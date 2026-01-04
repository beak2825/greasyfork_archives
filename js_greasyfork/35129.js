// ==UserScript==
// @name		Selfmade M0d
// @author		Frubi
// @description:de Erweitert pr0gramm.com um weitere Funktionen zum Blocken von Content
// @include		*://pr0gramm.com/*
// @grant       none
// @version		0.8.4
// @namespace   https://github.com/Frubi22/selfmade_m0d
// @description Erweitert pr0gramm.com um weitere Funktionen
// @downloadURL https://update.greasyfork.org/scripts/35129/Selfmade%20M0d.user.js
// @updateURL https://update.greasyfork.org/scripts/35129/Selfmade%20M0d.meta.js
// ==/UserScript==
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Settings__ = __webpack_require__(1);

let filterHTML = __webpack_require__(5);

class Utils
{
    constructor()
    {
        let _this = this;
        this.createFilter();

        this.createNotificationbox();

        window.addEventListener("commentsReady", function()
        {
            _this.addBlockTagSign();
            _this.addBlockUserSign()
            setTimeout(function(){_this.getRating()}, 10);
        });

        window.addEventListener("userReady", function()
        {
            _this.addBlockUserSign(true);  
        })
    }

    createFilter()
    {
        $(".filter-setting:last").after(filterHTML);

        let filter = $(".filter-setting:last");

        $("#filter-link").click(function()
        {
            if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.isActive)
                filter.addClass("active");
            else
                filter.removeClass("active"); 
        });
        
        $(".filter-setting:last").click(function()
        {
            $(".filter-setting:last").toggleClass("active")
            __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.isActive = !__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.isActive;
            __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].quickSave();
        });
    }

    static createNameTag(element, data)
    {
        let wrapper = document.createElement("span");
        $(wrapper).addClass("tag");
        
        $(wrapper).text(data);
    
        let x = document.createElement("a");
    
        $(x).href="#";
        $(x).html("&nbsp;&nbsp;x");
        $(x).css("color","red");
    
        $(x).click(function(e)
        {
            e.preventDefault();
            $(this).parent().remove();
        });
    
        wrapper.append(x);
    
        element.value = "";
    
        $(element).prev().append(wrapper);
    }

    createNotificationbox()
    {
        let notificationbox = document.createElement("div");
        $(notificationbox).addClass("selfmade_m0d");
        notificationbox.id = "notificationbox";
        $("body").append(notificationbox);
    }

    static showNotification(text, location = "")
    {
        let _this = this;
        if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.activateNotifications)
        {
            let element = document.createElement("span");
            element.id = "notification";
            $(element).addClass("selfmade_m0d");
            $(element).attr("data-href", location);
            element.innerText = text;

            $("#notificationbox").append(element);
            $(element).slideToggle();

            $(element).click(function(e)
            {
                let location = $(this).attr("data-href");
                if(location != "")
                {
                    __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.isActive = false;
                    Utils.pr0gramm.navigateTo(location,0);
                    setTimeout(function()
                    {
                        __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.isActive = true;
                    },10); 
                }
                $(this).animate(
                {
                    left: "-300px"
                },function()
                {
                    this.remove()
                });
            });

            $(element).contextmenu(function()
            {
                $(this).animate(
                {
                    left: "-300px"
                },function()
                {
                    this.remove()
                });
                return false;
            });
        
            setTimeout(function()
            {
                $(element).animate(
                {
                    left: "-300px"
                },function()
                {
                    element.remove()
                });
            },__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.notificationDuration*1000);
        }
    }

    addBlockTagSign()
    {
        let blockTagSign = document.createElement("span");
        blockTagSign.className = "block-tag"
        blockTagSign.innerText = "ø";
        if($(".block-tag").length == 0)
        {
            $(".tag").append(blockTagSign);
            $(".block-tag").css("cursor", "pointer");
    
            $(".block-tag").each(function()
            {
                let tmp = $(this).siblings()[0].innerText;
                if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedTags.includes(tmp.toLowerCase()))
                {
                    $(this).css("color", "red");
                }   
                else
                {
                    $(this).css("color", "#888");
                }
            });
    
            $(".block-tag").click(function()
            {
                let tmp = $(this).siblings()[0].innerText;
                if($(this).css("color") == "rgb(255, 0, 0)")
                {
                    __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedTags.splice(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedTags.indexOf(tmp),1);
                    if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedTags.length > 0)
                        __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.skipUploadByTag  = true;
                    else
                        __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.skipUploadByTag  = false;
                    $(this).css("color","#888" );
                }
                else
                {
                    __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedTags.push(tmp.toLowerCase());
                    __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.skipUploadByTag  = true;
                    $(this).css("color", "red");
                }
                
                __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].quickSave();
            });
        }
    }
    
    addBlockUserSign(userpage=false)
    {
        let blockUserSign = document.createElement("span");
        blockUserSign.className = "block-user";
        blockUserSign.innerText = " ø";
        if($(".block-user").length == 0)
        {
            if(userpage)
            {
                if($(".user-head span")[0] == undefined)
                    return;
                $(".user-head span")[0].before(blockUserSign);
            }
                
            else
                $(blockUserSign).insertAfter($(".user:not(.user-mark)"));

            $(".block-user").css("cursor", "pointer");
            if(userpage)
            {
                let text = $(".block-user").parent().text().trim();
                text = text.substr(0, text.indexOf(" ")).toLowerCase();
                if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedUsers.includes(text))
                {
                    $(".block-user").css("color", "red");
                }

                $(".block-user").click(function()
                {        
                    let user = $(".block-user").parent().text().trim();
                    user = user.trim().substr(0, user.indexOf(" ")).toLowerCase();
                    if($(this).css("color") == "rgb(255, 0, 0)")
                    {
                        __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedUsers.splice(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedUsers.indexOf(user),1);
                        if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedUsers.length > 0)
                            __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.skipUploadByUser  = true;
                        else
                            __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.skipUploadByUser  = false;
                        $(this).css("color","" );
                    }
                    else
                    {
                        __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedUsers.push(user.toLowerCase());
                        __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.skipUploadByUser  = true;
                        $(this).css("color", "red");
                    }      
                    __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].quickSave();
                });
            }
            else
            {
                $(".block-user").each(function()
                {
                    if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedUsers.includes($(this).prev()[0].innerText.toLowerCase()))
                    {
                        $(this).css("color", "red");
                    }
                });
                
                $(".block-user").click(function()
                {
                    let user = $(this).prev()[0].innerText;
        
                    if($(this).css("color") == "rgb(255, 0, 0)")
                    {
                        __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedUsers.splice(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedUsers.indexOf(user),1);
                        if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedUsers.length > 0)
                            __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.skipUploadByUser  = true;
                        else
                            __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.skipUploadByUser  = false;
                        $(this).css("color","" );
                    }
                    else
                    {
                        __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedUsers.push(user.toLowerCase());
                        __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.skipUploadByUser  = true;
                        $(this).css("color", "red");
                    }      
                    __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].quickSave();
                });
            }
    
            
        }
    }

    static nextUpload()
    {
        if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.nextUploadDirection == 1)
        {
            $(".stream-prev").click();
        }
        else if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.nextUploadDirection == -1)
        {
            $(".stream-next").click();
        }
    }

    static rateUpload(direction = -1)
    {
        Utils.showNotification("Upload wurde bewertet");
        if(direction == 1)
        {
            if($(".item-vote:has(.pict)")[0].className.indexOf("voted-up") == -1)
                $(".item-vote:has(.pict) .vote-up").click();
        }
        else if(direction == -1)
        {
            if($(".item-vote:has(.pict)")[0].className.indexOf("voted-down") == -1)
                $(".item-vote:has(.pict) .vote-down").click();
        }
    }

    static getTags()
    {
        let tags = [];
        let rawTags;
    
        if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.onlyGoodTags == true)
        {
            rawTags = $(".tag-good");
        }
        else
        {
            rawTags = $(".tag-good,.tag-bad");
        }

        let amount = __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.amountOfTagsChecked;
        if(amount == -1)
        {
            amount = rawTags.length;
        }
        else
        {
            amount = Math.min(amount, rawTags.length)
        }
    
        for(let i = 0; i <amount; i++)
        {
            tags.push(rawTags[i].children[0].innerText);
        }
        return tags;
    }

    static getTotalBenis()
    {
        let score = $(".item-vote .score");
        if(score.length != 0)
        {
            return $(".item-vote .score")[0].innerText;
        }
        return undefined;
    }
    static getAverageBenis()
    {
        let scoreElement = $(".item-vote .score");
        if(scoreElement.length != 0)
        {
            let score = $(".item-vote .score")[0].title;
            let divident = Number(score.substr(0,score.indexOf("u")-1));
            let divisor = Number(score.substr(score.indexOf("u")+4,score.indexOf("u")));
            if(divisor == 0)
            {
                return divident;
            }
            return divident / divisor;
        }
        else undefined; 
    }

    static getUser()
    {
        return $(".item-details .user")[0].innerText.toLowerCase();        
    }

    static getUserRank(user)
    {
        let returnText;
        switch(user.classList[1])
        {
            case("um0"):
                returnText = "Schwuchtel";
            break;
            case("um1"):
                returnText = "Neuschwuchtel";
            break;
            case("um2"):
                returnText = "Altschwuchtel";
            break;
            case("um3"):
                returnText = "Administrator";
            break;
            case("um4"):
                returnText = "Gesperrt";
            break;
            case("um5"):
                returnText = "Moderator";
            break;
            case("um6"):
                returnText = "Fliesentischbesitzer";
            break;
            case("um7"):
                returnText = "Lebende Legende";
            break;
            case("um8"):
                returnText = "Wichtler";
            break;
            case("um9"):
                returnText = "Edler Spender";
            break;
            default:
                returnText = undefined;
            break;
        }
        return returnText;
    }

    getRating()
    {
        Utils.rating = $(".item-vote")[0].className;
    }

    static uniq(a) 
    {
        var seen = {};
        return a.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Utils;


Utils.pr0gramm = p;
Utils.rating;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils__ = __webpack_require__(0);


let settingsPageContent = __webpack_require__(4);

class Settings 
{
    constructor()
    { 
        this.defaultSettings =
        {
            isActive : true,
            skipUploadByTag : false,
            blockedTags : [],
            onlyGoodTags : true,
            amountOfTagsChecked: -1,
            skipUploadByUser : false,
            blockedUsers : [],
            skipUploadByTotalBenis : false,
            minBenis : 0,
            skipUploadByAverageBenis : false,
            minAverageBenis : 0,
            skipUploadByUserRank : false,
            blockedUserRanks : [],
            nextUploadDirection : -1,
            autoRateSkippedUploads : false,
            blockCommentsByUser : false,
            commentBlacklist: [],
            blockCommentsByBlacklist: false,
            blockCommentsByBenis: false,
            commentMinBenis: 0,
            activateNotifications: true,
            notificationColor: "#ee4d2e",
            notificationDuration: 3.0,
            collapseTooLongComments: true,
            skipUploadAfterRate: false
        }
        this.pr0gramm = p;
        let _this = this
        Settings.settings = Object.assign({},this.defaultSettings);
        this.readSettings();  
        window.addEventListener("settingsReady", function(){_this.addSettingsTab()});
        if(window.location.href.includes("Selfmade_M0d")){this.pr0gramm.navigateTo("settings/site",0);}
    } 

    readSettings()
    {
        let tmp = JSON.parse(localStorage.getItem("Selfmade_M0d_Settings"));
        if(tmp != null)
        {
            Object.keys(tmp).forEach(function(e)
            {
                if(Settings.settings[e] != undefined)
                    Settings.settings[e] = tmp[e];  
            });
        }
        $("#notificationbox").css("background",Settings.settings.notificationColor);
        var r = parseInt(Settings.settings.notificationColor.substr(1,2),16);
        var g = parseInt(Settings.settings.notificationColor.substr(3,2),16);
        var b = parseInt(Settings.settings.notificationColor.substr(5,2),16);
        var yiq = ((r*299)+(g*587)+(b*114))/1000;
        $("#notificationbox").css("color",(yiq >= 128) ? 'black' : 'white');
    }

    static quickSave()
    {
        localStorage.setItem("Selfmade_M0d_Settings", JSON.stringify(Settings.settings));
    }

    addSettingsTab()
    {
        let _this = this
        let tmp = $(".selfmade_M0d");
        if(tmp.length != 0)
        {
            return;
        }
        let button = document.createElement("a");
        button.innerText = "Selfmade M0d";
        button.className = "selfmade_m0d";
        button.href = "/settings/Selfmade_M0d";
        $(button).click(function(e)
        {
            e.preventDefault();
            window.history.pushState({},"Selfmade M0d Settings","/settings/Selfmade_M0d");
            _this.createSettings();
        });
        $(".tab-bar")[0].appendChild(button); 
    }

    createSettings()
    {
        let _this = this;
        $(".pane.form-page").empty(); 
        $(".active").toggleClass("active");
        $(".selfmade_m0d").addClass("active");
        
        $(".pane.form-page")[0].innerHTML = settingsPageContent;
        
        $(".tablinks").click(function(e)
        {
            _this.changeSettingsContent(e, this);
        });

        $(".tablinks#default").click();

        //#region Blocked Tags
        Settings.settings.blockedTags.forEach(function(e)
        {
            __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].createNameTag($("#bt input")[0], e);
        });
    
        $("#bt input:first").keyup(function(e){
            if(e.key == ",")
            {
                let _this = this;
                let textarray = this.value.split(",");
                textarray.forEach(function(e)
                {
                    let text = e.trim().toLowerCase();
                    if(text.length <1) 
                    {
                        return;
                    }
                    __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].createNameTag(_this, text);
                });  
                this.value = "";
            }
        });
    
        $("#bt input")[1].checked = Settings.settings.onlyGoodTags;
        $("#bt input")[2].value = Settings.settings.amountOfTagsChecked;
        //#endregion

        //#region Blocked Users
        Settings.settings.blockedUsers.forEach(function(e)
        {
            __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].createNameTag($("#bu input")[0], e);
        });

        $("#bu input:first").keyup(function(e){
            if(e.key == ",")
            {
                let _this = this;
                let textarray = this.value.split(",");
                textarray.forEach(function(e)
                {
                    let text = e.trim().toLowerCase();
                    if(text.length <1) 
                    {
                        return;
                    }
                    __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].createNameTag(_this, text);
                });
                this.value = "";
            }
        });
        $("#bu input")[1].checked = Settings.settings.blockCommentsByUser;
        //#endregion

        //#region Comments
        Settings.settings.commentBlacklist.forEach(function(e)
        {
            __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].createNameTag($("#bc input")[0], e);
        });
    
        $("#bc input:first").keyup(function(e){
            if(e.key == "," || e.key == " ")
            {
                let _this = this;
                let textarray = this.value.split(/[\s,]+/);
                textarray.forEach(function(e)
                {
                    let text = e.trim().toLowerCase();
                    if(text.length <1) 
                    {
                        return;
                    }
                    __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].createNameTag(_this, text);
                });
                this.value = text;
            }
        });
        $("#bc input")[1].checked = Settings.settings.blockCommentsByBenis;
        $("#bc input")[2].value = Settings.settings.commentMinBenis;
        $("#bc input")[3].checked = Settings.settings.collapseTooLongComments;
        //#endregion

        //#region Blocked Userranks
        Settings.settings.blockedUserRanks.forEach(function(e)
        {
            let tmp = $("label:contains(" + e + ")");
            if(tmp.length != 0)
            $("label:contains(" + e + ")").prev()[0].checked = true;
        });
        //#endregion

        //#region minBenis
        $("#mb input")[0].checked = Settings.settings.skipUploadByTotalBenis;
        $("#mb input")[1].value = Settings.settings.minBenis;
        $("#mb input")[2].checked = Settings.settings.skipUploadByAverageBenis;
        $("#mb input")[3].value = Settings.settings.minAverageBenis;
        //#endregion

        //#region Skip
        $("#sr input")[0].checked = Settings.settings.skipUploadAfterRate;
        //#endregion

        //#region Notification
        $("#nf input")[0].checked = Settings.settings.activateNotifications;
        $("#nf input")[1].value = Settings.settings.notificationColor;
        $("#nf input")[2].value = Settings.settings.notificationDuration;
        //#endregion

        $("#save input").click(function()
        { 
            _this.saveSettings();
            __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].showNotification("Einstellungen gespeichert");
        });
        $("#reset a").click(function()
        {
            if(confirm("Wirklich alle Einstellungen löschen?"))
            {
                localStorage.removeItem("Selfmade_M0d_Settings");
                Settings.settings = Object.assign({},_this.defaultSettings);
                $("a.selfmade_m0d").click();
                __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].showNotification("Einstellungen zurückgesetzt");
            }
        });
    
        $(".box-from-label").next().each(function()
        {
            $(this).click(function()
            {
                $(this).prev()[0].checked = !$(this).prev()[0].checked;
            });
        });
    }

    saveSettings()
    {
        //#region Blocked Tags
        Settings.settings.blockedTags = [];
        $("#bt input").prev().find("span").each(function()
        {
            let text = this.innerText.slice(0,this.innerText.length-3);
            Settings.settings.blockedTags.push(text.toLowerCase());
        });
        Settings.settings.blockedTags = __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].uniq(Settings.settings.blockedTags);

        Settings.settings.skipUploadByTag = Settings.settings.blockedTags.length >0?true:false;
        Settings.settings.onlyGoodTags = $("#bt input")[1].checked;
        Settings.settings.amountOfTagsChecked = Number($("#bt input")[2].value);
        //#endregion

        //#region Blocked Users
        Settings.settings.blockedUsers = [];
        $("#bu input:first").prev().find("span").each(function()
        {
            let text = this.innerText.slice(0,this.innerText.length-3);

            Settings.settings.blockedUsers.push(text.toLowerCase());
        });
        Settings.settings.blockedUsers = __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].uniq(Settings.settings.blockedUsers);
        
        Settings.settings.skipUploadByUser = Settings.settings.blockedUsers.length >0 ? true:false;
        Settings.settings.blockCommentsByUser = $("#bu input")[1].checked;
        //#endregion

        //#region Comments
        Settings.settings.commentBlacklist = [];
        $("#bc input:first").prev().find("span").each(function()
        {
            let text = this.innerText.slice(0,this.innerText.length-3);
            Settings.settings.commentBlacklist.push(text.toLowerCase());
        });
        Settings.settings.commentBlacklist = __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].uniq(Settings.settings.commentBlacklist);
        
        Settings.settings.blockCommentsByBlacklist = Settings.settings.commentBlacklist.length >0 ? true:false;
        Settings.settings.blockCommentsByBenis = $("#bc input")[1].checked;
        Settings.settings.commentMinBenis = Number($("#bc input")[2].value);
        Settings.settings.collapseTooLongComments = $("#bc input")[3].checked;
        //#endregion

        //#region Blocked Userranks
        Settings.settings.blockedUserRanks = [];
        let tmp = $("#br input:checked").next();
        for(let i = 0; i < tmp.length; i++)
        {
            Settings.settings.blockedUserRanks.push(tmp[i].innerText.trim());
        }
        Settings.settings.skipUploadByUserRank = Settings.settings.blockedUserRanks.length >0 ? true:false;
        //#endregion

        //#region min Benis
        Settings.settings.skipUploadByTotalBenis = $("#mb input")[0].checked;
        Settings.settings.minBenis = Number($("#mb input")[1].value);
        Settings.settings.skipUploadByAverageBenis = $("#mb input")[2].checked;
        Settings.settings.minAverageBenis = Number($("#mb input")[3].value);
        //#endregion

        //#region Skip
        Settings.settings.skipUploadAfterRate = $("#sr input")[0].checked;
        //#endregion
        
        //#region Others
        Settings.settings.autoRateSkippedUploads = false;
        //#endregion

        //#region Notification
        Settings.settings.activateNotifications = $("#nf input")[0].checked;
        Settings.settings.notificationColor = $("#nf input")[1].value;
        Settings.settings.notificationDuration = Number($("#nf input")[2].value);
        $("#notificationbox").css("background",Settings.settings.notificationColor);

        var r = parseInt(Settings.settings.notificationColor.substr(1,2),16);
        var g = parseInt(Settings.settings.notificationColor.substr(3,2),16);
        var b = parseInt(Settings.settings.notificationColor.substr(5,2),16);
        var yiq = ((r*299)+(g*587)+(b*114))/1000;
        $("#notificationbox").css("color",(yiq >= 128) ? 'black' : 'white');
        //#endregion
 
        Settings.quickSave();
    }

    changeSettingsContent(evt, element)
    {
        $(".tabcontent").each(function()
        {
           this.style.display = "none"; 
        });

        $(".tablinks").each(function()
        {
           $(this).removeClass("active"); 
        });
        $("#" + $(element).attr("data-tab"))[0].style.display = "block";

        $(element).addClass("active");
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Settings;

Settings.settings = {};


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__EventHandler__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Settings__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Modules__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Keypress__ = __webpack_require__(7);







__webpack_require__(8);

class Main 
{
    constructor()
    {
        console.log("Selfmade M0d running");
       
        this.eventHandler = new __WEBPACK_IMPORTED_MODULE_0__EventHandler__["a" /* default */](); 
        this.utils = new __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */]();
        this.settings = new __WEBPACK_IMPORTED_MODULE_2__Settings__["a" /* default */]();
        this.modules = new __WEBPACK_IMPORTED_MODULE_3__Modules__["a" /* default */]();
        this.keypress = new __WEBPACK_IMPORTED_MODULE_4__Keypress__["a" /* default */]();
    }
}

$(document).ready(()=> new Main());


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class EventHandler
{
    

    constructor()
    {
        this.keyPress = new Event("keyPress");
        this.settingsReady = new Event("settingsReady");
        this.commentsReady = new Event("commentsReady");
        this.userReady = new Event("userReady");
        this.pr0gramm = p;
        this.addListener();
    }

    addListener()
    {
        let _this = this;
        
        //keyPress Event
        (function(handleKey)
        {
            _this.pr0gramm.hotkeys.handleKey = function(code)
            {
                handleKey.call(this,code);
                window.dispatchEvent(_this.keyPress);
            }
        })(_this.pr0gramm.hotkeys.handleKey);
        
        //settingsReady Event
        (function(render)
        {
            _this.pr0gramm.View.Settings.prototype.render = function(params)
            {
                render.call(this, params);
                window.dispatchEvent(_this.settingsReady);
            }
        })(_this.pr0gramm.View.Settings.prototype.render);

        //commentsReady Event
        (function(render) 
        {
            _this.pr0gramm.View.Stream.Comments.prototype.render = function() {
                render.call(this);
                window.dispatchEvent(_this.commentsReady);
            };
        }(_this.pr0gramm.View.Stream.Comments.prototype.render));

        //userReady Event
        (function(render) 
        {
            _this.pr0gramm.View.User.prototype.render = function()
            {
                render.call(this);
                window.dispatchEvent(_this.userReady);
            }
        })(_this.pr0gramm.View.User.prototype.render);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EventHandler;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = "<div class=\"form-section selfmade_m0d\">\r\n    <div class=\"tab\" style=\"display: inline-block\">\r\n        <button class=\"tablinks\" id=\"default\" data-tab=\"settings\">Einstellungen</button>\r\n        <button class=\"tablinks\" data-tab=\"shortcuts\">Shortcuts</button>\r\n        <button class=\"tablinks\" data-tab= \"credits\">Credits</button>\r\n    </div><hr>\r\n    <div class=\"tabcontent\" id=\"settings\">\r\n            <div id=\"bt\">\r\n                Geblockte Tags:<br>\r\n                <div class=\"tag-container\"></div>\r\n                <input placeholder=\"tag1,tag2,tag3,...\" title=\"Tags mit Komma trennen!\"></input>\r\n                <input type=\"checkbox\" class=\"box-from-label\" name=\"onlyGoodTags\">\r\n                    <label for=\"onlyGoodTags\"> Ignoriere Tags mit negativen Benis </label>\r\n                Anzahl der zu berücksichtigen Tags: <input type=\"number\" min=\"-1\" max=\"999\" value=\"-1\" title=\"-1 = alle\">\r\n            </div>\r\n            <br><hr />\r\n            <div id=\"bu\" title=\"Nutzernamen mit Komma trennen!\">\r\n                Geblockte Nutzer:<br>\r\n                <div class=\"tag-container\"></div>\r\n                <input placeholder=\"nutzer1,nutzer2,nutzer3,...\"></input>\r\n                <input type=\"checkbox\" class=\"box-from-label\" name=\"bc\">\r\n                    <label for=\"bc\"> Kommentare von geblockten Nutzern entfernen</label>\r\n            </div>\r\n            <br><hr/>\r\n            <div id=\"bc\">\r\n                Geblockte Wörter in den Kommentaren:<br>\r\n                <div class=\"tag-container\"></div>\r\n                <input placeholder=\"wort1,wort2,wort3,...\" title=\"Wörter mit Komma trennen!\"></input><br>\r\n                <input type=\"checkbox\" class=\"box-from-label\" name=\"ComMinBenis\">\r\n                    <label for=\"ComMinBenis\" style=\"display:inline-block\"> Mindest Benis bei Kommentaren:</label> <input type=\"number\" min=\"-999\" max=\"999\" value=\"0\">\r\n                <input type=\"checkbox\" class=\"box-from-label\" name=\"shortComms\" /> <label for=\"shortComms\"> Zu lange Kommentare kürzen</label>\r\n            </div>\r\n            <br><hr/>\r\n            <div id=\"br\" >\r\n                Geblockte Ränge:<br>\r\n                <div style=\"margin-left:25px;\">\r\n                    <input type=\"checkbox\" class=\"box-from-label\" name=\"Gesperrt\">\r\n                        <label for=\"Gesperrt\" style=\"color:#444444\"> Gesperrt </label>\r\n                    <input type=\"checkbox\" class=\"box-from-label\" name=\"Fliesentischbesitzer\">\r\n                        <label for=\"Fliesentischbesitzer\" style=\"color:#6C432B\"> Fliesentischbesitzer</label>\r\n                    <input type=\"checkbox\" class=\"box-from-label\" name=\"Neuschwuchtel\">\r\n                        <label for=\"Neuschwuchtel\" style=\"color:#E108E9\" >Neuschwuchtel</label>\r\n                    <input type=\"checkbox\" class=\"box-from-label\" name=\"Schwuchtel\">\r\n                        <label for=\"Schwuchtel\" style=\"color:#FFFFFF\">Schwuchtel</label>\r\n                    <input type=\"checkbox\" class=\"box-from-label\" name=\"Altschwuchtel\">\r\n                        <label for=\"Altschwuchtel\" style=\"color:#5BB91C\"> Altschwuchtel</label>\r\n                    <input type=\"checkbox\" class=\"box-from-label\" name=\"Wichtler\">\r\n                        <label for=\"Wichtler\" style=\"color:#D23C22\"> Wichtler</label>\r\n                    <input type=\"checkbox\" class=\"box-from-label\" name=\"Edler Spender\">\r\n                        <label for=\"Edler Spender\" style=\"color:#1cb992\"> Edler Spender</label>\r\n                    <input type=\"checkbox\" class=\"box-from-label\" name=\"Lebende Legende\">\r\n                        <label for=\"Lebende Legende\" style=\"color:#1cb992\"> Lebende Legende</label>\r\n                    <input type=\"checkbox\" class=\"box-from-label\" name=\"Moderator\">\r\n                        <label for=\"Moderator\" style=\"color:#008FFF\"> Moderator</label>\r\n                    <input type=\"checkbox\" class=\"box-from-label\" name=\"Administrator\">\r\n                        <label for=\"Administrator\" style=\"color:#FF9900\"> Administrator</label>\r\n                </div>\t\r\n            </div>\r\n            <br><hr/>\r\n            <div id=\"mb\" >\r\n                <input type=\"checkbox\" class=\"box-from-label\" name=\"minBenis\" >\r\n                    <label for=\"minBenis\" style=\"display:inline-block\">Skippe Bilder mit einem Benis kleiner als: </label><input type=\"number\" min=\"-999\" max=\"999\" value=\"0\"><br>\r\n                <input type=\"checkbox\" class=\"box-from-label\" name=\"minAverageBenis\" >\r\n                    <label for=\"minAverageBenis\" style=\"display:inline-block\"> Skippe Bilder mit einem Benis verhältnis(+/-) kleiner als: </label><input type=\"number\" min=\"-999\" max=\"999\" value=\"0\">\r\n            </div>\r\n            <br><hr/>\r\n            <div id=\"sr\" >\r\n                <input type=\"checkbox\" class=\"box-from-label\" name=\"sar\">\r\n                    <label for=\"sar\"> Nach Bewertung skippen</label>\r\n            </div>\r\n            <br><hr>\r\n            <div id=\"nf\">\r\n                <input type=\"checkbox\" class=\"box-from-label\" name=\"notification\">\r\n                    <label for=\"notification\">Notifications anzeigen</label>\r\n                Notificationsfarbe: <input type=\"color\" id=\"color\"><br>\r\n                Notificationdauer in Sekunden: <input type=\"number\">\r\n            </div>\r\n            <br>\r\n            <div id=\"save\">\r\n                <input type=\"submit\" value=\"Speichern\" class=\"confirm settings-save\"></input>\r\n            </div>\r\n            <br>\r\n            <div id=\"reset\">\r\n                <a class=\"action clear-settings-button\">Einstellungen zurücksetzen</a>\r\n            </div>\r\n    </div>\r\n    <div class=\"tabcontent\" id=\"shortcuts\">\r\n        <span>-'1' um auf /neu zu gehen</span>\r\n        <span>-'2' um auf /top zu gehen</span>\r\n        <span>-'3' um auf /stalk zu gehen</span>\r\n        <span>-'x' um das Addon zu de-/aktivieren</span>\r\n        <span>-'d' um das erste Bild zu öffnen wenn noch keins offen ist </span>\r\n        <span>-'e' um zu den Einstellungen zu kommen</span>\r\n        <span>-'n' um zu den Nachrichten zu kommen</span>\r\n        <span>-Linksklick auf eine Notification bringt dich zurück zum Bild</span>\r\n        <span>-Rechtsklick auf eine Notification entfernt sie</span>\r\n        <span>-Ein erneutes Bewerten eines Bilder per Tasten entfernt die Bewertung wieder</span>\r\n        <span>-Klicke auf einen geblockten Kommentar um ihn wieder sichtbar zu machen</span>\r\n    </div>\r\n    <div class=\"tabcontent\" id=\"credits\">\r\n        <span>Author: <a onclick=\"p.navigateTo('user/Frubi',0)\">Frubi</a></span>\r\n        <span>Soße: <a href=\"https://greasyfork.org/de/scripts/35129-selfmade-m0d\">Selfmade M0d auf Greasyfork</a></span>\r\n        <span>Code: <a href=\"https://github.com/Frubi22/selfmade_m0d/\">Selfmade M0d auf GitHub</a></span>\r\n        <span>Tester: <a onclick=\"p.navigateTo('user/apeir0n',0)\">apeir0n</a></span>\r\n    </div>\r\n</div>\r\n";

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "<span class=\"filter-setting\" data-flag=\"8\"> \r\n    <div class=\"filter-name\">\r\n        <span class=\"filter-check\"></span>Self-made M0d\r\n    </div> \r\n    <div class=\"filter-desc\">Aktiviere das Selfmade M0d Addon. Speichern nicht erforderlich</div> \r\n</span>";

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Settings__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Utils__ = __webpack_require__(0);



class Modules
{
    
    constructor()
    {
        this.pr0gramm = p;
        let _this = this;
        window.addEventListener("commentsReady", function()
        {
            setTimeout(function(){_this.executeModules(); },10);
            $(".stream-prev").click(function(){__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.nextUploadDirection = 1});
            $(".stream-next").click(function(){__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.nextUploadDirection = -1});
        });
    }

    executeModules()
    {
        let _this = this;

            if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.isActive)
            {
                let wasSkipped = false;  
                if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.skipUploadByTag)
                {
                    wasSkipped = _this.skipUploadByTag();
                }
                if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.skipUploadByUser && !wasSkipped)
                {
                    wasSkipped = _this.skipUploadByUser();
                }
                if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.skipUploadByTotalBenis && !wasSkipped)
                {
                    wasSkipped =_this.skipUploadByTotalBenis();
                }
                if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.skipUploadByAverageBenis && !wasSkipped)
                {
                    wasSkipped = _this.skipUploadByAverageBenis();
                }
                if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.skipUploadByUserRank && !wasSkipped)
                {   
                    wasSkipped = _this.skipUploadByUserRank();
                }
                if(!wasSkipped)
                {
                    if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockCommentsByUser)
                        _this.blockCommentsByUser();
                    if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockCommentsByBenis)
                        _this.blockCommentsByBenis();
                    if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.skipUploadByUserRank)
                        _this.blockCommentsByRank();
                    if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockCommentsByBlacklist)
                        _this.blockCommentsByBlacklist();
                    if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.collapseTooLongComments)
                        _this.collapseTooLongComments();
                }
            
            }
    }

    skipUploadByTag()
    {
        let _this = this;
        let tags = __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].getTags();
        for(let i = 0; i < tags.length; i++)
        {
            if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedTags.includes(tags[i].toLowerCase()))
            {
                if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.autoRateSkippedUploads)
                {
                    __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].rateUpload();
                }
                __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].showNotification("Skipped because of Tag: " + tags[i], this.pr0gramm.location);
                __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].nextUpload();
                return true;
            }
        }
        return false;
    }

    skipUploadByUser()
    {
        let user = __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].getUser();
        if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedUsers.includes(user))
        {
            if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.autoRateSkippedUploads)
                __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].rateUpload();
    
            __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].showNotification("Skipped because of User: " + user, this.pr0gramm.location);
            __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].nextUpload();
            return true;
        }  
        return false;
    }

    skipUploadByTotalBenis()
    { 
        let score = __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].getTotalBenis();
        if(score != undefined)
        {
            if(score < __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.minBenis)
                {   
                    if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.autoRateSkippedUploads)
                    {
                        __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].rateUpload();
                    }
                    __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].showNotification("Skipped because of Benis: " + score, this.pr0gramm.location);
                    __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].nextUpload();     
                    return true;
                }
        }
        return false;
    }

    skipUploadByAverageBenis()
    {
        let score = __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].getAverageBenis();
        if(score != undefined)
        {
            if(__WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].getAverageBenis() < __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.minAverageBenis)
            {   
                if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.autoRateSkippedUploads)
                {
                    __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].rateUpload();
                }
                __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].showNotification("Skipped because of average Benis: " + score, this.pr0gramm.location);
                __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].nextUpload();    
                return true;
            }
        }
        return false;
    }

    skipUploadByUserRank()
    {
        let rank = __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].getUserRank($('.item-details .user')[0]);
        if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedUserRanks.includes(rank))
        {
                if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.autoRateSkippedUploads)
                {
                    __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].rateUpload();
                }
                __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].showNotification("Skipped because of Userrank: " + rank, this.pr0gramm.location);
                __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].nextUpload();    
                return true;
        }
        return false;
    }

    blockCommentsByUser()
    {
        let _this = this;
        $('.comment:not(textarea)').each(function()
        {
            let user = $(this).find($('.comment-foot .user'))[0].innerText.toLowerCase();
            if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedUsers.includes(user))
            {
                _this.blockComment(this, "user: " + user);
            }
        });
    }

    blockCommentsByBlacklist()
    {
        let _this = this;
        $('.comment .comment-content').each(function()
        {
            let element = this;
            if($(element).attr("data-comment") != undefined)
                return;
    
            $($(this).text().toLowerCase().replace(/[^\w\s]/g, '').split(" ")).each(function()
            {
                if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.commentBlacklist.includes(String(this)))
                {
                    _this.blockComment($(element).parent(), 'word: "' + String(this) + '"');
                    return false;
                }
            });
        });
    }

    blockCommentsByBenis()
    {
        let _this = this;
        $('.comment-foot .score').each(function()
        {
            let score = parseFloat(this.innerText);
            if(score < __WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.commentMinBenis)
                _this.blockComment($(this).parent().parent(), "benis too small");
        });
    }

    blockCommentsByRank()
    {
        let _this = this;
        $('.comment-foot .user').each(function()
        {
            let rank = __WEBPACK_IMPORTED_MODULE_1__Utils__["a" /* default */].getUserRank(this);
            if(__WEBPACK_IMPORTED_MODULE_0__Settings__["a" /* default */].settings.blockedUserRanks.includes(rank))
                _this.blockComment($(this).parent().parent(), "rank: " + rank);
        });
    }

    blockComment(element, text, collapse= true)
    {
        let tmp = $(element).find($('.comment-content'));
        if(tmp.attr("data-comment") == undefined)
        {   
            $(tmp).css("color", "grey");
            $(tmp).css("cursor", "pointer");
            tmp.attr("data-comment", tmp[0].innerHTML )
            tmp[0].innerHTML = "[Blocked] because of " + text;
            tmp.click(function()
            {
                if($(this).attr("data-comment") != undefined)
                {
                    $(this).attr("data-blocked", this.innerHTML);
                    this.innerHTML = $(this).attr("data-comment");
                    $(this).removeAttr("data-comment");
                }
                else
                {
                    $(this).attr("data-comment", this.innerHTML);
                    this.innerHTML = $(this).attr("data-blocked");
                    $(this).removeAttr("data-blocked");
                }
            });
            if(collapse)
                $(element).find('.fold-in').click();
        }
    }

    collapseTooLongComments()
    {
        let size = 200;
        let _this = this;
        $('.comment .comment-content').each(function()
        {
            let element = this;
            if($(element).attr("data-comment") != undefined)
                return;
    
            if(element.innerText.length > size)
            {
                let tmp = element.innerText.slice(0, size);
                _this.blockComment($(element).parent(),"", false);
                
                element.innerText = tmp + "...\n[Comment too long, click to expand]";
            }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Modules;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Utils__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Settings__ = __webpack_require__(1);



class Keypress
{
    constructor()
    {
        let _this = this;
        window.addEventListener("keypress", function(e){_this.shortcuts(e);})
        window.addEventListener("wheel", function(e){_this.mousewheel(e);})
        window.addEventListener("keydown",function(e){_this.keydown(e);})
        this.pr0gramm = p
    }

    shortcuts(e)
    {
        let node;
        if(e.path != undefined)
            node = e.path[0].nodeName;
        else    
            node = e.target.nodeName;

        if(node != "TEXTAREA" && node != "INPUT")
        {
            if($(".item-vote").length > 0)
            {
                if(e.key == "w" ||   e.key == "g" || e.key == "+" || e.key == "f")
                {
                    if(__WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].rating.includes("voted-up"))
                    {
                        $(".item-vote .pict.vote-up").click();   
                    }
                    else
                    {
                        if(__WEBPACK_IMPORTED_MODULE_1__Settings__["a" /* default */].settings.skipUploadAfterRate)
                        {
                            __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].showNotification("Skipped because: you rated positive", this.pr0gramm.getLocation());
                            __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].nextUpload();
                        }
                    }    
                    __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].rating = $(".item-vote")[0].className; 
                }
                else if(e.key == "s" || e.key == "-" || e.key == "b")
                {
                    if(__WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].rating.includes("voted-down"))
                    {
                        $(".item-vote .pict.vote-down").click();                   
                    }
                    else
                    {
                        if(__WEBPACK_IMPORTED_MODULE_1__Settings__["a" /* default */].settings.skipUploadAfterRate)
                        {
                            __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].showNotification("Skipped because: you rated negative", this.pr0gramm.getLocation());
                            __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].nextUpload();
                        }
                    }
                    __WEBPACK_IMPORTED_MODULE_0__Utils__["a" /* default */].rating = $(".item-vote")[0].className;  
                }
            }
            else if(e.key == "d")
            {
                $("#stream a:first")[0].click();
            }

            if(e.key == "x")
            {
                __WEBPACK_IMPORTED_MODULE_1__Settings__["a" /* default */].settings.isActive = !__WEBPACK_IMPORTED_MODULE_1__Settings__["a" /* default */].settings.isActive;
                __WEBPACK_IMPORTED_MODULE_1__Settings__["a" /* default */].quickSave();
            }
            else if(e.key == "e")
            {
                this.pr0gramm.navigateTo("settings/site",0);
            }
            else if(e.key == "n")
            {
                this.pr0gramm.navigateTo("inbox/all",0);
            }
            else if(e.key == "1")
            {
                e.preventDefault();
                this.pr0gramm.navigateTo("new",0);
            }
            else if(e.key == "2")
            {
                e.preventDefault();
                this.pr0gramm.navigateTo("top",0);
            }
            else if(e.key == "3")
            {
                e.preventDefault();
                this.pr0gramm.navigateTo("stalk",0);
            } 
        }
    }
    mousewheel(e)
    {
        if(e.deltaY >= 0)
        {
            __WEBPACK_IMPORTED_MODULE_1__Settings__["a" /* default */].settings.nextUploadDirection = -1;
        }
        else if(e.deltaY <= 0)
        {
            __WEBPACK_IMPORTED_MODULE_1__Settings__["a" /* default */].settings.nextUploadDirection = 1;
        }
    }
    keydown(e)
    {
        if(e.key == "d" || e.key == "ArrowRight" )
        {
            __WEBPACK_IMPORTED_MODULE_1__Settings__["a" /* default */].settings.nextUploadDirection = -1;
        }
        else if(e.key == "a" || e.key == "ArrowLeft")
        {
            __WEBPACK_IMPORTED_MODULE_1__Settings__["a" /* default */].settings.nextUploadDirection = 1;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Keypress;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(9);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(11)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/less-loader/dist/cjs.js!./style.less", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/less-loader/dist/cjs.js!./style.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(10)(undefined);
// imports


// module
exports.push([module.i, ".selfmade_m0d#notificationbox {\n  visibility: hidden;\n  position: fixed;\n  width: 300px;\n  left: 0;\n  bottom: 0;\n  z-index: 11;\n  vertical-align: bottom;\n}\n.selfmade_m0d#notification {\n  visibility: visible;\n  display: none;\n  position: relative;\n  background: inherit;\n  line-height: 60px;\n  width: 100%;\n  text-align: center;\n  vertical-align: middle;\n  color: inherit;\n  cursor: pointer;\n}\n.selfmade_m0d .tag-container {\n  margin-top: 5px;\n  max-height: 100px;\n  overflow: auto;\n}\n.selfmade_m0d .tabcontent {\n  display: none;\n}\n.selfmade_m0d .tabcontent#shortcuts span {\n  display: block;\n}\n.selfmade_m0d .tabcontent#credits span {\n  display: block;\n}\n.selfmade_m0d .tabcontent#credits a:hover {\n  color: white!important;\n}\n.selfmade_m0d #color {\n  padding: 0;\n}\n.selfmade_m0d hr {\n  border: solid #8f8c8c 0.5px;\n}\n.selfmade_m0d button {\n  height: 30px;\n  background-color: inherit;\n  float: left;\n  border: none;\n  outline: none;\n  cursor: pointer;\n  margin-bottom: 10px;\n  transition: 0.3s;\n  color: white;\n}\n.selfmade_m0d button:hover {\n  background-color: #5f5f68;\n}\n.selfmade_m0d button.active {\n  background-color: #47474d;\n}\n", ""]);

// exports


/***/ }),
/* 10 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(12);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);