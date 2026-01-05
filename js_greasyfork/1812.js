// ==UserScript==
// @name           chaturbatefilter
// @version 1.0
// @namespace      chaturbate_filter
// @description    chaturbate-filter
// @include        http://chaturbate.com/*
// @include        http://*.chaturbate.com/*
// @grant          GM_xmlhttpRequest
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js
// @require         http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js
/*
 @require         https://raw.github.com/jaysalvat/buzz/master/dist/buzz.min.js
*/

// @downloadURL https://update.greasyfork.org/scripts/1812/chaturbatefilter.user.js
// @updateURL https://update.greasyfork.org/scripts/1812/chaturbatefilter.meta.js
// ==/UserScript==

version = 1.0;

var pageType = 0;
var startTime = +new Date();

var mySound = new buzz.sound( "http://soundjax.com/reddo/21862%5Ebeep1.mp3");
$(function() {
    $( "#dialog" ).dialog({
      autoOpen: false,
      autoResize: true,
      height: 'auto',
      width: 580,
      show: {
        effect: "blind",
        duration: 100
      },
      hide: {
        duration: 1000
      },
      position: {
        my: 'left',
        at: 'center',
        of: $('#header')
      },
      buttons: {
        "Close": function() {
          $( this ).dialog( "close" );
        },
        "Clear All": function() {
              var targetNodes =  $( "#ExhibitionistCams" ).find(".details");    
              if (targetNodes && targetNodes.length > 0) {
                  targetNodes.each ( function () {
                      removeFromAlert(getName($(this)));
                  } );
              }
              $( this ).dialog( "close" );
          }
      }, 
      open: function (event, ui) {
        $('#dialog').css('overflow', 'hidden'); 
          
      }
    });
 
    $( "#opener" ).click(function() {
      $( "#dialog" ).dialog( "open" );
    });    
    
    
    
    
    $( "#followeddialog" ).dialog({
      autoOpen: false,
      autoResize: true,
      height: 'auto',
      width: 580,
      show: {
        effect: "blind",
        duration: 100
      },
      hide: {
        duration: 1000
      },
      position: {
        my: 'left',
        at: 'center',
        of: $('#header')
      },
      buttons: {
        "Close": function() {
          $( this ).dialog( "close" );
        }
      },  
      open: function (event, ui) {
        $('#followeddialog').css('overflow', 'hidden'); 
      }
    });
 
    $( "#followeddialogopener" ).click(function() {
      var targetNodes =  $( "#FollowedCams" ).find(".details");
      if (targetNodes && targetNodes.length > 0) {
          targetNodes.each ( function () {
              $( "#FollowedCams" ).find('#'+getName($(this))).remove();
          } );
      }
      
      $.get( '/followed-cams/', function( data ) {
        var dataObj = $('<div/>').html(data);
        dataObj.find(".details").each( function() {
            var thisCam = createNewUserCam($(this));
            if(shouldShowCam(thisCam) && thisCam.type != 3) {
                $("#FollowedCams").append(thisCam.cam.parent());
            }
        }); 
	  }).fail(function() {
        alert( "error" );
      });
        
      $( "#followeddialog" ).dialog( "open" );
    });
    
    $( "#report_popupdialog" ).dialog({
      autoOpen: false,
      autoResize: true,
      height: 'auto',
      width: 400,
      show: {
        effect: "blind",
        duration: 100
      },
      hide: {
        duration: 1000
      },
      position: {
        my: 'left',
        at: 'center',
        of: $('#header')
      },
      buttons: {
        "Close": function() {
          $( this ).dialog( "close" );
        }
      },  
      open: function (event, ui) {
        $('#report_popupdialog').css('overflow', 'hidden'); 
      }
    });
 
    $( "#report_popupopener" ).click(function() {
       logit("report_popupopener clicked");
       $("#report_popup form").attr("action", "/abuse/report/lionrauuuhl/");        
       $( "#report_popupdialog" ).dialog( "open" );
    });
  });

function addCheckboxes() {      
    var sort, user_informationID = $("#user_information"), logo_zone = $(".logo-zone");
    
        sort = 
            [
             '  <div id="user_information" style="float:right; font-size: 4pt" align="right" >',
             '    <div class="top" align="middle">',
             '      <label class="username"><strong><font color="#e45900">Sort</font><strong></label>',
             '    </div>',
                '    <div class="bottom" style="height:40px; padding:0px 4px 4px 0px;">',
             '      <table>',
             '        <tr height="2px">',
             '          <td><label id="showFemaleLabel"><input type="checkbox"            name="showFemale"                            id="showFemale" checked           />Show Females</label></td>',
             '          <td><label id="showCouplesLabel"><input type="checkbox"           name="showCouples"                           id="showCouples"                  />Show Couples</label></td>',
             '          <td><label id="showOnlyOnlineLabel"><input type="checkbox"        name="showOnlyOnline"                        id="showOnlyOnline"               />Show Only Online</label></td>',
             '          <td><label id="showOnlyNewLabel"><input type="checkbox"           name="showOnlyNew"                           id="showOnlyNew"                  />Show Only New</label></td>',
             '          <td><label id="showOnly1825Label"><input type="checkbox"          name="showOnly1825"                          id="showOnly1825"                 />Show 18-25</label></td>',
             '          <!--td><button id="followeddialogopener">Followed Cams</button></td-->',
             '        </tr>',
             '        <tr height="2px">',
             '          <td><label id="showMaleLabel"><input type="checkbox"              name="showMale"              id="showMale"               />Show Males</label></td>',
             '          <td><label id="showTranssexualLabel"><input type="checkbox"       name="showTranssexual"       id="showTranssexual"        />Show Transsexual</label></td>',
             '          <td></td>',
             '          <td><label id="showOnlyExhibitionistLabel"><input type="checkbox" name="showOnlyExhibitionist" id="showOnlyExhibitionist"  />Show Only Exhibitionist</label></td>',
             '          <td><label id="showOnly2635Label"><input type="checkbox"          name="showOnly2635"          id="showOnly2635"           />Show 26-35</label></td>',
             '          <!--td><button id="report_popupopener">Report</button></td-->',
             '        </tr>',
             '      </table>',
             '    </div>',
             '</div>',
                
                
             '<div id="dialog" title="New Exhibitionist Cams" >',
                '    <div id="ExhibitionistCams" class="list" style="width: 100%; min-width: 0;"></div>',
			 '</div>',
                
             '<div id="followeddialog" title="Followed Cams" >',
             '    <div id="FollowedCams" class="list"></div>',
			 '</div>',
               
             '<div style="display:none" id="report_popupdialog" title="Report Abuse">',
             ' <form method="post" action="">',
             ' <div class="report_formborder">',
             '   <p class="report_select">Choose a category:',
             '   <select name="category" id="id_abuse_category_select">',
             '     <option value="">---</option>',
             '     <option value="recording">Recorded video</option>',
             '     <option value="underage">Broadcaster underage</option>',
             '     <option value="advertising">Broadcaster is advertising</option>',
             '     <option value="gender">Broadcaster is wrong gender</option>',
             '     <option value="other">Other</option>',
             '   </select></p>',
             '   <p class="report_comments">Additional Comments:<br />',
             '     <textarea id="id_additional_comments" name="additional_comments" draggable="false"></textarea>',
             '   </p>',
             '   <div class="button_abuse_report" style="width: auto;">',
             '     <a href="#" class="abuse_report_button" id="abuse_report_button" style="color:#FFF;">REPORT</a>',
             '   </div>',
             '   <div class="button_abuse_cancel">',
             '     <a href="#" class="abuse_cancel_button" id="abuse_cancel_button" style="color:#FFF;">CANCEL</a>',
             '   </div>',
             ' </div>',
             ' </form>',
             '</div>',
                
             '<div id="OtherPages"><h2>Cams From Other Pages</h2><div id="OtherPagesInside" class="list"></div></div>',
			 
			 '<div id="BannedCams"><h2>Banned Cams</h2><div id="BannedCamsInside" class="list"></div></div>',
             
            ].join('\n');
                
        if (typeof user_informationID.html() === "undefined") {
           logo_zone.before(sort);                  
        } else {
        	user_informationID.before(sort);      
        }
        
        $('#OtherPages').hide();
		$('#BannedCams').hide();
        
        $('#showFemale').click(function() {
            saveCheckboxSettings();
            refreshThePeopleList();
        });
        $('#showMale').click(function() {
            saveCheckboxSettings();
            refreshThePeopleList();
        });
        $('#showCouples').click(function() {
            saveCheckboxSettings();
            refreshThePeopleList();
        });   
        $('#showTranssexual').click(function() {
            saveCheckboxSettings();
            refreshThePeopleList();
        });  
        $('#showOnly1825').click(function() {
            saveCheckboxSettings();
            refreshThePeopleList();
        });
        $('#showOnlyOnline').click(function() {
            saveCheckboxSettings();
            refreshThePeopleList();
        });
        $('#showOnly2635').click(function() {
            saveCheckboxSettings();
            refreshThePeopleList();
        });        
        $('#showOnlyNew').click(function() {
            if($('#showOnlyNew').attr('checked')) {
              $('#showOnlyExhibitionist').attr('checked', false);
            }
            saveCheckboxSettings();
            refreshThePeopleList();
        });
        $('#showOnlyExhibitionist').click(function() {
            if($('#showOnlyExhibitionist').attr('checked')) {
              $('#showOnlyNew').attr('checked', false);
            }
            saveCheckboxSettings();
            refreshThePeopleList();
        });
        
        restoreCheckboxSettings();
}

function showHideCheckboxes() {
   if (pageType==7) {
       toggleCheckbox($('#showOnlyExhibitionist'),$('#showOnlyExhibitionistLabel'),false);
       toggleCheckbox($('#showOnlyNew'),$('#showOnlyNewLabel'),false);
   } else {
       toggleCheckbox($('#showOnlyExhibitionist'),$('#showOnlyExhibitionistLabel'),true);
       toggleCheckbox($('#showOnlyNew'),$('#showOnlyNewLabel'),true);
   }
    
   if (pageType==2 || pageType==3 || pageType==4 || pageType==5) {
       toggleCheckbox($('#showFemale'),$('#showFemaleLabel'),false);
       toggleCheckbox($('#showMale'),$('#showMaleLabel'),false);
       toggleCheckbox($('#showCouples'),$('#showCouplesLabel'),false);
       toggleCheckbox($('#showTranssexual'),$('#showTranssexualLabel'),false);
   } else {
       toggleCheckbox($('#showFemale'),$('#showFemaleLabel'),true);
       toggleCheckbox($('#showMale'),$('#showMaleLabel'),true);
       toggleCheckbox($('#showCouples'),$('#showCouplesLabel'),true);
       toggleCheckbox($('#showTranssexual'),$('#showTranssexualLabel'),true);
   }
    
    if(pageType==6) {
       toggleCheckbox($('#showOnlyOnlineLabel'),$('#showOnlyOnline'),true);
    } else {
        toggleCheckbox($('#showOnlyOnlineLabel'),$('#showOnlyOnline'),false);
    }
}

function getPageType() {
    // 1= Performer Page
    // 2= Female Page
    // 3= Male Page
    // 4= Couple Page
    // 5= Transsexual Page
    // 6= Followed Page
    // 7= Exhibitionist Page
    // 0= other
    var result = 0, activeTab = $(".active");
    if(activeTab.html()!=null) {
        if (activeTab.html().indexOf('s Cam') != -1) {
            result = 1;
        } else if (activeTab.html().indexOf('<a href="/female-cams/">FEMALE</a>') != -1) {
            result = 2;
        } else if (activeTab.html().indexOf('<a href="/male-cams/">MALE</a>') != -1) {
            result = 3;
        } else if (activeTab.html().indexOf('<a href="/couple-cams/">COUPLE</a>') != -1) {
            result = 4;
        } else if (activeTab.html().indexOf('<a href="/transsexual-cams/">TRANSSEXUAL</a>') != -1) {
            result = 5;
        } else if (activeTab.html().indexOf('<a href="/followed-cams/" class="followed">') != -1) {
            result = 6;
        }  else {
            $(".endless_page_template").each(function () {
                if ($(this).find(":nth-child(1)").html().indexOf('<h2>Exhibitionist Cams</h2>') != -1) {
                    result = 7;
                }
            });
        }
    }
    return result;
}

function isBetween18And25(age) {
    var ageValues = ["18","19", "20", "21", "22", "23", "24", "25", "99" ];
    return ageValues.indexOf(age) > -1;
}

function isBetween26And35(age) {
    var ageValues = ["26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "99" ];
    return ageValues.indexOf(age) > -1;
}

function saveCheckboxSettings() {
    var checkboxSettings = $(':checkbox').map(function () {return this.checked;}).get().join();
    createCookie('checkboxSettings',checkboxSettings);  
}

function restoreCheckboxSettings() {
    var checkboxSettings = readCookie('checkboxSettings');
    if(checkboxSettings) {
      $(checkboxSettings.split(',')).each(function (i) {
          $(':checkbox:eq(' + i + ')').attr('checked', (this.toString() === 'true'));
      });
    }
}

function getAge(jNode) {
    var age = "99";
    if(jNode.find('.age')) {
        age = jNode.find('.age').text();
    }  
    return age;
}

function getName(jNode) {
    var name = "";
    if(jNode.find('.title')) {
        name = jNode.find('.title').find('a').text();
    }  
    return name;
}

function getGender(jNode) {
    // 0=error
    // 1=male
    // 2=female
    // 3=couple
    // 4=Transsexual
    var result = 0, span = jNode.find('.title span');
    if (span && span.hasClass('genderm')) {
        result = 1;
    } else if (span && span.hasClass('genderf')) {
        result = 2;
    } else if (span && span.hasClass('genderc')) {
        result = 3;
    } else if (span && span.hasClass('genders')) {
        result = 4;
    }
    return result;
}

function getType(jNode) {
    // 0=other
    // 1=new
    // 2=EXHIBITIONIST
    // 3=OFFLINE
    // 4=
    var result = 0;
    if (jNode.parent().html().indexOf('<div class="thumbnail_label thumbnail_label_c_new">NEW</div>') != -1) {   
        result = 1;
    } else if (jNode.parent().html().indexOf('<div class="thumbnail_label thumbnail_label_exhibitionist">EXHIBITIONIST</div>') != -1) {
        result = 2;
    } else if (jNode.parent().html().indexOf('<div class="thumbnail_label thumbnail_label_offline">OFFLINE</div>') != -1) {
        result = 3;
    }
    return result;
}
        
function userCam(cam,name,gender,age,type,hidden) {
    cam.parent().attr('id',name);
    var that= this;
	this.cam=cam;
	this.name=name;
	this.gender=gender;
	this.age=age;
	this.type=type;
	this.hidden=hidden;
    this.getGenderString=function() {
        var result = "Unknown";
        if (that.gender==1) {
            result = "Male";
        } else if (that.gender==2) {
            result = "Female";
        } else if (that.gender==3) {
            result = "Couple";
        } else if (that.gender==4) {
            result = "Transsexual";
        } 
        return result;
    };
    this.href=cam.find('.title a').attr('href');
    this.hide=function() {
        cam.parent().hide();
        hidden=true;
    };
    this.show=function() {
        cam.parent().show();
        hidden=false;
    };
    this.getCamClone=function() {
        return cam.parent().clone();
    };
    var report = '<li id="reportButton"><button id="report_popupopener">Report</button></li>';
    //if(this.cam.find('.sub-info #reportButton').length==0)
      //this.cam.find('.sub-info .cams').after(report);
}
    

function createNewUserCam(jNode) {
    return new userCam(jNode,getName(jNode),getGender(jNode),getAge(jNode),getType(jNode),false); 
}

function preProcessCam(jNode) {
    return createNewUserCam(jNode);
}

function shouldShowCam(userCam) {
    var result = true;
    if (pageType!=2 && pageType!=3 && pageType!=4 && pageType!=5) {
        if (userCam.gender==1) {
            if(!isChecked($('#showMale'))) {
                result = false;
            }
        } else if (userCam.gender==2) {
            if(!isChecked($('#showFemale'))) {
                result = false;
            }
        } else if (userCam.gender==3) {
            if(!isChecked($('#showCouples'))) {
                result = false;
            }
        } else if (userCam.gender==4) {
            if(!isChecked($('#showTranssexual'))) {
                result = false;
            }
        }
    }
    
    if((isChecked($('#showOnlyNew')) && pageType!=7 && userCam.type!=1) || (isChecked($('#showOnlyExhibitionist')) && pageType!=7 && userCam.type!=2)) {
        result = false;
    } 
    
    if (isChecked($('#showOnly1825')) && !isBetween18And25(userCam.age) && !(isChecked($('#showOnly2635')) && !isBetween26And35(userCam.age))) {
        result = false;
    }
    
    if (isChecked($('#showOnly2635')) && !isBetween26And35(userCam.age) && !(isChecked($('#showOnly1825')) && !isBetween18And25(userCam.age))) {
        result = false;
    }
    if (isChecked($('#showOnlyOnline')) && pageType==7 && userCam.type==3) {
        result = false;
    }
    
    return result;
}

function processCam(userCam) {
    if (pageType!=7) {
        addTokensRemaining(userCam.cam);
    }
    
    if(shouldShowCam(userCam)) {        
       userCam.show();
	} else {
        userCam.hide();
	}
}

function processCams(cams) {
    $.each(cams, function (index,userCam) {
        processCam(userCam);
    });
}

var firstTimeThru=true;
function processExhibitionist(userCam, refreshThePeopleListIgnoreUserList) {
    if (pageType==7) {
        if(refreshThePeopleListIgnoreUserList!==null && !arrayContains(userCam.name, refreshThePeopleListIgnoreUserList.split(',')) && shouldShowCam(userCam)) {
            refreshThePeopleListIgnoreUserList = addUserToIgnoreUserList(userCam.name, refreshThePeopleListIgnoreUserList);
			var camOnMainPage = false;
            $('.list').not("#OtherPagesInside, #BannedCamsInside, #ExhibitionistCams").children("div[id] :visible").each( function() { 
                //logit(userCam.name);
                if($(this).attr('id') == userCam.name) {
                    camOnMainPage = true;
                }
            }); 
            if (!firstTimeThru && !camOnMainPage && $("#ExhibitionistCams").find("#"+userCam.name).length == 0 && $("#FollowedCams").find("#"+userCam.name).length == 0) {  
                
                var cloneOfCamParent = userCam.getCamClone();
                addAlertButtons(cloneOfCamParent, userCam.name);
                $("#ExhibitionistCams" ).append(cloneOfCamParent);
                
                var targetNodes =  $( "#ExhibitionistCams" ).find(".details");    
              	if (targetNodes && targetNodes.length > 9) {
                    $('#dialog').dialog('option','width',782);
                } else {
                    $('#dialog').dialog('option','width',580);
                }
                $("#dialog" ).dialog( "open" ); 
                
                mySound.play();
                setImageRefresh(cloneOfCamParent, userCam.name);
            }
        } 
    }     
}

var refreshThePeopleListRunning = false;
var newUserArray = [];
var currentUserArray = [];
var refreshThePeopleListIgnoreUserList;
function refreshThePeopleList() {
   refreshThePeopleListRunning = true;
   refreshThePeopleListIgnoreUserList = getUserToIgnoreUserList();
   var targetNodes = $(".details");
   //$('.list').not("#OtherPagesInside, #BannedCamsInside, #ExhibitionistCams").children(":visible").each( function() {  
                
   //});     
   if (targetNodes && targetNodes.length > 0) {
        targetNodes.each ( function () {
            var userCam = actionFunction($(this), refreshThePeopleListIgnoreUserList);
			newUserArray.push(userCam.name);
        });
    }
		
	currentUserArray.every(removeRefreshImages);
	currentUserArray = newUserArray;
	
	if(newUserArray.length > 0) {
		firstTimeThru=false;
	}
	
    //might not want to do this
    newUserArray = [];
    refreshThePeopleListRunning = false;
}

function actionFunction(jNode, refreshThePeopleListIgnoreUserList) {
    var userCam = preProcessCam(jNode);
    processCam(userCam);
    processExhibitionist(userCam, refreshThePeopleListIgnoreUserList);
    return userCam;
}

var intervalMap = new Object();
function setImageRefresh(cloneOfCamParent, name) {
    var image = cloneOfCamParent.find('img');
    //logit("setImageRefresh for: "+ name);
    var thisInterval = setInterval(function (name) {
        //logit("Refreshing image for: "+ name);
        image[0].src=image[0].src.replace(/\?.*/,function () {
            return '?'+new Date();
        });
    }, 60000);
	
	intervalMap[name] = thisInterval;
}

function removeFromAlert(name) {
    $( "#ExhibitionistCams" ).find('#'+name).remove();
    if ($( "#ExhibitionistCams" ).html() == '') {
        $( "#dialog" ).dialog( "close" );
    }
}

function addAlertButtons(jNode, name) { 
    jNode.find('.cams').after('<input type="button" id="clearButton_'+name+'" value="Clear" >');
    jNode.find('#clearButton_'+name).button().click(function(){ removeFromAlert(name);});   
    
    jNode.find('#clearButton_'+name).after('<input type="button" id="removeButton_'+name+'" value="Hide Room Forever" >');
    jNode.find('#removeButton_'+name).button().click(function(){ if(window.confirm("Are you sure you want to remove this room from showing on chaturbate forever?")) {alert("Removed");}}); 
}

var removeRefreshImages = function(x) {
    var found = false;
	for (var i = 0; i < newUserArray.length; i++) {
		if(x==newUserArray[i]) {
			found = true;
		}
	}
	
	if(!found && x in intervalMap) {
        clearInterval(intervalMap[x]);
		delete intervalMap[x];
	}
};



function getTokensRemaining(jNode) {
    var tokensRemaining = "", subjectElementHTML = jNode.find('.subject').html(),startpos,length;
    if(subjectElementHTML && subjectElementHTML.lastIndexOf("[") != -1 && subjectElementHTML.lastIndexOf(" tokens remaining]")!=-1) {
        startpos = subjectElementHTML.lastIndexOf("[")+1;
        length = subjectElementHTML.lastIndexOf(" tokens remaining]")-startpos;
        tokensRemaining = subjectElementHTML.substr(startpos,length);
    }
    return tokensRemaining.trim();
}

function addTokensRemaining(jNode) {
    var tokensRemaining = getTokensRemaining(jNode);
    if(jNode.find('#tokensRemaining')) {
        jNode.find('#tokensRemaining').remove();
    } 
    if(tokensRemaining=="") {
        tokensRemaining="--";
    }
    jNode.find('.cams').after('<li id="tokensRemaining">Tokens Remaining: ['+tokensRemaining+']</li>');    
}

function addUserToIgnoreUserList(userName, ignoreUserList) {
    if (!arrayContains(userName, ignoreUserList.split(','))) {
       if (ignoreUserList && ignoreUserList.split(',').length > 0) {
           ignoreUserList = ignoreUserList+',';
       }
       ignoreUserList = ignoreUserList + userName;
       createCookie('ignoreUserList',ignoreUserList);
	}
	return ignoreUserList;
}

function getUserToIgnoreUserList() {
    var ignoreUserList = readCookie('ignoreUserList');  
    if(!ignoreUserList) {
        ignoreUserList = '';
    }
    return ignoreUserList;
}
    
function createCookie(name,value,days) {
    var date = new Date(), expires="";
	if (days) {
		date.setTime(date.getTime()+(days*24*60*60*1000));
		expires = "; expires="+date.toGMTString();
    }
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var c, i, nameEQ = name + "=", ca = document.cookie.split(';');
	for(i=0;i < ca.length;i++) {
		c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function addStyle(style) {
	var head = document.getElementsByTagName("HEAD")[0], ele = head.appendChild(window.document.createElement( 'style' ));
	ele.innerHTML = style;
	return ele;
}

function arrayContains(obj, a) {
    var i;
    for (i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}
    
function showCheckbox(checkbox, checkboxlabel) {
    checkbox.show();
    checkboxlabel.show();
}

function hideCheckbox(checkbox, checkboxlabel) {
    checkbox.hide();
    checkboxlabel.hide();
}

function checkCheckbox(checkbox,checked) {
    if(checked != null) {
        checkbox.attr('checked', checked);
    }
}

function toggleCheckbox(checkbox, checkboxlabel, show, checked) {    
    if(show) {
        showCheckbox(checkbox,checkboxlabel);
    } else {
        hideCheckbox(checkbox,checkboxlabel);
    }
    checkCheckbox(checkbox,checked);
}

function isChecked(checkbox) {
    return checkbox.attr('checked');
}  
    
function loadOtherPagesDiv() {
     if (typeof $("#OtherPages2").html() === "undefined") {
        var otherPages = $('#OtherPages').clone();
        otherPages.attr('id','OtherPages2');
		//logit("Showing OtherPages2");
        otherPages.show();
		
		var bannedCams = $('#BannedCams').clone();
        bannedCams.attr('id','BannedCams2');
		//logit("Showing BannedCams2");
        bannedCams.show();
         
         // Removes cams that are on this page from otherpagesinside
         $.get( window.location.pathname, function( data ) {
             $('.list').not("#OtherPagesInside, #BannedCamsInside, #ExhibitionistCams").children(":visible").each( function() {  
                var thisCamPage = $(this).find('.title a').attr('href');    
            	var thisCamName = thisCamPage.substring(1, thisCamPage.length-1);
                if($("#OtherPagesInside").find("#"+thisCamName).length > 0) {
                    $("#OtherPagesInside").find("#"+thisCamName).remove();
                }
            });  
             
		}).fail(function() {
            logit("loadOtherPagesDiv error: " + nextPagelink);
        });
        $(".content").find('.list').after(otherPages);
		$("#OtherPages2").after(bannedCams);
     }
}

function loadPage(url){ 
    $.get( url, function( data ) {
        var dataObj = $('<div/>').html(data);
        getCamsFromOtherPages(dataObj);
	}).fail(function() {
        alert( "error" );
    });
}

var getCamsFromOtherPagesRunning = false;
function getCamsFromOtherPages() {
    getCamsOnPage($("html"));
    loadOtherPagesDiv();
}
    
function getCamsOnPage(data) {      
    getCamsFromOtherPagesRunning = true;
    var nextPagelink = getNextPageLink(data);
    if (nextPagelink != null) {
        $.get( nextPagelink, function( data ) {
            var dataObj = $('<div/>').html(data);
            dataObj.find(".details").each( function() {
                var thisCam = createNewUserCam($(this));
                if(shouldShowCam(thisCam)) {
                    if ( $("#OtherPagesInside").find("#"+thisCam.name).length == 0) {
                        $("#OtherPagesInside").append(thisCam.cam.parent());
                        loadOtherPagesDiv();
                    } else if ( $("#OtherPagesInside").find("#"+thisCam.name).length == 1) {
                        var oldCam = $("#OtherPagesInside").find("#"+thisCam.name);
                    }
                }
            }); 
            getCamsOnPage(dataObj);  
		}).fail(function() {
            logit("getCamsOnPage error: " + nextPagelink);
        });
    } 
    
    getCamsFromOtherPagesRunning = false;
}

//http://chaturbate.com/followed-cams/
//<a href="/followed-cams/" class="followed">FOLLOWED(7/490)</a>
function getFavoritePage(data) {
    if($('#followed')) {
        getFavoritePage("/followed-cams/");
    }
}
function getFavoritePage(nextPagelink) {     
    if (nextPagelink != null) {
        $.get( nextPagelink, function( data ) {
            var dataObj = $('<div/>').html(data);
            dataObj.find(".details").each( function() {
                $("#FavoritePagesInside").append($(this).parent());
            }); 
            getFavoritePage(dataObj);  
		}).fail(function() {
            logit("getFavoritePage error: " + nextPagelink);
        });
    }     
}

function checkedCam(cam, camPage, lastChecked, status) {
    this.cam = cam;
    this.camPage = camPage;
    this.lastChecked = lastChecked;
    this.status = status;
    
}
    
var checkedCams = {};
var pauseOtherCams = false;
function checkOtherCamsOnline() {
    //logit("\n\n(checkOtherCamsOnline) start");
    pauseOtherCams = true;
    $("#OtherPagesInside").find('.details').each( function() {
        var thisCamPage = $(this).find('.title a').attr('href'); 
        var thisCamName = thisCamPage.substring(1, thisCamPage.length-1);
        var thisCam = $("#OtherPagesInside " + "#"+thisCamName);//.find("#"+thisCamName);
        
        //if($(this).find('.thumbnail_label').text() != 'BANNED') {
        if(thisCam.find('.thumbnail_label').text() != 'BANNED') {
        	$.get( thisCamPage, function( data ) {
            	var status = "Online";
            
            	if (data.indexOf("offline_tipping") >= 0) {
					status = "Offline";	
                	thisCam.find('.thumbnail_label').attr('class', 'thumbnail_label thumbnail_label_offline');
                	thisCam.find('.thumbnail_label').text('OFFLINE!');
                	thisCam.remove();                
                	//logit("(checkOtherCamsOnline) removing: "+thisCamName);    
            	} else if(data.indexOf("This room has been banned.") >= 0) {
                	status = "Banned"; 
                	thisCam.find('.thumbnail_label').attr('class', 'thumbnail_label thumbnail_label_offline');
                	thisCam.find('.thumbnail_label').text('BANNED');
                	if ( $("#BannedCamsInside").find("#"+thisCamName).length == 0) {
                        logit("** Moving Other Page Cam "+thisCamName+"to Banned Cams\n");
                    	thisCam.appendTo("#BannedCamsInside");
                    } else {
                        logit("Already in Banned Section, Removing Other Page Cam "+thisCamName + "\n");
                    	thisCam.remove();
                    }
            	} else if(data.indexOf("Access Denied. This room is not available to your region or gender.") >= 0) {
                	status = "Blocked"; 
                	thisCam.find('.thumbnail_label').attr('class', 'thumbnail_label thumbnail_label_offline');
                	thisCam.find('.thumbnail_label').text('BLOCKED');
            	} else if(data.indexOf("This room requires a password.") >= 0) {
                	status = "Password"; 
                	thisCam.find('.thumbnail_label').attr('class', 'thumbnail_label thumbnail_label_offline');
                	thisCam.find('.thumbnail_label').text('PASSWORD');
            	}
                
            	if(!(thisCamName in checkedCams)) {
                    var thisCheckedCam = new checkedCam($(this), thisCamPage, new Date(), status);
                    checkedCams[thisCamName] = thisCheckedCam;
                    //logit("Other Pages Cam added: "+ thisCamName);
                } else {
                    var newDate = new Date();
                    var seconds = (newDate - checkedCams[thisCamName].lastChecked) / 1000;
                    checkedCams[thisCamName].lastChecked = newDate;
                    //logit("Other Pages Cam found: "+ thisCamName+", last checked " + seconds +" ago");
                }                
            
			});  
        } else {
            if ( $("#BannedCamsInside").find("#"+thisCamName).length == 0) {
                logit("** Moving Other Page Cam "+thisCamName+"to Banned Cams\n");
                thisCam.appendTo("#BannedCamsInside");
            } else {
                logit("(checkOtherCamsOnline) Already in BannedCamsInside removing: "+thisCamName); 
                thisCam.remove();
            }
        }
    });        
        
    $("#ExhibitionistCams").find('.details').each( function() {
        var thisCamPage = $(this).find('.title a').attr('href'); 
        var thisCamName = thisCamPage.substring(1, thisCamPage.length-1);
        var thisCam = $("#ExhibitionistCams " + "#"+thisCamName);//.find("#"+thisCamName);
        
        if(thisCam.find('.thumbnail_label').text() != 'BANNED') {    
            $.get( thisCamPage, function( data ) {
                var status = "Online";
                
                if (data.indexOf("offline_tipping") >= 0) {
                    //logit("(checkOtherCamsOnline) marking as offline in ExhibitionistCams: "+thisCamName);
                    thisCam.find('.thumbnail_label').attr('class', 'thumbnail_label thumbnail_label_offline');
                    thisCam.find('.thumbnail_label').text('OFFLINE!');
                    status = "Offline";
                } else if(data.indexOf("This room has been banned.") >= 0) {
                    logit("(checkOtherCamsOnline) marking as banned in ExhibitionistCams: "+thisCamName);
                    thisCam.find('.thumbnail_label').attr('class', 'thumbnail_label thumbnail_label_offline'); 
                    thisCam.find('.thumbnail_label').text('BANNED');
                    status = "Banned";
                } else if($("#OtherPagesInside").find("#"+thisCamName).length > 0) {
                    var otherPagesInsideClass = $("#OtherPagesInside").find("#"+thisCamName).find('.thumbnail_label').attr('class');
                    var otherPagesInsideThumbnail = $("#OtherPagesInside").find("#"+thisCamName).find('.thumbnail_label').text();
                    //logit("\nthisCamName - Class: "+otherPagesInsideClass+" Thumbnail: "+otherPagesInsideThumbnail+"\n");
                    thisCam.find('.thumbnail_label').attr('class', otherPagesInsideClass);
                    thisCam.find('.thumbnail_label').text(otherPagesInsideThumbnail);
                } else if(data.indexOf("Access Denied. This room is not available to your region or gender.") >= 0) {
                	status = "Blocked"; 
                	thisCam.find('.thumbnail_label').attr('class', 'thumbnail_label thumbnail_label_offline');
                	thisCam.find('.thumbnail_label').text('BLOCKED');
            	} else if(data.indexOf("This room requires a password.") >= 0) {
                	status = "Password"; 
                	thisCam.find('.thumbnail_label').attr('class', 'thumbnail_label thumbnail_label_offline');
                	thisCam.find('.thumbnail_label').text('PASSWORD');
            	}
                
                if(!(thisCamName in checkedCams)) {
                    var thisCheckedCam = new checkedCam($(this), thisCamPage, new Date(), status);
                    checkedCams[thisCamName] = thisCheckedCam;
                    //logit("Exhibitionist Cam added: "+ thisCamName);
                } else {
                    var newDate = new Date();
                    var seconds = (newDate - checkedCams[thisCamName].lastChecked) / 1000;
                    checkedCams[thisCamName].lastChecked = newDate;
                    //logit("Exhibitionist Cam found: "+ thisCamName+", last checked " + seconds +" ago");
                }
                
			});
        } else {
            if ( $("#BannedCamsInside").find("#"+thisCamName).length == 0) {
                logit("*** Copying Exhibitionist Cam "+thisCamName+" to Banned Cams\n");
                var thisCamClone = thisCam.clone();
                thisCamClone.find("#clearButton_"+thisCamName).remove();
                thisCamClone.find("#removeButton_"+thisCamName).remove();
                thisCamClone.appendTo("#BannedCamsInside");
            } else {
                logit("(checkOtherCamsOnline) Already in BannedCamsInside: "+thisCamName); 
            }
        }            
    });
    
    var ids = {};
    $("#BannedCamsInside").children().each( function() {
        logit($(this).attr('id'));
        var id = $(this).attr('id');
        clearInterval(id);

    	//was this id previously seen?
   		if ( ids.hasOwnProperty(id) ) {
        	$( "#"+id ).remove();
    	}
    	//a brand new id was discovered!
    	else {
        	ids[ id ] = true;
    	}
    });    
    pauseOtherCams = false;         
}

function logit(text) {
    console.log(text);
}

function getNextPageLink(data) {
    if(data == null) {
        return null;
    }
    var paging = data.find('.paging'), nextLink = null;
    paging.find('link').each(function() {
        var rel = $(this).attr('rel');
        if(rel=="next") {
            nextLink = $(this).attr('href');
        }
    });
    return nextLink;
}

$(document).ready(function () {
    $(".advanced_search_button").live("click", function () {
        $(".advanced_search_button").toggle();
        $("a.hide_advanced_search_button").toggle();
        $("div.advanced_search_options").slideDown();
        return false;
    });
    $(".hide_advanced_search_button").live("click", function () {
        $(".advanced_search_button").toggle();
        $("a.hide_advanced_search_button").toggle();
        $("div.advanced_search_options").slideUp();
        return false;
    });
    $("#filter_location_form input[type='checkbox']").click(function () {
        $(".searching-note").show();
        $.ajax({
            type: 'POST',
            url: $("#filter_location_form").attr("action"),
            data: $("#filter_location_form").serialize(),
            success: function (data) {
                $(".endless_page_template").load(window.location.href);
                $(".searching-note").hide();
            }
        });
        return true;
    });
    $("#filter_options_form").click(function () {
        $(".searching-note").show();
        $.ajax({
            type: 'POST',
            url: $("#filter_options_form").attr("action"),
            data: $("#filter_options_form").serialize(),
            success: function (data) {
                $(".endless_page_template").load(window.location.href);
                $(".searching-note").hide();
            }
        });
        return true;
    });
    $("#filter_search_form input[type='submit']").click(function () {
        var skey = $("#id_keywords").val();
        var search_message = interpolate(gettext("Searching for %(skey)s ..."), {skey: skey}, true);
        $(".searching-keyword h1").text(search_message);
        $(".searching-keyword").show();
        $(".endless_page_template").load($("#filter_search_form").attr("action") + '?' + $("#filter_search_form").serialize());
        return false;
    });
    
    $('.list').parent().bind("DOMNodeInserted",function(){
        if(!getCamsFromOtherPagesRunning && !refreshThePeopleListRunning && pageType==7) {
            getCamsFromOtherPages();
            refreshThePeopleList();
        } else if(!refreshThePeopleListRunning){
            refreshThePeopleList();
            logit("refreshThePeopleListRunning not running");
        }
    });
    
    //$('.list').parent().bind("DOMNodeRemoved",function(){
        //console.log('DOMNodeRemoved');
    //});
    
});

function do_script() {
    pageType = getPageType();
    if (pageType!=1) {  
        addGlobalStyle('.ui-widget-header-custom {background-color: #3D9700;color:White;font-weight:bold;}');
        addStyle('@import "http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css";');        
        addGlobalStyle('.ui-dialog .ui-dialog-buttonpane { text-align: center; }');
        addGlobalStyle('.ui-dialog .ui-dialog-buttonpane .ui-dialog-buttonset { float: none; }');
        if (pageType == 7) { 
        	createCookie('ignoreUserList',''); 
        }
        //eraseCookie('ignoreUserList');
        addCheckboxes();
        if (pageType==7) {
            getCamsFromOtherPages();
        }
        
        refreshThePeopleList();
        
        showHideCheckboxes();
        setInterval(checkOtherCamsOnline, 30000); 
	}
    if (pageType==7) {
        reload_rooms.delay = 10000;
        setTimeout(reload_rooms.on_timeout,15000);
    } else {
        reload_rooms.delay = 90000;
    }
}

do_script();	
//.user.js