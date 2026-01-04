
 async function baseGet(url,type,ua) {
        if (!type) {
            type = 'document'
        };
        if (ua) {
            ua= "Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Mobile Safari/537.36''Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Mobile Safari/537.36";
        }else{
            ua=undefined;
        }
        return new Promise((resolve,reject) => {
           GM_xmlhttpRequest({
                method: 'get',
                url: url,
                headers: {
                    'User-Agent': ua,
                    'Referer': url
                },
                responseType: type,
                onload: function(res){
                    if(res.status==200){
                        // console.log(res)
                        return resolve(res)
                    }else if(res.status.toString().startsWith('50')){
                        reject(res);
                       
                    }
                    else{
                        // console.log('ret')
                        resolve();
                        return false;
                    }
                }
            })
        })
    }

async function get(url,type,ua){
    return baseGet(url,type,ua).catch(function(err){
        // console.log(err)
        if(err){
            return get(url,type,ua)
        }
    })
}


    /**/
    async function basePost(url, data, fd) {
        let ctType
        if (fd) {
            ctType = undefined
        } else {
            ctType = "application/x-www-form-urlencoded"
        }
        return new Promise((resolve,reject) => {
            GM_xmlhttpRequest({
                method: 'post',
                url: url,
                data: data,
                headers: {
                    "Content-Type": ctType,
                    'Referer': url
                },
                onload: function(res){
                    if(res.status==200){
                        // console.log(res)
                        return resolve(res)
                    }else{
                        // console.log('ret')
                        reject(res);
                    }
                }
            })
        })
    }


    async function post(url, data, fd){
        return basePost(url, data, fd).catch(function(err){
            // console.log(err)
            if(err){
                return post(url, data, fd)
            }
        })
    }


    //获取url的html内容
    async function getResBody(url,ua) {
            let res = await get(url,undefined,ua);
            let body;
            if(res){
                body = res.responseText;
                return body
            }else{
                console.error(`链接${url}返回40x，无法正常访问`)
            }
            // console.log(res)
            // if(res.status!==200){
            //  return getResBody(url)
            // }else{
            //     body = res.responseText;
            //     return $(body);
            // }
        }

    //过滤特殊字符串
    function stripscript(s) {
        let pattern = new RegExp("[`~★☆○·!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“’。，、？]")
        let rs = "";
        for (var i = 0; i < s.length; i++) {
            rs = rs + s.substr(i, 1).replace(pattern, ' ');
        }
        return rs;
    }


    //将rgb()改成hex值
    function convertRGBDecimalToHex(rgb) {
        var regex = /rgb *\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3}) *\)/;
        var values = regex.exec(rgb);
        if (values.length != 4) {
            return rgb; // fall back to what was given.
        }
        var r = Math.round(parseFloat(values[1]));
        var g = Math.round(parseFloat(values[2]));
        var b = Math.round(parseFloat(values[3]));
        return "#" +
            (r + 0x10000).toString(16).substring(3).toUpperCase() +
            (g + 0x10000).toString(16).substring(3).toUpperCase() +
            (b + 0x10000).toString(16).substring(3).toUpperCase();
    }

    //formhash不是一成不变的，所以加上了时间戳判定，每24小时更新一次
    async function getFormhash() {
        let localFormhash = localStorage.bgm_wikihelper_formhash||''.split(',');
        let time=+new Date();
        if (localFormhash[0]-time>=-86400000&&localFormhash[1]) {
            return localFormhash[1];
        } else {
            let res = await get('https://bgm.tv/new_subject/4');
            let doc = res.response;
            let formhash = $(doc).find('input[name=formhash]').attr('value');
            localStorage.bgm_wikihelper_formhash = `${time},${formhash}`;
            return formhash
        }

    }

/*    替换链接。主要是如果在a页面解析B页面结果的话，出来的的绝对连接的host部分会被替换成a链接的。
    所以要换回来.currentUrl指的是当前页面获取到的错误的绝对连接，official指的是正确的链接的host部分
    function replaceUrl(currentUrl,officialUrl){
        return currentUrl.replace(window.location.origin,officialUrl)
    }*/

    //搜索条目，name是条目名字，type是类型。1=Book 2=Anime 3=Music 4=Game 6=Real。默认anime
    /*    async function searchSubject(name, type) {
            if (!type) {
                type = 2
            }
            let url = `https://bgm.tv/subject_search/${name}?cat=${type}`;
            let res = await get(url);
            let doc = res.response;
            let items = $(doc).find('#browserItemList li');
            if (items.length > 0) {
                let userConfirm = confirm("看起来已经有同名条目了，去看看吧");
                if (userConfirm) {
                    GM_openInTab(url, 'active');
                    let addConfirm = confirm("已经确认过是否有重复条目了，要继续添加吗？");
                    if (addConfirm) {
                        //添加条目函数
                    }
                }
            } else {
                //后续添加条目函数
            }
        }
    */


    //type默认和charaKind值一致
    //cv检测之所以用这个不用api是为了防止同名角色混乱，所以人工检验
    //返回值为 是否没有重复条目
    async function searchChara(name, type) {
        if (type == "chara") {
            type = 'crt'
        } else {
            type = 'prsn'
        }

        //过滤掉charaName里的特殊字符，否则部分特殊字符会影响原文搜索结果
        name = stripscript(name);

        let url = `https://bgm.tv/mono_search/${name}?cat=${type}`;
        let res = await get(url);
        let doc = res.response;
        let items = $(doc).find('#columnSearchB .light_odd');
        await new Promise((resolve, reject) => {
            if (items.length > 0) {
                let userConfirm = confirm("看起来已经有同名条目了，去看看吧。");
                if (userConfirm) {
                    GM_openInTab(url, false);
                    let asked = false;
                    document.addEventListener('visibilitychange', () => {
                        if (!document.hidden && !asked) {
                            if (confirm('已经确认过是否有重复条目了，要继续添加吗？')) {
                                resolve(true)
                            } else {
                                //第二次选择否
                                reject(false)
                            }
                            asked = true;
                        }
                    });

                } else {
                    //第一次选择否
                    reject(false);
                }
            } else {
                //后续添加条目函数
                resolve(true);

            }
        })
    }

    async function relatedAllSub(obj, charaId) {
        for (let i in obj) {
            if (obj[i]) {
                await relatedSub(i, obj[i], charaId)
            }

        }
    }


    //角色关联主条目。subid是主条目ID，最外层relateSetting里指定，未指定则默认不关联
    //角色类型（主角配角客串）一次只能设置一个值，默认主角。在全局变量里改
    //目前是只关联提供的subid（也就是说是替换型关联而不是新增型关联。主要是考虑到替换条目的时候的需求）
    async function relatedSub(type, subid, charaId) {
        if (subid) {
            let url = `https://bgm.tv/character/${charaId}/add_related/${type}`;
            let subItems = subid.split(',');
            let infoArrlist = '';
            for (let n = 0; n < subItems.length; n++) {
                infoArrlist += `infoArr[n${n}][crt_type]=${charaType}&infoArr[n${n}][subject_id]=${subItems[n]}&`
            }
            let data = `formhash=${formhash}&${infoArrlist}submit=保存关联数据`
            let res = await post(url, data)
            if ($(res.responseText).find('#crtRelateSubjects li').length < 1) {
                alert(`关联${type}失败`)
            } else {
                alert(`关联${type}成功`)
            }
        }

    }

    //新增型关联条目，会在原先关联的基础上进行条目关联

    async function addRelatedAllSub(obj, charaId) {
        for (let i in obj) {
            if (obj[i]) {
                await addRelatedSub(i, obj[i], charaId)
            }

        }
    }


    async function addRelatedSub(type, subid, charaId) {
        if (subid) {
            let url = `https://bgm.tv/character/${charaId}/add_related/${type}`;
            let page=await getResBody(url);
            let subItems = subid.split(',');
            let infoArrlist = '';
            let relatedItem=$(page).find('ul#crtRelateSubjects li')
            relatedItem.map((k,v)=>{
               let type= $(v).find('select').prop('name')+'='+$(v).find('select').prop('value');
               let sub= $(v).find('input').prop('name')+'='+$(v).find('input').prop('value');
               infoArrlist+=`${type}&${sub}&`
            });

            for (let n = 0; n < subItems.length; n++) {
                let j=n+relatedItem.length;
                infoArrlist += `infoArr[n${j}][crt_type]=${charaType}&infoArr[n${j}][subject_id]=${subItems[n]}&`
            }
            let data = `formhash=${formhash}&${infoArrlist}submit=保存关联数据`
            let res = await post(url, data)
            if ($(res.responseText).find('#crtRelateSubjects li').length < 1) {
                alert(`关联${type}失败`)
            } else {
                alert(`关联${type}成功`)
            }
        }

    }



    //查询CV条目id，仅支持全名搜索，默认取第一条
    async function getCVId(name) {
        if (!name) {
            alert('未找到声优相关信息');
            return false;
        }
        let url = `https://bgm.tv/json/search-cv_person/${name}`;
        let res = await get(url, 'json');
        CVId = Object.keys(res.response)[0];
        let missCV = localStorage.bgm_wikihelper_misscv;
        if (!missCV) {
            missCV = '';
        }
        if (CVId) {
            return true;
        } else {
            missCV += (`,${name}`);
            localStorage.bgm_wikihelper_misscv = missCV;
            alert(`找不到该声优${name}`)
            return false
        }
    }

    //关联CV
    async function relatedCV(type, subid, charaId) {
        let subTypeId = subTypeArr.indexOf(type) + 1;
        let subItems = subid.split(',');
        let infoArrlist = '';
        if (subid) {
            let url = `https://bgm.tv/character/${charaId}/add_related/person/${type}`;
            for (let n = 0; n < subItems.length; n++) {
                infoArrlist += `infoArr[n${n}][prsn_id]=${CVId}&infoArr[n${n}][subject_id]=${subItems[n]}&infoArr[n${n}][subject_type_id]=${subTypeId}&`
            }
            let data = `formhash=${formhash}&${infoArrlist}submit=保存关联数据`
        //    console.log(data);
            // let data = `formhash=${formhash}&infoArr[n0][prsn_id]=${CVId}&infoArr[n0][subject_id]=${subid}&infoArr[n0][subject_type_id]=${subTypeId}&submit=保存关联数据`
            let res = await post(url, data)
           // console.log(res)
            if ($(res.responseText).find('#crtRelateSubjects li').length < 1) {
                alert(`${type}关联CV失败`)
            } else {
                alert(`${type}关联CV成功`)
            }
        }

    }

    //obj是最上面的关联设置，CVRelatedSetting和subRelatedSetting
    async function relatedAllCV(obj, charaId) {
        let checkCV = await getCVId(CVName);
        if (!checkCV) {
            return false;
        } else {
            for (let i in obj) {
                if (obj[i]) {
                    await relatedCV(i, obj[i], charaId)
                }
            }
        }

    }

//新增型cv关联
    async function addRelatedCV(type, subid, charaId) {
        let subTypeId = subTypeArr.indexOf(type) + 1;
        let subItems = subid.split(',');
        if (subid) {
            let url = `https://bgm.tv/character/${charaId}/add_related/person/${type}`;
            let page=await getResBody(url);
            let infoArrlist = '';
            let relatedItem=$(page).find('ul#crtRelateSubjects li')
            relatedItem.map((k,v)=>{
               let type= $(v).find('.tip input').prop('name')+'='+$(v).find('.tip input').prop('value');
               let sub= $(v).find('input').eq(1).prop('name')+'='+$(v).find('input').eq(1).prop('value');
               infoArrlist+=`${type}&${sub}&`
            });

            for (let n = 0; n < subItems.length; n++) {
                let j=n+relatedItem.length;
                infoArrlist += `infoArr[n${j}][prsn_id]=${CVId}&infoArr[n${j}][subject_id]=${subItems[n]}&infoArr[n${j}][subject_type_id]=${subTypeId}&`
                console.log(infoArrlist)

            }
            let data = `formhash=${formhash}&${infoArrlist}submit=保存关联数据`
        //    console.log(data);
            // let data = `formhash=${formhash}&infoArr[n0][prsn_id]=${CVId}&infoArr[n0][subject_id]=${subid}&infoArr[n0][subject_type_id]=${subTypeId}&submit=保存关联数据`
            let res = await post(url, data)
           // console.log(res)
            if ($(res.responseText).find('#crtRelateSubjects li').length < 1) {
                alert(`${type}关联CV失败`)
            } else {
                alert(`${type}关联CV成功`)
            }
        }

    }

    async function addRelatedAllCV(obj, charaId) {
        let checkCV = await getCVId(CVName);
        if (!checkCV) {
            return false;
        } else {
            for (let i in obj) {
                if (obj[i]) {
                    await addRelatedCV(i, obj[i], charaId)
                }
            }
        }

    }



    //角色排序，subid为角色关联的条目id，sortNo是角色排序的序号，未指定的话默认当前角色类型末尾
    async function charaSort(subId,sortNo){
        let url=`https://bgm.tv/subject/${subId}/add_related/character`;
        let sortPage=await get(url);
        let charaSortArr=$(sortPage.response).find('#crtRelateSubjects li');
        // console.log(charaSortArr)
        let order;
        if(typeof(sortNo)=='string'){
            return false;
        }
        if(isNaN(sortNo)){
            order=$(charaSortArr).find(`option[value="${charaType}"]:selected`).length;
        }else{
            order=sortNo;
        }
      //  console.log(order);
        let sortData='';
        charaId=charaId;
        charaSortArr.map((k,v)=>{
            // console.log(v);
            let crtType=$(v).find(`select`).prop('value');
            let crtOrder=$(v).find('input.item_sort').prop('value');
            let crtId=$(v).find('.title a').prop('href').split('/').pop();
         //   console.log(crtId)
        //    console.log(charaId);
            if(crtId==charaId){
            sortData+=`infoArr[${k}][crt_type]=${crtType}&infoArr[${k}][crt_order]=${order}&infoArr[${k}][crt_id]=${charaId}&`;

        }else{
           sortData+=`infoArr[${k}][crt_type]=${crtType}&infoArr[${k}][crt_order]=${crtOrder}&infoArr[${k}][crt_id]=${crtId}&`

        }
        });
           // console.log(sortData);
            // let data=`formhash=${formhash}&submit=保存关联数据${sortData}`;
            // data=encodeURI(data);
            
            //sortdata的位置会影响encode的必要性。如果将其放在submit后面的话则必须encode。
            //目前还不知道原因。
            let data=`formhash=${formhash}&${sortData}submit=保存关联数据`;
            // data=encodeURI(data);
            let res=await post(url,data);
          //  console.log(res);
            if(res.status!=='200'){
                // alert('排序失败');
                // await charaSort(subId,sortNo);
            }
    }

    async function sortAllSub(obj,charaId,sortNo){
        for (let i in obj) {
            if (obj[i]) {
                let subArr=obj[i].split(',');
                    for(let n=0;n<subArr.length;n++){
                        await charaSort(subArr[n],sortNo)
                    }
                }

        }
    }

    //根据名字从谷歌cse找图片，默认取第一个结果。别问我为什么不直接取谷歌图片的结果.stie填域名即可。比如twitter.com
    //搜索引擎：https://cse.google.com/cse?cx=016521770207998520683:b6l6luja61k
    async function getImageUrlFromGoogle(name,site) {
        if(!site){
            site='';
        }
        let cxID = '016521770207998520683:b6l6luja61k';
        let apiKey = 'AIzaSyDoTuZttbaby57Cf-DLvdAX6WkzM4uWzOs';
        let baseurl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cxID}&q=${name}&siteSearch=${site}&searchType=image&gl=jp&cr=countryJP&alt=json`;
        let result = await get(baseurl, 'json');
        let imageUrl;
        try {
            imageUrl = result.response.items[0].link || '';
            return imageUrl;
        } catch (e) {
            let usrselect=window.confirm('头像搜索失败，尝试再次搜索吗');
            if(usrselect){
                getImageUrlFromGoogle(name);
            }else{
                return `https://bgm.tv/img/info_only.png`;
            }
        }
    }

/*    从别的网站获取图片,返回图片链接。
    url必须是是图片来源网站，带http头的绝对链接；selector是图片所在选择器，不是jquery对象*/
    async function getImageUrlFromSite(url,selector){
        let resPage=await get(url);
       // console.log(resPage);
        let imgUrl=$(resPage.responseText).find(selector).prop('src')
        return imgUrl;
    }

     function cropImage(img){
        let image=new Image();
        image.src=URL.createObjectURL(img);
        return new Promise((res,rej)=>{
            image.onload=function(){
                URL.revokeObjectURL(this.src); 
                var canvas=document.createElement('canvas');
                canvas.width=cropSetting[2];
                canvas.height=cropSetting[3];
                let cw=canvas.width;
                let ch=canvas.height;
                let ctx=canvas.getContext('2d');
                ctx.drawImage(this,cropSetting[0],cropSetting[1],cw,ch,0,0,cw,ch)
                canvas.toBlob(function(blob){
                    img=blob;
                    // console.log(img)
                    res(img)
                    return img
                },img.type)
            }
        })
    }

    async function ImagetoBlob(url) {
        //必须res然后res.response，否则会读不到文件
        if(!url){
            url='https://bgm.tv/img/info_only.png';
        }
        let res = await get(url, 'blob');
        if (res.status!==200){
            charaAvatarImage=new Blob()
        }else{
            charaAvatarImage = res.response;
            if(cropSetting.length>0){
                charaAvatarImage=await cropImage(charaAvatarImage)
                // console.log(charaAvatarImage)
            }
        }
        return charaAvatarImage

    }


    //table是某个jquery表格对象。比如$('table.indexbox')这样
    //从萌百页面右边的表格里获取信息
    //萌百的表格和wiki的构造不一样，没有th标签
    async function moeTable2InfoTpl(table) {
        table ? table : (infoTplDetail = null);
        let items = table.find('tr');
        let avatar = items.find('img');
        CVName ?CVName:CVName= table.find('tr:contains("声优")').children().eq(1).text().replace('\n', '') || null;
        console.log(`声优为${CVName}`)
        if (!charaAvatarUrl) {
            if (avatar.length) {
                charaAvatarUrl = avatar[0].src;
            } else {
                charaAvatarUrl = await getImageUrlFromGoogle(charaName);
            }
        }
        console.log(`头像链接：${charaAvatarUrl}`);
        kana = items.find('rt').append(' ').text();

        let linkArr = window.location.href.split('/');
        chnName = decodeURI(linkArr[linkArr.length - 1]);
        if(!charaName){
            let charaNameTmp='';
            charaNameTmp = (table.find('tr:contains("名")').eq(0).children().eq(1).text());
            if (charaNameTmp.indexOf('（') >= 0) {
                charaName = charaNameTmp.split('（')[0]
            } else {
                charaName = charaNameTmp.split('(')[0]
            }
            if (!charaName) {
                charaName = chnName
            }
        }


        try {
            romaji = table.find('tr:contains("名")').eq(0).children().eq(1).text().split('(')[1].split(')')[0];
            // romaji = romajiTemp.match(/（([^)]*)）/)[1] || romajiTemp.match(/\(([^)]*)\)/)[1];
        } catch (e) {
            romaji = ''
        }
        //姓名信息已经由上面获取，所以删掉这一行。
        items.find('td:contains("姓名")').parent('tr').remove();

        //萌百词条没有强制保准，导致有的假名是上标有的是放在本名里。
        items.find('th:contains("本名")').parent('tr').remove();
        //删除出道角色代表角色等信息
        table.find('tr:contains("角色")').remove();
        table.find('tr:contains("声优")').remove();
        table.find('tr:contains("萌点")').remove();
        table.find('sup').remove();
        items = table.find('tr');

        items.map(k => {
            let infoName = $(items[k]).children()[0].innerText.replace('\n', '/');
            let infoDetail;
            if ($(items[k]).children().length > 1) {
                infoDetail = $(items[k]).children()[1].innerText.replace('\n', '/');
                // console.log('infoDetail='+infoDetail)
            }
            if (infoName && infoDetail) {
                infoTplDetail += `|${infoName}=${infoDetail}\r\n`;
            }
        });
       // console.log(`infoTplDetail=${infoTplDetail}`)
        return infoTplDetail;
    }

    //table是某个jquery表格对象。比如$('table.indexbox')这样
    //从日文wiki页面右边的表格里获取信息
    async function wikiTable2InfoTpl(table) {
        table ? table : (infoTplDetail = null);
        let items = table.find('tr');
        let avatar = items.eq(1).find('img');
      //  console.log(avatar);
        if (!charaAvatarUrl) {
            if (avatar.length) {
                charaAvatarUrl = avatar[0].src;
            } else {
                charaAvatarUrl = await getImageUrlFromGoogle(charaName);
            }
        }
    //   console.log(charaAvatarUrl);
        kana = items.find('th').children('span').eq(0).text()
        items.map(k => {
            let infoName = $(items[k]).find('th').text();
            //生日的隐藏span以及引用出处的上标必须先删掉
            $(items[k]).find('td').children('span').remove()
            $(items[k]).find('td').children('sup').remove()
            let infoDetail
            if ($(items[k]).find('td').length > 0) {
                infoDetail = $(items[k]).find('td')[0].innerText.replace('\n', '/');
            }
            if (infoName && infoDetail) {
                infoTplDetail += `|${infoName}=${infoDetail}\r\n`;
            }
        });
        console.log(`infoTplDetail=${infoTplDetail}`)
        return infoTplDetail;
    }

    /*body是一个jquery对象。这里的话就是请求到的wiki页面本身.如果不指定的话默认就是'body'.
    功能是从wiki和萌百页面获取名字、个人简介（charaInfo）和infoTplDetal*/
    async function cvInfoFromWiki(body) {
        body ? body : body = 'body';
        //不从表格拿是因为不是所有条目都有表格
        if (!charaName) {
            let linkArr = window.location.href.split('/');
            charaName = decodeURI(linkArr[linkArr.length - 1]);
        }

        //寻找声优简介信息并删除上标号
        let descP = $(body).find('#toc').prevAll('p');
        let cvDesc = [];
        descP.map(i => {
            descP.eq(i).find('sup').remove();
            cvDesc.unshift(descP[i].innerText);
        })
        charaInfo = cvDesc.join().replace(' ', '');

        //将边上的表格信息整合成infoTpl，边上没有表格的话直接为空
        let table = $(body).find('table.infobox');
        if (pageHost.indexOf('moegirl.org') < 0) {
            await wikiTable2InfoTpl(table);
        } else {
            await moeTable2InfoTpl(table);
        }
    }


    async function charaInfoFromWiki(body) {
        body ? body : body = 'body';
        //不从表格拿是因为不是所有条目都有表格
        //寻找简介信息并删除黑条
        let descP = $(body).find('.mw-parser-output').children('h2').eq(0).nextUntil(":not(p)");
        let charaDesc = [];
        descP.map(i => {
            descP.eq(i).find('.heimu').remove();
            descP.eq(i).find('sup').remove();
            charaDesc.push(descP[i].innerText);
        })
        charaInfo = charaDesc.join().replace(' ', '');

        //将边上的表格信息整合成infoTpl，边上没有表格的话直接为空
        let table = $(body).find('.mw-parser-output table').eq(0);
        //萌百词条的表格两套html模板，角色和wiki 的声优表格类似
        await moeTable2InfoTpl(table);
    }

    //生成需要提交用户信息body，无参数的时候默认chara，大小写皆可。其他时候需要和charaKindArr一致
    async function makeFormData(subtype) {
        //新增条目类型。目前有chara，cv等，默认chara。这个主要是formdata的数据结构
        charaAvatarImage = await ImagetoBlob(charaAvatarUrl);
        var subOpt = {
            'chara': {
                formhash: formhash,
                crt_name: charaName,
                crt_infobox: infoTpl,
                crt_summary: charaInfo,

            },
            'person': {
                formhash: formhash,
                crt_name: charaName,
                crt_infobox: infoTpl,
                crt_summary: charaInfo,

            },
        };

        subtype ? subtype : subtype = 'chara';
        subtype = subtype.toLowerCase();
        if (subtype !== 'chara') {
            subOpt['person'][`prsn_pro[${subtype}]`] = 1;
            subtype = 'person'
        }
        let fd = new FormData();
        //console.log(charaAvatarImage);
        Object.entries(subOpt[subtype]).map(obj => {
            fd.append(obj[0], obj[1])
        });

        return fd
    }


    //获取特定条目下关联的所有角色名称.id可以是数组，比如[1,2]
   async function getRelatedCharas(id){
        let subjects=id.toString().split(',');
        let relatedCharas={};
        for(let i in subjects){
            let url=`https://bgm.tv/subject/${subjects[i]}/characters`;
            let page=await getResBody(url);
            let charas=$(page).find('.mainWrapper .light_odd h2 a');
            charas.map((k,v)=>{
                let name=$(v).text();
                let id=$(v).attr('href').split('/character/')[1];
                relatedCharas[name]=id
            })
            // relatedCharas+=names.append('||&*').text();
        // console.log(relatedCharas)
        }
        // relatedCharas=(relatedCharas.split('||&*'));
        // relatedCharas.splice(-1,1);
        return relatedCharas
    }

    //subtype为chara或者其他charaKindArr里的值，不能为空
    //editmode是编辑条目，参数类型给人物条目id，为空的情况下默认添加模式
    //nosort指添加完后角色不做排序（大量角色的时候排序很浪费时间.默认排序
    async function addSubject(subtype, editmode,sortNum) {
        //如果不检查重复以及开启静默模式的话，不会有任何的弹窗
        if(!checkDupe&&silent){
            window.alert=console.log;
            window.confirm=()=>false;
        }
        subtype = subtype.toLowerCase();
        let isNODupe=true;
        if (checkDupe) {
            await searchChara(charaName, subtype)
                .then(e => {
                    isNODupe = true
                })
                .catch(e => {
                    alert('取消添加')
                    isNODupe = false
                });
        }
        if (isNODupe) {
            let urlPath, url;
            if (subtype == 'chara') {
                urlPath = 'character'
            } else {
                urlPath = 'person'
            }

            let fd = await makeFormData(subtype);
            //单独拿出来是因为传参的方式加进去的不是file类型而是普通blob，没法被服务器端识别
            fd.append('picfile', charaAvatarImage, 'new.png');
            if (!editmode) {
                url = `https://bgm.tv/${urlPath}/new`;
                fd.append('crt_role', charaRole);
                fd.append('submit', '添加新人物');
            } else {
                url = `https://bgm.tv/${urlPath}/${editmode}/edit`;
                // let imgFile=new File([charaAvatarImage],'new.png',{type:'image/png'})
                // let imgblob=new Blob(charaAvatarImage,{type: 'application/octet-stream'});
                fd.append('editSummary', 'bgm_wikihelper脚本替换条目');
                fd.append('submit', '改好了');
            }
            if (debugFlg) {
                alert(`调试模式中，不会加条目，请手动关闭后刷新页面`)
                for (let pair of fd.entries()) {
                    console.log(pair[0] + ', ' + pair[1]);
                }
            } else {
                let pageres = await post(url, fd, 'fd');
               // console.log(pageres);
                let tmp = pageres.finalUrl.split('/');
                charaId = tmp[tmp.length - 1];

                if (subtype == 'chara') {
                   await  relatedAllSub(subRelatedSetting, charaId);
                    await relatedAllCV(CVRelatedSetting, charaId);
                    await  sortAllSub(subRelatedSetting,charaId,sortNum);                    
                }
                if (charaId.match(/\d+/g)) {
                    let cfm = confirm(`${editmode?'编辑':'添加'}成功！条目id=${charaId},要去看看吗`);
                    if (cfm) {
                        GM_openInTab(pageres.finalUrl, 'false')
                    }
                } else {
                    alert('添加失败')
                };
                return charaId;
            }

        }

    }



    var charaId, formhash, kana, jpnName,nickName, chnName, CVId, userFormData,CVName,pageHost, anotherName, charaName, charaAvatarUrl, charaAvatarImage, charaInfo,infoTpl, infoTplDetail = '';
     var artist,romaji, color, birthday,sex,part, instrument,height, weight, zodiacSign, hobby,hate,school, bwh, age, blood, grade, like, trick, weak, unit,weapon;
     var subRelatedSetting ,CVRelatedSetting ,charaType ,charaKindArr ,charaKind ,charaRole ,checkDupe ,debugFlg ,editSubId ;
    var silent,sortNum,cropSetting=[];
    var subTypeArr = ['book', 'anime', 'music', 'game', 'unkown', 'real'];

