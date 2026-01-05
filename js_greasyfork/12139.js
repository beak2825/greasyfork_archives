// ==UserScript==
// @id             Emp3
// @name           Empeopled.com Random Topics Bar
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant          GM_addStyle
// @version        1.2
// @namespace      
// @author         TrustyPatches
// @description    Places links to random topics at the top of the frontpage
// @include        https://empeopled.com/*
// @run-at         document-idle
// @downloadURL https://update.greasyfork.org/scripts/12139/Empeopledcom%20Random%20Topics%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/12139/Empeopledcom%20Random%20Topics%20Bar.meta.js
// ==/UserScript==


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////  User Options  ///////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
//change number after "=" and save script to change settings                                                      //
//reload page for settings to take effect                                                                         //
                                                                                                                  //
var number_of_links = 5;       //number of random links to display at a time (default is 5)                       //                     
                                                                                                                  //
var link_space = 60;           //space between links in pixels (default is 60)                                    //
                                                                                                                  //
var truncate_length = 0;       //number of characters to allow for each link's text - set to 0 for no truncation  //
                                                                                                                  //
var show_on_start = 0;         //show links on load - 0 to hide until toggled, 1 to show automatically            //
                                                                                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////  End Settings  ////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


GM_addStyle('                                              \
.randBtn{                                                  \
            width: 90px;                                   \
            display: inline-block;                         \
            text-align: center;                            \
            margin-right: 10px;                            \
            background: #ECF0F1 none repeat scroll 0% 0%;  \
            padding: 0px 5px;                              \
            border-radius: 4px;                            \
            font-size: 85%;                                \
            cursor: pointer                                \
            }                                              \
.randBtn:hover{                                            \
            background: #E1E6E7 none repeat scroll 0% 0%;  \
            color: #101112;                                \
            }                                              \
.buttonDiv{                                                \
            -moz-user-select: -moz-none;                   \
            -khtml-user-select: none;                      \
            -webkit-user-select: none;                     \
            color: #7F8C8D;                                \
            height: 46px;                                  \
            width: 350px;                                  \
            position: absolute;                            \
            margin-top: -32px;                             \
            padding-left: 23px;                            \
            transition-property: margin-top;               \
            transition-duration: .5s;                      \
            }                                              \
.linkDiv{                                                  \
            position: absolute;                            \
            width: 100%;                                   \
            height: 32px;                                  \
            border-bottom: solid #ECF0F1 1px;              \
            visibility: hidden;                            \
            display: block;                                \
            }                                              \
}');


/*setup elements*/
var linkDiv = document.createElement('div');
linkDiv.style.zIndex = '1';
$(linkDiv).addClass('linkDiv');
document.body.insertBefore(linkDiv, document.body.firstChild);

var buttonDiv = document.createElement('div');
buttonDiv.style.zIndex = '2';
$(buttonDiv).addClass('buttonDiv');
document.body.insertBefore(buttonDiv, document.body.firstChild);

var infoDiv = document.createElement('div');
$(infoDiv).addClass('infoDiv');
infoDiv.style.zIndex = '1031';
$(infoDiv).css('position', 'fixed').css('margin-top', '-24px').css('left', '84px').css('color', '#7F8C8D');
document.body.insertBefore(infoDiv, document.body.firstChild);

var start = document.createElement('a');
$(start).addClass('randBtn');
start.innerHTML = 'Generate';

var randomPage = document.createElement('a');
$(randomPage).addClass('randBtn');
randomPage.innerHTML = 'Surprise Me!';
  
var newLinks = document.createElement('a');
$(newLinks).addClass('randBtn');
newLinks.innerHTML = 'Randomize';

var hide = document.createElement('a');
$(hide).addClass('randBtn');
hide.innerHTML = 'Toggle';


String.prototype.trunc = String.prototype.trunc ||
function (n) {
  if (truncate_length > 0) {
    return this.length > n ? this.substr(0, n - 1) + '&hellip;' : this;
  }
  else {
    return this;
  }
};


function divIndexOf(div, link) {
    for (var i = 1; i < div.childNodes.length; i++) {
      if (div.childNodes[i].href == link) {
        return i;
      }
    }
    return -1;
}


//check for presence of login link
function checkLogin(){
  var check = document.getElementsByClassName('header-login');
  if (typeof check[0] == 'undefined'){
    return 1;
  }
  else {
    return 0;
  }
}


var docList, randomNum;
var list = [];
list[0] = [];
list[1] = [];

//Check for topics list on page
function initial(){
  if (window.location == 'https://empeopled.com/'){
    if (checkLogin() == 1){
      infoDiv.innerHTML = 'Waiting for topics list...';
      docList = document.getElementsByTagName('select') [0];
      if (typeof docList == 'undefined' || docList.length < 4){
        setTimeout(initial, 300);
      } 
      else {
        var topicName;
        //populate array with topics
        for (i = 3; i < docList.length + 2; i++) {
          topicName  = docList.childNodes[i].innerHTML;
          topicName = topicName.replace(/&amp;/g, '&');
          list[0][i - 3] = topicName.trunc(truncate_length);
          list[1][i - 3] = '/t/' + topicName.replace(/ /g, '_').toLowerCase();
        }
        infoDiv.innerHTML = list[0].length + ' Topics found';
        buttonDiv.innerHTML = '';
        buttonDiv.appendChild(hide);
        buttonDiv.appendChild(randomPage);
        buttonDiv.appendChild(newLinks);
        $(infoDiv).css('padding', '0');
        GM_addStyle('.buttonDiv:hover{margin-top: 2px;}');
        if (show_on_start > 0){
          linkDiv.style.visibility = 'visible';
        }
        generate();
      }
    }
    else{
      infoDiv.innerHTML = 'Login to use random topics bar';
      setTimeout(function(){
        infoDiv.style.display = 'none';
      }, 5000);
    }
  }
  else {
    infoDiv.innerHTML = 'No topics found';
    buttonDiv.innerHTML = 'Return to frontpage to generate random topics';
    setTimeout(function(){
      buttonDiv.innerHTML = '';
      buttonDiv.appendChild(start);
    }, 5000);
    GM_addStyle('.buttonDiv:hover{margin-top: 2px;}');
  }
}


//Link generator function
function generate(){
  linkDiv.innerHTML = '';
  var windowWidth, pad;
  var linkWidth = 0;
  var x = 0;
  
  //pick random topics to display
  while (x < number_of_links) {
    randomNum = Math.floor(Math.random() * list[0].length);
    if (linkDiv.childNodes.length < 1 || divIndexOf(linkDiv, list[1][randomNum]) < 0) {
      var randomLink = document.createElement('a');
      $(randomLink).css('margin', '0 ' + link_space + 'px 0 0');
      randomLink.innerHTML = list[0][randomNum];
      randomLink.href = list[1][randomNum];
      linkDiv.appendChild(randomLink);
      linkWidth += ($(linkDiv.childNodes[x]).width());
      x++;
    }
  }
  
  windowWidth = $(window).width();
  pad = ((windowWidth / 2) - Math.floor((linkWidth + (link_space * (number_of_links - 1))) / 2)) - 21;
  $(linkDiv).css('padding-left', pad + 'px');
}

setTimeout(initial, 1500);

//Randomize Button
newLinks.addEventListener('click', generate);

//Surprise Me! button
randomPage.addEventListener('click', function () {
  window.location = list[1][Math.floor((Math.random() * list[0].length))].replace('&amp;', '&');
});

//Toggle button
hide.addEventListener('click', function () {
  linkDiv.style.position = 'relative';
  if (linkDiv.style.visibility == 'visible'){
    linkDiv.style.visibility = 'hidden';
  }
  else {
    linkDiv.style.visibility = 'visible';
  }
});

//Generate button
start.addEventListener('click', initial);