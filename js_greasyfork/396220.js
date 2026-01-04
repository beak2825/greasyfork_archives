// ==UserScript==
// @name        Climate denialists filter for Climate-debate.com
// @namespace   https://greasyfork.org/pl/users/439127
// @description Blocks posts of offensive climate deniers on forum Climate-debate.com
// @include     https://www.climate-debate.com/forum/
// @include     https://www.climate-debate.com/forum/*
// @include     https://www.climate-debate.com/find.php*
// @include     https://www.climate-debate.com/
// @include     https://www.climate-debate.com/users*
// @include     https://www.climate-debate.com/topusers.php
// @version     1.0.6
// @author      Tomasz Dąbski "CzarnyZajaczek"
// @license     GPL-3.0 http://www.gnu.org/licenses/gpl-3.0.txt
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/396220/Climate%20denialists%20filter%20for%20Climate-debatecom.user.js
// @updateURL https://update.greasyfork.org/scripts/396220/Climate%20denialists%20filter%20for%20Climate-debatecom.meta.js
// ==/UserScript==

function denialFilterClimateDebateCom() {
   
  var options = {
    'hide_quoted_comments' : true,
  };
  
  
  var userNameList = [
    'aaronlevaugh',
    'Aikido',
    'AK_User',
    'alej',
    'AlfonsoHiguera',
    'allecnarf',
    'aloysious',
    'Anders',
    'ansi2018',
    'antialiased',
    'arthur18',
    'BarnabyJones',
    'Ben-ove',
    'bfoster',
    'Bigal',
    'Billio',
    'Billy000',
    'Blair Macdonald',
    'Bode',
    'Botulism',
    'bowlesj',
    'Braden',
    'BruceWilliams',
    'Budstar',
    'Buildreps',
    'campy',
    'CanIGiveAnIdea',
    'CantStumpTheTrump',
    'Clarity john',
    'Cnuk',
    'cofu',
    'Common Sense',
    'Commonsense',
    'confused about temps',
    'Convection Is a Thing',
    'Cornelius',
    'crede',
    'cthor29',
    'dadmansabode',
    'Dalerams',
    'Daniel',
    'dapork',
    'darkwulfe',
    'davidlaing',
    'Dawlish',
    'Deanster',
    'dehammer',
    'Diesel burner',
    'dougjones423',
    'dtremaine',
    'duncan61',
    'Earth_Master',
    'Earthling',
    'eheat',
    'einnor',
    'Eric Crews',
    'Eric4898',
    'evolutionist',
    'Exodus',
    'fcimeson',
    'flogger',
    'Frank Lansner',
    'Frank Schnabel',
    'Frescomexico',
    'FriendOfOrion',
    'Gamul1',
    'GasGuzler',
    'GasGuzzler',
    'Gaynor',
    'Geoff Sherrington',
    'gfm7175',
    'Glitch',
    'GlobalPerspectiveSGL',
    'Globalwarmingisfake',
    'Gogsy',
    'greyviper',
    'HappySikalengo',
    'Harry C',
    'HarveyH55',
    'Hayduke',
    'headcasey',
    'High Treason',
    'hopboyd',
    'hotandcold',
    'Howie',
    'hubble',
    'Humidity2',
    'IBdaMann',
    'Into the Night',
    'IsaacTorus11',
    'ipur',
    'JackCapp',
    'jackkarter',
    'James___',
    'James__',
    'James_',
    'James145',
    'jamesmatheson',
    'jdm',
    'Jeffvw',
    'Jesse Christopher',
    'Jethro Bodine',
    'jjcast',
    'joeh917',
    'John Niclasen',
    'Jonson Ket',
    'jørgen petersen',
    'joshuah',
    'Jsurguy',
    'just sayin',
    'JustTheFacts',
    'Kano',
    'Kenneth William Griffith',
    'killemwithscience',
    'kingsolution',
    'KKING',
    'kullboys',
    'kuts muth',
    'L8112',
    'LaplacesDemon',
    'Larry',
    'larrymac',
    'Laws of Nature',
    'leempoels',
    'Leitwolf',
    'Lewis Carlson',
    'Liam1156',
    'LifeIsThermal',
    'Longview',
    'mama nature',
    'markmendlovitz',
    'Masked Nostradamus',
    'MattS',
    'mememine69',
    'micole66',
    'miketolstoy',
    'MK001',
    'MonteCristo',
    'MosesApostaticus',
    'Mr Dynamic Solver',
    'MrMarvelousandtheUnicorn',
    'Mrs Wiggles',
    'mygor',
    'Myleader73',
    'mywifesatan',
    'nemodawson',
    'oldendays',
    'olyz',
    'One Punch Man',
    'Pablobellins',
    'paramount99',
    'Pariga',
    'patrick',
    'Paul O',
    'peterlward',
    'PeterOleKvint',
    'Petester',
    'Philled',
    'PitonObserver',
    'ProHuman',
    'Ptychodus',
    'RealityCheck',
    'redpillminded',
    'RenaissanceMan',
    'RichardP',
    'RightIdea',
    'Robertgreene3',
    'RobWigglezz',
    'Ruben',
    'rwswan',
    'sceptic777',
    'sculptor',
    'SDRAmerica',
    'seaninak',
    'Seeking Bliss',
    'seosecrets4',
    'serdariscool',
    'shagsnacks',
    'simlify',
    'snu',
    'Solarwind',
    'SpaceShot76',
    'spicez',
    'Spongy Iris',
    'StarMan',
    'starryowl',
    'student33',
    'SuperCSG',
    'swills123',
    'Tai Hai Chen',
    'Takashi-san',
    'Takashi',
    'tantalus',
    'The Humidity',
    'thenerdyone314',
    'TheSaviorMessiah',
    'TheThirdAngel144',
    'TheWeatherGirls',
    'Third world guy',
    'ThoAbEl',
    'thomasistrouble1',
    'Thunderbomb1982',
    'Tideman',
    'Tim the plumber',
    'tmb2610',
    'tommy100010',
    'TommytheKitty',
    'Tony Argieri',
    'too',
    'Trumpsupport',
    'Tudoceros',
    'update',
    'Vic',
    'Wake',
    'whitehat',
    'wisewilly',
    'woody',
    'Xadoman',
    'xiaoyouyou1hao',
    'YoucefZX',
    'yuno44907',
    'zenblaster',
    'Zloppino',
    'ZurichBlunte'
  ];
    
  /*
   * Variable below contains javascript which is added to page with <script> tag, since it has to be available from scope of page to show/hide post JS links
   * */
  
    var scriptValue = "function denialFilterClimateDebateComShowComment(comment_id) {\n"+
"  var postIdLink = document.getElementById(comment_id);\n"+
"  \n"+
"  var commentTitleTR;\n"+
"  \n"+
"  var commentTitleTRFound = false;\n"+
"  \n"+
"  var parentNode = postIdLink;\n"+
"  \n"+
"  var commentTitleTD;\n"+
"  \n"+
"  while (!commentTitleTRFound) {\n"+
"    var parentNode = parentNode.parentNode;\n"+
"    \n"+
"    if (parentNode.tagName == 'TD') {\n"+
"      commentTitleTD = parentNode;\n"+
"    }\n"+
"    \n"+
"    if (parentNode.tagName == 'TR') {\n"+
"      commentTitleTR = parentNode;\n"+
"      commentTitleTRFound = true;\n"+
"    }\n"+
"  }\n"+
"  \n"+
"  var parentOfTR = commentTitleTR.parentNode;\n"+
"  \n"+
"  var commentContentsTR = commentTitleTR.nextElementSibling;\n"+
"  \n"+
"  commentContentsTR.style.display = '';\n"+
"  \n"+
"  // replace link \"Show comment\"\n"+
"  var showCommentLink = document.getElementById('denialFilterClimateDebateComShowComment_'+comment_id);\n"+
"  var postJsShowLink = document.createElement('A');\n"+
"  var postJsShowLinkText = document.createTextNode(\"Hide comment\");\n"+
"  postJsShowLink.appendChild(postJsShowLinkText);\n"+
"  postJsShowLink.title = \"Hide this comment\";\n"+
"  postJsShowLink.href = \"javascript:denialFilterClimateDebateComHideComment('\"+comment_id+\"');\";\n"+
"  postJsShowLink.id = 'denialFilterClimateDebateComHideComment_'+comment_id;\n"+
"  postJsShowLink.className = 'denialFilterClimateDebateComHideComment small2';\n"+
"  postJsShowLink.style.color = '#003D71';\n"+
"  \n"+
"  commentTitleTD.insertBefore(postJsShowLink, showCommentLink);\n"+
"  \n"+
"  showCommentLink.parentNode.removeChild(showCommentLink);\n"+
" \n"+
"  var postTitleUserName = document.getElementById('denialFilterClimateDebateComHiddenUserName_'+comment_id);\n"+
"  postTitleUserName.style.display = 'none';\n"+
"}\n"+
"function denialFilterClimateDebateComHideComment(comment_id) {\n"+
"  var postIdLink = document.getElementById(comment_id);\n"+
"  \n"+
"  var commentTitleTR;\n"+
"  \n"+
"  var commentTitleTRFound = false;\n"+
"  \n"+
"  var parentNode = postIdLink;\n"+
"  \n"+
"  var commentTitleTD;\n"+
"  \n"+
"  while (!commentTitleTRFound) {\n"+
"    var parentNode = parentNode.parentNode;\n"+
"    \n"+
"    if (parentNode.tagName == 'TD') {\n"+
"      commentTitleTD = parentNode;\n"+
"    }\n"+
"    \n"+
"    if (parentNode.tagName == 'TR') {\n"+
"      commentTitleTR = parentNode;\n"+
"      commentTitleTRFound = true;\n"+
"    }\n"+
"  }\n"+
"  \n"+
"  var parentOfTR = commentTitleTR.parentNode;\n"+
"  \n"+
"  var commentContentsTR = commentTitleTR.nextElementSibling;\n"+
"  \n"+
"  commentContentsTR.style.display = 'none';\n"+
"  \n"+
"  var showCommentLink = document.getElementById('denialFilterClimateDebateComHideComment_'+comment_id);\n"+
"  var postJsShowLink = document.createElement('A');\n"+
"  var postJsShowLinkText = document.createTextNode(\"Show hidden comment\");\n"+
"  postJsShowLink.appendChild(postJsShowLinkText);\n"+
"  postJsShowLink.title = \"Show this comment\";\n"+
"  postJsShowLink.href = \"javascript:denialFilterClimateDebateComShowComment('\"+comment_id+\"');\";\n"+
"  postJsShowLink.id = 'denialFilterClimateDebateComShowComment_'+comment_id;\n"+
"  postJsShowLink.className = 'denialFilterClimateDebateComShowComment small2';\n"+
"  postJsShowLink.style.color = '#003D71';\n"+
"  \n"+
"  commentTitleTD.insertBefore(postJsShowLink, showCommentLink);\n"+
"  \n"+
"  showCommentLink.parentNode.removeChild(showCommentLink);\n"+
"  \n"+
"  var postTitleUserName = document.getElementById('denialFilterClimateDebateComHiddenUserName_'+comment_id);\n"+
"  postTitleUserName.style.display = '';\n"+
"}\n"+
"function denialFilterClimateDebateComShowAllComments(commentsBlocked) {\n"+
"  allLinks = document.getElementsByTagName('A');\n"+
"  \n"+
"  for (i = 0; i < allLinks.length; i++) {\n"+
"    if ((' ' + allLinks[i].className + ' ').indexOf(' ' + 'denialFilterClimateDebateComShowComment' + ' ') > -1) {\n"+
"      allLinks[i].click();\n"+
"    }\n"+
"  }\n"+
"  \n"+
"  var postJsShowAllLink = document.getElementById('denialFilterClimateDebateComShowAllComments');\n"+
"  \n"+
"  var postJsShowLink = document.createElement('A');\n"+
"  var postJsShowLinkText = document.createTextNode(\"Hide all blocked comments (\"+commentsBlocked+\")\");\n"+
"  postJsShowLink.appendChild(postJsShowLinkText);\n"+
"  postJsShowLink.title = \"Hide all blocked comments (\"+commentsBlocked+\")\";\n"+
"  postJsShowLink.href = \"javascript:denialFilterClimateDebateComHideAllComments('\"+commentsBlocked+\"');\";\n"+
"  postJsShowLink.id = 'denialFilterClimateDebateComHideAllComments';\n"+
"  postJsShowLink.className = 'denialFilterClimateDebateComHideAllComments small2';\n"+
"  postJsShowLink.style.color = '#003D71';\n"+
"  postJsShowLink.style.float = 'right';\n"+
"  \n"+
"  postJsShowAllLink.parentNode.insertBefore(postJsShowLink, postJsShowAllLink);\n"+
"  \n"+
"  postJsShowAllLink.parentNode.removeChild(postJsShowAllLink);\n"+
"}\n"+
"function denialFilterClimateDebateComHideAllComments(commentsBlocked) {\n"+
"  allLinks = document.getElementsByTagName('A');\n"+
"  \n"+
"  for (i = 0; i < allLinks.length; i++) {\n"+
"    if ((' ' + allLinks[i].className + ' ').indexOf(' ' + 'denialFilterClimateDebateComHideComment' + ' ') > -1) {\n"+
"      allLinks[i].click();\n"+
"    }\n"+
"  }\n"+
"  \n"+
"  var postJsShowAllLink = document.getElementById('denialFilterClimateDebateComHideAllComments');\n"+
"  \n"+
"  var postJsShowLink = document.createElement('A');\n"+
"  var postJsShowLinkText = document.createTextNode(\"Show all hidden comments (\"+commentsBlocked+\")\");\n"+
"  postJsShowLink.appendChild(postJsShowLinkText);\n"+
"  postJsShowLink.title = \"Show all hidden comments (\"+commentsBlocked+\")\";\n"+
"  postJsShowLink.href = \"javascript:denialFilterClimateDebateComShowAllComments('\"+commentsBlocked+\"');\";\n"+
"  postJsShowLink.id = 'denialFilterClimateDebateComShowAllComments';\n"+
"  postJsShowLink.className = 'denialFilterClimateDebateComShowAllComments small2';\n"+
"  postJsShowLink.style.color = '#003D71';\n"+
"  postJsShowLink.style.float = 'right';\n"+
"  \n"+
"  postJsShowAllLink.parentNode.insertBefore(postJsShowLink, postJsShowAllLink);\n"+
"  \n"+
"  postJsShowAllLink.parentNode.removeChild(postJsShowAllLink);\n"+
"}";
    
  // find table containing posts
  var tableElements = document.getElementsByTagName('table');
  
  var commentsTable;
  var commentsTableFound = false;
  
  var  i;

  for (i = 0; i < tableElements.length; i++) {
    if ((' ' + tableElements[i].className + ' ').indexOf(' ' + 'ramme2' + ' ') > -1) {
      commentsTable = tableElements[i];
      commentsTableFound = true;
      break;
    }
  }
  
  var pageType;
  pageType = false;
  if (window.location.pathname == '/') {
    pageType = 'main';
  } else {
    var currentUrlParts = window.location.pathname.split('/');
    if (currentUrlParts[1] == 'forum' && currentUrlParts.length>2 && currentUrlParts[2].indexOf('.') > -1) {
      currentUrlParts = currentUrlParts[2].split('.');
      
      if (currentUrlParts[0].indexOf('-') > -1) {
        currentUrlParts = currentUrlParts[0].split('-');
        var i;
        var j;
        i = currentUrlParts.length;
        i--;
        j = i;
        j--;
        if (currentUrlParts[i].indexOf('f') == 0) {
          pageType = 'f';
        }
        
        if (currentUrlParts[i].indexOf('e') == 0) {
          pageType = 'e';
        }
        
        if (currentUrlParts[i].indexOf('s') == 0 && currentUrlParts[j].indexOf('e') == 0) {
          pageType = 'e';
        }
      }
    } else {
      if (currentUrlParts[1] == 'users.php') {
        pageType = 'users';
      }
      if (currentUrlParts[1] == 'topusers.php') {
        pageType = 'topusers';
      }
      if (currentUrlParts[1].indexOf('.') > -1 && currentUrlParts[1].indexOf('-') > -1) {
        currentUrlParts = currentUrlParts[1].split('.');
        currentUrlParts = currentUrlParts[0].split('-');
        if (currentUrlParts.length == 2 && currentUrlParts[0] == 'users' && currentUrlParts[1].indexOf('s') == 0) {
          pageType = 'users';
        }
      }
    }
    
  }
  
  
  
  if (pageType == 'e' && commentsTableFound) {
    
    var parentDiv = document.getElementById('hoejre');
    var denialFilterClimateDebateComScriptTag = document.createElement('SCRIPT');
    denialFilterClimateDebateComScriptTag.type = "text/javascript";
    
    var denialFilterClimateDebateComScriptTagContents = document.createTextNode(scriptValue);
    denialFilterClimateDebateComScriptTag.appendChild(denialFilterClimateDebateComScriptTagContents); 
    
    parentDiv.insertBefore(denialFilterClimateDebateComScriptTag, commentsTable);
    
    
    var commentsTableTR = commentsTable.getElementsByTagName('tr');
    
    var  i;
    var j;
    
    var commentsBlocked = 0;
    
    for (i = 0; i < commentsTableTR.length; i+=2) {
      j = i
      j++;
      
      var rowTdS = commentsTableTR[j].getElementsByTagName('td');
      
      if (rowTdS.length < 2) {
        i++;
        j++;
      }
      
      var profileTd = commentsTableTR[j].getElementsByTagName('td')[0];
      
      var profileHrefs = profileTd.getElementsByTagName('a');
      var userName;
      if (profileHrefs && profileHrefs.length > 0) {
        
        var profileHref = profileTd.getElementsByTagName('a')[0];
        userName = profileHref.innerHTML;
      } else {
        // first text node from TD
        userName = profileTd.childNodes[0].nodeValue;
      }
      // check if username is on blacklist
      var k;
      var usernameToTest;
      
      var userIsBanned;
      userIsBanned = false;
      
      for (k = 0; k < userNameList.length; k++) {
        usernameToTest = userNameList[k];
        
        if (userName == usernameToTest) {
          userIsBanned = true;
          break;
        }
        
      }
      
      if (userIsBanned) {
        var commentTitleTDs = commentsTableTR[i].getElementsByTagName('td');
        
        for (k = 0; k < commentTitleTDs.length; k++) {
          commentTitleTDs[k].style.backgroundColor = '#FFEEEE';
        } 
      
        var commentEntryTDs = commentsTableTR[j].getElementsByTagName('td');
        for (k = 0; k < commentEntryTDs.length; k++) {
          commentEntryTDs[k].style.backgroundColor = '#FFEEEE';
        }
        
         var l = commentTitleTDs[0].childNodes.length;
        l--;
        
        var postIdLinks = commentTitleTDs[0].getElementsByTagName('a');
        var postIdLink;
        var postIdLinkFound = false;
        for (m=0; m<postIdLinks.length; m++) { 
          if ((' ' + postIdLinks[m].className + ' ').indexOf(' ' + 'post' + ' ') > -1) {
            postIdLink = postIdLinks[m];
            break;
          }
        }
        
        // get instead first link in this TD, it may have different class in some cases
        if (!postIdLinkFound) {
          postIdLink = postIdLinks[0];
        }
        
        var postEntryDate = commentTitleTDs[0].childNodes[1];
        
        var postDateText = postEntryDate.textContent ? postEntryDate.textContent : postEntryDate.innerText;
         
        var postTitleClear = document.createElement('DIV');
        postTitleClear.style.clear = 'both';
        commentTitleTDs[0].insertBefore(postTitleClear, postEntryDate);
        commentTitleTDs[0].insertBefore(postEntryDate, postTitleClear);
        
        var postJsShowLink = document.createElement('A');
        postJsShowLink.id = 'denialFilterClimateDebateComShowComment_'+postIdLink.id;
        var postJsShowLinkText = document.createTextNode("Show hidden comment");
        postJsShowLink.appendChild(postJsShowLinkText);
        postJsShowLink.title = "Show this comment";
        postJsShowLink.href = "javascript:denialFilterClimateDebateComShowComment('"+postIdLink.id+"');";
        postJsShowLink.className = 'denialFilterClimateDebateComShowComment small2';
        postJsShowLink.style.color = '#003D71';
        
        commentTitleTDs[0].insertBefore(postJsShowLink, postTitleClear);
        commentTitleTDs[0].insertBefore(postTitleClear, postJsShowLink);
        
        commentsTableTR[j].style.display='none';
        
        var postTitleUserNameSpan = document.createElement('SPAN');
        postTitleUserNameSpan.style.float = 'left';
        postTitleUserNameSpan.id = 'denialFilterClimateDebateComHiddenUserName_'+postIdLink.id;
        postTitleUserNameSpan.className = 'small2';
        
        var postTitleUserName = document.createElement('A');
        postTitleUserName.href = profileHref.href;
        postTitleUserName.innerHTML = userName;
        postTitleUserName.style.color = '#003D71';
        
        postTitleUserNameSpan.appendChild(postTitleUserName);
        commentTitleTDs[0].insertBefore(postTitleUserNameSpan, postJsShowLink);
        
        postTitleUserNameSpan.innerHTML = 'posted by: '+postTitleUserNameSpan.innerHTML;
        
        commentsBlocked++;
      } else {
        if (options.hide_quoted_comments) {
          // check in quotes, and optionally hide cited content from banned users
          var postTd = commentsTableTR[j].getElementsByTagName('td')[1];
          var packDiv;
          packDiv = false;
          var blockedCommentQuote;
          blockedCommentQuote = false;
          var isQuote;
          isQuote = false;
          denialFilterClimateDebateComHideQuote(userNameList, postTd, packDiv, isQuote, blockedCommentQuote);
          
          
        }
      }
    }
    
    if (commentsBlocked>0) {
      var postJsShowAllLink = document.createElement('A');
      postJsShowAllLink.id = 'denialFilterClimateDebateComShowAllComments';
      var postJsShowAllLinkText = document.createTextNode("Show all hidden comments ("+commentsBlocked+")");
      postJsShowAllLink.appendChild(postJsShowAllLinkText);
      postJsShowAllLink.title = "Show all hidden comments ("+commentsBlocked+")";
      postJsShowAllLink.href = "javascript:denialFilterClimateDebateComShowAllComments('"+commentsBlocked+"');";
      postJsShowAllLink.className = 'denialFilterClimateDebateComShowAllComments small2';
      postJsShowAllLink.style.color = '#003D71';
      postJsShowAllLink.style.float = 'right';
      commentsTable.parentNode.insertBefore(postJsShowAllLink, commentsTable);
    }
    
    var currentUrlParts = window.location.href.split('#');
    var i = currentUrlParts.length;
    i--;
    var anchorId = currentUrlParts[i];
    document.getElementById(anchorId).scrollIntoView();
  }
  
  // /find.php? page
  if (!pageType) {
    var currentUrlParts = window.location.pathname.split('/');
    if (currentUrlParts[1] == 'find.php') {
      var resultsDiv = document.getElementById('hoejre');
      
      var spanElements = resultsDiv.getElementsByTagName('span');
      var  i;
      
      for (i = 0; i < spanElements.length; i++) {
        if ((' ' + spanElements[i].className + ' ').indexOf(' ' + 'small2' + ' ') > -1) {
          var profileHref = spanElements[i].getElementsByTagName('a')[0];
          var userName = profileHref.innerHTML;
          // check if username is on blacklist
          var k;
          var usernameToTest;
          
          var userIsBanned;
          userIsBanned = false;
          
          var alertTestMSG;
          for (k = 0; k < userNameList.length; k++) {
            usernameToTest = userNameList[k];
            
            if (userName == usernameToTest) {
              userIsBanned = true;
              break;
            }
          }
          
          if (userIsBanned) {
            spanElements[i].style.backgroundColor = '#FFEEEE';
            
            var commentTitleAFound = false;
            
            var currentElement = spanElements[i];
            
            while (!commentTitleAFound) {
              currentElement = currentElement.previousElementSibling;
              
              currentElement.style.backgroundColor = '#FFEEEE';
              if (currentElement.tagName == 'A') {
                commentTitleAFound = true;
              }
            }
            var commentTitleAFound = false;
            var currentElement = spanElements[i];
            while (!commentTitleAFound) {
              currentElement = currentElement.nextElementSibling;
              
              currentElement.style.backgroundColor = '#FFEEEE';
              if (currentElement.tagName == 'SPAN') {
                commentTitleAFound = true;
              }
            }
          }
        }
      }
    }
  }
  
  // list of topics on forums
  /* // username of poster is removed, so this part no longer works
  if (pageType == 'f') {
    var resultsDiv = document.getElementById('hoejre');
    var tableElements = resultsDiv.getElementsByTagName('table');
    var resultsTable;
    var i;
    
    for (i = 0; i < tableElements.length; i++) {
      if ((' ' + tableElements[i].className + ' ').indexOf(' ' + 'ramme' + ' ') > -1) {
        
        resultsTable = tableElements[i];
        var commentsTableTR = resultsTable.getElementsByTagName('tr');
        var firstRow;
        firstRow = true;
        
        var j;
        
        var commentsBlocked = 0;
        
        for (j = 0; j < commentsTableTR.length; j++) {
          if (firstRow) {
            // skip table header
            firstRow = false;
            continue;
          }
          
          var tdElements = commentsTableTR[j].getElementsByTagName('td');
          
          var profileTd = tdElements[2];
          var userName = profileTd.innerHTML;
          
          // check if username is on blacklist
          var k;
          var usernameToTest;
          
          var userIsBanned;
          userIsBanned = false;
          
          for (k = 0; k < userNameList.length; k++) {
            usernameToTest = userNameList[k];
            
            if (userName == usernameToTest) {
              userIsBanned = true;
              break;
            }
          }
          if (userIsBanned) {
            for (k = 0; k < tdElements.length; k++) {
              tdElements[k].style.backgroundColor = '#FFEEEE';
            }
          }
        }
      }
    }
  }*/
  
  // highlight on latest posts on main page
  if (pageType == 'main') {
    var resultsDiv = document.getElementById('hoejre');
    var tableElements = resultsDiv.getElementsByTagName('table');
    var resultsTable;
    var i;
    
    for (i = 0; i < tableElements.length; i++) {
      if ((' ' + tableElements[i].className + ' ').indexOf(' ' + 'ramme' + ' ') > -1) {
        
        resultsTable = tableElements[i];
        var commentsTableTR = resultsTable.getElementsByTagName('tr');
        var j;
        for (j = 0; j < commentsTableTR.length; j++) {
          var tdElements = commentsTableTR[j].getElementsByTagName('td');
          var skipHeader;
          skipHeader = false;
          var firstTdLinks;
          
          if (tdElements.length<4) {
            skipHeader = true;
          }
          if (skipHeader) {
            // skip table header
            continue;
          }
          
//           var profileHref = tdElements[2].getElementsByTagName('a')[0];
//           var userName = profileHref.innerHTML;
          var userName = tdElements[2].innerHTML;
          
          // check if username is on blacklist
          var k;
          var usernameToTest;
          
          var userIsBanned;
          userIsBanned = false;
          
          for (k = 0; k < userNameList.length; k++) {
            usernameToTest = userNameList[k];
            
            if (userName == usernameToTest) {
              userIsBanned = true;
              break;
            }
          }
          if (userIsBanned) {
            for (k = 0; k < tdElements.length; k++) {
              tdElements[k].style.backgroundColor = '#FFF8F8';
            }
            tdElements[2].style.backgroundColor = '#FFEEEE';
          }
        }
      }
    }
  }
  
  // highlight on list of users
  if (pageType == 'users' || pageType == 'topusers') {
    var resultsDiv = document.getElementById('hoejre');
    var tableElements = resultsDiv.getElementsByTagName('table');
    var resultsTable;
    var i;
    
    for (i = 0; i < tableElements.length; i++) {
      if ((' ' + tableElements[i].className + ' ').indexOf(' ' + 'ramme' + ' ') > -1) {
        
        resultsTable = tableElements[i];
        var commentsTableTR = resultsTable.getElementsByTagName('tr');
        var firstRow;
        firstRow = true;
        
        var j;
        
        var commentsBlocked = 0;
        
        for (j = 0; j < commentsTableTR.length; j++) {
          if (firstRow) {
            // skip table header
            firstRow = false;
            continue;
          }
          
          var tdElements = commentsTableTR[j].getElementsByTagName('td');
          
          if (pageType == 'users') {
            var profileTd = tdElements[0];
          } else {
            var profileTd = tdElements[1];
          }
          var profileHref = profileTd.getElementsByTagName('a');
          var userName;
          if (!profileHref || profileHref.length == 0) {
            userName = profileTd.innerHTML;
          } else {
            userName = profileHref[0].innerHTML;
          }
          
          // check if username is on blacklist
          var k;
          var usernameToTest;
          
          var userIsBanned;
          userIsBanned = false;
          
          for (k = 0; k < userNameList.length; k++) {
            usernameToTest = userNameList[k];
            
            if (userName == usernameToTest) {
              userIsBanned = true;
              break;
            }
          }
          if (userIsBanned) {
            for (k = 0; k < tdElements.length; k++) {
              tdElements[k].style.backgroundColor = '#FFEEEE';
            }
          }
        }
      }
    }
  }
}

/**
 * @param array userNameList
 *  list of banned usernames
 * @param node parentDiv 
 *  DOM element to search quotes in
 * @param bool packDiv
 *  false: in comment main content, do not pack contents in div's
 *  true: content of current level of quote except nested quotes will be 'packed' into divs to allow independent of other nested quotes levels hiding per quote
 * @param bool isQuote
 *  true: parentDiv is quote
 * @param bool blockedCommentQuote
 *  true: parentDiv is quote of blocked comment
 *  
 * 
 * **/
function denialFilterClimateDebateComHideQuote(userNameList, parentDiv, packDiv, isQuote, blockedCommentQuote) {
  // CANCELLLED:TODO just add class here, actual hiding/unhiding will be done in functions in var scriptValue
  // just add backgroundColor
  
  // find all 
  var commentTextNodes = parentDiv.childNodes;
  
  var i;
  var newDivPackNeeded;
  newDivPackNeeded = true;
  var currentDivPack;
  
  if (isQuote) {
    if (blockedCommentQuote) {
      parentDiv.style.backgroundColor = '#FFEEEE';
    } else {
      parentDiv.style.backgroundColor = '#F6F6F6';
    }
  }
  
  for (i = 0; i < commentTextNodes.length; i++) {
    if (commentTextNodes[i].tagName == 'BLOCKQUOTE') {
      var subPackDiv;
      subPackDiv = true;
      var subIsQuote;
      subIsQuote = true;
      var subBlockedCommentQuote;
      subBlockedCommentQuote = false;
      
      // check first line && first <b> tag if quote was written by banned username
      var quotedCommentTextNodes = commentTextNodes[i].childNodes;
      
      var quoteTitle;
      var quoteTitleParts;
      var quoteTitleParsed;
      var userName;
      
      var j;
      for (j = 0; j < quotedCommentTextNodes.length; j++) {
        if (quotedCommentTextNodes[j].nodeType == 1) {
          if (quotedCommentTextNodes[j].tagName == 'B') {
            quoteTitle = quotedCommentTextNodes[j].innerText;
            quoteTitleParts = quoteTitle.split(' wrote:');
            var k;
            if (!quoteTitleParts.length || quoteTitleParts.length==1) {
              // only username
              quoteTitleParsed = quoteTitle;
            } else {
              // pop last element, and glue the rest with ' wrote:'
              var prevPartAdded;
              prevPartAdded = false;
              var k_limit;
              k_limit = quoteTitleParts.length;
              k_limit--;
              
              for (k = 0; k < k_limit; k++) {
                if (prevPartAdded) {
                  quoteTitleParsed = quoteTitleParsed+' wrote:'+quoteTitleParts[k];
                } else {
                  quoteTitleParsed = quoteTitleParts[k];
                }
              }
              
            }
            userName = quoteTitleParsed;
            // check if banned user
            var usernameToTest;
            
            for (k = 0; k < userNameList.length; k++) {
              usernameToTest = userNameList[k];
              
              if (userName == usernameToTest) {
                subBlockedCommentQuote = true;
                break;
              }
              
            }
          }
          break;
        }
      }
      
      
      denialFilterClimateDebateComHideQuote(userNameList, commentTextNodes[i], subPackDiv, subIsQuote, subBlockedCommentQuote);
      //  TODO new pack div here
      newDivPackNeeded = true;
    }
    
    if (newDivPackNeeded) {
      // prepare new div for quoted comment contents
    }
    
    //
  }
}

denialFilterClimateDebateCom();