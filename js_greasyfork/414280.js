// ==UserScript==
// @name         AdminInputer
// @namespace    http://tampermonkey.net/
// @version      2.7.0
// @description  phpcms adminHelper!
// @author       whiteCat
// @require      https://cdn.jsdelivr.net/npm/hotkeys-js@3.7.2/dist/hotkeys.min.js
// @match        *://admin.pw88.com/index.php?m=content&c=content&a=add*
// @match        *://admin.pw88.com/index.php?m=content&c=content&a=init*
// @match        *://admin.3310.com/index.php?m=content&c=content&a=add*
// @match        *://admin.8q98.com/index.php?m=content&c=content&a=add*
// @match        *://admin.07xz.com/index.php?m=content&c=content&a=add*
// @match        *://admin.07xz.com/index.php?m=content&c=content&a=init*
// @match        *://admin.29xz.com/index.php?m=content&c=content&a=add*
// @match        *://admin.29xz.com/index.php?m=content&c=content&a=init*
// @match        *://admin.ucbug.cc/index.php?m=content&c=content&a=add*
// @match        *://admin.ucbug.cc/index.php?m=content&c=content&a=init*
// @match        *://admin.huanleren.com/index.php?m=content&c=content&a=add*
// @match        *://admin.huanleren.com/index.php?m=content&c=content&a=init*
// @match        *://admin.apkdd.com/index.php?m=content&c=content&a=add*
// @match        *://admin.apkdd.com/index.php?m=content&c=content&a=init*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414280/AdminInputer.user.js
// @updateURL https://update.greasyfork.org/scripts/414280/AdminInputer.meta.js
// ==/UserScript==

(function() {
    'use strict';
	let title;
    let invokeCount = 0;
    let secondTitle;
    let version;
    let keywords;
    let hostname;
    let isRepeated = -1;
    let gameSuffixList = new Array('安卓版','手机版','手游','中文版','汉化版','官方版','最新版');
    let breakSuffixList = new Array('破解版','付费破解版','内购破解版','无限金币版','变态版','bt版');
    let appSuffixList = new Array('安卓版','手机版','最新版','官方版','app','免费版');
    let hentaiSuffixList = new Array('福利版','午夜福利版','污版','深夜福利版','无限制版','成年版','老司机版','超污版','色版','成人版','无限观看版','绅士版','开车版','私密版','看污片app','看片app','污视频app','成人视频app','福利视频app','成人app','成年app','看片神器','成人福利版','污片在线看','成人片');
    //deal the big open page
    let openLink = $("a.add.fb").attr("onclick");
    if (typeof(openLink) != "undefined"){
        let newLink = openLink.substring(0,openLink.indexOf(")"))+",1013)";
        $("a.add.fb").attr("onclick",newLink);
    }
    //Create Random Number
    function randomNum(minNum,maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
                break;
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                break;
            default:
                return 0;
                break;
        }
    }
    // ensure two diffrent number
    function differNumber(minNum,maxNum){
        let randomNumList = new Array();
        let n1 = randomNum(minNum,maxNum);
        let n2;
        randomNumList.push(n1);
        do{
        n2 = randomNum(minNum,maxNum);
        }
        while(n1 == n2);
        randomNumList.push(n2);
        return randomNumList;
    }
    //get Tag Array
    function getTagArray(tag,content){
        let positions = new Array();
        let pos = content.indexOf(tag);
        while(pos > -1){
            positions.push(pos);
            pos = content.indexOf(tag,pos + 1);
        }
        return positions;
    };
    //block alert
    //window.alert=function(){}
    //Judge Site
    function AutoInput(type,tagStr){
        hostname = window.location.host;
        if(hostname == "admin.07xz.com"){
            return AutoInput07(type,tagStr);
        }if(hostname == "admin.29xz.com"){
            if(invokeCount == 0){
                title = $("#title").val();
            }
            invokeCount++;
            return AutoInput29(type,tagStr);
        }
        if((hostname == "admin.ucbug.cc")|(hostname == "admin.huanleren.com")|(hostname == "admin.apkdd.com")){
            if(invokeCount == 0){
                title = $("#title").val();
            }
            invokeCount++;
            return AutoInputUC(type,tagStr);
        }
    }
    // Hotkey
    // type 1 is game 2 is app 3 is breakVersion
    hotkeys('alt+q', function() {AutoInput(2,',');});
    hotkeys('alt+a', function() {AutoInput(1,',');});
    hotkeys('alt+e', function() {AutoInput(3,',');});
    hotkeys('alt+1', function() {AutoInput(4,',');});
    hotkeys('alt+2', function() {AutoInput(5,',');});
    hotkeys('alt+3', function() {AutoInput(6,',');});
    hotkeys('alt+4', function() {AutoInput(7,',');});
    hotkeys('alt+5', function() {AutoInput(8,',');});
    hotkeys('alt+6', function() {AutoInput(9,',');});
    hotkeys('alt+7', function() {AutoInput(10,',');});
    //hotkeys('alt+r', function() {CKEDITOR.config.coreStyles_bold;});
    //Auto Deal Input 07Site
    function AutoInput07(type,tagStr){
        let keywordsList = new Array();
        // title
        title = $("#title").val();
        // version
        version = $('#version').val();
        if(!version.includes('v')){
            $('#version').val('v'+version);
        }
        if(type==1){
            $("#seo_title").val(title+gameSuffixList[randomNum(0,gameSuffixList.length-1)]+"-"+title+gameSuffixList[randomNum(0,gameSuffixList.length-1)]+"下载");
            secondTitle = $("#seo_title").val();
            $("#keywords").val(title+","+secondTitle.replace("-",","));
            keywordsList.push(title+gameSuffixList[randomNum(0,gameSuffixList.length-1)]+"下载");
            keywordsList.push(title+gameSuffixList[randomNum(0,gameSuffixList.length-1)]+"下载");
        }if(type==2){
            $("#seo_title").val(title+appSuffixList[randomNum(0,appSuffixList.length-1)]+"-"+title+appSuffixList[randomNum(0,appSuffixList.length-1)]+"下载");
            secondTitle = $("#seo_title").val();
            $("#keywords").val(title+","+secondTitle.replace("-",",")).toString;
            keywordsList.push(title+appSuffixList[randomNum(0,appSuffixList.length-1)]+"下载");
            keywordsList.push(title+appSuffixList[randomNum(0,appSuffixList.length-1)]+"下载");
        }if(type==3){
            $("#seo_title").val(title+breakSuffixList[randomNum(0,breakSuffixList.length-1)]+"-"+title+breakSuffixList[randomNum(0,breakSuffixList.length-1)]+"下载");
            secondTitle = $("#seo_title").val();
            $("#keywords").val(title+","+secondTitle.replace("-",",")).toString;
            keywordsList.push(title+breakSuffixList[randomNum(0,breakSuffixList.length-1)]+"下载");
            keywordsList.push(title+breakSuffixList[randomNum(0,breakSuffixList.length-1)]+"下载");
        }
        keywords = $("#keywords").val();
        let positions = getTagArray(tagStr,keywords);
        keywordsList.push(keywords.substring(0,positions[0]));
        keywordsList.push(keywords.substring(positions[0]+1,positions[1]));
        keywordsList.push(keywords.substring(positions[1]+1,keywords.length));
        $("input[name='jietupic_alt[]']").each(function(i){
                $(this).val(keywordsList[i]);
            });
    }
    //Auto Deal Input 29Site
    function AutoInput29(type,tagStr){
         let tkey;
        // version
        version = $('#version').val();
        if(!version.includes('v')){
            $('#version').val('v'+version);
        }
        if(type==1){
            $("#title").val(title+gameSuffixList[randomNum(0,gameSuffixList.length-1)]);
            tkey = $("#tkey").val(title+gameSuffixList[randomNum(0,gameSuffixList.length-1)]+"下载");
        }if(type==2){
            $("#title").val(title+appSuffixList[randomNum(0,appSuffixList.length-1)]);
            $("#tkey").val(title+appSuffixList[randomNum(0,appSuffixList.length-1)]+"下载");
        }if(type==3){
            $("#title").val(title+breakSuffixList[randomNum(0,breakSuffixList.length-1)]);
            $("#tkey").val(title+breakSuffixList[randomNum(0,breakSuffixList.length-1)]+"下载");
        }
        keywords = $("#keywords").val($("#title").val()+","+$("#tkey").val()+","+title);
    }
    // UCbug Site
    // 以后写的主标题和副标题一样，主标题多加一个下载 -20200731
    let helpdesc = "  1爱威  2恋  3泰迪  4黑鲨  5夏娃  6被窝  7蜜柚";
    let regex = new RegExp('在线观看|\\\w|无码视频|安装包|在线看|播放器|老司机|你懂的|下载|app|tv|不限|看片|软件|无码|内购|手游|完整|福利|日本|中国|国产|韩国|日韩|中文|私密|网|欧美|充值|频道|高清|免费|破解|平台|污版|资源|手机|苹果|污片|观看|色版|路线|成年|成人|色版|午夜|污视频|无限|制|在线|入口|宅男|vip|抢先|最新|看污|永久|会员|ios|亚洲|神器|高清|二维码|播放|地址|付费|隐藏|房间|官网|官方|盒子|次数|安卓|apk|污|版|免','ig');
    $('div .crumbs').text(helpdesc);
    function AutoInputUC(type,tagStr){
        let thumb = new Array(
            'https://www.ucbug.cc/uploadfile/2020/1110/20201110014436891.jpg',
            'https://www.ucbug.cc/uploadfile/2020/1109/20201109113322753.jpg',
            'https://www.ucbug.cc/uploadfile/2020/1109/20201109033908470.jpg',
            'https://www.ucbug.cc/uploadfile/2020/1111/20201111100204626.jpg',
            'https://www.ucbug.cc/uploadfile/2020/1107/20201107030330800.jpg',
            'https://www.ucbug.cc/uploadfile/2020/1111/20201111025511633.jpg',
            'https://www.ucbug.cc/uploadfile/2020/1105/20201105052912581.jpg'
        );
        //妹子图
        let picArr21 = [
            "https://www.ucbug.cc/uploadfile/2020/1022/20201022114908898.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1022/20201022114908247.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1022/20201022114908606.jpg"
        ];
        let picArr22 = [
            "https://www.ucbug.cc/uploadfile/2020/1022/20201022030603980.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1022/20201022030603217.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1022/20201022030603987.jpg"
        ];
        let picArr23 = [
            "https://www.ucbug.cc/uploadfile/2020/1022/20201022043513412.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1022/20201022043513406.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1022/20201022043513589.jpg"
        ];
        let picArr24 = [
            "https://www.ucbug.cc/uploadfile/2020/1023/20201023044805619.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1023/20201023044805940.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1023/20201023044805243.jpg"
        ];
        let picArr25 = [
            "https://www.ucbug.cc/uploadfile/2020/1026/20201026105224673.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1026/20201026105224195.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1026/20201026105224307.jpg"
        ];
        let picArr26 = [
            "https://www.ucbug.cc/uploadfile/2020/1026/20201026032230611.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1026/20201026032230386.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1026/20201026032230372.jpg"
        ];
        let picArr27 = [
            "https://www.ucbug.cc/uploadfile/2020/1026/20201026044942269.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1026/20201026044942686.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1026/20201026044942894.jpg"
        ];
        let picArr28 = [
            "https://www.ucbug.cc/uploadfile/2020/1028/20201028105918632.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1028/20201028105918535.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1028/20201028105918398.jpg"
        ];
        let picArr29 = [
            "https://www.ucbug.cc/uploadfile/2020/1029/20201029021208674.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1029/20201029021208595.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1029/20201029021208687.jpg"
        ];
        let picArr30 = [
            "https://www.ucbug.cc/uploadfile/2020/1103/20201103034042519.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1103/20201103034042695.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1103/20201103034042830.jpg"
        ];
        let picArr31 = [
            "https://www.ucbug.cc/uploadfile/2020/1103/20201103034042519.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1103/20201103034042695.jpg",
            "https://www.ucbug.cc/uploadfile/2020/1103/20201103034042830.jpg"
        ];
        let jietuhtml;
        title = $('#title').val(); //-20200731
        let originalTitle = title.replace(regex,""); //正则过滤
        if(originalTitle.indexOf("视频")==4){
            originalTitle = originalTitle.replace("视频","");
        }
        if (title.indexOf("下载")==-1){
            title +="下载";
            $('#title').val(title);
        }
        let vsetitle = title.substring(0,title.length-2); //-20200731
        $("#seo_title").val(vsetitle); //-20200731
        function makeVersion(version,size){
            add_multifile('downfiles');
            $("input[name='downfiles_fileurl[]']").val("http://htm.2929xz.com:39010/uc/xz.htm");
            //$("input[name='downfiles_fileurl[]']").val("http://cr5.198254.com/tiktokqsygjb.apk");
            $("#iosdownfiles").val("http://htm.2929xz.com:39010/uc/xzios.htm");
            $("#_3").attr("checked", 'checked');
            //let videoVersion = "v"+randomNum(1,3)+"."+randomNum(0,9)+"."+randomNum(0,9);
            let videoVersion = "v"+version;
            $('#version').val(videoVersion);
            //let videoSize = randomNum(11,52)+"."+randomNum(0,9)+"MB";
            let videoSize = size+"MB";
            $('#filesize').val(videoSize);
            // hide
            //$("#is_display_0").removeAttr('checked');
            //$("#is_display_1").attr('checked','true');
            partStyle();
        }
        function dealDesc(str){
            let ci = 0;
            let character = str.replace(/！|？/g,"。")
            let periodArray = getTagArray("。",character);
            let dealed = character.substring(0,periodArray[ci]+1);
            if(dealed != ""){
               for(ci; dealed.length<100;ci++){
                dealed = character.substring(0,periodArray[ci]+1);
            }}
            return dealed;
        }
        function partStyle(){
            let html = CKEDITOR.instances.content.getData();
            //let addpic = '<p><img alt=\''+vsetitle+'\' src=\''+pic3[isRepeated]+'\' style=\"height: 550px;\" /></p>';
            let TagStart = "<p>";
            let TagEnd = "</p>";
            let TagStartArray = getTagArray(TagStart,html);
            let TagEndArray = getTagArray(TagEnd,html);
            let p1 = html.substring(TagStartArray[0], TagEndArray[0]);
            let tempp1;
            // sp250 判断
            if (html.length<400){
                tempp1 = p1.replace("<p>","<p>　　<strong>"+vsetitle+"</strong>");
                if(p1.indexOf("tt")!=-1){
                    let p2 = p1.replace(RegExp("tt", "g"),vsetitle);
                    tempp1 = tempp1.replace(RegExp("tt", "g"),vsetitle);
                    $("#description").val(dealDesc((p2.replace("<p>",vsetitle))));
                }else{
                    $("#description").val(dealDesc((p1.replace("<p>",vsetitle))));
                }
            }else{
                tempp1 = p1.replace("<p>　　","<p>　　<strong>"+vsetitle+"</strong>");
                $("#description").val(p1.replace("<p>　　",vsetitle));
            }
            // 长度小于13认为h3
            let titlepArray = new Array();
            let temptitlepArray = new Array();
            for(let i = 1;i<TagStartArray.length-1;i++){
                let tempp = html.substring(TagStartArray[i], TagEndArray[i]+4);
                let temp1;
                if(tempp.length<=13){
                    titlepArray.push(tempp);
                    //console.log("-----"+i+tempp);
                    temp1 = tempp.replace("<p>　　","<h3>"+vsetitle);
                    temp1 = temp1.replace("</p>","</h3>");
                    temptitlepArray.push(temp1);
                }
            }
            // 段落标题
            for(let j = 0;j<titlepArray.length;j++){
                html = html.replace(titlepArray[j],temptitlepArray[j]);
            }
            //加粗段首
            html = html.replace(p1,tempp1);
            /* add image
            if(isRepeated != -1){
                html = html + addpic;
            }*/
            //console.log(html);
            CKEDITOR.instances.content.setData(html);
        }
        function jietuHandle(piccount,picArr){
            $('.upload-pic img').attr('src',thumb[piccount]);$('#thumb').val(thumb[piccount]);
            jietuhtml += '<div id="image_jietupic_1" style="padding:1px"><input type="text" name="jietupic_url[]" value='+picArr[0]+' style="width:310px;" ondblclick="image_priview(this.value);" class="input-text"> <input type="text" name="jietupic_alt[]" value='+vsetitle+' style="width:160px;" class="input-text"> <a href="javascript:remove_div(\'image_jietupic_1\')">移除</a></div>'+
            '<div id="image_jietupic_2" style="padding:1px"><input type="text" name="jietupic_url[]" value='+picArr[1]+' style="width:310px;" ondblclick="image_priview(this.value);" class="input-text"> <input type="text" name="jietupic_alt[]" value='+$('#title').val()+' style="width:160px;" class="input-text"> <a href="javascript:remove_div(\'image_jietupic_2\')">移除</a></div>'+
            '<div id="image_jietupic_3" style="padding:1px"><input type="text" name="jietupic_url[]" value='+picArr[2]+' style="width:310px;" ondblclick="image_priview(this.value);" class="input-text"> <input type="text" name="jietupic_alt[]" value='+originalTitle+' style="width:160px;" class="input-text"> <a href="javascript:remove_div(\'image_jietupic_3\')">移除</a></div>';
            $('#jietupic').before(jietuhtml);
        }
        if (type==4){
            makeVersion('3.5.2',43.8);
            jietuHandle(0,picArr31);
        }
        if (type==5){
            makeVersion('1.1.5',36.5);
            jietuHandle(1,picArr24);
        }
        if (type==6){
            makeVersion('2.0.6',42.8);
            jietuHandle(2,picArr24);
        }
        if (type==7){
            makeVersion('1.4.1',36.2);
            jietuHandle(3,picArr22);
        }
        if (type==8){
            makeVersion('2.0.1',34.5);
            jietuHandle(4,picArr26);
        }
        if (type==9){
            makeVersion('1.0.5',52.3);
            jietuHandle(5,picArr28);
        }
        if (type==10){
            makeVersion('2.5.1',43.6);
            jietuHandle(6,picArr25);
        }
        if (type==2){
            partStyle();
        }
        if (type==3){
            //let numList = differNumber(0,hentaiSuffixList.length-1);
            //$("#title").val(title+hentaiSuffixList[numList[0]]+"下载");
            //$("#seo_title").val(vsetitle);
            makeVersion();
        }
        vsetitle = $('#seo_title').val();
        $('#keywords').val(title+","+vsetitle+","+originalTitle);
        //$("input[name='jietupic_alt[]']").val(vsetitle);
    }
})();