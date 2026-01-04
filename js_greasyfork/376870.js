// ==UserScript==
// @name         Forumactif Account Switch
// @namespace    http://tampermonkey.net/
// @version      2.7.5
// @description  Change accounts with one click !
// @author       Miyuun
// @include      http*://*.forumactif.*/*
// @exclude      http*://*.forumactif.*/chatbox*
// @exclude      http*://*.forumactif.*/smilies*
// @exclude      http*://*.forumactif.*/admin*
// @exclude      http*://*.forumactif.*/post?mode=smilies*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/progressbar.js/1.0.1/progressbar.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.ui.position.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.contextMenu.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js
// @downloadURL https://update.greasyfork.org/scripts/376870/Forumactif%20Account%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/376870/Forumactif%20Account%20Switch.meta.js
// ==/UserScript==

function isValidJson(json) {
    try {
        JSON.parse(json);
        return true
    } catch (e) {
        return false
    }
}
$(window).on('resize', function() {
    var height = $(window).height() - $("#fa_toolbar").height();
    $("#divbubbles").css("height", height - 80 + "px");
});
$(document).ready(function() {
    if ($("#fa_toolbar").length == 0) {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (!mutation.addedNodes)
                    return;
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var node = mutation.addedNodes[i];
                    if (node.id == "fa_toolbar") {
                        bubbleAccounts();
                        observer.disconnect();
                    }
                }
            })
        }
        );
        observer.observe(window.document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    } else {
        bubbleAccounts();
    }
});
function bubbleAccounts() {
    var keyPressed = false;
    var mouseovered = false;
    var allAccounts = {};
    var lastMessages = {};
    var bubbleStack = [];
    var bubbleNumber = 0;
    var BubbleDiv = document.createElement('div');
    var $targetedDiv;
    BubbleDiv.id = "divbubbles";
    var height = $(window).height();
    $(BubbleDiv).css({
        'height': height - 150 + "px",
        'position': 'fixed',
        'left': '-100px',
        'top': '0px',
        'margin-top': "30px"
    });
    $(document.body).append($("<style>#divbubbles:hover{overflow:auto;width:180px;}#divbubbles{overflow:hidden;width:90px;}" + "#divbubbles::-webkit-scrollbar { width: 12px;}#divbubbles::-webkit-scrollbar-track { border-radius:8px; padding:5 5 5 5; box-shadow: inset 0 0 10px 10px transparent;border: solid 4px transparent;} " + "#divbubbles::-webkit-scrollbar-thumb { border-radius: 8px;box-shadow: inset 0 0 10px 10px  #26282C;border: solid 4px transparent;}" + ".title-bubble{z-index:-2;background-color:#2F3136;width:0px;left:15px;padding-left:0px;padding-top:6px;text-overflow: ellipsis;bottom:10px;border-radius:20px;height:21px;overflow:hidden;font-size:12px;font-weight:bold;position:absolute;display:block;white-space: nowrap;" + "transition: all 0.5s ease-in-out; -moz-transition: all 0.5s ease-in-out; /* Firefox 4 */-webkit-transition: all 0.5s ease-in-out; /* Safari and Chrome */-o-transition: all 0.5s ease-in-out; /* Opera */-ms-transition: all 0.5s ease-in-out; /* Explorer 10 */}" + ".bubble:hover{transition: all 0.5s ease-in-out;}.bubble:hover .title-bubble{transition: all 0.5s ease-in-out;width:90px;padding-left:45px;padding-right:5px;}" + ".custom-menu { display: none; z-index: 1000; position: absolute; overflow: hidden; border: 1px solid #CCC; white-space: nowrap; font-family: sans-serif; background: #FFF; color: #333;" + "border-radius: 8px; padding: 0; } .custom-menu li { padding: 8px 12px; cursor: pointer; list-style-type: none; transition: all .3s ease; user-select: none; } " + ".custom-menu li:hover { background-color: #DEF; }.login_form.modal{padding: 0!important;} .login_form h3 { margin: 0; padding: 10px; color: #fff; font-size: 14px; background: -moz-linear-gradient(top, #2e5764, #1e3d47); background: -webkit-gradient(linear,left bottom,left top,color-stop(0, #1e3d47),color-stop(1, #2e5764)); } .login_form.modal p { padding: 20px 30px; border-bottom: 1px solid #ddd; margin: 0; background: -webkit-gradient(linear,left bottom,left top,color-stop(0, #eee),color-stop(1, #fff)); overflow: hidden; } .login_form.modal p label { float: left; font-weight: bold; color: #333; font-size: 13px; width: 110px; line-height: 22px; } .login_form.modal p input[type='text'], .login_form.modal p input[type='password'] { font: normal 12px/18px 'Lucida Grande', Verdana; padding: 3px; border: 1px solid #ddd; width: 200px; }</style>"));
    $(document.body).append($('<ul class="custom-menu"> <li data-action="first">First thing</li> <li data-action="second">Second thing</li> <li data-action="third">Third thing</li> </ul>'));
    $(document.body).append(BubbleDiv);
    var link = window.document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.contextMenu.min.css';
    document.getElementsByTagName("HEAD")[0].appendChild(link);
    link = window.document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css';
    document.getElementsByTagName("HEAD")[0].appendChild(link);
    var isLoginPage = function() {
        if (location.href == location.protocol + '//' + location.host + "/login") {
            bubbleStack[bubbleStack.length - 1].onclick = function() {
                $("input[name=login]").click()
            }
            ;
            $("input[name=login]").on("click", function() {
                createAccount($("input[name=username]").val(), $("input[name=password]").val())
            })
        }
    };
    var createAccount = function(username, password) {
        allAccounts[username] = {
            "username": username,
            "password": password,
            "src": undefined
        };
        localStorage.setItem(location.protocol + '//' + location.host + 'accounts', JSON.stringify(allAccounts))
    };
    var importAccount = function(username, password, src) {
        allAccounts[username] = {
            "username": username,
            "password": password,
            "src": src
        };
        localStorage.setItem(location.protocol + '//' + location.host + 'accounts', JSON.stringify(allAccounts))
    };
    var addAddAccountBubble = function(link, onclick, title) {
        var bubbleId = bubbleNumber;
        var cssBubble = {
            "margin-top": "10px",
            "margin-left": "20px",
            "position": "relative",
            "cursor": "pointer",
            'float': 'bottom'
        };
        var cssImage = {
            "border-radius": "40px",
            "width": "50px",
            "height": "50px",
            "box-shadow": "black 0px 0px 10px -5px"
        };
        var BubbleAccount = document.createElement('div');
        var BubbleImage = document.createElement('img');
        if (link)
            BubbleImage.src = link;
        else
            BubbleImage.src = "https://2img.net/image.noelshack.com/fichiers/2017/19/1494197222-defaut.jpg";
        $(BubbleAccount).attr("title", title);
        $(BubbleAccount).css(cssBubble);
        $(BubbleImage).css(cssImage);
        $(BubbleAccount).append(BubbleImage);
        $(BubbleAccount).addClass("addbubble");
        $(BubbleDiv).prepend(BubbleAccount);
        bubbleStack[bubbleId] = BubbleAccount;
        if (!onclick)
            BubbleAccount.onclick = function() {
                $('.bubble').animate({
                    left: "-70px",
                }, 400, 'easeInOutBack')
            }
            ;
        else
            BubbleAccount.onclick = onclick;
        bubbleNumber++
    };
    var addBubble = function(link, onclick, title) {
        var bubbleId = bubbleNumber;
        var cssBubble = {
            "margin-top": "10px",
            "margin-left": "20px",
            "height": "50px",
            "position": "relative",
            "cursor": "pointer",
            'float': 'bottom'
        };
        var cssImage = {
            "z-index": "-1",
            "position": "absolute",
            "border-radius": "40px",
            "width": "50px",
            "height": "50px",
            "box-shadow": "black 0px 0px 10px -5px"
        };
        var BubbleAccount = document.createElement('div');
        var BubbleImage = document.createElement('img');
        var BubbleImageDiv = document.createElement('div');
        if (link)
            BubbleImage.src = link;
        else
            BubbleImage.src = "https://2img.net/image.noelshack.com/fichiers/2017/19/1494197222-defaut.jpg";
        if ($("#fa_usermenu > img")[0] && title == $("#fa_usermenu > img")[0].alt) {
            BubbleImage.src = $("#fa_usermenu > img")[0].src;
            allAccounts[$("#fa_usermenu > img")[0].alt].src = $("#fa_usermenu > img")[0].src;
            localStorage.setItem(location.protocol + '//' + location.host + 'accounts', JSON.stringify(allAccounts))
        }
        $(BubbleAccount).data("bubbleID", bubbleId);
        $(BubbleAccount).attr("data-title", title);
        $(BubbleImageDiv).attr("data-title", title);
        $(BubbleAccount).css(cssBubble);
        $(BubbleImage).css(cssImage);
        $(BubbleImageDiv).css(cssImage);
        $(BubbleImage).css({
            "width": "100%",
            "height": "100%",
            "object-fit": "cover"
        });
        $(BubbleAccount).append(BubbleImageDiv);
        $(BubbleImageDiv).append(BubbleImage);
        $(BubbleAccount).addClass("bubble");
        $(BubbleImageDiv).addClass("bubble-image-div");
        $(BubbleAccount).append($("<div class='title-bubble'>" + $(BubbleAccount).attr('data-title') + "</div>"));
        $(BubbleDiv).prepend(BubbleAccount);
        bubbleStack[bubbleId] = BubbleAccount;
        if (link == "https://i.imgur.com/FTnBXYR.png") {
            $(BubbleAccount).addClass("add")
        }
        if (!onclick)
            BubbleAccount.onclick = function() {
                $('.bubble').animate({
                    left: "-70px",
                }, 400, 'easeInOutBack')
            }
            ;
        else
            BubbleAccount.onclick = onclick;
        bubbleNumber++
    };
    var addMainBubble = function(link, onclick) {
        var bubbleId = bubbleNumber;
        var cssBubble = {
            "bottom": "20px",
            "left": "-70px",
            "position": "fixed",
            "cursor": "pointer",
            'float': 'bottom',
            "object-fit": "cover",
            "cursor": "pointer",
            "width": "50px",
            "height": "50px"
        };
        var cssImage = {
            "border-radius": "40px",
            "width": "100%",
            "height": "100%",
            "object-fit": "cover",
            "box-shadow": "black 0px 0px 10px -5px"
        };
        var BubbleAccount = document.createElement('div');
        var BubbleImage = document.createElement('img');
        if (link)
            BubbleImage.src = link;
        else
            BubbleImage.src = "https://2img.net/image.noelshack.com/fichiers/2017/19/1494197222-defaut.jpg";
        $(BubbleAccount).attr("title", "Vos comptes");
        $(BubbleAccount).css(cssBubble);
        $(BubbleImage).css(cssImage);
        $(BubbleAccount).append(BubbleImage);
        $(BubbleAccount).addClass("mainbubble");
        $(document.body).append(BubbleAccount);
        bubbleStack[bubbleId] = BubbleAccount;
        if (!onclick)
            BubbleAccount.onclick = function() {
                $('.bubble, .addbubble').animate({
                    left: "-70px",
                }, 400, 'easeInOutBack')
            }
            ;
        else
            BubbleAccount.onclick = onclick;
        bubbleNumber++;
        $(BubbleAccount).animate({
            left: "20px",
        }, 400, 'easeInOutBack')
    };
    var removeBubble = function(bubbleID) {
        $(bubbleStack[bubbleID]).animate({
            left: "-70px",
        }, 500, 'easeInOutBack', function() {
            $(bubbleStack[bubbleID]).animate({
                height: "0px",
            }, 500, 'easeInOutBack', function() {
                setTimeout($(bubbleStack[bubbleID]).remove(), 100)
            })
        })
    };
    var changeCharacter = function(bubble, username, password) {
        var progressBar = new ProgressBar.Circle('.bubble[data-title="' + username.replace(/"/g, '\\"') + '"] .bubble-image-div',{
            color: '#FF5E00',
            strokeWidth: 15,
            duration: 2000,
            easing: 'easeInOut'
        });
        if ($("textarea").length > 0) {
            for (var i = 0; i < $("textarea").length; i++) {
                lastMessages[i] = $("textarea")[i].value;
                progressBar.animate(0.5 * i / $("textarea").length)
            }
            lastMessages.scrollTop = $(document).scrollTop();
            localStorage.setItem('lastmessages', JSON.stringify(lastMessages))
        } else {
            progressBar.animate(0.5)
        }
        if ($("#logout").attr("href") !== undefined)
            $.ajax(location.protocol + '//' + location.host + $("#logout").attr("href"), {
                type: 'POST',
                crossDomain: false,
                success: function() {
                    progressBar.animate(0.8);
                    $.ajax(location.protocol + '//' + location.host + "/login", {
                        type: 'POST',
                        data: {
                            "username": username,
                            "password": password,
                            "autologin": "on",
                            "redirect": "",
                            "query": "",
                            "login": "Connexion"
                        },
                        crossDomain: false,
                        success: function() {
                            progressBar.animate(1.0);
                            document.location.reload(true)
                        },
                        error: function(e) {
                            console.log(e)
                        }
                    })
                },
                error: function(e) {
                    console.log(e)
                }
            });
        else {
            progressBar.animate(0.8);
            $.ajax(location.protocol + '//' + location.host + "/login", {
                type: 'POST',
                data: {
                    "username": username,
                    "password": password,
                    "autologin": "on",
                    "redirect": "",
                    "query": "",
                    "login": "Connexion"
                },
                crossDomain: false,
                success: function() {
                    progressBar.animate(1.0);
                    document.location.reload(true)
                },
                error: function(e) {
                    console.log(e)
                }
            })
        }
    };
    var loginPage = function() {
        if ($("#logout").attr("href") !== undefined)
            $.ajax(location.protocol + '//' + location.host + $("#logout").attr("href"), {
                type: 'POST',
                crossDomain: false,
                success: function() {
                    document.location.assign(location.protocol + '//' + location.host + "/login")
                },
                error: function(e) {
                    console.log(e)
                }
            });
        else
            document.location.assign(location.protocol + '//' + location.host + "/login")
    };
    var loadBubbles = function() {
        addMainBubble($("#fa_usermenu").find('img').attr("src"), function() {
            if ($(this).data('toggle')) {
                $('#divbubbles').animate({
                    left: "-100px",
                }, 400, 'easeInOutBack');
                $(this).data('toggle', false)
            } else {
                $('#divbubbles').animate({
                    left: "0px",
                }, 400, 'easeInOutBack');
                $(this).data('toggle', true)
            }
        });
        for (var account in allAccounts) {
            if ($("#fa_welcome").html() && (allAccounts[account].src == undefined || (allAccounts[account].username == $("#fa_welcome").html().substring($("#fa_welcome").html().indexOf(' ') + 1) && allAccounts[account].src !== $("#fa_usermenu").find('img').attr("src")))) {
                allAccounts[account].src = $("#fa_usermenu").find('img').attr("src")
            }
            try {
                throw allAccounts[account]
            } catch (account2) {
                addBubble(allAccounts[account].src, function() {
                    if (mouseovered && keyPressed) {
                        delete allAccounts[account2.username];
                        localStorage.setItem(location.protocol + '//' + location.host + 'accounts', JSON.stringify(allAccounts));
                        removeBubble($(this).data("bubbleID"))
                    } else {
                        changeCharacter(this, account2.username, account2.password)
                    }
                }, account2.username)
            }
        }
        addAddAccountBubble("https://i.imgur.com/FTnBXYR.png", function() {
            loginPage()
        }, "Ajouter un compte");
        localStorage.setItem(location.protocol + '//' + location.host + 'accounts', JSON.stringify(allAccounts));
        $('<form class="login_form modal" id="dialog-form"> <h3>Exporter les comptes</h3> <p><label>Comptes</label><input type="text" name="account" id="account"></p> <p><label for="email">Clé de décryptage</label><input type="text" name="decryptkey" id="decryptkey" ></p></form>').appendTo(document.body);
        $('<a href="#dialog-form" rel="modal:open" style="display:none;">Open Modal</a>').appendTo(document.body);
        var p = document.createElement("p");
        var button = document.createElement("button");
        button.name = "submit_form";
        button.id = "submit_form";
        button.type = "button";
        button.innerHTML = "Importer les comptes";
        button.onclick = function(e) {
            e.preventDefault();
            var decrypted = Crypto.decode($('#dialog-form')[0].account.value, $('#dialog-form')[0].decryptkey.value);
            if (isValidJson(decrypted)) {
                var allAccounts = JSON.parse(decrypted);
                for (var account in allAccounts) {
                    importAccount(allAccounts[account].username, allAccounts[account].password, allAccounts[account].src)
                }
                document.location.reload(true)
            }
        }
        ;
        $(p).append(button);
        $('#dialog-form').append(p);
        $.contextMenu({
            selector: '.mainbubble',
            callback: function(key, options) {
                switch (key) {
                case "export":
                    var array = Crypto.encode(localStorage.getItem(location.protocol + '//' + location.host + 'accounts'));
                    $('#dialog-form')[0].account.value = array[0].toString();
                    $('#dialog-form')[0].decryptkey.value = array[1].toString();
                    $('#dialog-form')[0].submit_form.style.display = 'none';
                    $('a[href="#dialog-form"]').trigger("click");
                    break;
                case "import":
                    $('#dialog-form')[0].account.value = '';
                    $('#dialog-form')[0].decryptkey.value = '';
                    $('#dialog-form')[0].submit_form.style.display = 'block';
                    $('a[href="#dialog-form"]').trigger("click");
                    break
                }
            },
            items: {
                "export": {
                    name: "Exporter les comptes",
                    icon: "fa-download"
                },
                "import": {
                    name: "Importer des comptes",
                    icon: "fa-download"
                }
            }
        });
        isLoginPage()
    };
    if (isValidJson(localStorage.getItem('accounts')) && localStorage.getItem('accounts') !== null && localStorage.getItem('accounts') !== undefined) {
        localStorage.setItem(location.protocol + '//' + location.host + 'accounts', localStorage.getItem('accounts'));
        localStorage.setItem('accounts', "")
    }
    if (isValidJson(localStorage.getItem(location.protocol + '//' + location.host + 'accounts')) && localStorage.getItem(location.protocol + '//' + location.host + 'accounts') !== null && localStorage.getItem(location.protocol + '//' + location.host + 'accounts') !== undefined) {
        allAccounts = JSON.parse(localStorage.getItem(location.protocol + '//' + location.host + 'accounts'))
    }
    var Crypto = {
        encode: function(string) {
            var key = Math.random().toString(36).substr(2, 10);
            var encrypted = CryptoJS.AES.encrypt(string, key);
            return [encrypted, key]
        },
        decode: function(encrypted, key) {
            var decrypted = CryptoJS.AES.decrypt(encrypted, key);
            return decrypted.toString(CryptoJS.enc.Utf8)
        }
    };
    if (isValidJson(localStorage.getItem('lastmessages')) && localStorage.getItem('lastmessages') !== null && localStorage.getItem('lastmessages') !== undefined) {
        lastMessages = JSON.parse(localStorage.getItem('lastmessages'));
        if ($("textarea").length > 0) {
            for (var i = 0; i < $("textarea").length; i++) {
                $("textarea")[i].value = lastMessages[i]
            }
        }
        $(document).scrollTop(lastMessages.scrollTop);
        localStorage.setItem('lastmessages', undefined)
    }
    loadBubbles();
    function isBubbleCTRLHovered(element) {
        if (mouseovered && keyPressed) {
            if ($(element).find('img')[0].src !== "https://i.imgur.com/iLi71DS.png") {
                $(element).data('oldsrc', $(element).find('img')[0].src);
                $(element).find('img')[0].src = "https://i.imgur.com/iLi71DS.png"
            }
        } else
            $(element).find('img')[0].src = $(element).data('oldsrc') || $(element).find('img')[0].src
    }
    $(window).bind('mousemove', function(e) {
        $targetedDiv = $(e.target)[0]
    });
    $(window).keydown(function(e) {
        if (e.keyCode == 17) {
            keyPressed = true
        } else {
            keyPressed = false
        }
        if ($targetedDiv.className == "bubble")
            isBubbleCTRLHovered($targetedDiv)
    });
    $(window).keyup(function(e) {
        keyPressed = false;
        if ($targetedDiv.className == "bubble")
            isBubbleCTRLHovered($targetedDiv)
    });
    $(".bubble").mouseover(function(e) {
        mouseovered = true;
        isBubbleCTRLHovered(this)
    });
    $(".bubble").mouseout(function() {
        mouseovered = false;
        isBubbleCTRLHovered(this)
    })
}