// ==UserScript==
// @name        GameFAQs - Change /community/ links to /community/boards/
// @namespace   https://greasyfork.org/en/scripts/19469-gamefaqs-change-community-links-to-community-boards
// @include     http://www.gamefaqs.com/boards/*
// @include     http://www.gamefaqs.com/user/*
// @include     http://www.gamefaqs.com/pm*
// @description:en Changes profile links on gamefaqs.com
// @version     1.09
// @grant       none
// @description Changes profile links on gamefaqs.com
// @downloadURL https://update.greasyfork.org/scripts/19469/GameFAQs%20-%20Change%20community%20links%20to%20communityboards.user.js
// @updateURL https://update.greasyfork.org/scripts/19469/GameFAQs%20-%20Change%20community%20links%20to%20communityboards.meta.js
// ==/UserScript==
//user
removeUserDropDown=1;
if (window.location.href.indexOf('/user/') != - 1)
{
  if (window.location.href.indexOf('/tagged') != - 1)
  {
    var board = document.getElementsByClassName('userinfo') [0];
    var tr = board.getElementsByTagName('tr');
    if (tr.length != 0)
    {
      for (i = 1; 1 != tr.length; i++) //skip first tr
      {
        modify_href(tr[i]);
      }
    }
  } else {
    var board = document.getElementsByClassName('board') [0];
    var tr = board.getElementsByTagName('tr');
    if (tr.length != 0)
    {
      for (i = 1; 1 != tr.length; i++) //skip first tr
      {
        modify_href(tr[i]);
      }
    }
  }
} //topic_list and msg_list

if (window.location.href.indexOf('/user/') == - 1 && window.location.href.indexOf('/pm') == - 1)
{
  //topic_list
  var tauthor = document.getElementsByClassName('tauthor');
  if (tauthor.length != 0)
  {
    for (i = 1; i != tauthor.length; i++) //skip first tauthor
    {
      modify_href(tauthor[i]);
    }
  } //msg_list

var name = document.getElementsByClassName('name menu_toggle');
  if(removeUserDropDown)
    {
  if(name.length!=0)
    {
      for(i=0;i!=name.length;i++)
        {
          name[i].removeAttribute('data-msgid');
          name[i].removeAttribute('data-userid');
          var user = name[i].getElementsByTagName('b')[0].innerHTML.replace(" ", "+");
          name[i].setAttribute('href', 'http://www.gamefaqs.com/community/'+user+'/boards');
          var carrot = name[i].getElementsByTagName('i')[0];
          name[i].removeChild(carrot);
        }
    }
    }
  
} //pb_admin and pm page
var board = document.getElementsByClassName('board');
if (window.location.href.indexOf('/pm') != - 1 || board!=null )
{
  if (window.location.href.indexOf('?message=') != - 1)
  { //in_message
    modify_href(document.getElementsByClassName('foot') [0]);
  } else { //on pm_list
    var board = document.getElementsByClassName('board') [0];
    var tbody = board.getElementsByTagName('tbody');
    if (window.location.href.indexOf('/pm') != - 1)
    {
      start = 0;
    } else {
      start = 1;
    }
    if (tbody.length != 0)
    {
      for (i = start; i != tbody.length; i++)
      {
        var tr = tbody[i].getElementsByTagName('tr');
        if (tr.length != 0)
        {
          for (j = start; j != tr.length; j++) //skip first tr
          {
            modify_href(tr[j]);
          }
        }
      }
    }
  }
}
function modify_href(parent_element)
{
  var a_element = parent_element.getElementsByTagName('a') [0];
  var href = a_element.getAttribute('href');
  if (href.indexOf('/community/') != - 1)
  {
    a_element.setAttribute('href', href + '/boards/');
  }
}