// ==UserScript==
// @name         Efficient AO3
// @namespace    https://everlarkarchivetms.tumblr.com/
// @version      0.847
// @description  Making AO3 an efficient reference
// @author       EverlarkArchive
// @match        http://archiveofourown.org/SEE NOTES ON WHAT TO PUT HERE*
// @grant        GM_setValue
// @grant        GM_getValue
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/38441/Efficient%20AO3.user.js
// @updateURL https://update.greasyfork.org/scripts/38441/Efficient%20AO3.meta.js
// ==/UserScript==


/*  Misc:
-By copying and pasting this script, you acknowledge the author is not to be held responsible if your computer craps
itself, sprouts legs and runs away, or any other problem you may have with it (in other words, you’ve read the disclaimer).
-For the privacy/security-minded, this script does not access any site outside of AO3 other than jquery from Google.
-please let me know about any additional bugs. I'll try to get to them as soon as possible (as free time becomes available)
-you can also request features but I may or may not decide to add. If I do, again, as free time becomes available   */


const ReadLinksCount = 20;  // Number of links in displayed Read List. Maximum is 20. 0 to turn off.
const ShipList = "Katniss/Peeta";  /* Ship to be prioritized.  "" = nothing proiritized. Single name for each char in rel preferred. (EX: Katniss/Peeta)
      Non-priority ships listed first will be grayd out as 1 star but not added to 1 star list.
      To override individually, set fic using button. To return to temp status, unselect and reload   */
const Read = "#ecffec";  // backcolor for to-read items. default: #ecffec
const Star1 = "lightgray";  // font color for 1 star items default: lightgray
const Star2 = "darkgray";  // font color for 2 star items default: darkgray
const Star3 = "#4d4d4d";  // font color for 3 star items default: #4d4d4d
const Star4 = "#800000";  // font color for 4 & 5 star items. Recommended colors by fandom below:
      // Everlark:#800000, ASoIaF:#00cccc, HP houses:#800000 or #0000b3 or #008000 or #b38300 default: black
const Own_Color = "#ededed";  // backcolor for author's own fics. Can be overridden with another setting. default: #ededed
const Date_Format = "1";  // use number associated (0) Day/Month/Year format or (1) Month/Day/Year format. Be careful
const Update_ReadList = 30;   // # of days before updating Read List titles & authors (sometimes authors chg them). Recommend 30 days

// DO NOT CHG WHAT'S BELOW
const None = "transparent"; // reset color default: transparent
const days = 1000*60*60*24;
var lastReadDate,chpt;

var myFunctions = window.myFunctions = {};
myFunctions.addCss=function () {
    try{
        if(GM_getValue('lastUpdate','')!=""){}else{GM_setValue('lastUpdate',new Date());}
        if (GM_getValue('toread',[]).length>0 && GM_getValue('toread2',[]).length==0){var trl=onetimeRedo(GM_getValue('toread',[])); GM_setValue("toread2",trl);}
        myFunctions.testDate(); injectReadLinks(); addReadLinks();

        var head = document.getElementsByTagName('body')[0];
        var newCss = document.createElement('style');
        newCss.type = "text/css";//
        newCss.innerHTML = "";
        newCss.innerHTML = "em {visibility:hidden; font-style:initial; font-size:100%; font-weight:initial; width:auto; background-color:#555; color:#fff; border-radius:6px;";
        newCss.innerHTML+=   "padding:8px; position:absolute; z-index:1; bottom:-5px; margin-left:10px; white-space:nowrap; }";
        newCss.innerHTML+= "*:hover em{visibility: visible;} *:not(:hover) em{visibility: hidden;} ";
        newCss.innerHTML+= ".totheLeft{display:inline-block; margin-right:2%} .totheRight{float:right;}";
        newCss.innerHTML+= ".required-tags{position:static !important;} li{position: static !important}";
        newCss.innerHTML+= ".dd1{position: relative; display: inline-block; margin:0px 30px}";
        newCss.innerHTML+= ".dd1 a:hover {background-color: #f1f1f1}";
        newCss.innerHTML+= ".dd1btn{background-color: transparent; color: black; font-size: 16px;border: none;cursor: pointer;}";
        newCss.innerHTML+= ".dd1btn:hover {background-color: #ecffec;}";
        newCss.innerHTML+= ".dd1-content {display: none; position: absolute; background-color: #f9f9f9; width: 100px; height:190px; overflow: auto; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); z-index: 1;}";
        newCss.innerHTML+= ".dd1-content a {color: black; text-decoration: none; display: block; border:none; margin-left:10px; margin-top:5px;}";
        newCss.innerHTML+= ".show {display:block;}";
        newCss.innerHTML+= "a[href^='/works/']:link, a[href^='/users/']:link{  font: 16px Arial,sans-serif; color:"+Star3+" }";//<
        newCss.innerHTML+= "a[href^='/works/']:visited, a[href^='/users/']:visited{color:"+Star3+" }";
        newCss.innerHTML+= "a[href$='comments'], a[href$='bookmarks'],#chapter,.readlink{ font-size:inherit !important;text-decoration:none;border-bottom:1px solid black;}";//>
        newCss.innerHTML+= ".toReadLinks{font: 14px Arial,sans-serif;}";
        newCss.innerHTML+= "a.i{border: none; font-size:inherit !important; text-decoration:none; font-style:italic; cursor:text; position: relative; display: inline-block;}";
        newCss.innerHTML+= "a.i:hover{color:inherit;}";
        newCss.innerHTML+= "td,tr {padding:0px}";
        newCss.innerHTML+= "ul.required-tags{width:60px !important;column-gap:0px !important;}";
        newCss.innerHTML+= "ul.required-tags li{width:20px;height:20px;}";
        newCss.innerHTML+= "ul,table,tr,td{background-color:inherit;";
        newCss.innerHTML+= "table{padding:20px}";
        newCss.innerHTML+= "tbody{width:100px !important}";
        newCss.innerHTML+= ".truncateIt{margin-bottom:3px; width: 90%; height:22pt; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}";//width: 50px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        head.appendChild(newCss);
        BeginWorking();
    }
    catch(err){alert("addCss: "+err);}
};

function onetimeRedo(list){
    try{
        var i, lines;lines=[];

        $.each(list, function() {i=this; lines.push(createTA(i)); })
        GM_setValue('lastReadDate',new Date());
        return lines;
    }
    catch(err){alert("onetimeRedo: "+err);return "";}
}
function getReadListTA(){
    try{
        var i, lines;lines=[];

        $.each(GM_getValue('toread',[]), function() { i=this; lines.push(createTA(i)); })
        GM_setValue('lastReadDate',new Date());
        return lines;
    }
    catch(err){alert("getReadListTA: "+err); return "";}
}
function getListTA(list){
    try{
        var i, lines;lines=[];

        $.each(list, function() {i=this;lines.push(createTA(i));})
        return lines;
    }
    catch(err){alert("getListTA: "+err); return "";}
}
function createTA(id){
    try{
        var line;
        $.ajax({
            async: false,
            type: 'GET',
            url: '/works/' + id + '/navigate',
            success: function(page) {
                str = id+"·";
                str += $(page).find('.works-navigate.region').find('a').eq(0).text()+"·";
                str += $(page).find('.works-navigate.region').find('a').eq(1).text();
                line=str;
            }
        });
        return line;
    }
    catch(err){alert("createTA: "+err); return "";}
}
myFunctions.testDate= function(){
    try{
        var savedDate = new Date(GM_getValue('lastReadDate',''));
        var thisDay = new Date();
        var diff = thisDay-savedDate;
        if (Math.floor(diff/days)>=Update_ReadList){var trl=getReadListTA(); GM_setValue("toread2",trl);}
    }
    catch(err){alert("testDate: "+err);}
};

myFunctions.add2ReadList=function(id){
    try{
        readList=GM_getValue('toread',[]); var readList2=GM_getValue('toread2',[]);
        if(readList.indexOf(id)==-1){
            readList.push(id);readList2.push(createTA(id));
            //if(readList.length==0){readList=[id];readList2=[createTA(id)];} else{}
            GM_setValue('toread',readList);GM_setValue('toread2',readList2);}
    }
    catch(err){alert("add2ReadList: "+err);}
};
myFunctions.minusReadList=function(id){
    try{
        readList=GM_getValue('toread',[]);x = readList.indexOf(id);
        if(x!=-1){var readList2 = GM_getValue('toread2',[]);readList.splice(x,1);GM_setValue('toread',readList);readList2.splice(x,1);GM_setValue('toread2',readList2);}
    }
    catch(err){alert("minusReadList: "+err);}
};

function BeginWorking(){
    try{
        var works,i,a;
        var works2 = $('.work.blurb.group');
        for(i=0;i<$(works2).length;i++){//
            var work,ID,sqs,sq,title,author,summs,fandoms,rels,datetime,wccks;
            cssClass=' class="worktext" ';
            work=$(works2[i]);ID=$(work).attr('id');ID=ID.replace("work_","");
            sqs=$(work).find('.required-tags');
            $(sqs).children().wrap('<td>');$(sqs).children().eq(0).wrap('<tr>');$(sqs).children().eq(1).wrap('<tr>');$(sqs).children().wrapAll('<table><tbody>');
            $(sqs).find('tr').eq(0).append('\n').append($(sqs).find('td').eq(2));$(sqs).find('tr').eq(1).append('\n').append($(sqs).find('td').eq(3));
            title=$(work).find('h4 a').eq(0).addClass('worktext');author=$(work).find('h4 a').eq(1).addClass('worktext');
            fandoms=[];$(work).find('.fandoms.heading a').each(function(){fandoms.push($(this).text())});
            rels=[];$(work).find('.relationships').each(function(){rels.push($(this).text())});
            datetime=myFunctions.convertDateTime($(work).find('.datetime').html());
            if($(work).find('.userstuff.summary').length){
                $(work).find('.userstuff.summary').children().wrapAll('<div class="worktext" id="summ'+ID+'" style="color:'+Star3+';display: inline-block; margin-bottom:3px; width: 90%; height:22pt; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">');
                summs=$(work).find('.userstuff.summary').html().replace(/<p>&nbsp;<\/p>/g,"").replace(/<b>/g,"").replace(/<\/b>/g,"");
            }else{summs="";}
            wcck=[];wccks=$(work).find('dl dd').each(function(){var item=this; // 0(words), 1(chapt), 2(comnts), 3(kudos), 4(bookmarks)
                if($(item).attr('class').includes('words')){wcck[0]=$(item).html();}
                else if($(item).attr('class').includes('chapters')){wcck[1]=$(item).text().split("/");}
                else if($(item).attr('class').includes('comments')){
                    wcck[2]=$(item).find('a').addClass('worktext').attr('href','/works/'+ID+'?show_comments=true&view_full_work=true#comments')[0].outerHTML;}
                else if($(item).attr('class').includes('kudos')){wcck[3]=$(item).find('a').addClass('worktext')[0].outerHTML;}
                else if($(item).attr('class').includes('bookmarks')){wcck[4]=$(item).find('a').addClass('worktext')[0].outerHTML;}
            });
            var chdt=getLastChDt(ID);
            sq=$('<div>').css({'float':'left','display':'inline !important','margin':'0px 10px 3px 0px'}).append($(sqs));
            var str=$(sq)[0].outerHTML+'\n';
            str+="<div style='display:inline !important;margin-left:0px;'>\n";
               str+=$(title)[0].outerHTML+" <span class='worktext'>-</span> ";
               if($(author).length){str+=$(author)[0].outerHTML+'\n';}else{str+="Anonymous\n";}
               var down=$('<a>',{href: '#/',id:'down'+ID}).css({'font-size':'12pt','border':'0'}).text('\u2304');
               var up=$('<a>',{href: '#/',id:'up'+ID}).css({'border':'0'}).text('^');
               str+=$(down)[0].outerHTML+'\n'+$(up)[0].outerHTML+'\n';
               down=$('<span>').addClass('totheRight worktext').css({'width':'275px'}).append($('<div>',{id:'datetime'}).css({'font-size':'75%','vertical-align':'top','float':'right'}));
               $(down).find('div').eq(0).prepend('\n').append($('<span>').css({'padding-right':'20px'}).html('Pub: '+chdt[0]).append('<br />')).append('Upd: '+datetime+'\n');
               str+=$(down)[0].outerHTML+'<br style="margin-bottom:5px">\n';
               str+=summs+'</div>\n';
            down=$('<div>').css({'width':'100%'}).append($('<a>',{href:'#/'}).addClass('i worktext').text('Fandoms ').append($('<em>').html(fandoms.join("<br>")))).append($('<span>').addClass('totheLeft worktext')).append('\n');
            $(down).append($('<a>',{href:'#/',id:'rel'}).addClass('i worktext').text('Relationships ').append($('<em>').html(rels.join("<br>")))).append($('<span>').addClass('totheLeft worktext')).append('\n');
            $(down).append($('<span>').addClass('totheLeft worktext').append($('<i>').text('Words:')).append(' '+wcck[0])).append('\n');
            up=$('<span>',{id:'chapters'}).append($('<a>',{href:chdt[1],id:'chapter',title:'Go to last chapter'}).addClass('worktext').html(wcck[1][0])).append('/'+wcck[1][1]);
            $(down).append($('<span>').addClass('totheLeft worktext').append($('<i>').text('Chapters: ')).append($(up))).append('\n');
            if (wcck[2]!=null){$(down).append($('<span>').addClass('totheLeft worktext').prepend($('<i>').text('Comments:')).append(' '+wcck[2])).append('\n');}
            if (wcck[3]!=null){$(down).append($('<span>').addClass('totheLeft worktext').prepend($('<i>').text('Kudos:')).append(' '+wcck[3])).append('\n');}
            if (wcck[4]!=null){$(down).append($('<span>').addClass('totheLeft worktext').prepend($('<i>').text('Bookmarks:')).append(' '+wcck[4])).append('\n');}
            str+=$(down)[0].outerHTML;
            myFunctions.removeElements(work[0]);
            work.html(str);
            insertUpClick(ID); insertDownClick(ID);
            summsUp(ID);
            var newRight=$(work).find('.totheRight');
            var dropBtn=myFunctions.addDropDown(ID,"margin-right:30px;border:0px");
            $(newRight).prepend($(dropBtn));
            if(GM_getValue('hide',[]).indexOf(ID)>-1){myFunctions.selectIt(dropBtn.querySelectorAll("[id='0']")[0]);}
            else if(GM_getValue('toread',[]).indexOf(ID)>-1){myFunctions.selectIt(dropBtn.querySelectorAll("[id='1']")[0]);}
            else if(GM_getValue('star1',[]).indexOf(ID)>-1){myFunctions.selectIt(dropBtn.querySelectorAll("[id='2']")[0]);}
            else if(GM_getValue('star2',[]).indexOf(ID)>-1){myFunctions.selectIt(dropBtn.querySelectorAll("[id='3']")[0]);}
            else if(GM_getValue('star3',[]).indexOf(ID)>-1){myFunctions.selectIt(dropBtn.querySelectorAll("[id='4']")[0]);}
            else if(GM_getValue('star4',[]).indexOf(ID)>-1){myFunctions.selectIt(dropBtn.querySelectorAll("[id='5']")[0]);}
            else if(GM_getValue('star5',[]).indexOf(ID)>-1){myFunctions.selectIt(dropBtn.querySelectorAll("[id='6']")[0]);}
            else{
                if($(work).attr('class').includes("own")){$(work).css('background-color',Own_Color);}
                else if (!isOtp(ID)){myFunctions.toFormat1_4($(work)[0],Star1);}
            }
        }
        injectClearCbo();
//        alert($(newel).html());
//        alert($(newel).prop("tagName"));
    }
    catch(err){alert("BeginWorking: "+err);}
}
myFunctions.convertDateTime=function(datetime){
    try{
        var dt=new Date(Date.parse(datetime));
        var m=myFunctions.padZeros((dt.getMonth()+1).toString(),2);
        var d=myFunctions.padZeros((dt.getDate()).toString(),2);
        var y=dt.getFullYear();
        if (Date_Format==0){return d+"/"+m+"/"+y;} else {return m+"/"+d+"/"+y;}
    }
    catch(err){alert("convertDateTime: "+err);}
};
myFunctions.padZeros=function(str,sp){
    try{ if (str.length == sp){return str;} while(str.length!=sp){str="0"+str;} return str; }
    catch(err){alert("padZeros: "+err);}
};
myFunctions.removeElements=function (blurb){var i; for(i=blurb.children.length-1;i>=0;i--){blurb.children[i].outerHTML = "";}};
function getLastChDt(id){
    try{
        var newdate, last;
        $.ajax({
            async: false,
            type: 'GET',
            url: '/works/' + id + '/navigate',
            success: function(page) {
                var first = $(page).find('ol li').first().find('span').html().replace("(","").replace(")","");
                var dt=new Date(Date.parse(first));
                var m=myFunctions.padZeros((dt.getMonth()+1).toString(),2);
                var d=myFunctions.padZeros((dt.getDate()+1).toString(),2);
                var y=dt.getFullYear();
                if (Date_Format==0){newdate= d+"/"+m+"/"+y;} else {newdate= m+"/"+d+"/"+y;}
                last = $(page).find('ol li').last().find('a').attr('href');
            }
        });
        return [newdate,last];
    }
    catch(err){alert("getLastChDt: "+err);}
}
function isOtp(id){
    try{
        if(ShipList.length==0){return true;};//alert($('#work_'+id).find('#rel').children().first().html());
        var rel = $('#work_'+id).find('#rel').children().first().html().split("<br>");
        searchRel=ShipList.toLowerCase().split("/");
        if(rel[0].toLowerCase().indexOf(searchRel[0])==-1||rel[0].toLowerCase().indexOf(searchRel[1])==-1){return false;} else {return true;}
    }
    catch(err){alert("isOtp: "+err);}
}

function insertUpClick(id){ $(document).on('click','#up'+id,function(){summUp(id);return false;}); }
function insertDownClick(id){ $(document).on('click','#down'+id,function(){summDown(id);return false;}); }
function summsUp(){ $('a[id^="up"]').each(function(){ $(this).hide(); }); $('a[id^="down"]').each(function(){ $(this).show(); }); }
function summsDown(){ $('a[id^="up"]').each(function(){ $(this).show(); }); $('a[id^="down"]').each(function(){ $(this).hide(); }); }
function summUp(id){
    try{
        var summ = $('#summ'+id);$(summ).removeAttr('style');var pc = $('#work_'+id).find('#rel').css('color');
        $(summ).css({'color':pc,'display':'inline-block', 'margin-bottom':'3px', 'width':'90%','height':'22pt', 'white-space':'nowrap', 'overflow':'hidden', 'text-overflow':'ellipsis'});
        $('a[id="down'+id+'"]').show();$('a[id="up'+id+'"]').hide();
    }
    catch(err){alert("summUp: "+err);}
}
function summDown(id){
    try{
        var summ = $('#summ'+id);$(summ).removeAttr('style');var pc = $('#work_'+id).find('#rel').css('color');$(summ).css({'color':pc});
        $('a[id="up'+id+'"]').show();$('a[id="down'+id+'"]').hide();
    }
    catch(err){alert("summDown: "+err);}
}

myFunctions.addDropDown=function (id,style=""){
    try{
        var di="_"+id;
        var drop = document.createElement("div"); drop.className = "dd1"; drop.style.cssFloat="left";
        var btn = document.createElement("input"); btn.type="button"; btn.className="dd1btn"; btn.value="Select";
        btn.addEventListener('click', function() { myFunctions.dropItDown(di); }, false);drop.appendChild(btn);
        var opts = document.createElement("div"); opts.className="dd1-content";opts.id=di;
        var array = ["Hide","to Read","\u2605","\u2605\u2605","\u2605\u2605\u2605","\u2605\u2605\u2605\u2605","\u2605\u2605\u2605\u2605\u2605","Unselect"];//;
        var i; for(i=0;i<array.length;i++){
            var opt = document.createElement("a");
            opt.href="#/"; opt.id=i; opt.onclick=function(){myFunctions.selectIt(this);return false;};opt.innerHTML = array[i];
            opts.appendChild(opt);
        }
        drop.appendChild(opts);
        return(drop);
    }
    catch(err){alert("addDropDown: "+err);}
};
myFunctions.dropItDown=function (id) {
    try{
        var btns = document.querySelectorAll("[id^='_']");
        var i,oi=0;for(i=0;i<btns.length;i++){ if (btns[i].classList.contains("show")){oi=btns[i].id;} }
        if(oi==0||oi==id){document.getElementById(id).classList.toggle('show');}else{document.getElementById(oi).classList.remove("show");document.getElementById(id).classList.add('show');}
    }
    catch(err){alert("dropItDown: "+err);}
};

myFunctions.selectIt=function (opt){
    try{
        var opts = opt.parentNode;
        var btn = opts.parentNode.getElementsByTagName("input")[0];
        var work = opts.parentNode.parentNode.parentNode.parentNode;
        var workID = work.id.replace("work_","");
        switch(opt.innerHTML){
            case "Hide":
                myFunctions.toDefault(work,"hide");
                toFormatHide(work);
                var hideList=GM_getValue('hide',[]);
                if (hideList.indexOf(workID)==-1){hideList.push(workID);GM_setValue('hide',hideList);}
                var cbo = document.getElementById("cboClear"); if(cbo==null){}else if(cbo.value=="hide"){clearList();}
                break;
            case "to Read":
                myFunctions.toDefault(work,"toread");
                work.style.backgroundColor=Read;
                myFunctions.add2ReadList(workID);
                addReadLink(workID);
                var cbo = document.getElementById("cboClear"); if(cbo==null){}else if(cbo.value=="toread"){clearList();}
                break;
            case "\u2605":
                myFunctions.toDefault(work,"star1");
                myFunctions.toFormat1_4(work,Star1);
                var star1List=GM_getValue('star1',[]);
                if (star1List.indexOf(workID)==-1){star1List.push(workID);GM_setValue('star1',star1List);}
                var cbo = document.getElementById("cboClear"); if(cbo==null){}else if(cbo=="star1"){clearList();}
                break;
            case "\u2605\u2605":
                myFunctions.toDefault(work,"star2");
                myFunctions.toFormat1_4(work,Star2);
                var star2List=GM_getValue('star2',[]);
                if (star2List.indexOf(workID)==-1){star2List.push(workID);GM_setValue('star2',star2List);}
                var cbo = document.getElementById("cboClear"); if(cbo==null){}else if(cbo=="star2"){clearList();}
                break;
            case "\u2605\u2605\u2605":
                myFunctions.toDefault(work,"star3");
                myFunctions.toFormat1_4(work,Star3);
                var star3List=GM_getValue('star3',[]);
                if (star3List.indexOf(workID)==-1){star3List.push(workID);GM_setValue('star3',star3List);}
                var cbo = document.getElementById("cboClear"); if(cbo==null){}else if(cbo=="star3"){clearList();}
                break;
            case "\u2605\u2605\u2605\u2605":
                myFunctions.toDefault(work,"star4");
                myFunctions.toFormat1_4(work,Star4);
                var star4List=GM_getValue('star4',[]);
                if (star4List.indexOf(workID)==-1){star4List.push(workID);GM_setValue('star4',star4List);}
                var cbo = document.getElementById("cboClear"); if(cbo==null){}else if(cbo=="star4"){clearList();}
                break;
            case "\u2605\u2605\u2605\u2605\u2605":
                myFunctions.toDefault(work,"star5");
                myFunctions.toFormat1_4(work,Star4);
                var title = work.querySelectorAll("[href^='/works/']")[0];
                title.innerHTML="<span style='text-shadow: 4px -4px 4px red,  2px -2px 3px #e6d71a,6px -6px 9px #0e0504'>"+myFunctions.toFormat5(title.innerHTML)+"</span>";
                var star5List=GM_getValue('star5',[]);
                if (star5List.indexOf(workID)==-1){star5List.push(workID);GM_setValue('star5',star5List);}
                var cbo = document.getElementById("cboClear"); if(cbo==null){}else if(cbo=="star5"){clearList();}
                break;
            case "Unselect":
                myFunctions.toDefault(work,"");
                if(work.className.indexOf("own")>-1){work.style.backgroundColor=Own_Color;}
                else if (!isOtp(workID)){myFunctions.toFormat1_4(work,Star1);}

                 //make sure not hidden
                break;
        }
        if(opt.innerHTML=="Unselect"){btn.value = "Select";}else{btn.value = opt.innerHTML;}
        opts.classList.remove("show");
        /*

        OTP color doen't come back after unselect

        */
    }
    catch(err){alert("selectIt: "+err);}
};
myFunctions.toDefault=function (work,item){
    try{
        var workID = work.id.replace("work_","");var x;
        if (item!="hide"){var hideList=GM_getValue('hide',[]);x = hideList.indexOf(workID); if(x!=-1){hideList.splice(x,1);GM_setValue('hide',hideList);}}
        if (item!="toread"){myFunctions.minusReadList(workID);}
        if (item!="star1"){star1List=GM_getValue('star1',[]);x = star1List.indexOf(workID); if(x!=-1){star1List.splice(x,1); GM_setValue('star1',star1List); }}
        if (item!="star2"){star2List=GM_getValue('star2',[]);x = star2List.indexOf(workID); if(x!=-1){star2List.splice(x,1);GM_setValue('star2',star2List);}}
        if (item!="star3"){star3List=GM_getValue('star3',[]);x = star3List.indexOf(workID); if(x!=-1){star3List.splice(x,1);GM_setValue('star3',star3List);}}
        if (item!="star4"){star4List=GM_getValue('star4',[]);x = star4List.indexOf(workID); if(x!=-1){star4List.splice(x,1);GM_setValue('star4',star4List);}}
        if (item!="star5"){star5List=GM_getValue('star5',[]);x = star5List.indexOf(workID); if(x!=-1){star5List.splice(x,1);GM_setValue('star5',star5List);}}
        var text;
        var title=work.querySelectorAll("[href^='/works/']")[0];
        if (title.innerHTML.indexOf("<span")!=-1){
            title.innerHTML=title.innerHTML; title.innerHTML=title.innerHTML.replace(title.innerHTML.substr(0,title.innerHTML.indexOf(">")+1),"");
            while(title.innerHTML.indexOf("<")>-1){
                var a,b; a = title.innerHTML.indexOf("<"); b=title.innerHTML.indexOf(">");
                title.innerHTML=title.innerHTML.replace(title.innerHTML.substr(a,(b+1)-a),"");
            };
        }
        if (work.style.backgroundColor==myFunctions.hex2RGB(Read)){removeReadLink(workID,false);}
        work.style.backgroundColor=None;
        var chgd = work.getElementsByClassName("worktext");
        var i;for(i=0;i<chgd.length;i++){chgd[i].style.color=Star3;}
        toUnhide(work);
    }
    catch(err){alert("toDefault: "+err);}
};

myFunctions.hex2RGB=function (Hex){
    try{
        Hex = Hex.trim(); var r,g,b;
        if (Hex.indexOf("#")>-1){Hex=Hex.replace("#","");}
        if (Hex.length==3){ Hex=Hex[0]+Hex[0]+Hex[1]+Hex[1]+Hex[2]+Hex[2]; }
        r=parseInt(Hex.substr(0,2),16); g=parseInt(Hex.substr(2,2),16); b=parseInt(Hex.substr(4),16);
        return "rgb("+r+", "+g+", "+b+")";
    }
    catch(err){alert("hex2RGB: "+err);}
};
function toFormatHide(work){
    try{
        if ($(work).children().first().is(':hidden')){}else{
            $(work).children().each(function(){//div
                if ($(this).html().includes("dd1")){
                    $(this).children().each(function(){//span totheRight
                        if ($(this).html().includes("dd1")){$(this).children(":not(.dd1)").hide();} else {$(this).hide();}
                    });
                }
                else{$(this).hide();}
            });
        }
    }
    catch(err){alert("toFormatHide: "+err);}
}
function toUnhide(work){
    try{
        if ($(work).children().first().is(':hidden')){
            $(work).children().each(function(){//divs
                if ($(this).html().includes("dd1")){ // title, author, up, down, button, date
                    $(this).children().each(function(){
                        if ($(this).html().includes("dd1")) {$(this).children(":not(.dd1)").show();}
                        else {$(this).show();}
                    });
                }
                else{$(this).show();}
            });
            summUp($(work).attr('id').replace("work_",""));
        }
    }
    catch(err){alert("toUnhide: "+err);}
}
myFunctions.toFormat1_4=function (work,color){var chgd = work.getElementsByClassName("worktext"); var i; for(i=0;i<chgd.length;i++){chgd[i].style.color=color;}};
myFunctions.toFormat5=function (title){
    try{
        var lst=[],f, o =Math.ceil((title.length - 1) / 3); f=Math.floor((Math.random()*o)+1);
        var ff;for(ff=1;ff<title.length;ff++){
            var x=Math.floor(Math.random()*title.length);
            if (lst.length==0||lst.indexOf(x)==-1){lst.push(x);}
            if (lst.length==f){break;}
        }
        lst=lst.sort(sortNumber);
        for(ff=lst.length-1;ff>=0;ff--){
            title=title.substr(0,lst[ff]+1)+"</i>"+title.substr(lst[ff]+1);
            title=title.substr(0,lst[ff])+"<i style='text-shadow: 6px -8px 4px red,  4px -4px 3px #e6d71a,8px -6px 9px #0e0504'>"+title.substr(lst[ff]);
        }
        return title;
    }
    catch(err){alert("toFormat5: "+err);}
};function sortNumber(a,b) { return a - b; }

function injectReadLinks(){
    try{
        if (ReadLinksCount==0){return;}
        var el = $('#work-filters').first().children().eq(1);
        $(el).before('<center><b>To Read</b></center>').after('<p class="toReadLinks"></p>');
    }
    catch(err){alert("injectReadLinks: "+err);}
}
function addReadLinks(){
    try{
        if(ReadLinksCount==0){return;}
        var a,z; if (GM_getValue('toread',[]).length<ReadLinksCount){z=GM_getValue('toread',[]).length;}else{if(ReadLinksCount>20){z=20;}else{z=ReadLinksCount;}}
        var newel = $('.toReadLinks'); if(!($(newel).is(':empty'))){$(newel).empty();}
        $(newel).append('<ul style=""></ul>'); newel=$(newel).find('ul').first();
        if(GM_getValue('toread',[]).length==0){return;}
        var i; for(i=0;i<z;i++){
            var ita = myFunctions.calcTextSpace((GM_getValue('toread2',[])[i]).split("·"));
            var style="margin-left:10px; padding: 0px 2px; color: black; background: lightgray; line-height:8pt;display: inline-block;";
            style+="-moz-border-radius: 50%;-webkit-border-radius: 50%; border-radius: 50%; ";
            var remove = " <a href=\"#/\" id=\"remove"+ita[0]+"\" class=\"readlink\" style=\"bottom:-15px;"+style+"\" title=\"Remove from \"To Read\" list\"> x </a>\n";

            var str = '<li id="readlink'+ita[0]+'" style="margin-bottom:-5px;">\n';
            if(ita.length==1){
                str+='<a href="/works/' + ita[0] + '" class="readlink" style="line-height:10pt;display: inline-block;color:#cc1f00"'
                str+='title="AO3 does not allow access to basic info on what was deleted">Deleted:</a>  title and author lost';
                str+='<span style="padding-left:10px;font-family:Arial Narrow,Arial,sans-serif;;">ao3 '+ita[0]+remove;
            }
            else if(ita[1].length==0 && ita[2].length==0){
                str+='<a href="/works/' + ita[0] + '" class="readlink" style="line-height:10pt;display: inline-block;color:#cc1f00">Restricted:</a>  <i>log-in to access</i>'+remove;
            }
            else{str+='<a href="/works/' + ita[0] + '" class="readlink" style="line-height:10pt;display: inline-block;">'+ita[1]+'</a> - '+ita[2]+remove;}
            $(newel).append(str+'</li>\n');
            $(document).on('click','#remove'+ita[0],function(){removeReadLink(ita[0]);return false;});
        }
    }
    catch(err){alert("addReadLinks: "+err);}
}
function addReadLink(id){
    try{
        if ($('#readlink'+id).length >0){return;}
        if ($('.toReadLinks').find('ul').first().children().length>=ReadLinksCount){return;}
        var newel = $('.toReadLinks').find('ul').first();
        var x = GM_getValue('toread',[]).indexOf(id);
        var ita = myFunctions.calcTextSpace(GM_getValue('toread2',[])[x]).split("·");
        var style="margin-left:10px; padding: 0px 2px; color: black; background: lightgray; line-height:8pt;display: inline-block;";
        style+="-moz-border-radius: 50%;-webkit-border-radius: 50%; border-radius: 50%; ";
        var remove = " <a href=\"#/\" id=\"remove"+ita[0]+"\" class=\"readlink\" style=\"bottom:-15px;"+style+"\" title=\"Remove from \"To Read\" list\"> x </a>\n";

        var str = '<li id="readlink'+ita[0]+'" style="margin-bottom:-5px;">\n';
        if(ita.length==1){
            str+='<a href="/works/' + ita[0] + '" class="readlink" style="line-height:10pt;display: inline-block;color:#cc1f00"'
            str+='title="AO3 does not allow access to basic info on what was deleted">Deleted:</a>  title and author lost';
            str+='<span style="padding-left:10px;font-family:Arial Narrow,Arial,sans-serif;;">ao3 '+ita[0]+remove;
        }
        else if(ita[1].length==0 && ita[2].length==0){
            str+='<a href="/works/' + ita[0] + '" class="readlink" style="line-height:10pt;display: inline-block;color:#cc1f00">Restricted:</a>  <i>log-in to access</i>'+remove;
        }
        else{str+='<a href="/works/' + ita[0] + '" class="readlink" style="line-height:10pt;display: inline-block;">'+ita[1]+'</a> - '+ita[2]+remove;}
        $(newel).append(str+'</li>\n');
        $(document).on('click','#remove'+ita[0],function(){removeReadLink(ita[0]);return false;});
    }
    catch(err){alert("addReadLink: "+err);}
}
function removeReadLink(id,removeEverything=true){
    try{
        //if fic on page, unselect
        if (removeEverything){
            if ($('#work_'+id).length){myFunctions.selectIt($('#_'+id).children().eq(7)[0]);}
            else{minusReadList(id);}
        }
        $('#readlink'+id).remove();
    }
    catch(err){alert("removeReadLink: "+err);}
}
myFunctions.calcTextSpace=function(nta){
    try{
        var num = Number(nta[1].length+nta[2].length);
        if (Number(num) > Number(40)){
            var o;
            if (Number(nta[2].length)>Number(20)){
                if(Number(nta[1].length)>Number(20)){nta[2]=nta[2].substr(0,17)+"...";}else{ o = 20-Number(nta[1].length);o+=19;nta[2]=nta[2].substr(0,o)+"..."; }
            }
            o = 20-Number(nta[2].length);
            if (Number(nta[1].length)>Number(25)){o+=19;nta[1]=nta[1].substr(0,o)+"...";}
        }
        return nta;
    }
    catch(err){alert("calcTextSpace: "+err);}
};

function injectClearCbo(){
    try{
        var el = $('#work-filters').first().append('<div style="margin-left:10px;"><select id="cboClear" style="width:25%;margin-bottom:10px;"></select><UL id="lstClear"></UL></div>');
        $('#cboClear').append('<option value="closed" selected disabled hidden>Lists</option>');
        $('#cboClear').append('<option value="hide">Hide</option>');
        $('#cboClear').append('<option value="toread">To Read</option>');
        $('#cboClear').append('<option value="star1">1 Star</option>');
        $('#cboClear').append('<option value="star2">2 Stars</option>');
        $('#cboClear').append('<option value="star3">3 Stars</option>');
        $('#cboClear').append('<option value="star4">4 Stars</option>');
        $('#cboClear').append('<option value="star5">5 Stars</option>');
        $(document).on('change','#cboClear',function(){listSelected();});
    }
    catch(err){alert("injectClearCbo: "+err);}
}
function listSelected(){
    try{
        var ullist = $('#lstClear').empty();
        var opt = $('#cboClear').val();
        var cboList2, cboList;
        var newel = $('#lstClear').first();
        $(newel).append('<li id="gathering"> Gathering list... </li>');
        if(opt!="toread"){cboList2 = GM_getValue(opt,[]);cboList= getListTA(cboList2);}
        else{cboList=GM_getValue('toread2',[])}

        if(cboList.length==0){return;}
        var i; for(i=0;i<cboList.length;i++){
            var ita;
            if(typeof (cboList[i])=="undefined"){ita=[cboList2[i]];}
            else{ita=myFunctions.calcTextSpace((cboList[i]).split("·"));}
            var style="margin-left:10px; padding: 0px 2px; color: black; background: lightgray; line-height:8pt;display: inline-block;";
            style+="-moz-border-radius: 50%;-webkit-border-radius: 50%; border-radius: 50%; ";
            var remove = " <a href=\"#/\" id=\"remove"+ita[0]+"\" class=\"readlink\" style=\"bottom:-15px;"+style+"\" title=\"Remove from \"To Read\" list\"> x </a>\n";

            var str = '<li id="lst'+ita[0]+'" style="margin-bottom:-5px;">\n';
            if(ita.length==1){
                str+='<a href="/works/' + ita[0] + '" class="readlink" style="line-height:10pt;display: inline-block;color:#cc1f00"'
                str+='title="AO3 does not allow access to basic info on what was deleted">Deleted:</a>  title and author lost';
                str+='<span style="padding-left:10px;font-family:Arial Narrow,Arial,sans-serif;;">ao3 '+ita[0]+remove;
            }
            else if(ita[1].length==0 && ita[2].length==0){
                str+='<a href="/works/' + ita[0] + '" class="readlink" style="line-height:10pt;display: inline-block;color:#cc1f00">Restricted:</a>  <i>log-in to access</i>'+remove;
            }
            else{str+='<a href="/works/' + ita[0] + '" class="readlink" style="line-height:10pt;display: inline-block;">'+ita[1]+'</a> - '+ita[2]+remove;}
            $(newel).append(str+'</li>\n');
            $(document).on('click','#remove'+ita[0],function(){removeReadLink(ita[0]);return false;});
        }
        $('#gathering').remove();
   }
    catch(err){alert("listSelected: "+err);}
}
function clearList(){var cbo = document.getElementById("cboClear"); if (cbo!=null){ cbo.value="closed"; var ul=document.getElementById("lstClear"); ul.innerHTML=""; }}
function removeListItem(id){
    try{
        var opt = $('#cboClear').val();
        var cboList,optID;

        if ($('#work_'+id).length){ myFunctions.selectIt($('#_'+id).children().last()[0]);}
        else{
            var x;
            switch(opt){
                case "hide": var hideList = GM_getValue(opt,[]); x = hideList.indexOf(id); if(x!=-1){hideList.splice(x,1);GM_setValue(opt,hideList);} break;
                case "toread": var toReadList = GM_getValue(opt,[]); x = toReadList.indexOf(id); if(x!=-1){toReadList.splice(x,1);GM_setValue(opt,toReadList);} break;
                case "star1": var star1List = GM_getValue(opt,[]); x = star1List.indexOf(id); if(x!=-1){star1List.splice(x,1); GM_setValue(opt,star1List);}  break;
                case "star2": var star2List = GM_getValue(opt,[]); x = star2List.indexOf(id); if(x!=-1){star2List.splice(x,1);GM_setValue(opt,star2List);} break;
                case "star3": var star3List = GM_getValue(opt,[]); x = star3List.indexOf(id); if(x!=-1){star3List.splice(x,1);GM_setValue(opt,star3List);} break;
                case "star4": var star4List = GM_getValue(opt,[]); x = star4List.indexOf(id); if(x!=-1){star4List.splice(x,1);GM_setValue(opt,star4List);} break;
                case "star5": var star5List = GM_getValue(opt,[]); x = star5List.indexOf(id); if(x!=-1){star5List.splice(x,1);GM_setValue(opt,star5List);} break;
            }
        }
        $('#lst'+id).remove();
   }
    catch(err){alert("removeListItem: "+err);}
}

function injectNote(id){
    try{
        alert("injecting note "+id);
    }
    catch(err){alert("injectNotes: "+err);}
}
myFunctions.addCss();