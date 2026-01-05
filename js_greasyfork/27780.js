// ==UserScript==
// @name         NoKissReload [CAPTCHA SKIP]
// @version      0.23
// @description  Plays the next Episode without reloading the page
// @author       lolamtisch@gmail.com
// @license      Creative Commons; http://creativecommons.org/licenses/by/4.0/
// @match        http://kissanime.ru/Anime/*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @namespace    https://greasyfork.org/users/92233
// @downloadURL https://update.greasyfork.org/scripts/27780/NoKissReload%20%5BCAPTCHA%20SKIP%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/27780/NoKissReload%20%5BCAPTCHA%20SKIP%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var realUrl = '';
    var retries = 0;
    $( document ).ready(function() {

        var nbShortcuts = GM_getValue( 'nbShortcuts', 0 );

        function noscript(strCode){
           var html = $(strCode.bold());
           html.find('script').remove();
         return html.html();
        }

        function getvideolink(url){
            var results = new RegExp('[\?&]' + 's' + '=([^&#]*)').exec(window.location.href);
            url += results[0];
            $.ajax({
                method: "GET",
                url: url,
                cache: false,
                success : function(data, textStatus, xmLHttpRequest){
                    handleAjaxData(data, url);
                },
                error: function(data, textStatus, xmLHttpRequest){
                    window.location.href = url;
                }
            });
        }

        function handleAjaxData(data, url){
            if(data.includes("Are You Human")){
                console.log('Captcha');
                k = url;
                realUrl = url;
                capture(data);
                return;
            }
            //console.log(data);
            history.pushState({myTag: true}, '', url);
            try{
                videojs('my_video_1').currentTime("0");
                var newlinks = data.split('<select id="slcQualix">')[1].split('</select>')[0];
                var link = newlinks.split('"')[1].split('"')[0];
                try{
                    $("#divFileName").html(data.split('divFileName">')[1].split('</div>')[0]);
                    $("#divDownload").html("");
                    var urlBefore = $('#my_video_1 video').attr('src');
                }catch(e){}
                if( $('#slcQualix').height() === null){
                    $('#my_video_1').before('<select style="display: none;" id="slcQualix"></select>');
                }
                if( $('#slcQualix').html() === newlinks){
                    window.location.href = url;
                }
                $('#slcQualix').html(newlinks);
                $("head").trigger( "click" );
                if($('#my_video_1').height() === null){
                   window.location.href = url;
                }
                videojs('my_video_1').currentTime("0");
                $('#slcQualix').trigger("change");
                if(urlBefore === $('#my_video_1 video').attr('src')){
                    SetPlayer(ovelWrap($('#slcQualix').val()));
                }
            }catch(e){
                console.log("error:",e);
                window.location.href = url;
            }

            $("#btnPrevious").parent().css("display","initial");
            $("#btnNext").parent().css("display","initial");
            if($("#selectEpisode")[0].selectedIndex === 0) {
                $("#btnPrevious").parent().css("display","none");
            }

            if($("#selectEpisode")[0].selectedIndex === $("#selectEpisode option").size()-1) {
                $("#btnNext").parent().css("display","none");
            }
        }

        function nextE(){
            if(active+1 < link.length){
                getvideolink(window.location.href.split('/').slice(0,5).join('/')+'/'+link[active+1]);
                active++;
                $("#selectEpisode")[0].selectedIndex = active;

            }
        }

        function previosE(){
            if(active > 0){
                getvideolink(window.location.href.split('/').slice(0,5).join('/')+'/'+link[active-1]);
                active--;
                $("#selectEpisode")[0].selectedIndex = active;

            }
        }

        var link = [];
        var active = null;
        $("#selectEpisode option").each(function( index ) {
            link[index] = $(this).attr("value");
            if($("#selectEpisode").attr("value") == $(this).attr("value")){
                active = index;
            }
        });

        if($("#btnPrevious").height() === null && $("#btnNext").height() !== null){
            $("#btnNext").parent().before('<a href="#!"><img id="btnPrevious" src="http://kissanime.ru/Content/images/previous.png" title="Previous episode" border="0"></a>&nbsp;&nbsp;');
            $("#btnPrevious").parent().css("display","none");
        }

        if($("#btnNext").height() === null && $("#btnPrevious").height() !== null){
            $("#btnPrevious").parent().after('&nbsp;&nbsp;<a href="#!"><img id="btnNext" src="http://kissanime.ru/Content/images/next.png" title="Next episode" border="0"></a>');
            $("#btnNext").parent().css("display","none");
        }

        $("#btnNext").parent().attr("href","#!").click(function(){
            retries = 0;
            nextE();
        });

        $("#btnPrevious").parent().attr("href","#!").click(function(){
            retries = 0;
            previosE();
        });

        $("#selectEpisode").unbind().change(function(){
            retries = 0;
            var before = window.location.href.split('/').slice(0,5).join('/')+'/';
            active = $("#selectEpisode")[0].selectedIndex;
            getvideolink(before+link[active]);
        });

        document.onkeydown = function(evt) {
            evt = evt || window.event;
            if (evt.keyCode == 78) {
                if(nbShortcuts == 1){
                    nextE();
                }
            }
            if (evt.keyCode == 66) {
                if(nbShortcuts == 1){
                    previosE();
                }
            }
        };

        if(nbShortcuts == 1){
            var check = 'checked';
        }else{
            var check = '';
        }
        $('.barContent').after('<input type="checkbox" id="nbShortcuts" '+check+' > Shortcuts ( n = next, b = back )');
        $('#nbShortcuts').change(function(){
            if($('#nbShortcuts').is(":checked")){
                nbShortcuts = 1;
                GM_setValue('nbShortcuts', 1);
            }else{
                nbShortcuts = 0;
                GM_setValue('nbShortcuts', 0);
            }
        });

        //Rest of code based on KissAnime Multi Downloader
        //Author: Anime Bro1
        //url: https://greasyfork.org/en/scripts/31080-kissanime-multi-downloader
        var images = ["","","","",""];
        var words = [];
        var k = "";
        var eps = [];
        var epsName = [];
        var epsLinks = [];
        var failedLinks = [];

        var count = 0;
        var failedCount = 0;

        var start = "";
        var end = "";
        var isText = false;
        var isHTML = false;
        var isM3U8 = false;
        var quality = [];
        var failed = true;

        var animebro;
        var max = 1;


        function capture(data){
            if(!isBasicJson()){
                factoryReset();
                getBasicJson();
            }
            getEP(data);
        }

        function factoryReset(){
            var keys = GM_listValues();
            for (var i=0; i < keys.length; i++) {
                GM_deleteValue(keys[i]);
            }
        }

        function isBasicJson(){
            return GM_getValue("AnimeBro2",false);
        }

        function getBasicJson(){
            var isFirefox = typeof InstallTrigger !== 'undefined';
            var isChrome = !!window.chrome && !!window.chrome.webstore;
            $("body").append('<div id="CaptchaInfo" style="display:none;width:200px;height:150px;font-size:20px;position:fixed; top: 10px; left:10px; background: red; border-radius: 25px;padding:40px;"><p></p></div>');
            $("#CaptchaInfo").show();
            $("#CaptchaInfo").find("p").html("First time running, fetching some files... Page will reload.");

            var msg='';
            if(isChrome){
                msg = $.ajax({type: "GET", url: "https://cdn.rawgit.com/Eltion/Kissanime-Chaptcha-Auto-Complete/623d627fa2ec94dea00621e406e66088a61b6bff/BasicJson1.json", async: false}).responseText;
            }else if(isFirefox){
                msg = $.ajax({type: "GET", url: "https://cdn.rawgit.com/Eltion/Kissanime-Chaptcha-Auto-Complete/623d627fa2ec94dea00621e406e66088a61b6bff/BasicJsonFireFox1.json", async: false}).responseText;
            }else{
                alert("Not Chrome or Firefox. Tryng the chrome database");
                msg = $.ajax({type: "GET", url: "https://cdn.rawgit.com/Eltion/Kissanime-Chaptcha-Auto-Complete/623d627fa2ec94dea00621e406e66088a61b6bff/BasicJson1.json", async: false}).responseText;
            }
            msg = JSON.parse(msg);
            for(var i = 0; i < msg.length; i++){
                GM_setValue(msg[i].n,msg[i].v);
            }
            location.reload();
        }

        function getEP(data){
            var msg = data;
            words = [];
            images=["","","","",""];
            GetWords(msg,function(){
                getImages(msg,function(){
                    /*count++;
                    if(count < eps.length){
                        getEP(eps[count]);
                    }else{
                        setTimeout(function(){
                            AllDone();
                        }, 5000);
                    }*/
                });
            });
        }

        function GetWords(html,callback){
            var form = html.split("formVerify")[1].split("</form")[0];
            var x = form.match(/(?:<span[^>]*>\s*)([^<]*)/g);
            var word1 = x[0].split(">")[1].replace(/\s\s/g,"");
            var word2 = x[1].split(">")[1].replace(/\s\s/g,"");
            words = [word1,word2];
            callback();
        }

        function getImages(html,callback){
            //console.log(html);
            var items = html.match(/CapImg\??f?=?[^"']*/g);
            //console.log(items);
            loader(items, loadImage, function () {
                Complete();
                callback();
            });
        }

        function Complete() {
            var jj = 0;
            var postData = "";
            for(var j = 0; j <2; j++){
                var w1 = GM_getValue( words[j], false );
                if(w1 !== false){
                    if(w1.includes(" ")){
                        w1 = w1.split(" ");
                    }else{
                        w1 = [w1];
                    }
                    for(var k =0; k < w1.length; k++){
                        for(var i = 0; i < images.length; i++){
                            if((images[i] === w1[k]) && postData.length < 4){
                                postData += i+",";
                            }
                        }
                    }
                }
            }
            if(postData.length == 4){
                postdata(postData);
                console.log("EP Grabed");
            }else{
                if(retries < 4){
                    try{
                        console.log(retries+". try");
                        retries++;
                        getvideolink(realUrl.split('&s')[0]);
                    }catch(e){
                        window.location.href = realUrl;
                    }
                }else{
                    window.location.href = realUrl;
                }
            }
        }

        function postdata(answer){
            var data = {reUrl: k, answerCap: answer};
            var msg = $.ajax({type: "POST", url: "http://kissanime.ru/Special/AreYouHuman2",data: data ,async: false}).responseText;
            //console.log(msg);
            //alert();
            handleAjaxData(msg, k);
            //getLinks(msg);
        }

        function loader(items, thingToDo, allDone) {
            if (!items) {
                // nothing to do.
                return;
            }

            if ("undefined" === items.length) {
                // convert single item to array.
                items = [items];
            }

            var count1 = items.length;

            // this callback counts down the things to do.
            var thingToDoCompleted = function (items, i) {
                count1--;
                if (0 === count1) {
                    allDone(items);
                }
            };

            for (var i = 0; i < items.length; i++) {
                // 'do' each thing, and await callback.
                thingToDo(items, i, thingToDoCompleted);
            }
        }

        function loadImage(items, i, onComplete) {
            var img = new Image();
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            var dataURL ="";
            var onLoad = function (e) {
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                ctx.drawImage(img, 0, 0);
                dataURL = canvas.toDataURL("image/jpeg",0.2);
                images[i] = dataURL;
                e.target.removeEventListener("load", onLoad);
                onComplete(items, i);
            };
            img.addEventListener("load", onLoad, false);
            img.src = "http://kissanime.ru/Special/"+items[i];
        }

    });

})();