// ==UserScript==
// @name          WME LinkBar Mods Demo892003
// @namespace     
// @description   Restaure les permaliens perdus ;)
// @include       https://www.waze.com/editor/*
// @include       https://www.waze.com/*/editor/*
// @include       https://editor-beta.waze.com/*
// @exclude       https://www.waze.com/user/*
// @exclude       https://www.waze.com/*/user/*
// @author        Demo892003 : Merci à Seb-d59 pour l'aide au début du déchiffrage
// @copyright     2016 Demo892003
// @icon          
// @version       0.1
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/17228/WME%20LinkBar%20Mods%20Demo892003.user.js
// @updateURL https://update.greasyfork.org/scripts/17228/WME%20LinkBar%20Mods%20Demo892003.meta.js
// ==/UserScript==
function run_LB ()
{
	var WMELBversion = '0.1';
	// level de débogage: 1 - affiche le mini; 3 - Affiche Tout
	var LevelAutorise = 1;
	

	var WMELB_ToSave = {};
	var WMELB_AutoHideSideBar = false;
	var WMELB_sidebarvisible;
	var WMELB_sidebarOriginalWidth;
	var WMELB_SaveOnExit;
	var WMELB_NewSave;
	var WMELB_header;
	var Adjust=60;
	var MenAdjust=60;

	//	DebugLog("starting...",1);
		
	function waitForObject(object)
	{
    var obj=null;
    //DebugLog ("eval: " + "typeof(unsafeWindow." + object.o.replace(/\//g, '.') + ")");
    if (object.r==true)
    {
        eval ((object.s!=null?object.s:'dummy') + '=require("' + object.o + '")');
        eval ("obj=" + (object.s!=null?object.s:'dummy'));
    }
        //obj=require(object.o);
		else
        obj=eval("typeof(unsafeWindow." + object.o.replace(/\//g, '.') + ")");
    	//DebugLog("obj", obj);
    if(obj === "undefined")
    {
        DebugLog(object.o + ' KO');
        window.setTimeout(waitForObject.caller, 500);
        return false;
    }

    if (object.s!=null && object.r==false)
        eval (object.s + "=" + object.o.replace(/\//g, '.'));

    return true;
	}

	function WMELBBootstrap(){
		DebugLog('WMELBBootstrap',1);
		/*    try {
            if ((typeof window.Waze.map != undefined) && (undefined != typeof window.Waze.map.events.register)) {
                DebugLog('WMELBBootstrap ok',1);
                setTimeout(WMELB_MainInitialise, 500);
            } else {
                setTimeout(WMELBBootstrap, 1000);
            }
        } catch (err) {
            setTimeout(WMELBBootstrap, 1000);
        }

		*/
		if (typeof unsafeWindow === "undefined") {
		  unsafeWindow    = ( function () {
		    var dummyElem = document.createElement('p');
		    dummyElem.setAttribute('onclick', 'return window;');
		    return dummyElem.onclick();
		  }) ();
		}
		
		var objectToCheck = [{o: "Waze.map",								s: "wazeMap",								r: false},
				                 {o: "localStorage",						s: null,										r: false}
				                ];
		for (var i=0; i<objectToCheck.length; i++)
		{
		    if (!waitForObject(objectToCheck[i])) return;    
		}
		
		/* begin running the code! */
		
		DebugLog('WMELBBootstrap ok',1);
		WMELB_MainInitialise();
		
	}

	//==========  Helper ==============================//
	function getElementsByClassName(classname, node) {
		if(!node) node = document.getElementsByTagName("body")[0];
		var a = [];
		var re = new RegExp('\\b' + classname + '\\b');
		var els = node.getElementsByTagName("*");
		for (var i=0,j=els.length; i<j; i++)
		  if (re.test(els[i].className)) a.push(els[i]);
		return a;
	}

	function getId(node) {
		return document.getElementById(node);
	}

	function DebugLog(DebugLog_msg, LevelDebug) {
		if (LevelDebug > LevelAutorise)
			return;
		
		if (typeof DebugLog_msg == "object") {
			if ((DebugLog_msg.id !== undefined) && (DebugLog_msg.fid !== undefined)) {
				console.log("LinkBar "+WMELBversion+" Affichage détails d\'objet: " + DebugLog_msg.id +" - "+ DebugLog_msg.fid);
			}else if ((DebugLog_msg.id !== undefined) && (DebugLog_msg.fid === undefined)) {
				console.log("LinkBar "+WMELBversion+" Affichage détails d\'objet: " + DebugLog_msg.id);
			}else if ((DebugLog_msg.id === undefined) && (DebugLog_msg.fid !== undefined)) {
				console.log("LinkBar "+WMELBversion+" Affichage détails d\'objet: " + DebugLog_msg.fid);
			}else if ((DebugLog_msg.id === undefined) && (DebugLog_msg.fid === undefined)) {
				console.log("LinkBar "+WMELBversion+" Affichage détails d\'objet: ");
			}
			console.log(DebugLog_msg);
		}
		else {
	 	console.log("LinkBar "+WMELBversion+": " + DebugLog_msg);
		}
	}

	function WMELB_getQueryString(e, t)
	{   DebugLog('link:' + e, 3);
		  DebugLog('name:' + t, 3);
		  var n = e.indexOf(t + '=') + t.length + 1;
		  DebugLog('pos:' + n, 3);
		  var r = e.substr(n).indexOf('&');
		  if (r == - 1) {
		    r = e.substr(n).length;
		  }
		  DebugLog('len:' + r, 3);
		  var i = e.substr(n, r);
		  DebugLog('data:' + i, 3);
		  return i;
	 }

	//==========  /Helper ==============================//  

	//**********************************************************************
	// A modifier pour suivi de Toolbox masquage volet Gauche ********** 
	/*  var WMELB_slideSideBar = function (e) {
		  'use strict';
		  var t = parseInt($('#sidebar').parent().parent().css('padding-left')) * 100 / document.body.clientWidth;
		  if (e == 'hide') {
		    WMELB_sidebarvisible = false;
		    $('#sidebar').animate({
		      width: '-=' + WMELB_sidebarOriginalWidth + 'px'
		    }, {
		      duration: 150,
		      complete: function () {
		        $('#editor-container').css({
		          left: 0,
		          width: $(window).width(),
		          position: 'absolute'
		        });
		        Waze.map.updateSize();
		        $('#links').hide();
		        $('#WMELB_ToggleSidebar').attr('src', document['sidebar_arrow_right.png'].src);
		        if ($('#WMELB_NavBar').position().left < $(window).width() / 2) {
		          $('#WMELB_NavBar').animate({
		            left: '-=' + WMELB_sidebarOriginalWidth
		          }, {
		            duration: 150,
		            fail: function () {
		              WMELB_DispErr('navbar move to left failed to complete')
		            }
		          })
		        }
		      },
		      fail: function () {
		        WMELB_DispErr('sidebar hide failed to complete')
		      }
		    })
		  } else if (e == 'show') {
		    WMELB_sidebarvisible = true;
		    $('#sidebar').animate({
		      width: '+=' + WMELB_sidebarOriginalWidth
		    }, {
		      duration: 150,
		      complete: function () {
		        $('#editor-container').css({
		          left: '',
		          width: '',
		          position: ''
		        });
		        Waze.map.updateSize();
		        $('#links').show();
		        if (WMELB_AutoHideSideBar === false) {
		          $('#WMELB_ToggleSidebar').attr('src', document['sidebar_arrow_left.png'].src)
		        }
		        if ($('#WMELB_NavBar').position().left < $(window).width() / 2) {
		          $('#WMELB_NavBar').animate({
		            left: '+=' + WMELB_sidebarOriginalWidth
		          }, {
		            duration: 150,
		            complete: function () {
		              if ($('#WMELB_NavBar').position().left > $(window).width() - $('#WMELB_NavBar').width()) {
		                $('#WMELB_NavBar').animate({
		                  left: '-=' + WMELB_sidebarOriginalWidth
		                }, {
		                  duration: 150,
		                  fail: function () {
		                    WMELB_DispErr('navbar correction failed to complete')
		                  }
		                })
		              }
		            },
		            fail: function () {
		              WMELB_DispErr('navbar move to right failed to complete')
		            }
		          })
		        }
		      },
		      fail: function () {
		        WMELB_DispErr('sidebar show failed to complete')
		      }
		    })
		  }
		},
		WMELB_ToggleSidebar = function () {
		  'use strict';
		  if (WMELB_AutoHideSideBar === true) {
		    WMELB_AutoHideSideBar = false;
		    if (WMELB_sidebarvisible === false) {
		      WMELB_sidebarvisible = true;
		      WMELB_slideSideBar('show')
		    }
		  } else {
		    WMELB_AutoHideSideBar = true
		  }
		};
		*/
	/*
	function WMELB_ClearCache()
	{ for (var e in localStorage) {
		  if (e.indexOf('WME_Linkbar_Picture_') != - 1) {
		    localStorage.removeItem(e);
		  }
		}
	}
	*/
	//	DebugLog("loading pictures...",1);
	var menuicon="iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gwVCQYVcoHlsQAABL9JREFUOMt1lH1Q03Ucx9+/3574gXOwMXBbAeK6dPiQKGpSpohngQjEmZ0WSN4BJ5ZoneVDgnfyT4qnnBhmpOwyPRbFg0yUC8EuE3m6AQNswli6RB2DscWe9+0POisb7z8/n+/3de/7vj/fDwb6+1dqtdovy0rPhANAaWkp/Km4uBjT/dM8dYP6vc6OzsF+rdbc2dFxsbWlNQgAcnJyQGn7+mIkUmlX2507I91dna8uWRhrTk5Lxky62dysJD7yPovNwr17v1XJpNKi5JRNAwBg1OtBAUD73fY8cWjosaGhofL1GxIPzwT7TnlJnpSSpOvu6obdYf/TMDKyUigS0Var9TDL58vMzs110gAQtyKuvLqqapXX49mhrq0/DwDKCxf+B1QsjkkUBAdjgUIBhmGCGIZpCgkRtgUFBgqyc3OdAKYdKgD0A2ABsmuN17ucDse5lLTUI88DdTpdiUQi2dfS0gqGCQCHzcHExPhjmmDdprTUgcLCwn8O7929GwCwbcs7L95obHysrqv/GgCqr6jAX1cB040POW2/3tbU19aRXbl5pOT4CdKv1ZKW5pt7AKCm6ns8c+hH0uvqa+0et7siOXXzEQCQZaj2boujS9YvCaL0+mFvfHz8fTab/QdFUe3fqlSfFRcWEr/Agrx8nCovQ+4HO+emv53R6vbhxrlLD+zzrL/vVkemItqnN2WvcWW6PL5bmVlZUwAIIQQURc04GVAoFAAAvlgeob5c43p4/ASplUeSfVuP+RCnfgsAPsrP93uX9ld0LT0KAHhtw8FPxE2NHFdvD+bHr8UbQ7XOA+1JtwHAUVbmF8jyVzT3qrCi4KdPjfrRQ6JbleBZxyBevRq+4SE21+tNf5PHu15kt5sBoBBA60xAaYYS1oEfsfNMx8mBntHP9ZN8eBK2gG15pJtqqhJFLlsOcXh46PjoaNYGhglsmJq6qVy7FlEWCxodDv8prz/QvMdknDyl6R2HYs0r4NAek8akWPTVtYhEAZdXGZueTtsMBvR1dMDm8TQ6QbYXmMbMlXw+sqzWaYfipIuY0tVgQY76kHXC/YVWOw7Zkvngsb0Y0ure9dQs7+JO2XtfYJilZr1+vjwxEaFCIUwjI3ICbEzicq8EREQ4Fz95AhQZCAAgOvPq5ugdTR4sOEtEW38mqw5qSHCSaj8AiPN/AABkcbnBFRLJ+OWwMGI4epRo0tKIMjycfBMWVvcs5aJICuLUK2s4gYJqQ4+RxZe/jLlRAgx032uY0Nw9+dL+djxtsOBwaCgqXa4Jo8uVQQICPL+cPw/BokVYlpAADkWnXJJKygGAEm1WiULEc3pZvEBbIJeKcoPiGO8PD45fzVgIwPvv9901axbO2mw4JBTmLeTzTxGHg7dy+3ZYBwfRp9F4xHx+LE05JmVjjyaFQVLhx14O1zQ6/PCpxWjc+DwMAM7abNPL1mwuH7ZaE+00bWlTqcBIpVidnu6NiIlxU7Q0a/bsebH10sWxr1uMxrEnXdWZwZN1fT7WLA4AmhDyH+jfX8xnpSh3vNMp2cTjKWNkMpm8oKBMnp19kOIANIKiRCRk1RyWrcfOpwxuQgdwCSGsmQYfgJeiKK8LcMvdbjpBIOCUPHgwChbL9hcyvghIwPZAdgAAAABJRU5ErkJggg==";
	var sep="iVBORw0KGgoAAAANSUhEUgAAAAUAAAAUCAYAAABF5ffbAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAACNJREFUeNpi+P//P8P///8ZjI2N/8PYDKOCg0kQAAAA//8DAK8mDwBAX0DJAAAAAElFTkSuQmCC";
	var Live="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";
	var Livebeta="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";
	var B="iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACKklEQVR42s2UT2jUQBTGZ9K02XVTY7dLpVRBRDx4KnpST4IH70UQvHvpTjLJphh3hVw8eBUFBa/SQ69CiyB4q5eKbmYmf1aloBdRQWqr6LptfJPdrVTL2i4qBh5MJu/98s37Zgah//8p840spoPZPwckPIWI/x0wTXEW/QIP2It5w+FTg1TcUc3wMSIskTFA2KJmidtFj08d8pdzvYHTrGFUohOazW8qJnsv5zBhLUTEK0x4gLJgr1E2x1PIeatRdqMw05gECt5O4TdUZmvtd9YaouLeRJVPoktLBnLrhSxgXJoJjwNoDvJb7dxgVXcE2Q6YyrFC2BPdic9A43r1DGtuclaxeF3WYJM3c5TVkJ+qW4GEfxjzksM79XPYiY5CzUpHzNc85ae3AHVXmLvdJHucqNathzbNbgJB9uf+9l2KwbRm2yj+DoBt17DJVvvi+b4CYr5IxiCF5SuEv+xKHvfic7vllarhhW69ZocPUc4Jr2VbRkomPNHd+tiO+0fDcfxDUDMPhwHtd98UQOojmFiX/YTGzg1fiUZ/63AlKWlU3Ic66UELDsSDI+S5ln0cub5kaJTf7fxpQ7FElKtwb7SWTPwMKtZeHByy+VXIaWwu1QlvHfO5/otbe734IjgVgNJPWbIp1kF9rFIxr5piHtQ3OrtCXnlrkPus6MXney7F8IIR1WSnVFtUVUssDFh8GZeDj3CuV6SBmi0WVCu8rNLgJKJP9/31+/o7zxlZ/ybqhuIAAAAASUVORK5CYII=";
	var G="iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAADcUlEQVR42mNgQAPGaf9ZfWsfmZqkn5skH7T7tJjbmiOizks3izkt3iDmumKvhOfW69KBRx/JhV84KRd+pVMq9LyrpM9+EQaG/4zoZjEkdb7mDWx7bO+Qd36JXsyea1KuC2YLWE4MFDZu05AybZEVMuzREnWYFyLhtnq+lO+eWzKBJ39IBZy8J+6xsZnXulMdaATC0MiZT0XC2u8X2uccuqrqNXeNkFGZBQMeIGizwFrUbe0aUZdVnwTNu9/wG1ZlAL3HCpYM7XjHH9LztMwuc/9jJZfeZfy6mUoMhAGjkPV8C0GLju3cWlntXPJBkmDR2O4X3NGTX/t5Vl16rOQ28QyvWpINUJiJCAMZuM0niAsYtzryKGeIwQWLlrzzSZ3+7JBR9LqffNrZjQwMDhwMRIN6JobQVcwoQqWL3myN67rzV8q+7x6XQlgAA6WgYNbLNx7Fp/8LGtccZ5UPMqLYwOTeJ79ME/b95zco38euFKBGsYHuZff+qYVsBxpYBTQwjnIDNROu/5X23f6fz7j5OJdmGuVelo+48k3Cd+9/AfO+O7x65b4UGygTfvmhpP+R/0J2s7/zGzeXA5MNCzH6fGseKIbWv1KJ6XulElr/WEUr5piKotdaeQaZ4HNzJP1P/hN1Wf1f2HrSTmHLNg28Dog6bWacdumgYdKJ7+6lV7/lz3j5K6ju3n95n7XfRW2nhjBI+h3zkAo49lTcc8d/EYcF34Vtp+cwqExix27cfyYZn73SfJarhBi06tk8Kx9quVc82KsVsfu/oEndOQaVXD4Gfu8tgpK+e6okvHd9FXVb/1/EaclNUYfFHiglBw4Q2/9M06f6wR7VoI3/+fRKjzOoJ/GCJQS8tsqLe2xaKe6+4aeY67r/oq5rzoi7rPNnYEDLVuiZYvYzzYi2R3s0Qzf/59NHMhCUJ8UcV+iLOi1eLuq09AvQwP/inltui/vsbxYOPK6Jy7Wxnc80XYuv7lHwmPefRzPtOIOIHy9KRuc0nSorYDWpWNB68j0huzn/RFxXfxbz2nVewu/IHJmgk8kyIecd5EJPGCtHX7HWTLgcqxN9ZJG858Kn/LoF1zgUQ1oZFLAVLMDAZlCpFOU1qI7nM2xYzm/adkPQsv+dsM30z2KO816IOy++IOmydL2M2+IuGacZMUKG9VoMCgkCMMMA2Nk9lh0XyHIAAAAASUVORK5CYII=";
	var Gmaker="iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAADY0lEQVR42mNgQAMzGRhY74YHmV5ycpy030D39DoVpSPLlOQ2L1aW27BKRX7vdnXF68e11R9d1tc+eUVPs/O8pqrrJkleEaBWRnSzGG74+fE+j020v+TnvWS/rcW1hWrKsyfKSAbWC/NqVEtJybYJ8WjNU5QLWauqMH+fpsqtUzqqP05rqd7brCrf3CkipY5i6NO0YpEnqRmFR/38rs7T115TJC5kwYAHzJEStN6gorhmjYrCpx4ZiTcVEiIZQGFWsOTdUBf+1xl5ZYe8vR/362ouS+TnV2IgDBhni/NZdMnKbM8RFW0P4uKSBItedHPj/pRT5Hc9KubxJF2tM5GCHDZAYSYiDGRo5eYWb5QQcIzl4RGDC35t7vR5V1Z7aKOd7c9sMaFGBQYGDgbiAchiZhSRDy0dWx/m5v2dqKZ4L1iAN4CBUvC6tvbNhfDQ/3XS4sfDubiMKDbwWX7ur0PO9v8rJUT3efGKqFFs4MPQgH+7TQ3/V0mI7Avn5aXcwFuWJn/36Gj8b5ESO57GL0K5l68Zan87pKX2v19G/E6JiKAvxQZe19N6eFJb7f88eZnvzRKi5UAhFmL03Qj1VXwc6qfyKjlZ5U5oqMp+Iy2VJYqS8gznddTmnNFU+rdeVeH/ZDnpnfWSwhr4DDqtpW921cn24CkHu+/XQ4O/va2p/vUoMeb/eh3N71Pl5EIYDqvLeJzSUnu6R13p/0JF2e/T5aVyPBkY2HEl5M1qatJz+PiEtBgY2G77+2s9Cg3au9/K9H+9tOQ5oD4+hqX8/IL7NFSq9qorfd2ipvh/maLszcUKMh5YiyP0JJeVpfkoOnzPVhPD/2ViwsetGRh4wRJbJSXlN6sprtykrvRzE9Dr65XlzqxWkPLHyFboBpbVaD5JS9uz3cLkf5m4GMJAkFcWSwvoL1WSW75MSfbLRlXF/9vVlG8fVFdsPqgqr4nLtQ+SYzVvBPvvWaSr9T9DRAjFQLChvUJCslNkpYunycnemy8v82+disLnPaqK549pqsw5qaOSfF5Hw+GEhobxeQN162vmJrFHLE0WLdXVfFogIXIthJ+/1QFbwQIK7EQGBtFqUeH4OnGh5Z1SEjcmyEq9myEv+XmBkvyLJaoKF5aqKaxfrKncNU1dLqZSQkgrgYFBAGYYACs2IiM3WQVuAAAAAElFTkSuQmCC";
	var H="iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAGoSURBVHjarJTNi45xFIafHSnkzhglf4Bi6Q+4JJamLMiCsFCSlGiythzlmqQk60kYpeQrGytlwWyU0aR8DTXJYErj47E5U2++3pm3Wfx6zu/Uuc557vs8T9O2bbOYpwn2etYFh4Mfgw+DO4M9A5cHzwZ/BF8HPwUngzt6gS0LDtZk14IDwZngg+DGXoBHg5+DbXAieDd4KbgheG8hoNXBg8EXwfHgo4K+D54LjgTbhQD3lV5t8GJwc/BW3b/Xc3i+mm0rRyer8Glwe7A/eCJ4Jngg2NcNtqZe523wZXCqgG3wSTVqgkvmaroBh4JfglcK2AbvBG9X/Di4orOmG3CiTDgSvF/CD9TUY8HTwZW/AzcFdwWXVnJ9cH9wT/BZ8FVpNxrcWoaMF/iPIZrg9eBs8HCwL3ihQ6cPHfFI8EbF58usvwJvBn8WdKhW4HlwugM2XVq+K1j/v2RqgmuDVzt26WtwS/Bk8E3lxoKnavf+q/tcsKo0mi3w3sofr1WZqSbNfIFNuTUa/FZTHav8YPBQNV0QcA56ub7PqeDuzqWdF3DR/9iLDfw1AO8XTElqsIxPAAAAAElFTkSuQmCC";
	var I="iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACD0lEQVR42mOobmy6XFpdt4YBAhjLa5u0y2vqdpRUVn8qrqz+XVRR9bG4qvp4YW2tLkhBXnm5XFlN7dqOjg5+qB6G+vo2NaCeM5V1jYsYKmrrPwA1fQAZFhoaylxZ37igoLzyX1l13d2y6trZpdW1iwsrqt4VVFROBKkB4cLyyj9AQ3eC1MPESqpqzpdU1Z5gKEcysKmpzRyo+F91Q8tsh/p6FpjiiooKwdbubm9kA4H4f1Vd/Y60tDRWFAORXVjf2roYpBioiGvukQi/Cfsc1vXutdsx9aBX5+4z5fzIBhaUVfwD4bKa+rUgQ7EaWNvUchbI/lVYWMg5bb+nRe9e2x89e63+g/Ee2w8zDwebwwwEqvvS2NreAfJReW3DSqCBlzAMrGporgcpmDB7gjiI37XVQWLSfvecvj22sybt9eht3uakjOTlzxBftU0C6QGa8Q/DwJaWFmlQ2IBsr+9tU4N5sbiyqrWkqvpfbGwJN7qBIFxZ3zAVpA9sYGVdwwuYgWBvt7cbQjRUgQz+CMX/QRpwGQg2tK5xCtDbJxgSEuo5gGEmhCwZGlrIuXzVWu+iipq2koqapuUbNtgmJCRwwOTTiotFsrOzhZH1gL3f3u3EwKAS9A8dM6oG/+uZs/EfNvD9yYt/J7S8/u1lUMWKIQaqBv9Hx75pbf+B+rHiy+EF//cyqGHBowaOGjhMDQQAxjUuD9cvc/cAAAAASUVORK5CYII=";
	var S="iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACoUlEQVR42n2U3UsUURTA70MQrEqZlpa7rRpZJoVvQRhBQRD0N9RTr0EvkWUQ6kMoRi74oH0tKbSWGhppm7YLG6aGhYKE+IkvJWm6tTvfd87pzszO1+7ohR87e865Pw53zlwi954F6ZnfBZ1oAAQKqqp2xOPxPSSz2HP+1lbyNSLLfm8z6p+6IXKkBqQXZZgN/FvDzKo1hdFoNC+Z/DujBaWxa3b9cxui9J8CuecIZqOM39RtrMsnpnBhYfmqFgNhw67tdkPoYDUovYdRJ+IG+HVdyvN8IBQa3ru5+WdU+09nmnJqTYg6fALowCGk/U5KdNTFTrPL+7OzcxeN7n5beRPFAVFHjwN9V4yevPcjKClNuLG9nRzU5StdSIeKPTioQyBRCeqHA7gT8LPPfDmG/GOZkRvxhkDsGKijhQif9nszeY6ZVEO43u9dM2bDzrAK6CBrN1qImCjwJjluSKdO7lyTgShvq0Fmb1hDGSpC+OJDnMhi8QbiVjQ37gGRX9WA/JLNkAUbl6kS1o3P5msRk153x6byM/hcECl8GsQuPzpRVkdQ6g4gJPJyNlj86mC/BblCsfMMCKGj6ISuxlAM17HnAAodfpTCpeyM99kbp0vZdKe9hUJbFfAtQXRCl2NMmsDsON8aQP6xH+XPt9kI8ShH2DAPFLkg/IMgcI1BdEIXY8YnF6rD7Bz3sBpBSiHIAnLNFcg1BV0Qrj4I6bvlqHPPQJk3hPJ0rxXjMghvbhkzqQkbKq24TkM5kvQdJqxnmxyYQm1xjy7ZucZadmEkDaHEsyYqMHuvp5BurFhC+VufFRejrfZnKKZzZDsKQUwZZygIot5l+xXkWi+wrgRkIW5XodB+GbiW857CubkfA+ymUZX5OMqTPfpVuLS00ryb8D9MrIoyVrUluQAAAABJRU5ErkJggg==";
	var M="iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABwElEQVR42sWU3yuDYRTH93e4dePelfZuGCYlUkpzQykuXOzCH+BOvMYQwpSISImU5kYuvM9es81Yq6Vsq5HRbLEZ2vvjeJ6jEVPTvOXU6T3fnvd8nvP8OrrhI87KC4bnUWJQ/+A5XuCcQ4dVFTqeMJgRtHCecNu69xm0AbJKNQYaoQRgNcy4W2HR1wlznnYYd9X9DRi824cXKQOqqoIkv0IyewVTx82lASdEM8iKBMxecmkayxiHEgelAafEZqyMwZgOJ0UE3qRDuBU/Asdd9WB3mT+0jZiobqTfWqyQAZkH4nsUnEHg9WOgsMLZkzZIZKOQt4fnOIRTIk1WUMtKDvcvmb2G7xZJuQuB/psdKGaS8goLHgsEb524b8wvk4ROEoMxl+krMPZwhkmJpygOsJ+Yrfj7YDM4gLGiyrB02vW7e3j1mAdGcCCRjaB2eC2wdt7/CfR3/xMwmvLQBAXu6ZJtpAbimQvU6wErrJz1YizRg1n298Ck2FQcOO1uAYfPAvPeDgSyU2eaPS92x1jM3C42wBgxafmWizeHnLbtS+B2NWuwArdFO3Zl+QjRr44IhgydQSrFKeiJJ/qNQUFf9gYjjGNzJlUowwAAAABJRU5ErkJggg==";
	var Mappy="iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAABRtJREFUeNoszNtvW3cBwPHvOed3fG52fI0TO4mTtM7FNNvadG3XrgxVgqFRDSHQJgaTeJxSaRLSntAGVDwhniYe0ICBigYvbEWbxLh0CASjaFHLsiVdG9NLWOwkduz4Fl+Oj8/x4YXPH/CR4BUfPAxjhPFUhpmZOZbPpNGSm/x17SPu7eyB7ALAUJBOxLkQ8bl47dcc9TpYkQhmJIIWCiGpKhK84kuSj2VFmDlyhOi8z42d66QzbZ56YoaTuTSjkSCuL1Ft9Lh1t8y1f25Tuq+xoldY6WwSNXXUYBCEQIKXfVUNMDWbgqk2FWmdly8tcfHxh9jp3CNf2aDc3eeEZaDrOlboOMFAih+9c4U/v53k9CDBbyJbxPwBriQhSdL3/LHxGKGlIW74Dr/84VPYygFX139GqV1AlhV8BCltyMpkkSs7MfbcNEJvo3enqb8/jl6d5DV2kXodZCEEM6dMdv1/8+oPHgU3z+qt77LTPcAKjGAIC0toFJ0gG+0EXxwd0hg4YGs8nXJZea7Gv9odXgvmcD0PafnML/x1/w6f/9bfycw61FotXsg0+LQX4Op+DEMZogA+cDzU4cxImztdDUNKE5SyqKpCaXfIS69OciPXQRZJj+UTmyQyFeqdQ4aKyo2WSdbs8VyqSjIwIKIOGNMcPOD1vQRfiNuowxwd10LxBjy20OT8Q3V+2h5FOUycuvzi197HCXiUuyaPGH0OhjL5rsGzkRZJy2ava5AVLnHThoGG4Y2wnCjSHyjEtRojosHC2D5v3YwiNKvJm7ePYjWC3D802dX69M0+T5/a5Jk/nOVkosHNUgJJ9hDxJvZBkk9UwaOLJUr1MI/lqvx2Y4InT9zlwJaRTculbqtceOQun5veJbj0ANHT2N/M4BgOb63NYXgS3//GNQr5LLIT4dvPrnL99iRb+zFAodExsLQOx2fLKLFj5y4H4zXaso/uqNRMB9G0KO+O4hh9vK5O29Zo74dIjCgctlXu3gszlXI4OVvkL6ujbFdNnjm7xn7VRPQODY7NFfEsm8Vgl8hQYXx2lz1XYWMnyeRcgc3VOdozGpeW8lx5J8XzF/IsZhqoQuHsfJEf/26JcjPMG/94GNl3grRaJgHT5o4n80Sixmy8RQGZ6NQ+RrrCiSf/w5lslL4S5tJXt7DGJygPFmn0x5lN1vjJytvYA4Ft64hc+jOEa9c4e/KQescgrHjISOR0G10e4uExEfUYU3ZYsD5hb5BlOBTooo0p6sj+IdFoj6sfzPDZmEDMx5f5/WqOULaONtrkg2aIlOZQsDVUxSGhTKCIBcJ6nt5wBEPqEAqUEJKPLjcJG13WtyZ48/oir8ceIIr3A5yaPo1RWGN+qsJ4wGFM8Vi0umiyRCagEhafMmlsU+lnGGIx9F1MpUBQbaAFfF76+Tm+Mqpj3V5DSadfvNysJPi4oLH6QGV0oURUd3i3EiIo59DJktRKSJKKi0VC28OQm0StFq4n851fnUd0knx960PcThvRbHapVgeoxjlatsQf3xBMP/83xq0oR80UQalJ2ihRcrJY6gAtoBHXy9z6b5j31qa49fEiLxzkcatlHNdFys6t+/Van2bTxQh6RBbzHOobHMnanH9Y4kvH1okZPRrOOIrbpljy+NPNBO/enOfLVo9vNj+ERo1Ov09/MECanvnIbzYcWi2P4RACAZnccpe500XWtwvoooosAnieTNuWkeUQj0+YXNx8j+naNj3XpTsY0P1/+L8BAKABKMjDSF5qAAAAAElFTkSuQmCC";
	var O="iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAFOElEQVR42qWUe0yTVxjGvy1mZi6KwEzMsotBtsHiBYczwkBRUS7jVgW5WS4ySimFcQeLWkRxICBCbQUGTpSbcisWHEihFkEjQkAFlVpaoAJjqIRZLjrbZ6c68a/tn53k5PtOvny/PO/7PO+hvIKdu1N4kb3enjtKPl+10p+iKGuTdUYH6Cy3pji+91P+Zc48NytctW79mpuenp5/0Ol0jY+Pj8bX1/e5nd2uic3WGyZM1qy2pN4uX4ZraddonfZuf4mmU1k1Xd3GH22TlUzVy3I1FwYS0D/TgNjkELDD2XCmOYIe4gnuySgERXjDhZxjYqO1a9evrVgAGn39GfPmULX68UgNRoeroXgpxeB8K2pGjiKnxw8xaYEEFobgyAA0dgpRJs1D4Y1ElLZmoPRqNsITA8AKY8LMzOw0wX2gY371qyh9RKVtx/jtQgz91YahV22QTuQjReyOmPhI2Ltb4YayGr2POiEbu4OO/npUXxeghuybyirEcIPB5XJnjY2NLXTAFQmpzIeK580Y7iqCkgAfTDeh61k5PKK3wNOfBkbeNqSKfVDWkY2G7goUS0+iopUorctB91gdzlQeg42NjdrW1lZALVm6xKVSyh97PFQF1YtrkM+2oOd3EXqf1MHZ1QlBB13BzN8BzpUiJNYEQiCNRmaHP0S3CnDuigCD5J9DWex5U1PTAhqNJqe+t93I61TVzo3KL0GluQ7ly2tEYSPqFUUgjmI/xw3BZ9wRyOslzxxEFNsjryMaFyU8lDbz0dJ3AR4Bjh0EmO3l5fWMikkJuts9KsTQs9+gkuRCOdkAmboJbZO/YK+3O4J/YoORk4FMoRCxxV0oa89FXnvs6x4WXubr+qj1ZTgfMzc3LyTA+1T2uaShe08aoHghgc5pxf0SPJptIm5LcDgjEkEMJgqEWegerwe/MRP1pM8XJQIUiQQoa+ahue+8ZvWXn8YT2FNSchYVEud1pX+qSSubEWOYuNyrrMQjWTnuj9WjXVaFQ4eT4OJhh+a753Gu/gTyKo/iYutpFNWl49T5gygX5+C7zRtUqamp08TlbymzTWs4Lf2X5nVRUc1JoLhXjFu9Vbh08gQOJieAGRqC2LhYMCJ9kJHJRgI3ED/nJ+AoLwpZZzlgRHnDz98PRkZGR0hiFlGLFlGWJVcLxmUzUihIoPsnhTieuAMsB0N4OG1CVmYGwtihYLEY8NjrhsA9DohKCsGP4XTsIWd2BAuOrtv/JLDFb4fFICLJ/0HflBQ9k1IcS9wKR8uPsXurIej2K+DmYIn8qnR0N2bjSHY0nGh2IHmDvdNOHDoRjlskbrXtAi3h2LwFmvPLuUN9EzU4zrGGi5UhgRlg3y59BDvpIWC3MRQkBSMTIgyoWyGbacEAGYLBOd27GLLZVhQJ014Rzievaes2miSTWZ5O41jB0cIQtC2Gr2EMp+UIp+nh5zQvKEkCxsWnIJ9rwwgZUZmaGEgyO0z6rtuc9NDehcvBze4LSXzoBs0bZf/AnPXAdNEDN3onbnecxZ2HtRisO0VC/2bO5USdbgB0sMH5a2DF7+O9u7526s//YPmuTAYpM4IoO0Bg8tpUzQ15xexDdfOLgedirW4sdSD5XAsBX9eVr+2ZEM257bP3XgB6bdefXFBGyiTKtFvMlt9z97Xle2409Vu69EMLk/XGuwLCaHHRyftFaQXxUym5UWPEyCr/MFrEKuOVWwlm2QKQbqfHJDC1ThnbTU/ram1QSf33eo/s9//1q4MxtXi31Ud0j236KkdLg7MW3ywzoP7H+ht4j2NuiHPLtwAAAABJRU5ErkJggg==";
	var V="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";
	var Y="iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABkUlEQVR42mNgGAqAkaqmhWvnTw1WydYOV83SjFTL0fDXyNENUsk2CtXIMw5QLTAAyQUoFAgQbWCYRl58uHbB4wjtgm9A/C9Sp/A/CIdr5r0G4kNhmvnrQtXybMhxLHO4Vv5kmIER2oU/0V3mp56vDlRzBmjxaSB9MEI7fyfQMdsitAq2hGvmrw/XzO1CMTGUIZQZKHkI7kqtgrPo8oHAoAnVyC0CqnuL8E3BjSC1vNhAjWxhDGc6MDiwhGnlv4EpDlbLy0ZX46+cJQt05Y8InYK3wUrpqgT97sOQxhWhlf8abKh2wd9Q9TwPmFyAWoYZ0LDvQC/PAFlOdIAGqRQYgcIR7CXtgjehKomiYZp5ZUCv/g3TLMgmL0mp55ciwjP/E9CwPyFauekUpVOg907ADdXOX06FhF+4BmYg0KudFBsIDMfVcAPV88spNjASyYXAmF9EliEh6nlN4eBckHchQqfwNyL3FHyK0Mm/DswhV8M08nuIDzfFHP1glVxDcKGhUaQWrJmnio4DxTPEGEYBCAAA4w6xDi4uUXUAAAAASUVORK5CYII=";
	var oamtc="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";
	var ch="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";
	var mapy="iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACGUlEQVR42qWUzUtUURjGHxMqMZ1xPu65gxsxMMFN+LGQaCm0KGjRPxBBW1cuSiFQW7Qo2kgRgnvRhdQqKDKkYBjKuffcMT9IRCkhCBULtGx87sy93nfGK6lz4HK457zn9z7vxzmAGA7MNg3T4bzHeVlD3cgDVahkEJZ2kMoXP/O7hXhrRUCqmhHAfxrJ4aNsP6A+ZkO9ciMZB6qPAJrvAmAB+jsL1IbbGnddp7TbsWGMhUJpMF0KTOWp4Em53Regjs5zwvG2RrwrDPjxMND8ytBN34aFOhPm2IJxMyyH8+WGPPyHwFvC5qkXar4s39dKYPRc7UDtFg0UW8fIBAfVzDJwnv/PDjssfDsOkldLgBYiHSJva2lEmhnuN7H2xlUrVO2JtGxlkWgvr9qgOPzSbWrOo+EpUG8dGM8F8AeBl2S4VewpOzikHrvrs6hrCUn+yCpQo5EaCICptXnEGw+As/zJwdzwE0z4HVGE1976eg6q17+OXOsXqpc+Ixo9ALIxe4qJLcj/SxXd/h4Nm1jBgQwiF+XdZhT3Rchzi8A52S5DfkWpbjMDRP53TSmiTwDtB+xPeeV0sJl8eJx7byF5WwAt4SnWIzY25oD4cYCfkOgUOUwXFrO4YNgw3wdAY+Jkz51a8NL0wlOn7rHkP31gDonrJwFaiHUzqnWN6GX/MVjxQv1FdZOneUNLni0qnCLokUbDFQ2cRYVjH1W5ZmAPlQ5jAAAAAElFTkSuQmCC";
	var Maplink="iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACoUlEQVR42n2U3UsUURTA70MQrEqZlpa7rRpZJoVvQRhBQRD0N9RTr0EvkWUQ6kMoRi74oH0tKbSWGhppm7YLG6aGhYKE+IkvJWm6tTvfd87pzszO1+7ohR87e865Pw53zlwi954F6ZnfBZ1oAAQKqqp2xOPxPSSz2HP+1lbyNSLLfm8z6p+6IXKkBqQXZZgN/FvDzKo1hdFoNC+Z/DujBaWxa3b9cxui9J8CuecIZqOM39RtrMsnpnBhYfmqFgNhw67tdkPoYDUovYdRJ+IG+HVdyvN8IBQa3ru5+WdU+09nmnJqTYg6fALowCGk/U5KdNTFTrPL+7OzcxeN7n5beRPFAVFHjwN9V4yevPcjKClNuLG9nRzU5StdSIeKPTioQyBRCeqHA7gT8LPPfDmG/GOZkRvxhkDsGKijhQif9nszeY6ZVEO43u9dM2bDzrAK6CBrN1qImCjwJjluSKdO7lyTgShvq0Fmb1hDGSpC+OJDnMhi8QbiVjQ37gGRX9WA/JLNkAUbl6kS1o3P5msRk153x6byM/hcECl8GsQuPzpRVkdQ6g4gJPJyNlj86mC/BblCsfMMCKGj6ISuxlAM17HnAAodfpTCpeyM99kbp0vZdKe9hUJbFfAtQXRCl2NMmsDsON8aQP6xH+XPt9kI8ShH2DAPFLkg/IMgcI1BdEIXY8YnF6rD7Bz3sBpBSiHIAnLNFcg1BV0Qrj4I6bvlqHPPQJk3hPJ0rxXjMghvbhkzqQkbKq24TkM5kvQdJqxnmxyYQm1xjy7ZucZadmEkDaHEsyYqMHuvp5BurFhC+VufFRejrfZnKKZzZDsKQUwZZygIot5l+xXkWi+wrgRkIW5XodB+GbiW857CubkfA+ymUZX5OMqTPfpVuLS00ryb8D9MrIoyVrUluQAAAABJRU5ErkJggg==";
	var wikimapia="iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAADe0lEQVR42p1UaUwTQRSednss3bIL7e62UCyCeIWAGknxhzeoBasYFGniDxBNCCEFNQYNUYj+sBrjkWiUqL/45xVjvKNovLg8QOOJJBIwEAEFvLC22+cbNAbPFF/yJTPfvPnem3lvhpDfTTUabWlm5trKvLzaUx5P18mCgtakqKip5D/Nmp+ff6jG6/2iFBWBkpwMgbg4mKrRbBi5ktXq2FdR8SHodkMgJga6ZRmaRHGwURS7JzHMyhGJybI86WxVFShJSdBvscAhnn8dQcg6XIpEaEaaHF9RUtJHj9cjScFxhJxCTodBLDZZPpCbldVus1hcoYqZ3W73BsXjgbeSBMkq1Q1aGJvNtqfj6FF/IDUVFLsdUjSaspDUXE5nZlVx8dsvo0bBGUHoQyqM4zhvf3m5MojcawzShQi5KHlz5ux/s3EjdJvNMF6trkbK+OjYMd8gZtUhij8wJVTBTYsX3wrMnAl3IiMBp7MkkynHP3dusAMDvByGKWp1aII75s1r8iUkQI0gKLTYkQbDPiU+HlpNJngxDFt5/ok3Pf2C1+kcwrYFC86Hs+x02gXlhYVnt2dkXFySmLiGbHE4aj/FxsJVng/iYryJZSsDNhs8w4yHoxNFaTv1W61D6MWxhDeGe2Z0pqXBO+TKOO40KUxIOPIZM7ojCKAlpETW68d8tNuVxxER8OgfqOf5gEyIxWw2b/OlpMAT5FZotbvJEkla3jx2bPAhCnp0uqcYUV0mim0tOG/+C+7zPGRpNA+o797KyraB6GhoRC6OkOXEHBZm2yxJ91uRuGU0Khwh82mjnxOEzibk7v6ChvBw8LLsK/ThBEHI7cvJUZ5jkC0sO4CcMPS7TNDrXW9EMUidLxuNfuTsdMN8hqmr4TjfbQx0E3HSYPBNVqku4RqLYnFPT5zwD2BL1RuNMPuXLlAv0unOteBCLaKZ5/0mQlYhz9BGx3EMBRWiHD7J9e3V1f7P+HnUof8yhmn9vvaTGVfqdA330AGPDi14vEsWS7fLar2m1+t34uvZle1y3bxeWtr73uGATiwC9Vut1b5Dpdi/tSWXwTDH6wyG4HWOgwYEFe7BTPqxlXrxCdJ5PfI1BgMsZJjasG+Z/9NUUViYAoa5cpBlA3TjVRSguILjwywbzMMKTyQkF321I/3W4rHXsqdhf6YSUhpNiBu5xO93+0f7CoOggrj4u4WkAAAAAElFTkSuQmCC";

	var WMELB_Permalinks = {
		lm: 					['Waze live map',				'WMELB_LivemapPermalink',					Live],
		lmbeta: 				['Waze beta/prod editor',		'WMELB_BetaPermalink',						Livebeta],
        bing: 					['Bing maps',					'WMELB_BingPermalink',						B],
		google: 				['Google maps',					'WMELB_GooglePermalink',					G],
        googlemapmaker:         ['Google maps maker',			'WMELB_GoogleMapMakerPermalink',        	Gmaker],
		osm: 					['Open Street Map',				'WMELB_OSMPermalink',						O],
		geoportail: 	    	['Geoportail (IGN France)', 	'WMELB_IGNPermalink',						I],
		geospot2015: 	    	['Geoportail (SPOT2015)',	    'WMELB_IGNSPOT2015Permalink',			    S],
		mapquest: 		    	['Mapquest',					'WMELB_MapquestPermalink',			    	M],
		viamichelin: 		    ['ViaMichelin',					'WMELB_VMPermalink',						V],
		yahoo: 					['Yahoo maps',					'WMELB_YahooPermalink',						Y],
		wikimapia: 		    	['Wikimapia',					'WMELB_WikimapiaPermalink',			    	wikimapia],
		herecom: 				['Here',						'WMELB_HerePermalink',						H],
		mappy: 					['Mappy (France)',				'WMELB_MappyPermalink',						Mappy],
		oamtc: 					['ÖAMTC maps (Austria)',		'WMELB_OAMTCPermalink',						oamtc],
		geoadmin: 		    	['Geo Admin (Swiss)',			'WMELB_GeoAdminPermalink',				    ch],
		mapy: 					['Mapy (Cz)',					'WMELB_MapyPermalink',						mapy],
		maplink: 				['Maplink (Brazil)',			'WMELB_MaplinkPermalink',					Maplink]
	};

	
	function WMELB_Permalink_Register_Links()
	{
		DebugLog("WMELB_Permalink_Register_Links",2);
			if (getId('WMELB_LivemapPermalink')!==null){
				getId('WMELB_LivemapPermalink').onclick=function(){
					var e = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var t = WMELB_getQueryString(e, 'lon');
				  var n = WMELB_getQueryString(e, 'lat');
				  var r = parseInt(WMELB_getQueryString(e, 'zoom'));
				  r += 12;
				  if (r >= 17) r = 17;
				  var i = 'https://www.waze.com/livemap?lon=' + t + '&lat=' + n + '&zoom=' + r;
				  DebugLog(i,2);
				  window.open(i, '_blank');
				};
			}
			if (getId('WMELB_BetaPermalink')!==null){
				getId('WMELB_BetaPermalink').onclick=function(){
				  var e;
				  var t = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var n = t.indexOf('editor-beta.waze.com');
				  if (n == - 1) {
				    e = t.replace('www.waze.com', 'editor-beta.waze.com');
				  } else {
				    e = t.replace('editor-beta.waze.com', 'www.waze.com');
				  }
				  window.open(e);
		  	};
		  }
		  if (getId('WMELB_BingPermalink')!==null){
				getId('WMELB_BingPermalink').onclick=function(){
				  var e = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var t = WMELB_getQueryString(e, 'lon');
				  var n = WMELB_getQueryString(e, 'lat');
				  var r = parseInt(WMELB_getQueryString(e, 'zoom'));
				  r = (r > 6) ? 19 : (r + 12);
				  var i = 'http://www.bing.com/maps/default.aspx?cp=' + n + '~' + t + '&lvl=' + r + '&sty=h';
				  DebugLog(i,2);
				  window.open(i, '_blank');
				};
			}
		  if (getId('WMELB_GooglePermalink')!==null){
				getId('WMELB_GooglePermalink').onclick=function(){
				  var e = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var t = WMELB_getQueryString(e, 'lon');
				  var n = WMELB_getQueryString(e, 'lat');
				  var r = parseInt(WMELB_getQueryString(e, 'zoom'));
				  //r = (r > 6) ? 19 : (r + 12);
				  r = r + 12;
				  var i = 'https://maps.google.fr/maps/@' + n + ',' + t + ','+ r +'z?hl=fr';
				  DebugLog(i,2);
				  window.open(i, '_blank');
				};
			}
		  if (getId('WMELB_GoogleMapMakerPermalink')!==null){
				getId('WMELB_GoogleMapMakerPermalink').onclick=function () {
				  var e = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var t = WMELB_getQueryString(e, 'lon');
				  var n = WMELB_getQueryString(e, 'lat');
				  var r = parseInt(WMELB_getQueryString(e, 'zoom'));
				  r = r + 12;
				  var i = 'https://www.google.com/mapmaker?ll=' + n + ',' + t + '&z=' + r + '&spn=0.00' + r + ',0.00' + r + '&t=h&lyt=large_map_v3';
				  DebugLog(i,2);
				  window.open(i, '_blank');
				};
			}
		  if (getId('WMELB_HerePermalink')!==null){
				getId('WMELB_HerePermalink').onclick=function () {
				  var e = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var t = WMELB_getQueryString(e, 'lon');
				  var n = WMELB_getQueryString(e, 'lat');
				  var r = parseInt(WMELB_getQueryString(e, 'zoom'));
				  r = r > 6 ? 19 : r + 12;
				  var i = 'http://here.com/' + n + ',' + t + ',' + r + ',satellite';
				  window.open(i, '_blank');
				};
			}
		  if (getId('WMELB_IGNPermalink')!==null){
				getId('WMELB_IGNPermalink').onclick=function () {
				  var e = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var t = WMELB_getQueryString(e, 'lon');
				  var n = WMELB_getQueryString(e, 'lat');
				  var r = parseInt(WMELB_getQueryString(e, 'zoom'));
				  switch (r) {
				  case 10:
				    r = 0.000003648865662418647;
				    break;
				  case 9:
				    r = 0.000003648865662418647;
				    break;
				  case 8:
				    r = 0.000003648865662418647;
				    break;
				  case 7:
				    r = 0.000003648865662418647;
				    break;
				  case 6:
				    r = 0.000006454478476155455;
				    break;
				  case 5:
				    r = 0.000011417326973512833;
				    break;
				  case 4:
				    r = 0.00002019610968533674;
				    break;
				  case 3:
				    r = 0.0000625642009137609;
				    break;
				  case 2:
				    r = 0.00011122524606647397;
				    break;
				  case 1:
				    r = 0.00019576383574934658;
				    break;
				  case 0:
				    r = 0.00034628664905454276;
				    break;
				  }
				  var i = 'http://tab.geoportail.fr/?c=' + t + ',' + n + '&z=' + r + '&l0=ORTHOIMAGERY.ORTHOPHOTOS%281%29&l1=ADMINISTRATIVEUNITS.BOUNDARIES%281%29&l2=TRANSPORTNETWORKS.ROADS%281%29&permalink=yes';
				  window.open(i, '_blank');
				};
			}
		  if (getId('WMELB_MappyPermalink')!==null){
				getId('WMELB_MappyPermalink').onclick=function () {
				  var e = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var t = WMELB_getQueryString(e, 'lon');
				  var n = WMELB_getQueryString(e, 'lat');
				  var r = parseInt(WMELB_getQueryString(e, 'zoom'));
				  r = (r > 6) ? 19 : (r + 12);
				  var i = 'http://fr.mappy.com/#/M2/THome/N151.12061,6.11309,' + t + ',' + n + '/Z' + r;
				  window.open(i, '_blank');
		 	  };
			}
		  if (getId('WMELB_MapquestPermalink')!==null){
				getId('WMELB_MapquestPermalink').onclick=function () {
				  var e = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var t = WMELB_getQueryString(e, 'lon');
				  var n = WMELB_getQueryString(e, 'lat');
				  var r = parseInt(WMELB_getQueryString(e, 'zoom'));
				  r = r > 6 ? 19 : r + 12;
				  var i = 'http://www.mapquest.com/?q=' + n + ',' + t + '&zoom=' + r + '&maptype=map';
				  window.open(i, '_blank');
				};
			}
		  if (getId('WMELB_OSMPermalink')!==null){
				getId('WMELB_OSMPermalink').onclick=function () {
				  var e = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var t = WMELB_getQueryString(e, 'lon');
				  var n = WMELB_getQueryString(e, 'lat');
				  var r = parseInt(WMELB_getQueryString(e, 'zoom'));
				  r = r > 6 ? 19 : r + 12;
				  var i = 'http://www.openstreetmap.org/#map=' + r + '/' + n + '/' + t;
				  window.open(i, '_blank');
				};
			}
		  if (getId('WMELB_VMPermalink')!==null){
				getId('WMELB_VMPermalink').onclick=function () {
				  var e = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var t = WMELB_getQueryString(e, 'lon');
				  var n = WMELB_getQueryString(e, 'lat');
				  var r = parseInt(WMELB_getQueryString(e, 'zoom'));
				  r = r > 5 ? 16 : r + 11;
				  var i = 'http://www.viamichelin.com/web/Maps/?zoomLevel=' + r + '&strCoord=' + t + '*' + n;
				  window.open(i, '_blank');
				};
			}
		  if (getId('WMELB_YahooPermalink')!==null){
				getId('WMELB_YahooPermalink').onclick=function () {
				  var e = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var t = WMELB_getQueryString(e, 'lon');
				  var n = WMELB_getQueryString(e, 'lat');
				  var r = parseInt(WMELB_getQueryString(e, 'zoom'));
				  r = r > 6 ? 19 : r + 12;
				  var i = 'http://maps.yahoo.com/#mvt=m&lat=' + n + '&lon=' + t + '&zoom=' + r;
				  window.open(i, '_blank');
				};
			}
		  if (getId('WMELB_WikimapiaPermalink')!==null){
				getId('WMELB_WikimapiaPermalink').onclick=function () {
				  var e = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var t = WMELB_getQueryString(e, 'lon');
				  var n = WMELB_getQueryString(e, 'lat');
				  var r = parseInt(WMELB_getQueryString(e, 'zoom'));
				  r = r > 6 ? 19 : r + 12;
				  var i = 'http://wikimapia.org/#lat=' + n + '&lon=' + t + '&z=' + r;
				  window.open(i, '_blank');
				};
			}
		  if (getId('WMELB_OAMTCPermalink')!==null){
				getId('WMELB_OAMTCPermalink').onclick=function () {
				  var e = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var t = WMELB_getQueryString(e, 'lon');
				  var n = WMELB_getQueryString(e, 'lat');
				  var r = parseInt(WMELB_getQueryString(e, 'zoom'));
				  r = 10 - 2 * r;
				  r = r < 2 ? 1 : r;
				  var i = 'http://www.oeamtc.at/maps/?lat=' + n + '&lon=' + t + '&zoom=' + r;
				  window.open(i, '_blank');
				};
			}
		  if (getId('WMELB_GeoAdminPermalink')!==null){
				getId('WMELB_GeoAdminPermalink').onclick=function () {
				  var e = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var t = WMELB_getQueryString(e, 'lon');
				  var n = WMELB_getQueryString(e, 'lat');
				  var r = parseInt(WMELB_getQueryString(e, 'zoom')) + 5;
				  var i = (n * 3600 - 169028.66) / 10000;
				  var s = (t * 3600 - 26782.5) / 10000;
				  var o = 200147.07 + 308807.95 * i + 3745.25 * s * s + 76.63 * i * i + 119.79 * i * i * i - 194.56 * s * s * i;
				  var u = 600072.37 + 211455.93 * s - 10938.51 * s * i - 0.36 * s * i * i - 44.54 * s * s * s;
				  var a = 'http://map.geo.admin.ch/?Y=' + u.toFixed(0) + '&X=' + o.toFixed(0) + '&zoom=' + r + '&bgLayer=ch.swisstopo.pixelkarte-farbe&time_current=latest&lang=de';
				  window.open(a, '_blank');
			  };
			}
		  if (getId('WMELB_MapyPermalink')!==null){
				getId('WMELB_MapyPermalink').onclick=function () {
				  var e = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var t = WMELB_getQueryString(e, 'lon');
				  var n = WMELB_getQueryString(e, 'lat');
				  var r = parseInt(WMELB_getQueryString(e, 'zoom'));
				  r = r + 10;
				  var i = 'http://mapy.cz/#!x=' + t + '&y=' + n + '&z=' + r;
				  window.open(i, '_blank');
				};
		  }
		  if (getId('WMELB_MaplinkPermalink')!==null){
				getId('WMELB_MaplinkPermalink').onclick=function () {
				  var e = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var t = WMELB_getQueryString(e, 'lon');
				  var n = WMELB_getQueryString(e, 'lat');
				  var r = parseInt(WMELB_getQueryString(e, 'zoom'));
				  r = r > 6 ? 19 : r + 12;
				  var i = 'http://www.maplink.com.br/?loc=' + n + ',' + t + ',' + r;
				  window.open(i, '_blank');
				};
			} 
        
        if (getId('WMELB_IGNSPOT2015Permalink')!==null){
				getId('WMELB_IGNSPOT2015Permalink').onclick=function () {
				  var e = getElementsByClassName('WazeControlPermalink')[0].childNodes[0].href;
				  var t = WMELB_getQueryString(e, 'lon');
				  var n = WMELB_getQueryString(e, 'lat');
				  var r = parseInt(WMELB_getQueryString(e, 'zoom'));
				  switch (r) {
				  case 10:
				    r = 0.000003648865662418647;
				    break;
				  case 9:
				    r = 0.000003648865662418647;
				    break;
				  case 8:
				    r = 0.000003648865662418647;
				    break;
				  case 7:
				    r = 0.000003648865662418647;
				    break;
				  case 6:
				    r = 0.000006454478476155455;
				    break;
				  case 5:
				    r = 0.000011417326973512833;
				    break;
				  case 4:
				    r = 0.00002019610968533674;
				    break;
				  case 3:
				    r = 0.0000625642009137609;
				    break;
				  case 2:
				    r = 0.00011122524606647397;
				    break;
				  case 1:
				    r = 0.00019576383574934658;
				    break;
				  case 0:
				    r = 0.00034628664905454276;
				    break;
				  }
				  var i = 'http://tab.geoportail.fr/?c=' + t + ',' + n + '&z=' + r + '&l=ORTHOIMAGERY.ORTHO-SAT.SPOT.2015::GEOPORTAIL:OGC:WMTS%281%29&permalink=yes';
				DebugLog(i,2); window.open(i, '_blank');
				};
			}
	}
	
    
    //                     http://tab.geoportail.fr/?c=0.54267,49.51697&z=18&l=ORTHOIMAGERY.ORTHO-SAT.SPOT.2015::GEOPORTAIL:OGC:WMTS%281%29&permalink=yes
	
	function WMELB_ToolBar_Permalink_Obj(WMELB_NavBar,e)
	{ WMELB_NavBar.innerHTML += '<img class="WMEBLstandardMouseCursor" width="5" height="20" src="data:image/png;base64,' + sep + '">';
		for (var t in WMELB_Permalinks) {
		  if (e == t) {
		    var n = WMELB_Permalinks[t][0];
		    var r = WMELB_Permalinks[t][1];
		    var i = WMELB_Permalinks[t][2];
		    WMELB_NavBar.innerHTML += '<img id="' + r + '" class="WMELBtooltip"  style="cursor: pointer;" title="Permalink to ' + n + '" width="20" height="20" src="data:image/png;base64,' + i + '">';
		  }
		}
		return;
	}

	function init_WMELB_ToolBar()
	{ DebugLog("init_WMELB_ToolBar",1);
		var Map = getId('map');
		var inputWrapper = getElementsByClassName('input-wrapper');
		var e = document.createElement('div');
		e.id = 'WMELB_NavBar';
		e.style.position = 'fixed';
		e.style.visibility = 'hidden';
		e.style.zIndex = 1000;
		e.style.fontSize='xx-small';
		e.style.lineHeight='14px';
		e.style.borderRadius='2px';
		e.style.color='#111111';
		e.style.backgroundColor='#cccccc';
		e.style.margin='1px';
		e.style.border='none';
		e.style.borderColor='black';
		e.style.borderWdth='1px';
		e.style.padding='2px';
		e.style.textAlign='center';
		e.style.opacity='0.8';
		e.style.height='22px';
		/*e.style.left='690px';
		e.style.top='60px';
		//e.style.left=getId('sidebar').width + 60 + 'px';
		//e.style.left=(getId('sidebar').width + inputWrapper[0].clientWidth + 60) + 'px';
		//e.style.top= window.Waze.map.getHeight() - e.style.left - 10 + 'px';
		if (localStorage.WME_Toolbox_Options){
			var tmp=JSON.parse(localStorage.WME_Toolbox_Options);
			//DebugLog(tmp.NavBarLeft);
			//DebugLog(tmp.NavBarTop);
			e.style.left=tmp.NavBarLeft +'px';
			e.style.top=tmp.NavBarTop + 22 + Adjust + 'px';
		}*/
		e.draggable='true';
		/*e.draggable({
		  cursor: 'move',
		  containment: 'Map',
		  delay: 100,
		  distance: 10,
		  scroll: false
		});
		*/
		//getId('wazeMap').append(e);
		Map.appendChild(e);
		DebugLog("init_WMELB_ToolBar ok",1);
	}

	function refresh_WMELB_ToolBar(){
		DebugLog("refresh_WMELB_ToolBar",1);
		var WMELB_NavBar=getId('WMELB_NavBar');
		WMELB_NavBar.innerHTML = '<span id="WMELB_NavBarSpan"><font size=2>&nbsp;Linkbar ';
		WMELB_NavBar.innerHTML += '<img class="WMEBLstandardMouseCursor" width="5" height="20" src="data:image/png;base64,' + sep + '">';
		WMELB_NavBar.innerHTML += '<img id="WMEBL_ConfigurationPanel" class="WMELBtooltip" title="Linkbar configuration panel" width="20" height="20" src="data:image/png;base64,' + menuicon + '">';
		for (var k in WMELB_Permalinks) {
		  if (WMELB_ToSave.extpermalink.indexOf(k) >= 0) {
				WMELB_ToolBar_Permalink_Obj(WMELB_NavBar,k);
			}
		}
		WMELB_Permalink_Register_Links();
		getId('WMEBL_ConfigurationPanel').style.cursor='pointer';
		getId('WMEBL_ConfigurationPanel').onclick=function(){
				Aff_ConfigurationPanel();
			};
		
		WMELB_NavBar.style.cursor = 'move';
		WMELB_NavBar.style.visibility = 'visible';

		DebugLog("refresh_WMELB_ToolBar Ok",1);

	}

		
	function WMELB_Save_All()
	{   if (WMELB_SaveOnExit) {
		    DebugLog("saving options",2);
		  	WMELB_ToSave.NavBarLeft = getId('WMELB_NavBar').style.left;
		    WMELB_ToSave.NavBarTop = getId('WMELB_NavBar').style.top;
		    localStorage.WME_Linkbar_Options = JSON.stringify(WMELB_ToSave);
		  }
	}

	function Aff_ConfigurationPanel()
	{ DebugLog("Aff_ConfigurationPanel",1);
		WMELB_cfgdialog=getId('WMELB_cfgdialog');
		AdjustPosition();
		WMELB_cfgdialog.style.top=  (window.innerHeight - 500) / 2 + Adjust + 'px';//'0px';
    WMELB_cfgdialog.style.left= (window.innerWidth - 500) / 2 + 'px'; //'0px';
    DebugLog("window.innerHeight= " + window.innerHeight + ";window.innerWidth= " + window.innerWidth,2);
		WMELB_cfgdialog.style.display= 'block';
	}
	
	function init_WMELB_cfgdialog(){
		var Map = getId('map');
    var WMELB_cfgdialog = document.createElement('div');
    WMELB_cfgdialog.id = 'WMELB_cfgdialog';
    WMELB_cfgdialog.style.fontSize = '70.5%';
    WMELB_cfgdialog.style.display= 'none';
    WMELB_cfgdialog.style.width='500px';
    WMELB_cfgdialog.style.height='500px';
    WMELB_cfgdialog.style.position= 'absolute';
    WMELB_cfgdialog.style.padding= '.2em';
    WMELB_cfgdialog.style.overflow= 'auto';
    WMELB_cfgdialog.style.background= 'rgba(255, 255, 255, 0.75)';

    WMELB_cfgdialog.innerHTML = '<br>Linkbar - Configuration panel<br>';
    WMELB_cfgdialog.innerHTML+='<br>External permalinks to display in toolbar:<br>';
    for (var t in WMELB_Permalinks) {
      var n = false;
      if (WMELB_ToSave.extpermalink.indexOf(t) >= 0) {
        n = true;
      }
      var r = WMELB_Permalinks[t][0];
      var i = WMELB_Permalinks[t][2];
      WMELB_cfgdialog.innerHTML+='&nbsp&nbsp<input id="choosepermalink['+t+']" type="checkbox" ' + (n ? 'checked ' : '') + 'value="' + t + '" />&nbsp&nbsp<img width="20" height="20" src="data:image/png;base64,' + i + '">&nbsp&nbsp' + r + '<br>';
    }
    
    WMELB_cfgdialog.innerHTML+='<button id="OkButton">Ok</button>';
    
		document.body.appendChild(WMELB_cfgdialog);
		
		getId('OkButton').onclick = function () {
  		getId('WMELB_cfgdialog').style.display= 'none';
  		WMELB_ToSave.extpermalink.length = 0;
	  	for (var t in WMELB_Permalinks) {
    		var perma = getId('choosepermalink['+t+']');
    		if (perma.checked){
	  			WMELB_ToSave.extpermalink.push(perma.value);
	  		}
	  	}
	  	AdjustNavBarPosition();
	  	refresh_WMELB_ToolBar();
	  	WMELB_Save_All();
  	};
	}
	function AdjustPosition(){
		if (document.body.className=="fullscreen"){
			Adjust=0;
		}else Adjust=60;
	}

	function AdjustNavBarPosition(){
		var TB_NavBar=getId('WMETB_NavBar');
		var WMELB_NavBar=getId('WMELB_NavBar');
		if (TB_NavBar!==null){
			WMELB_NavBar.style.left=TB_NavBar.style.left;
			WMELB_NavBar.style.top= parseInt(TB_NavBar.style.top) + 22 + 'px';
		}else if (TB_NavBar===null){
			if (document.body.className=="fullscreen"){
				Adjust=0;
				WMELB_NavBar.style.left='690px';
				WMELB_NavBar.style.top= '30px';
			}else{
				Adjust=60;
				WMELB_NavBar.style.left='690px';
				WMELB_NavBar.style.top= '90px';
			}
			MenAdjust=Adjust;
		}
		WMELB_ToSave.NavBarLeft=WMELB_NavBar.style.left;
		WMELB_ToSave.NavBarTop=WMELB_NavBar.style.top;
		//WMELB_Save_All();
	}

	function WMELB_MainInitialise()
	{   DebugLog("Initializing main features",1);
		  //WMELB_ClearCache();
		  var WMELB_Default_Options = {
		    extpermalink: [
		      'lm',
		    	'bing',
		      'google'
		    ]
		  };
		  if (localStorage.WME_Linkbar_Options) {
		    WMELB_ToSave = JSON.parse(localStorage.WME_Linkbar_Options);
		  }else WMELB_ToSave = WMELB_Default_Options;
		  
		  DebugLog("loading saved options",2);
		  for (var k in WMELB_Default_Options) {
		    WMELB_ToSave[k] = typeof WMELB_ToSave[k] === 'undefined' ? WMELB_Default_Options[k] : WMELB_ToSave[k];
		  }
		  /*if (WMETB_sidebarvisible !== undefined) {
		    WMELB_sidebarvisible = WMETB_sidebarvisible;
		  }
		  */
		  init_WMELB_cfgdialog();
		  init_WMELB_ToolBar();
		  AdjustNavBarPosition();
		  refresh_WMELB_ToolBar();
		  
	//    $('#WMELB_NavBar').css('visibility', 'visible');
			/*
		  if (localStorage.WMELB) {
		    localStorage.removeItem('WMELB');
		  }
		  if (localStorage.WMELB_NavBar) {
		    localStorage.removeItem('WMELB_NavBar');
		  }
		  
		  */
		  WMELB_SaveOnExit = false;
		  var WMELB_saveOptions = function () {
		    if (localStorage) {
		      if (typeof WMELB_ToSave !== 'undefined') {
		        WMELB_Save_All();
		      }
		    }
		  };
		  window.addEventListener('beforeunload', WMELB_saveOptions);
		  WMELB_NewSave = false;
		  
		  window.setInterval(AdjustNavBarPosition,3000);
		  window.setInterval(WMELB_Save_All, 60000);
		  
		  WMELB_SaveOnExit = true;
		  
		  setTimeout(function(){DebugLog("Enjoy!",1);}, 1000);
	}

	WMELBBootstrap();

}

var LBscript = document.createElement("script");
LBscript.textContent = '' + run_LB.toString() + ' \n' + 'run_LB();';
LBscript.setAttribute("type", "application/javascript");
document.body.appendChild(LBscript);
