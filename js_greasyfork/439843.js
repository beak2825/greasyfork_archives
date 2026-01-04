// ==UserScript==
// @name                Waze Fix Forum Styling (aka FFS...)
// @namespace           http://greasemonkey.chizzum.com
// @description         Restyles the Waze forum pages to deal with the excesses of the native design
// @include             https://www.waze.com/forum/*
// @grant               none
// @supportURL          https://www.waze.com/forum/viewtopic.php?t=341259
// @version             1.13
// @downloadURL https://update.greasyfork.org/scripts/439843/Waze%20Fix%20Forum%20Styling%20%28aka%20FFS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439843/Waze%20Fix%20Forum%20Styling%20%28aka%20FFS%29.meta.js
// ==/UserScript==

/* JSHint Directives */
/* jshint esversion: 6 */
/* globals trustedTypes: */

// ===========================================================================================
// FIX BEFORE RELEASE
//
// ===========================================================================================

const WazeFFS =
{
   ver: "1.13",
   prefix: "WazeFFS",
   enabled: true,
   dmEnabled: false,

   ModifyHTML: function(htmlIn)
   {
      if(typeof trustedTypes === "undefined")
      {
         return htmlIn;
      }
      else
      {
         const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {createHTML: (to_escape) => to_escape});
         return escapeHTMLPolicy.createHTML(htmlIn);
      }
   },
   AddGlobalStyle: function(css)
   {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) 
      {
         return;
      }
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = css;
      head.appendChild(style);
   },
   AddStyle: function(ID, css)
   {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head) 
      {
         return;
      }
      WazeFFS.RemoveStyle(ID); // in case it is already there
      style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = WazeFFS.ModifyHTML(css);
      style.id = ID;
      head.appendChild(style);
   },
   RemoveStyle: function(ID)
   {
      var style = document.getElementById(ID);
      if (style) 
      {
         style.parentNode.removeChild(style); 
      }
   },
   GetMyCB: function(node)
   {
      var retval = null;
      var cbObj = document.getElementById(node);
      if(cbObj !== null)
      {
         if(cbObj.type === 'checkbox')
         {
            retval = cbObj;
         }
      }
      return retval;
   },
   SetMyCBState: function(node, state)
   {
      var cbObj = WazeFFS.GetMyCB(node);
      if(cbObj !== null)
      {
         cbObj.checked = state;
      }
   },      
   GetMyCBState: function(node)
   {
      var retval = null;
      var cbObj = WazeFFS.GetMyCB(node);
      if(cbObj !== null)
      {
         retval = cbObj.checked;
      }
      return retval;
   },
   InsertNodeBeforeNode: function(insertNode, beforeNode)
   {
      beforeNode.parentNode.insertBefore(insertNode,beforeNode);
   },
   InsertNodeAfterNode: function(insertNode, afterNode)
   {
      WazeFFS.InsertNodeBeforeNode (insertNode, afterNode);
      WazeFFS.InsertNodeBeforeNode (afterNode,insertNode);
   },
   RemoveLastOccurrence: function(srcStr, toRemove)
   {
      var retval = srcStr;
      var io = srcStr.lastIndexOf(toRemove);
      if(io != -1)
      {
         var rl = toRemove.length;
         retval = srcStr.substring(0, io) + srcStr.substring(io + rl);
      }
      return retval;
   },
   WriteLog: function(msg)
   {
      console.debug(WazeFFS.prefix+': '+msg);
   },
   LoadSettings: function()
   {
      if (localStorage.WazeFFSSettings) 
      {
         var settings = JSON.parse(localStorage.WazeFFSSettings);
         for(var i = 0; i < settings.length; ++i)
         {
            if(settings[i].apply === true)
            {
               WazeFFS.SetMyCBState(settings[i].name, settings[i].value);
            }
         }
      }
   },
   SaveSettings: function()
   {
      if(WazeFFS.GetMyCB('_cbFFSEnabled') !== null)
      {
         if(localStorage)
         {
            let settings = [];

            settings.push({name:'version', value:WazeFFS.ver, apply:false});

            let inputElms = document.getElementsByTagName('input');
            for(let i = 0; i < inputElms.length; ++i)
            {
               let elmID = inputElms[i].id;
               if(elmID.indexOf('_cbFFS') === 0)
               {
                  settings.push({name:elmID, value:WazeFFS.GetMyCBState(elmID), apply:true});      
               }
            }
            
            localStorage.WazeFFSSettings = JSON.stringify(settings);
         }
      }
   },
   AddUI: function()
   {
      WazeFFS.AddStyle(WazeFFS.prefix+"AddUI", ".control_bar_middle_waze { padding-top: 28px; }");
      var hostElement = document.getElementsByClassName('control_bar_placeholder');
      if(hostElement.length > 0)
      {
         hostElement = hostElement[0];
         
         var uiElement = document.createElement('div');
         uiElement.style.position = "fixed";
         uiElement.style.zIndex = "1000";
         uiElement.style.backgroundColor = "#ffffff";
         uiElement.style.padding = "0px 4px 4px 4px";
         uiElement.style.left = "0px";
         uiElement.display = "flex";
         uiElement.className = "ffsControlBar";

         var tHTML = '';
         tHTML += '<a href="https://greasyfork.org/en/scripts/439843-waze-fix-forum-styling-aka-ffs">FFS v'+WazeFFS.ver+'</a>';
         tHTML += '<font color="#000000">';
         tHTML += ' | Compress whitespace: <input type="checkbox" id="_cbFFSEnabled">&nbsp;';
         tHTML += ' (Use full window width: <input type="checkbox" id="_cbFFSMWEnabled">)&nbsp;';
         tHTML += ' | Dark mode: <input type="checkbox" id="_cbFFSDMEnabled">&nbsp;';
         tHTML += ' | Indent own posts: <input type="checkbox" id="_cbFFSIndentOwn">&nbsp;';
         tHTML += ' | Highlight: ';
         tHTML += 'unanswered posts <input type="checkbox" id="_cbFFSUnlovedPosts">&nbsp;';
         tHTML += 'bumped by author <input type="checkbox" id="_cbFFSBumpedPosts">';
         tHTML += ' | Hide: ';
         tHTML += 'thanks <input type="checkbox" id="_cbFFSHideThanks">&nbsp;';
         tHTML += 'ratings <input type="checkbox" id="_cbFFSHideRatings">&nbsp;';
         tHTML += 'signatures <input type="checkbox" id="_cbFFSHideSignatures">';
         tHTML += '</font>';
         uiElement.innerHTML = WazeFFS.ModifyHTML(tHTML);
         WazeFFS.InsertNodeBeforeNode(uiElement, hostElement);

         WazeFFS.GetMyCB('_cbFFSEnabled').onclick = WazeFFS.ApplySettings;
         WazeFFS.GetMyCB('_cbFFSMWEnabled').onclick = WazeFFS.MaximiseWidth;
         WazeFFS.GetMyCB('_cbFFSDMEnabled').onclick = WazeFFS.DarkMode;
         WazeFFS.GetMyCB('_cbFFSIndentOwn').onclick = WazeFFS.IndentPosts;
         WazeFFS.GetMyCB('_cbFFSUnlovedPosts').onclick = WazeFFS.HighlightPosts;
         WazeFFS.GetMyCB('_cbFFSBumpedPosts').onclick = WazeFFS.HighlightPosts;
         WazeFFS.GetMyCB('_cbFFSHideThanks').onclick = WazeFFS.HideThanks;
         WazeFFS.GetMyCB('_cbFFSHideRatings').onclick = WazeFFS.HideRatings;
         WazeFFS.GetMyCB('_cbFFSHideSignatures').onclick = WazeFFS.HideSignatures;
      }
   },
   Init: function()
   {
      WazeFFS.WriteLog("Waze FFS initialising...");
      WazeFFS.AddUI();
      WazeFFS.LoadSettings();
      WazeFFS.DarkMode();
      WazeFFS.ApplySettings();
   },
   ApplySettings: function()
   {
      WazeFFS.enabled = WazeFFS.GetMyCBState('_cbFFSEnabled');
      WazeFFS.CompressEntries();
      WazeFFS.CompressWelcomeBar();
      WazeFFS.CompressSectionHeaders();
      WazeFFS.LegibilityFixes();
      WazeFFS.HideRatings();
      WazeFFS.HideSignatures();
      WazeFFS.HideThanks();
      WazeFFS.AddPaginationAtTop();
      WazeFFS.IndentPosts();
      WazeFFS.HighlightPosts();
      WazeFFS.AddMyTopicsLink();
      WazeFFS.MaximiseWidth();
      WazeFFS.SaveSettings();
   },
   DarkMode: function()
   {
      // Thanks to bedo2991 for their hard work getting the bulk of
      // this dark mode styling sorted out

      const nameColoursLight =
      [
         'rgb(204, 0, 0)',
         'rgb(0, 102, 153)',
         'rgb(51, 153, 153)',
         'rgb(158, 141, 167)',
         'rgb(0, 102, 102)',
         'rgb(0, 102, 0)',
         'rgb(255, 102, 0)',
         'rgb(51, 51, 255)',
         'rgb(153, 51, 204)',
         'rgb(102, 102, 102)',
         'rgb(0, 51, 51)',
         'rgb(64, 128, 255)',
         'rgb(153, 153, 204)',
         'rgb(0, 0, 204)',
         'rgb(102, 204, 153)',
         'rgb(51, 0, 204)',
         'rgb(255, 204, 0)',
         'rgb(255, 153, 0)',
         'rgb(0, 0, 0)',
         'rgb(102, 204, 255)',
         'rgb(102, 51, 153)',
         'rgb(0, 153, 153)',
         'rgb(102, 102, 255)',
         'rgb(87, 81, 73)',
         'rgb(255, 0, 0)'
      ];
      const nameColoursDark =
      [
         'rgb(51, 255, 255)',
         'rgb(255, 153, 102)',
         'rgb(204, 102, 102)',
         'rgb(97, 114, 88)',
         'rgb(255, 153, 153)',
         'rgb(255, 153, 255)',
         'rgb(0, 153, 255)',
         'rgb(204, 204, 0)',
         'rgb(102, 204, 51)',
         'rgb(153, 153, 153)',
         'rgb(255, 204, 204)',
         'rgb(191, 127, 0)',
         'rgb(102, 102, 255)',
         'rgb(255, 255, 51)',
         'rgb(153, 51, 102)',
         'rgb(204, 255, 51)',
         'rgb(0, 51, 255)',
         'rgb(0, 102, 255)',
         'rgb(255, 255, 255)',
         'rgb(180, 128, 192)',
         'rgb(153, 204, 102)',
         'rgb(255, 102, 102)',
         'rgb(153, 153, 0)',
         'rgb(168, 174, 182)',
         'rgb(0, 255, 255)'
      ];

      const fname = "DarkMode";
      const GREYSCALE = ['#101010', '#303030', '#444444', '#787878', '#BABABA', '#F0F0F0'];
  
      WazeFFS.dmEnabled = WazeFFS.GetMyCBState('_cbFFSDMEnabled');

      let nNames = document.getElementsByClassName('username-coloured').length;
      for(let i = 0; i < nNames; ++i)
      {
         let tName = document.getElementsByClassName('username-coloured')[i];
         let tCol = tName.style.color;
         if(WazeFFS.dmEnabled === false)
         {
            let cIndex = nameColoursDark.indexOf(tCol);
            if(cIndex != -1)
            {
               tName.style.color = nameColoursLight[cIndex];
            }
         }
         else
         {
            let cIndex = nameColoursLight.indexOf(tCol);
            if(cIndex != -1)
            {
               tName.style.color = nameColoursDark[cIndex];
            }
         }
      }
      
      if(WazeFFS.dmEnabled === true)
      {
         var styles = "";
         // Greyscale theming
         styles += 'body { background-color:'+GREYSCALE[0]+'!important; color:'+GREYSCALE[1]+' !important; }';
         styles += '.bg-gray-100{ background-color:'+GREYSCALE[1]+'; }';
         styles += 'h1,h2,h3,h4,h5,h6,.forum-header h1{ color:'+GREYSCALE[5]+'; }';
         styles += '.content{ color:'+GREYSCALE[4]+': }';
         styles += '.postprofile{ color:'+GREYSCALE[4]+': }';
         styles += '.postprofile strong{ color:'+GREYSCALE[4]+': }';
         styles += '.bg1{ background-color:'+GREYSCALE[1]+'; }';
         styles += '.bg2{ background-color:'+GREYSCALE[1]+'; }';
         styles += '.waze-grey-800, a.waze-grey-800{ color:'+GREYSCALE[4]+'; }';
         styles += '.waze-grey-900, a.waze-grey-900, .wz-forums-grey-900{ color:'+GREYSCALE[3]+'; }';
         styles += '.text-gray-900{ color:'+GREYSCALE[3]+'; }';
         styles += '.text-gray-800{ color:'+GREYSCALE[5]+'; }';
         styles += '.text-body-2{ color:'+GREYSCALE[3]+'; }';
         styles += '.page-body{ color:'+GREYSCALE[3]+'; }';
         styles += '.bg-gray-200{ background-color:'+GREYSCALE[4]+'; }';
         styles += '.cp-mini{ background-color:'+GREYSCALE[1]+'; }';
         styles += '#phpbb blockquote{ background-color:'+GREYSCALE[0]+'; color:'+GREYSCALE[4]+' }';
         styles += '#phpbb blockquote a{ color:'+GREYSCALE[5]+' !important; }';
         styles += '.topiclist li.header{ color:'+GREYSCALE[5]+'; background-color:'+GREYSCALE[4]+' }';
         styles += 'ul.forums{ background-color:'+GREYSCALE[1]+'; color:'+GREYSCALE[5]+' }';
         styles += 'li.row dd.posts, li.row dd.views{ color: '+GREYSCALE[4]+'; }';
         styles += '.postprofile strong{ color: '+GREYSCALE[4]+'; }';
         styles += '.wz-forums-grey-800{ color: '+GREYSCALE[4]+'; }';
         styles += '.wz-forums-grey-700{ color: '+GREYSCALE[4]+'; }';
         styles += '.stat-block{ background-color: '+GREYSCALE[0]+'; }';
         styles += '.footer-block .footer-block-content div{ color: '+GREYSCALE[3]+'!important; }';
         styles += '.panel{ color: '+GREYSCALE[3]+'; background-color: '+GREYSCALE[1]+'; }';
         styles += '.content{ color: '+GREYSCALE[4]+'; }';
         styles += 'body#phpbb.hasjs select:not{ background-color: '+GREYSCALE[1]+'!important; }';
         styles += '#phpbb .row .list-inner{ color: '+GREYSCALE[3]+'; }';
         styles += 'dd.lastpost{ color: '+GREYSCALE[3]+'; }';
         styles += 'article.ucp-main{ color: '+GREYSCALE[3]+'!important; }';
         styles += '.mr-3{ color: '+GREYSCALE[3]+'; }';
         styles += 'fieldset.fields1{ background-color: '+GREYSCALE[1]+'; color: '+GREYSCALE[3]+'!important; }';
         styles += '.mb-3{ color: '+GREYSCALE[3]+'; }';
         styles += 'form.ucp-form{ color: '+GREYSCALE[3]+'; }';
         styles += 'div.tabs-content{ background-color: '+GREYSCALE[3]+'!important; }';
         styles += '.pagination{ color: '+GREYSCALE[4]+'; }';
         styles += '.topiclist li.header{ color: '+GREYSCALE[1]+'; }';
         styles += 'td.active{ color: '+GREYSCALE[3]+'; }';
         styles += '.mainpage-title { color:'+GREYSCALE[0]+'; }';
         styles += '.number { color:'+GREYSCALE[0]+'; }';
         styles += '.text { color:'+GREYSCALE[0]+'; }';
         styles += 'li.row strong { color:'+GREYSCALE[4]+'; }';
         styles += 'li.row:hover{ background-color:'+GREYSCALE[0]+'; }';
         styles += '.mx-3 { color:'+GREYSCALE[5]+'; }';
         styles += '.explain { color:'+GREYSCALE[4]+'!important; }';
         styles += '.pl-6:hover, .pl-3:hover { background-color:'+GREYSCALE[2]+'!important; }';
         styles += '.member__left-col { color:'+GREYSCALE[4]+'!important; }';
         styles += '.member__col { color:'+GREYSCALE[5]+'; }';
         styles += '.memberlist--boxes .h3 { color:'+GREYSCALE[3]+'; }';
         styles += '.post-content-and-profile-wrp { color:'+GREYSCALE[4]+'; }';

         styles += '.footer-block-icon { filter:brightness(4); }';
         styles += 'wz-radio-button, wz-checkbox { filter:invert(); }';
         styles += 'wz-button { filter:brightness(0.85) invert(); }';
         styles += '.before-explain { filter:invert(); }';
         styles += '.waze-already-commented { filter:invert() brightness(2); }';
         styles += '.tabs { filter:invert(); }';

         styles += 'a.topictitle { color:'+GREYSCALE[4]+'!important; }';
         styles += '.footer-block .footer-block-content div { color:'+GREYSCALE[4]+'!important; }';

         styles += '.error { color:#FF8040; }';

         // Colour accents
         styles += '.bg-color-blue-topic{ background-color:#102030; }';
         styles += '.waze-grey-800:hover{ color: #a0a000; }';
         styles += 'a:hover{ color: #ffff00; }';
         styles += '.waze-grey-900:hover{ color: #a0a000; }';

         // Maintain a white background behind any embedded images - this mainly helps avoid problems
         // if someone's used a transparent signature image containing elements rendered in darker
         // colours which would show up fine with the default forum colours but become (near) impossible
         // to see when dark mode is enabled...
         styles += '.postimage { background-color: white; }';

         WazeFFS.AddStyle(WazeFFS.prefix + fname, styles);         
      }
      else
      {
         WazeFFS.RemoveStyle(WazeFFS.prefix + fname);
      }
      WazeFFS.SaveSettings();
      WazeFFS.HighlightPosts();
   },
   MaximiseWidth: function()
   {
      let fname = "MaximiseWidth";
      let mwEnabled = WazeFFS.GetMyCBState('_cbFFSMWEnabled');
      let styles = '.profile-wrp { flex: 0 0 0; }';
      if((WazeFFS.enabled === true) && (mwEnabled == true))
      {
         styles += '.main_content { max-width: 95%; }';
      }
      else
      {
         styles += '.main_content { max-width: 67%; }';
      }
      WazeFFS.AddStyle(WazeFFS.prefix + fname, styles);
      WazeFFS.SaveSettings();
   },   
   CompressEntries: function()
   {
      let fname = "CompressEntries";
      if(WazeFFS.enabled === true)
      {
         let styles = "";

         styles += '.forum-description { padding-bottom: 0px; }';
         styles += '.forumlist_body .list-inner { max-width: 100%; }';
         styles += '.forum-description { padding-bottom: 0px; }';
         styles += '.mt-4 { margin-top: 4px; }';
         styles += '.mt-6 { margin-top: 0px; }';
         styles += '.pa-6 { padding-top: 8px; padding-bottom: 0px; margin-bottom: 4px; }';
         styles += '.signature { padding-top: 4px; margin-top: 4px; }';
         styles += '.row_has_subject { padding: 2px !important; }';
         styles += 'li.row { padding: 2px !important; }';
         styles += '.row .pagination { margin-top: 8px !important; }';
         styles += '.profile-rank img { max-width: 48px; }';
         styles += '.notice { padding-top: 2px; margin-top: 0px; }';
         styles += '.profile-wrp { flex: 0 0 0; }';

         WazeFFS.AddStyle(WazeFFS.prefix + fname, styles);

         let nListInner = document.getElementsByClassName('list-inner').length;
         for(let i = 0; i < nListInner; ++i)
         {
            let tObj = document.getElementsByClassName('list-inner')[i];
            tObj.innerHTML = WazeFFS.ModifyHTML(tObj.innerHTML.replace('<br>','<!-- br -->'));
         }
      }
      else
      {
         WazeFFS.RemoveStyle(WazeFFS.prefix + fname);

         let nListInner = document.getElementsByClassName('list-inner').length;
         for(let i = 0; i < nListInner; ++i)
         {
            let tObj = document.getElementsByClassName('list-inner')[i];
            tObj.innerHTML = WazeFFS.ModifyHTML(tObj.innerHTML.replace('<!-- br -->','<br>'));
         }
      }
   },
   CompressWelcomeBar: function()
   {
      var fname = "CompressWelcomeBar";
      if(WazeFFS.enabled === true)
      {
         var styles = "";
         
         styles += '.mainpage-title__wrapper { padding: 8px 0px 8px 0px; }';
         styles += '.hp-header { height: 100%; }';
         styles += '.hp-header svg { display: none; }';
         styles += '.mt-15 { margin-top: 8px; }';
         styles += '.mb-6 { margin-bottom: 8px; }';

         WazeFFS.AddStyle(WazeFFS.prefix + fname, styles);
      }
      else
      {
         WazeFFS.RemoveStyle(WazeFFS.prefix + fname);
      }
   },
   CompressSectionHeaders: function()
   {
      var fname = "CompressSectionHeaders";
      if(WazeFFS.enabled === true)
      {
         var styles = "";

         // Stuff that mostly/entirely affects the main forum pages
         styles += '.mb-6 { padding: 0px; }';
         styles += '.forum-section-title-wrp { margin-bottom: 4px; }';
         styles += '.forum-section-title {margin-bottom: 4px; }';
         styles += '.viewfroum_body { margin-bottom: 8px; }';
         styles += '.bar-bottom { margin: 0px !important; }';
         styles += '.copyright { margin: 0px; }';
         styles += 'li.header { height: 100% !important; }';
         styles += 'li.header dd { padding: 4px !important; }';
         styles += 'li.header dl.row-item dt { height: 100%; }';
         styles += 'ul.topiclist dl { min-height: 0px; }';
         styles += '.nav-breadcrumbs { max-width: 100%; }';
         styles += '.post-top-buttons { transform: translateY(-20px); }';

         // Stuff that affects the search results pages
         styles += '.h1 { font-size: 28px; margin-bottom: 0px; margin-top: 0px; }';
         styles += '.my-6 { margin-top: 4px; margin-bottom: 4px; }';

         // Stuff that affects PM pages
         styles += '.py-4 { padding-top: 4px; padding-bottom: 4px; }';
         styles += '.ucp_pm_viewfolder .row-item:before { top: 4px!important; }';
         styles += 'h2 { margin: 0px; }';

         WazeFFS.AddStyle(WazeFFS.prefix + fname, styles);
      }
      else
      {
         WazeFFS.RemoveStyle(WazeFFS.prefix + fname);
      }
   },
   LegibilityFixes: function()
   {
      var fname = "LegibilityFixes";
      if(WazeFFS.enabled === true)
      {
         var styles = "";

         styles += 'a.postlink { font-size: 14px !important; }';

         WazeFFS.AddStyle(WazeFFS.prefix + fname, styles);
      }
      else
      {
         WazeFFS.RemoveStyle(WazeFFS.prefix + fname);
      }
   },
   AddMyTopicsLink: function()
   {
      let tObj = document.getElementsByTagName('wz-header-user-panel');
      if(tObj.length == 1)
      {
         for(let cn of tObj[0].childNodes)
         {
            if(cn.nodeType == 8)
            {
               let nData = cn.data;
               nData = nData.replace('<li>','');
               nData = nData.replace('</li>','');
               let tNode = document.createElement('li');
               tNode.innerHTML = WazeFFS.ModifyHTML(nData);
               let tA = tNode.getElementsByTagName('a');
               if(tA.length == 1)
               {
                  tA[0].href = './search.php?search_id=egosearch';
                  tA[0].innerText = "My topics";
                  cn.replaceWith(tNode);
               }
            }
         }
      }
   },
   HideThanks: function()
   {
      var fname = "HideThanks";
      if(WazeFFS.GetMyCBState('_cbFFSHideThanks') === true)
      {
         var styles = "";

         styles += '[id^="list_thanks"] { display: none; }';

         WazeFFS.AddStyle(WazeFFS.prefix + fname, styles);
      }
      else
      {
         WazeFFS.RemoveStyle(WazeFFS.prefix + fname);
      }
      WazeFFS.SaveSettings();
   },
   HideRatings: function()
   {
      var fname = "HideRating";
      if(WazeFFS.GetMyCBState('_cbFFSHideRatings') === true)
      {
         var styles = "";

         styles += '[id^="div_post_reput"] { display: none; }';

         WazeFFS.AddStyle(WazeFFS.prefix + fname, styles);
      }
      else
      {
         WazeFFS.RemoveStyle(WazeFFS.prefix + fname);
      }
      WazeFFS.SaveSettings();
   },
   HideSignatures: function()
   {
      var fname = "HideSignature";
      if(WazeFFS.GetMyCBState('_cbFFSHideSignatures') === true)
      {
         var styles = "";

         styles += '.signature { display: none; }';

         WazeFFS.AddStyle(WazeFFS.prefix + fname, styles);
      }
      else
      {
         WazeFFS.RemoveStyle(WazeFFS.prefix + fname);
      }
      WazeFFS.SaveSettings();
   },
   AddPaginationAtTop: function()
   {
      // It's annoying having to scroll all the way to the bottom of the page just to be
      // able to go to the next page, so make a copy of the pagination links at the top.
      if(WazeFFS.enabled === true)
      {
         // On forum pages with links to sub-forums, those links may include pagination entries of their own - we 
         // want to ignore these and only focus on the pagination entry right at the end of the page, which should
         // also then contain either a next or previous page arrow entry
         var paginationCount = document.getElementsByClassName('pagination').length;
         var hasPagination = false;
         if(paginationCount > 0)
         {
            hasPagination = (document.getElementsByClassName('pagination')[paginationCount - 1].getElementsByClassName('arrow').length > 0);
         }

         if((document.getElementById('nav-breadcrumbs') != undefined) && (hasPagination))
         {
            var fHTML = document.getElementsByClassName('pagination')[paginationCount - 1].outerHTML;
            
            // Remove the "jump to page" arrow if present, as this doesn't work in the repliated pagination links.  
            // The HTML for this always starts with the li class for the dropdown, but depending on whether we're on
            // the first or a subsequent page of the forum it'll end either with the li class for the "previous page"
            // arrow or the li class for the first of the page links - test for the arrow first, as if this is
            // present then it'll come before the first page link...
            var posA = fHTML.indexOf('<li class="dropdown');
            var posB = fHTML.indexOf('<li class="arrow previous');
            if(posB == -1)
            {
               posB = fHTML.indexOf('<li class="active');
            }
            if((posA != -1) && (posB != -1) && (posB > posA))
            {
               // We've found both the markers required to strip out the jump to arrow, so update the pagination
               // HTML before we append it to the top of the page
               var nHTML = fHTML.substring(0, posA);
               nHTML += fHTML.substring(posB);
               fHTML = nHTML;
            }

            document.getElementById('nav-breadcrumbs').innerHTML += fHTML;
         }
         else
         {
            // Occasionally the page rendering takes longer than expected, causing the pagination links not to be present
            // the first time (and perhaps once or twice after that) we test the page contents
            window.setTimeout(WazeFFS.AddPaginationAtTop, 100);
         }
      }
      else
      {
         if(document.getElementById('nav-breadcrumbs') != null)
         {
            if(document.getElementById('nav-breadcrumbs').getElementsByClassName('pagination').length > 0)
            {
               document.getElementById('nav-breadcrumbs').getElementsByClassName('pagination')[0].remove();
            }
         }
      }   
   },
   GetRepliesCount: function(lObj)
   {
      var retval = -1;
      if(lObj.getElementsByClassName('posts').length > 0)
      {
         var iText = lObj.getElementsByClassName('posts')[0].childNodes[0].nodeValue;
         retval = parseInt(iText);
      }
      return retval;
   },
   IsNormalPost: function(lObj)
   {
      return ((lObj.className.indexOf('announce') === -1) && (lObj.className.indexOf('sticky') === -1));
   },
   IsUnlockedPost: function(lObj)
   {
      return ((lObj.getElementsByTagName('dl').length > 0) && (lObj.getElementsByTagName('dl')[0].className.indexOf('locked') == -1));
   },
   GetPostUserNames: function(lObj, includeSpecialNames)
   {
      var retval = [];

      let classes = '.username';
      if(includeSpecialNames === true)
      {
         classes += ', .username-coloured';
      }
      let uNames = lObj.querySelectorAll(classes);
      for(let i = 0; i < uNames.length; ++i)
      {
         if(uNames[i].getBoundingClientRect().width != 0)
         {
            retval.push(uNames[i].innerText.toLowerCase());
         }
      }
      
      return retval;
   },
   GetCurrentUser: function()
   {
      let retval;
      let tObjs = document.getElementsByTagName('wz-user-box');
      if(tObjs.length > 0)
      {
         let tObj = tObjs[0];
         retval = tObj.attributes[0].nodeValue;
      }
      return retval;
   },
   HighlightPosts: function()
   {
      let postAreas = document.getElementsByClassName('topiclist topics').length;
      while(postAreas > 0)
      {
         --postAreas;
         let aObj = document.getElementsByClassName('topiclist topics')[postAreas];        
         for(let i = 0; i < aObj.getElementsByTagName('li').length; ++i)
         {
            let lObj = aObj.getElementsByTagName('li')[i];         
            let bgColour = "";

            if(WazeFFS.IsNormalPost(lObj) === true)
            {
               if(WazeFFS.IsUnlockedPost(lObj) === true)
               {
                  let rCount = WazeFFS.GetRepliesCount(lObj);

                  if(WazeFFS.GetMyCBState('_cbFFSUnlovedPosts') === true)
                  {
                     // Add a highlight to any non sticky, non locked, non announcement posts which haven't yet been replied to...
                     if(rCount === 0)
                     {
                        if(WazeFFS.dmEnabled === true)
                        {
                           bgColour = "#606000";
                        }
                        else
                        {
                           bgColour = "#ffffaa";
                        }
                     }
                  }

                  if(WazeFFS.GetMyCBState('_cbFFSBumpedPosts') === true)
                  {
                     // Add a highlight to any posts bumped by the original poster due to a lack of other responses...
                     if(rCount === 1)
                     {
                        // Only get posts if they were made by a "normal" user (i.e. their username isn't highlighted by the forums for any reason)
                        let postNames = WazeFFS.GetPostUserNames(lObj, false);
                        if(postNames.length > 1)
                        {
                           if(postNames[0] === postNames[1])
                           {
                              if(WazeFFS.dmEnabled === true)
                              {
                                 bgColour = "#444466";
                              }
                              else
                              {
                                 bgColour = "#eeeeff";
                              }
                           }
                        }
                     }
                  }
               }
            }

            lObj.style.backgroundColor = bgColour;
         }
      }

      WazeFFS.SaveSettings();    
   },
   IndentPosts: function()
   {
      let postEntries = document.getElementsByClassName('content-and-stuff').length;
      let currentUser = WazeFFS.GetCurrentUser();
      if(currentUser !== undefined)
      {
         while(postEntries > 0)
         {
            --postEntries;

            let lObj = document.getElementsByClassName('post__bg')[postEntries];
            let oLeft = '0px';

            if(WazeFFS.GetMyCBState('_cbFFSIndentOwn') === true)
            {
               let postAuthor = WazeFFS.GetPostUserNames(lObj, true);

               if(postAuthor[0].toLowerCase() === currentUser)
               {
                  oLeft = "50px";
               }
            }
            lObj.style.position = 'relative';
            lObj.style.left = oLeft;
         }
      }
      WazeFFS.SaveSettings();    
   }   
};

WazeFFS.Init();
