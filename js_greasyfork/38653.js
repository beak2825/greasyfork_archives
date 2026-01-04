// ==UserScript==
// @name         register-add
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  lol
// @author       murat
// @match        https://register.metu.edu.tr/*
// @match        https://oibs.metu.edu.tr/regclosed.html
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/38653/register-add.user.js
// @updateURL https://update.greasyfork.org/scripts/38653/register-add.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // course code, section, category (1: must, 4: restricted, 5: free, 7: technical, 8: nontech, 9: NI)
    var course1 = ['6510242', 1, 8]; // mus242
    var course2 = ['6510341', 1, 8]; // mus341
    var course3 = ['5610221', 3, 4]; // es221
    var course4 = ['5700230', 1, 4]; // mete230
    var course5 = ['5680407', 2, 4]; // ie407
    var course6 = ['3110210', 3, 8]; // ceng443
    var course7 = ['5710443', 1, 7]; // ceng443

    var selected = course6;
    var user = 'e2';
    var pass = '';

    var bool_solvecaptcha = false;
    var bool_autoclick = true;
    var bool_startAtTime = false;


//    if (window.location.href === "https://oibs.metu.edu.tr/regclosed.html"){
//        window.location.href = "https://register.metu.edu.tr/";
//    }
//    else if (document.getElementById('single_content').childElementCount > 9){
//        document.getElementsByTagName('a')[1].click();
//    }
//    else if (document.getElementsByName('submitLogin').length){
//        document.getElementById('textUserCode').value = user;
//        document.getElementById('textPassword').value = pass;
//        var startTime = new Date(2018, 1, 19, 9, 0, 0);
//        if (user.length == 7 && pass){
//            login();
//        }
//    }
     if (selected){
        //var img = document.getElementById('imgVerify');
        window.onload = function () { add(selected[0], selected[1], selected[2], bool_solvecaptcha); };
        var callback = function(){
            console.log('page loaded');
        };
        //if (img.width === 150){ add(selected[0], selected[1], selected[2], bool_solvecaptcha); }
        if (document.readyState === "complete" ||
            (document.readyState !== "loading" && !document.documentElement.doScroll)
           ) {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    function login(){
        var clickEvent = new MouseEvent("click", {
            "view": unsafeWindow,
            "bubbles": true,
            "cancelable": true
        });
        if (bool_startAtTime){
            var time = startTime - Date.now();
            time = time < 0 ? 10 : time;
            setTimeout(function(){document.getElementsByName('submitLogin')[0].dispatchEvent (clickEvent);},
                       time);
        }
        else{
            document.getElementsByName('submitLogin')[0].click();
        }
    }

    function login2(){
        var targetNode = document.getElementsByName('submitLogin')[0];
        triggerMouseEvent (targetNode, "mouseover");
        triggerMouseEvent (targetNode, "mousedown");
        triggerMouseEvent (targetNode, "mouseup");
        triggerMouseEvent (targetNode, "click");
    }

    function triggerMouseEvent (node, eventType) {
        var clickEvent = document.createEvent ('MouseEvents');
        clickEvent.initEvent (eventType, true, true);
        node.dispatchEvent (clickEvent);
    }

    function add(addcode, addsection, addcategory, bool_solvecaptcha){
        var addcodeform = document.getElementById('textAddCourseCode');
        var addsectionform = document.getElementById('textAddCourseSection');
        var addcategoryform = document.getElementById('selectAddCourseCategory');
        //var changesec = document.getElementById('textChangeCourseSection');
        //var s_sec = document.getElementsByName('submitChangeSection')[0];
        //var c = document.getElementsByName('textImgVerify')[0];
        var s = document.getElementsByName('submitAddCourse')[0];
        //var img = document.getElementsByTagName('img')[1];
        //var imgsrc = img.src;
        var stop = false;
        //c.value = '';
        //c.focus();
        //s.disabled = false;
        //$('form')[0].acceptCharset = 'utf-8';

        addcodeform.value = addcode;
        addsectionform.value = addsection;
        addcategoryform.value = addcategory;

        if (bool_solvecaptcha){
            var timeinit = Date.now();
            sendData(bool_autoclick);
        }

        //c.onkeyup = function() {
        //    if(c.value.length >= 6){
        //        if (bool_autoclick){s.click();}
        //    }
        //};
        //img.onclick = function(){
        //    sessionStorage.clear();
        //    stop = true; //!s.disabled;
        //    //s.click();
        //};

        //login(1000);

        if (sessionStorage.length < 3){
            sessionStorage.setItem('total', 0);
            sessionStorage.setItem('valids', 0);
            sessionStorage.setItem('time1', new Date()/1000);
        } else{
            var total = sessionStorage.getItem('total');
            var valids = sessionStorage.getItem('valids');
            var time1 = sessionStorage.getItem('time1');
            var time = ((new Date()/1000) - time1).toFixed(1);
            if (!document.getElementById('formmessage').innerHTML.includes('Invalid image')){
                valids++;
                sessionStorage.setItem('valids', valids);
            }
            total++;
            sessionStorage.setItem('total', total);
            var feed = valids + ' / ' + total + ' --- ' + time;
            console.log(feed);

            /*if( total > 99){
            alert(feed);
            sessionStorage.setItem('total', 0);
            sessionStorage.setItem('valids', 0);
            sessionStorage.setItem('time1', new Date()/1000);
        }*/
        }

        function getBase64Image(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        }

        function sendData(click) {
            var response = GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://localhost:9911/solveCAP/getResult',
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    'nargout': 1,
                    'rhs': [getBase64Image(img) ,imgsrc]
                }),
                onload: function(response) {
                    var result = JSON.parse(response.responseText);
                    console.log(result);console.log(Date.now() - timeinit);
                    if('lhs' in result){
                        if (c.value.length === 0 && !stop){
                            c.value = result.lhs[0].mwdata;
                            if (click){s.click();}
                            //s.disabled = false;
                            //setTimeout(function(){ s.dispatchEvent (clickEvent); }, 100);
                        }
                    }else {
                        c.value = '999999';
                        if (click){s.click();}
                    }
                    console.log( "Status: " + request.status);
                }
            });
        }
        //sendData();

        /*$(document).keyup(function(e) {
		if ( e.keyCode === 113 ){ // f2
			sessionStorage.clear();
			console.log('stop');
			stop = true;
		}
	    });*/

        var request = new XMLHttpRequest();
        var url = "http://localhost:9910/solveCAP/getResult";
        var params = {"nargout":1, "rhs": [imgsrc]};
        request.open("POST", url);
        request.setRequestHeader("Content-Type", "application/json");
        request.onload = function()
        {
            if (request.status == 200)
            {
                var result = JSON.parse(request.responseText);
                console.log(result);
                if('lhs' in result)
                {
                    var res = result.lhs[0].mwdata;
                    if (c.value.length === 0){
                        c.value = res;
                        s.disabled = false;
                        setTimeout(function(){ s.dispatchEvent (clickEvent); }, 100);
                    }
                }
                else { console.log('error');
                      c.value = '000000';
                      s.disabled = '';
                      setTimeout(function(){ s.dispatchEvent (clickEvent); }, 100);
                     }
            }
            console.log( "Status: " + request.status + "<br>" +
                        "Status message: " + request.statusText + "<br>" +
                        "Response text: " + request.responseText);
        };
        //request.send(JSON.stringify(params));
    }
})
();
