// ==UserScript==
// @name         Bangumi Autoshow Tags
// @namespace    https://github.com/bangumi/scripts/liaune
// @version      0.4.1
// @description  在条目收藏列表显示条目的常用标签，双击标签栏可以修改。在右边显示标签统计,点击标签可在列表上方显示相应的条目
// @author       Liaune
// @include      /^https?://(bangumi\.tv|bgm\.tv|chii\.in)\/\S+\/list\/.*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/36985/Bangumi%20Autoshow%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/36985/Bangumi%20Autoshow%20Tags.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
.tag_del{
padding: 4px 0;
color: #aaa;
font-size: 10px;
width: 16px;
height: 16px;
line-height: 16px;
float: right;
text-align: center;
}
`);
    let itemsList,TagsAll=[],JsonTags = {},AllTags=[],count=0,update=0;
    const Display_Tag_Num = 15;  //每个条目下展示的标签数量
    const Tag_Bar_Num = 50;   //标签统计栏默认显示的标签数量
    const showBtn0 = document.createElement('a');
    showBtn0.addEventListener('click', ShowProcess);
    showBtn0.className = 'chiiBtn';
    showBtn0.href='javascript:;';
    showBtn0.textContent = 'Show Tags';
    document.querySelector('#browserTools').append(showBtn0);

    //更新缓存数据
    const showBtn4 = document.createElement('a');
    showBtn4.addEventListener('click', Update);
    showBtn4.className = 'chiiBtn';
    showBtn4.href='javascript:;';
    showBtn4.textContent = '更新Tags';

    //停止
    const showBtn5 = document.createElement('a');
    showBtn5.addEventListener('click',ShowSidePanel.bind(this,AllTags),false);
    showBtn5.className = 'chiiBtn';
    showBtn5.href='javascript:;';
    showBtn5.textContent = '停止加载';

    const User =window.location.href.match(/\/list\/(\S+)\//)? window.location.href.match(/\/list\/(\S+)\//)[1]: null;

    function Update(){
        update=1;
        count=0;
        itemsList = document.querySelectorAll('#browserItemList li.item');
        itemsList.forEach( (elem, index) => {
            let href = elem.querySelector('a.subjectCover').href;
            let ID = href.split('/subject/')[1];
            FetchStatus(href,elem);
        });
    }

    //Main Program
    function ShowProcess(){
        $(showBtn0).hide();
        $(document.querySelector('#columnSubjectBrowserB .SimpleSidePanel')).hide();
        itemsList = document.querySelectorAll('#browserItemList li.item');
        itemsList.forEach( (elem, index) => {
            let href = elem.querySelector('a.subjectCover').href;
            let ID = href.split('/subject/')[1];
            //为每个条目添加单独刷新
            let showBtn_Re = document.createElement('a');
            showBtn_Re.className = 'l';
            showBtn_Re.href='javascript:;';
            showBtn_Re.textContent = '↺';
            showBtn_Re.addEventListener('click', FetchStatus.bind(this,href,elem),false);
            elem.querySelector('.inner h3').appendChild(showBtn_Re);

            if(localStorage.getItem('Subject'+ID+'Tags')){
                let info = {"Tags": localStorage.getItem('Subject'+ID+'Tags')};
                DisplayStatus(elem,info);
            }
            else
                FetchStatus(href,elem);

        });
        CreateYearSidePannel();
        CreateRateSidePannel();
    }

    function CheckTag(Tag){
        function ParseDate(Datestring){
            let yy=Datestring.match(/(\d{4})/)? Datestring.match(/(\d{4})/)[1].toString():'';
            let year = Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)? Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)[1].toString(): yy;
            let month = Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)? Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)[3].toString(): '';
            let day = Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)?Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)[5].toString(): '';
            let time = year? (month? (year+'/'+month+'/'+day):year):'';
            return time;
        }
        if(!Tag) return false;
        else if(ParseDate(Tag)!='') return false;
        else return true;
    }

    function FetchStatus(href,elem){
        fetch(href,{credentials: "include"})
            .then(data => {
            return new Promise(function (resovle, reject) {
                let targetStr = data.text();
                resovle(targetStr);
            });
        })
            .then(targetStr => {
            let ID = href.split('/subject/')[1];
            //获取Tag
            let TagMatch = targetStr.match(/<a href="#;" class="btnGray" onclick="chiiLib.subject.addTag(\S+)<\/a>/g);
            if(TagMatch){
                let Tags=[],len=0;
                for(i=0;i<Math.min(Display_Tag_Num,TagMatch.length-15);i++){
                    let thisTag = TagMatch[i].match(/<a href="#;" class="btnGray" onclick="chiiLib.subject.addTag(\S+)">(\S+)<\/a>/)? TagMatch[i].match(/<a href="#;" class="btnGray" onclick="chiiLib.subject.addTag(\S+)">(\S+)<\/a>/)[2]: null;
                    if(CheckTag(thisTag)) {Tags[len]=thisTag; len+=1;}
                }
                localStorage.setItem('Subject'+ID+'Tags',JSON.stringify(Tags));
                let info = {"Tags": JSON.stringify(Tags)};
                DisplayStatus(elem,info);
                if(update){
                    showBtn4.textContent='更新中... (' + count + '/' + itemsList.length +')';
                    if(count==itemsList.length){ showBtn4.textContent='更新完毕！';}
                }
            }

        });
    }

    function addDivTags(elem,Tags){
        let DivTags = document.createElement('div');
        DivTags.id = "DivTags";
        for(i=0;i<Tags.length;i++){
            let Atags = document.createElement('a');
            //Atags.href = "/anime/tag/"+Tags[i];
            //Atags.target="_blank";
            Atags.href ='#';
            Atags.className = 'l';
            if(i==Tags.length-1) Atags.innerHTML=Tags[i];
            else Atags.innerHTML=Tags[i]+"&nbsp;&nbsp;";
            Atags.addEventListener('click', ShowThisTag.bind(this,Tags[i]),false);
            DivTags.appendChild(Atags);
        }
        if(elem.querySelector('#DivTags')) $(elem.querySelector('#DivTags')).remove();
        $(DivTags).insertAfter(elem.querySelector('.inner .collectInfo'));
        DivTags.addEventListener('dblclick', function (){
            DivTags.contentEditable = true;
        });
        DivTags.addEventListener('blur', function (){
            let Tags = DivTags.textContent.split("  ");
            localStorage.setItem('Subject'+ID+'Tags',JSON.stringify(Tags));

        });
    }

    function DisplayStatus(elem,info){
        let href = elem.querySelector('a.subjectCover').href;
        let ID = href.split('/subject/')[1];
        let Tags = JSON.parse(info.Tags);
        TagsAll = TagsAll.concat(Tags);
        addDivTags(elem,Tags);

        count+=1;
        if(!update){
            document.querySelector('#browserTools').append(showBtn5);
            showBtn5.textContent='加载中... (' + count + '/' + itemsList.length +')';
        }
        if(count==itemsList.length){
            document.querySelector('#browserTools').append(showBtn4);
            $(showBtn5).hide();
            for (i = 0; i < TagsAll.length; i++) {
                JsonTags[TagsAll[i]] = (JsonTags[TagsAll[i]] + 1) || 1;
            }
            AllTags = Object.keys(JsonTags)
                .map(function(key){return {TagName:key, Value:JsonTags[key]};})
                .sort(function(x, y){return y.Value - x.Value;});
            /* for (var key in JsonTags){
                let temp_tag = {TagName:key,Value:JsonTags[key]};
                AllTags.push(temp_tag);
            }
            AllTags.sort(function (x,y){return y.Value - x.Value;});*/
            ShowSidePanel(AllTags);
            //console.log(AllTags);
        }

    }

    function ShowSidePanel(AllTags){
        let SimpleSidePanel = document.createElement('div');
        SimpleSidePanel.className = "SimpleSidePanel";
        SimpleSidePanel.style.width = "190px";
        $(SimpleSidePanel).append($("<h2>标签统计</h2>"));
        let tagList = document.createElement('ul');
        tagList.className = "tagList";
        let showmoreTags = document.createElement('a');
        showmoreTags.href='javascript:;';
        showmoreTags.textContent = '/ 展开全部标签';
        function ShowmoreTags(start,end,hide){
            if(hide) $(showmoreTags).hide();
            for(i=start; i<end; i++){
                let tagli = document.createElement('li');
                let taglia = document.createElement('a');
                taglia.href='#';taglia.textContent = AllTags[i].TagName;
                taglia.addEventListener('click', ShowThisTag.bind(this,AllTags[i].TagName),false);
                $(taglia).append(`<small>${AllTags[i].Value}</small>`);
                //添加删除按钮
                let tag_del = document.createElement('a');
                tag_del.href='javascript:;';tag_del.textContent = 'x';tag_del.title = '删除';tag_del.classList.add('tag_del');
                tag_del.addEventListener('click', DelThisTag.bind(this,tagli,AllTags[i].TagName),false);
                tagli.appendChild(tag_del);
                tagli.appendChild(taglia);
                tagList.appendChild(tagli);
            }
        }
        ShowmoreTags(0,Math.min(Tag_Bar_Num,AllTags.length),0);
        $(SimpleSidePanel).append($(tagList));
        showmoreTags.addEventListener('click', ShowmoreTags.bind(this,Math.min(Tag_Bar_Num,AllTags.length),AllTags.length,1),false);
        $(SimpleSidePanel).append($(showmoreTags));

        document.querySelector('#columnSubjectBrowserB').insertBefore(SimpleSidePanel,document.querySelector('#columnSubjectBrowserB .SimpleSidePanel'));
    }

    function ShowThisTag(TagName){
        itemsList = document.querySelectorAll('#browserItemList li.item');
        let count_t = 0;
        itemsList.forEach( (elem, index) => {

            elem.style.border="none";
            let TagsList = elem.querySelector('#DivTags').textContent.split("  ");
            if (TagsList.includes(TagName)) {
                if(count_t %2 == 0) elem.setAttribute('class', 'item odd clearit');
                else elem.setAttribute('class', 'item even clearit');
                elem.style.border="1px solid #5ebee3";
                document.querySelector('#browserItemList').insertBefore(elem,document.querySelector('#browserItemList li.item'));
                count_t+=1;
            }
        });
    }
    function ShowThisRate(Rate){
        itemsList = document.querySelectorAll('#browserItemList li.item');
        let count_t = 0;
        itemsList.forEach( (elem, index) => {
            elem.style.border="none";
            let stars = elem.querySelectorAll('.inner .collectInfo span')[0].className;
            let User_rate= stars ? (stars.match(/sstars(\d+)/) ? stars.match(/sstars(\d+)/)[1]: 0): 0;
            if (User_rate == Rate) {
                if(count_t %2 == 0) elem.setAttribute('class', 'item odd clearit');
                else elem.setAttribute('class', 'item even clearit');
                elem.style.border="1px solid #5ebee3";
                document.querySelector('#browserItemList').insertBefore(elem,document.querySelector('#browserItemList li.item'));
                count_t+=1;
            }
        });
    }

    function ShowThisYear(Year){
        itemsList = document.querySelectorAll('#browserItemList li.item');
        let count_t = 0;
        itemsList.forEach( (elem, index) => {
            elem.style.border="none";
            let date = elem.querySelectorAll('.inner .info')[0].textContent;
            function ParseDate(Datestring){
                let yy=Datestring.match(/(\d{4})/)? Datestring.match(/(\d{4})/)[1].toString():'';
                let year = Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)? Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)[1].toString(): yy;
                let month = Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)? Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)[3].toString(): '';
                let day = Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)?Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)[5].toString(): '';
                let time = year? (month? (year+'/'+month+'/'+day):year):'';
                return year;
            }
            date = ParseDate(date);
            if (date == Year) {
                if(count_t %2 == 0) elem.setAttribute('class', 'item odd clearit');
                else elem.setAttribute('class', 'item even clearit');
                elem.style.border="1px solid #5ebee3";
                document.querySelector('#browserItemList').insertBefore(elem,document.querySelector('#browserItemList li.item'));
                count_t+=1;
            }
        });
    }

    Array.prototype.remove = function(val) {
        var a = this.indexOf(val);
        if (a >= 0) {
            this.splice(a, 1);
            return true;
        }
        return false;
    };

    function DelThisTag(tagli,TagName){
        itemsList = document.querySelectorAll('#browserItemList li.item');
        //ShowThisTag(TagName);
        if (!confirm(`确认要删除标签“${TagName}”吗？`)) {
            return;
        }
        $(tagli).remove();
        itemsList.forEach( (elem, index) => {
            let href = elem.querySelector('a.subjectCover').href;
            let ID = href.split('/subject/')[1];
            let TagsList = elem.querySelector('#DivTags').textContent.split("  ");
            if (TagsList.includes(TagName)) {
                TagsList.remove(TagName);
                localStorage.setItem('Subject'+ID+'Tags',JSON.stringify(TagsList));
                addDivTags(elem,TagsList);
            }
        });
    }

    function CreateRateSidePannel(elem){
        let AllRates = [], JsonAllRates = {},RatesAll=[];
        itemsList.forEach( (elem, index) => {
            let User_rate=User ? elem.querySelectorAll('.inner .collectInfo span')[0].className: null;
            let Rate = User_rate ? (User_rate.match(/sstars(\d+)/)?User_rate.match(/sstars(\d+)/)[1]: 0): 0;
            AllRates = AllRates.concat(Rate);
        });
        for (i = 0; i < AllRates.length; i++) {
            JsonAllRates[AllRates[i]] = (JsonAllRates[AllRates[i]] + 1) || 1;
        }
        //console.log(JsonAllRates);
        RatesAll = Object.keys(JsonAllRates)
            .map(function(key){return {Rate:key, Value:JsonAllRates[key]};})
            .sort(function(x, y){return y.Rate - x.Rate;});
        //console.log(RatesAll);
        ShowSidePanelRate(RatesAll);
    }
    function ShowSidePanelRate(RatesAll){
        let SimpleSidePanel = document.createElement('div');
        SimpleSidePanel.className = "SimpleSidePanel";
        SimpleSidePanel.style.width = "190px";
        let RateSum = 0, count_t=0;
        let tagList = document.createElement('ul');
        tagList.className = "tagList";
        for(i=0; i<RatesAll.length; i++){
            let tagli = document.createElement('li');
            let taglia = document.createElement('a');
            taglia.href='#';taglia.textContent = RatesAll[i].Rate+"分";
            if(RatesAll[i].Rate=='0') taglia.textContent = "未评分";
            taglia.addEventListener('click', ShowThisRate.bind(this,RatesAll[i].Rate),false);
            $(taglia).append(`<small>${RatesAll[i].Value}</small>`);
            tagli.appendChild(taglia);
            tagList.appendChild(tagli);
            //不计未评分
            if(RatesAll[i].Rate!='0'){
            RateSum += RatesAll[i].Rate * RatesAll[i].Value;
            count_t += RatesAll[i].Value;}
        }
        $(SimpleSidePanel).append($("<h2>打分统计<small style='float:right'>平均："+ parseFloat(RateSum/count_t).toFixed(2)+"</small></h2>"));
        $(SimpleSidePanel).append($(tagList));

        document.querySelector('#columnSubjectBrowserB').insertBefore(SimpleSidePanel,document.querySelector('#columnSubjectBrowserB .SimpleSidePanel'));
    }

    function CreateYearSidePannel(elem){
        let AllYears = [], JsonAllYears = {},YearsAll=[];
        itemsList.forEach( (elem, index) => {
            let date = elem.querySelectorAll('.inner .info')[0].textContent;
            function ParseDate(Datestring){
                let yy=Datestring.match(/(\d{4})/)? Datestring.match(/(\d{4})/)[1].toString():'';
                let year = Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)? Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)[1].toString(): yy;
                let month = Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)? Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)[3].toString(): '';
                let day = Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)?Datestring.match(/(\d{4})(年|-)(\d{1,2})(月|-)(\d{1,2})/)[5].toString(): '';
                let time = year? (month? (year+'/'+month+'/'+day):year):'';
                return year;
            }
            date = ParseDate(date);
            AllYears = AllYears.concat(date);
        });
        for (i = 0; i < AllYears.length; i++) {
            JsonAllYears[AllYears[i]] = (JsonAllYears[AllYears[i]] + 1) || 1;
        }
        console.log(JsonAllYears);
        YearsAll = Object.keys(JsonAllYears)
            .map(function(key){return {Year:key, Value:JsonAllYears[key]};})
            .sort(function(x, y){return y.Year - x.Year;});
        console.log(YearsAll);
        ShowSidePanelYear(YearsAll);
    }

    function ShowSidePanelYear(YearsAll){
        let SimpleSidePanel = document.createElement('div');
        SimpleSidePanel.className = "SimpleSidePanel";
        SimpleSidePanel.style.width = "190px";
        let tagList = document.createElement('ul');
        tagList.className = "tagList";
        let showmoreTags = document.createElement('a');
        showmoreTags.href='javascript:;';
        showmoreTags.textContent = '/ 展开全部标签';
        function ShowmoreTags(start,end,hide){
            if(hide) $(showmoreTags).hide();
            for(i=start; i<end; i++){
                let tagli = document.createElement('li');
                let taglia = document.createElement('a');
                taglia.href='#';taglia.textContent = YearsAll[i].Year;
                taglia.addEventListener('click', ShowThisYear.bind(this,YearsAll[i].Year),false);
                $(taglia).append(`<small>${YearsAll[i].Value}</small>`);
                tagli.appendChild(taglia);
                tagList.appendChild(tagli);
            }
        }
        ShowmoreTags(0,Math.min(15,YearsAll.length),0);
        showmoreTags.addEventListener('click', ShowmoreTags.bind(this,Math.min(15,YearsAll.length),YearsAll.length,1),false);
        $(SimpleSidePanel).append($("<h2>时间统计</h2>"));
        $(SimpleSidePanel).append($(tagList));
        $(SimpleSidePanel).append($(showmoreTags));

        document.querySelector('#columnSubjectBrowserB').insertBefore(SimpleSidePanel,document.querySelector('#columnSubjectBrowserB .SimpleSidePanel'));
    }

})();