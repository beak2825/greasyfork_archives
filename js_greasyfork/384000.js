//============================================================================
// Anti-captcha System -submit
//============================================================================
function antiGoogleShits(token){
    function bitir(code)
    {
    	var taskSolution=code;
    	var injectedCode = "(" + function(taskSolution) {
                        var recaptchaCallbackAlreadyFired = false;

                        var recursiveCallbackSearch = function(object, solution, currentDepth, maxDepth) {
                            if (recaptchaCallbackAlreadyFired) {
                                return
                            }
                            var passedProperties = 0;
                            for (var i in object) {
                                passedProperties++;
                                if (passedProperties > 15) {
                                    break
                                }
                                try {
                                    if (typeof object[i] == "object" && currentDepth <= maxDepth) {
                                        recursiveCallbackSearch(object[i], solution, currentDepth + 1, maxDepth)
                                    } else if (i == "callback") {
                                        if (typeof object[i] == "function") {
                                            recaptchaCallbackAlreadyFired = true;
                                            object[i](solution)
                                        } else if (typeof object[i] == "string" && typeof window[object[i]] == "function") {
                                            recaptchaCallbackAlreadyFired = true;
                                            window[object[i]](solution)
                                        }
                                        return
                                    }
                                } catch (e) {}
                            }
                        };

                        if (!recaptchaCallbackAlreadyFired) {
                            if (typeof ___grecaptcha_cfg != "undefined" && typeof ___grecaptcha_cfg.clients != "undefined") {
                                var oneVisibleRecaptchaClientKey = null;
                                visible_recaptcha_element_search_loop: for (var i in ___grecaptcha_cfg.clients) {
                                    for (var j in ___grecaptcha_cfg.clients[i]) {
                                        if (___grecaptcha_cfg.clients[i][j] && typeof ___grecaptcha_cfg.clients[i][j].nodeName == "string" && typeof ___grecaptcha_cfg.clients[i][j].innerHTML == "string" && typeof ___grecaptcha_cfg.clients[i][j].innerHTML.indexOf("iframe") != -1) {
                                            if (___grecaptcha_cfg.clients[i][j].offsetHeight != 0 || ___grecaptcha_cfg.clients[i][j].childNodes.length && ___grecaptcha_cfg.clients[i][j].childNodes[0].offsetHeight != 0 || ___grecaptcha_cfg.clients[i][j].dataset.size == "invisible") {
                                                if (oneVisibleRecaptchaClientKey === null) {
                                                    oneVisibleRecaptchaClientKey = i;
                                                    break
                                                } else {
                                                    oneVisibleRecaptchaClientKey = null;
                                                    break visible_recaptcha_element_search_loop
                                                }
                                            }
                                        }
                                    }
                                }
                                if (oneVisibleRecaptchaClientKey !== null) {
                                    recursiveCallbackSearch(___grecaptcha_cfg.clients[oneVisibleRecaptchaClientKey], taskSolution, 1, 2)
                                }
                            }
                        }
                    } + ')("' + taskSolution + '");';
                    var script = document.createElement("script");
                    script.textContent = injectedCode;
                    (document.head || document.documentElement).appendChild(script);
                    script.remove();
    }

    //============================================================================
    // Anti-captcha System -captcha
    //============================================================================
    (function(){
        // ...
        var d = document.getElementById("anticaptcha-imacros-account-key");
        if (!d) {
            d = document.createElement("div");
            d.innerHTML = token;
            d.style.display = "none";
            d.id = "anticaptcha-imacros-account-key";
            document.body.appendChild(d);
        }

        var s = document.createElement("script");
        s.src = "https://cdn.antcpt.com/imacros_inclusion/recaptcha.js?" + Math.random();
        document.body.appendChild(s);
        // ...
    })();
    //============================================================================
    // Anti-captcha System -error_control
    //============================================================================
    setInterval(function(){captFixError()},10000);
    function captFixError()
    {
    	// If the captcha api get an error, we will try to solve it
    	//document.getElementsByClassName('antigate_solver in_process');
    	try 
    	{
            var moneySaver = 1;
            var keyvalue = document.getElementsByClassName('g-recaptcha-response')[0].value;
            if( keyvalue.length >= 10){
                bitir(keyvalue);
                console.log('Keycode submited value was: '+ keyvalue.substr(1, 30)+'...');
    
                /*moneySaver = bot.reach;
                console.log("moneySaver: " + moneySaver);
    
                //prevent spend unnecessary money in captchas
                if (moneySaver >= 2) {
                	window.location.href = "http://CAPTCHA-BANNED.com";
                }*/
            }
        }
        catch (e) {
           console.log(e);
        }
	  
    	if (document.getElementsByClassName('error').length >= 1)
    	{
    	    document.getElementsByClassName("disconnectbtn")[0].click();
    	    document.getElementsByClassName("disconnectbtn")[0].click();
    	    window.location.reload();
    	}
    	else {
    	    console.log('Captcha Status: Good');
    	}
    }
}