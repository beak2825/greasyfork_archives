// ==UserScript==
// @name         Spectrum Advanced
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This script is designed to help users automatically log into the University of Malaya's SPeCTRUM system(by sending request).
// @author       Koukotsukan Neo
// @match        https://casv.um.edu.my/cas/loginAllType?service=*
// @match        https://spectrum.um.edu.my
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/427693/Spectrum%20Advanced.user.js
// @updateURL https://update.greasyfork.org/scripts/427693/Spectrum%20Advanced.meta.js
// ==/UserScript==

(function() {
    const curURL = window.location.href;
    const match = (...patterns) => patterns.some(p => curURL.includes(p));
    var data2 = "";
    if (match("https://spectrum.um.edu.my")) {
        if (document.querySelector("span.login").querySelector("a")) {
            var z= document.createElement('a');
            z.setAttribute("href","javascript:void(0);");
            z.setAttribute("id","helper");
            z.innerText='Spectrum Advanced';
            console.log(document.querySelectorAll("div[class=\"usermenu\"]")[0])
            document.querySelectorAll("div[class=\"infoarea \"]")[0].appendChild(z);
            document.querySelector ("#helper").addEventListener("click", doAdd, false);
            if (GM_getValue('status') == 1 && GM_getValue('pwd') && GM_getValue('uname')){
                GM_xmlhttpRequest ({
                    method:     "GET",
                    url:        "https://sso.um.edu.my/cas/loginAllType?service=https://spectrum.um.edu.my/login/index.php",
                    headers:    {
                        "Content-Type": "text/html; charset=utf-8"
                    },
                    onload: function(res){
                        if(res.status === 200){
                            console.log(res.responseHeaders)
                            console.log(res.response)
                            console.log('Success Visit')
                            var html = res.responseText
                            var patt = /<input type="hidden" name="lt" value="(.*)" \/>/i;
                            var lt = html.match(patt)[1]
                            data2 = "uname=" + GM_getValue('uname') +"&password=" + GM_getValue('pwd') + "&domain=%40perdana.um.edu.my&lt=" + lt + "&_eventId=submit&username="+GM_getValue('uname')+"%40perdana.um.edu.my"
                            GM_xmlhttpRequest ({
                                method:     "POST",
                                url:        "https://sso.um.edu.my/cas/loginAllType?service=https://spectrum.um.edu.my/login/index.php",
                                data:       data2,
                                headers:    {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                },
                                onload: function(res){
                                    if(res.status === 200){
                                        //console.log(res.responseHeaders)
                                        //console.log(res.response)
                                        var patt2 = /<div class="error" style="color: red; font-size: 1em;">The credentials you provided cannot be found or please select different Status.<p\/><\/div>/
                                        if(!res.responseText.match(patt2)){
                                            console.log('Success Login')
                                            location.href="https://spectrum.um.edu.my";
                                        }else{
                                            console.log('Incorrect Credentials')
                                            alert("credentials not correct, please reset them")
                                            doAdd()
                                        }
                                    }else{
                                        console.log('Login Failed')
                                        console.log(res)
                                    }
                                },
                                onerror : function(err){
                                    console.log('Error Login')
                                    console.log(err)
                                }
                            });
                        }else{
                            console.log('Fail Visit')
                            console.log(res)
                        }
                    },
                    onerror : function(err){
                        console.log('Error Visit')
                        console.log(err)
                    }
                });
            }
        }
    }
    function doAdd(){
            var uname = prompt("Username", "");
            var password = prompt("Password","");
            GM_setValue('uname',uname);
            GM_setValue("pwd", password);
            GM_setValue("status",1);
            location.reload();
    }
}
)();