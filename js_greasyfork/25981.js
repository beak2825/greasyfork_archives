// ==UserScript==
// @name         PTH User tagging
// @version      1.3
// @description  Tag, ignore, highlight, and change avatars for users on PTH and PTP
// @author       Chameleon
// @include      http*://redacted.ch/*
// @include      http*://passthepopcorn.me/*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25981/PTH%20User%20tagging.user.js
// @updateURL https://update.greasyfork.org/scripts/25981/PTH%20User%20tagging.meta.js
// ==/UserScript==

var current_site;

(function() {
  'use strict';
  var h=window.location.host;
  if(h==="redacted.ch")
    current_site='RED';
  else if(h==="passthepopcorn.me")
    current_site='PTP';

  window.setTimeout(checkHeight.bind(undefined, document.body.clientHeight), 800);

  if(window.location.href.indexOf('user.php?id=') != -1)
  {
    var username;
    if(current_site==="RED")
      username=document.getElementsByTagName('h2')[0].getElementsByTagName('a')[0].textContent;
    else if(current_site==="PTP")
      username=document.getElementsByTagName('h2')[0].textContent;
    var a=document.createElement('a');
    a.href='javascript:void(0);';
    a.addEventListener('click', openTags.bind(undefined, username, undefined), false);
    if(current_site==="RED")
    {
      a.innerHTML = '[User tags]';
      document.getElementsByClassName('linkbox')[0].appendChild(a);
    }
    else if(current_site==="PTP")
    {
      var e=document.getElementsByClassName('linkbox')[0];
      e.appendChild(document.createTextNode(' ['));
      a.innerHTML='User Tags';
      e.appendChild(a);
      e.appendChild(document.createTextNode(']'));
    }

    var avatar;
    if(current_site==="RED")
      avatar=document.getElementsByClassName('box_image_avatar')[0].getElementsByTagName('img')[0];
    else if(current_site==="PTP")
      avatar=document.getElementsByClassName('sidebar-cover-image')[0];
    avatar.setAttribute('originalAvatar', avatar.src);

    setProfile();
  }

  //var posts=document.getElementsByClassName('forum_post');
  var posts=document.querySelectorAll('.forum_post, .forum-post');
  for(var i=0; i<posts.length; i++)
  {
    var p=posts[i];
    if(p.getAttribute('class').indexOf('preview_wrap') != -1)
      continue;
    if(p.id=='reply_box')
      continue;
    var links;
    if(current_site==="RED")
      links=p.getElementsByTagName('td')[0].firstElementChild;
    else if(current_site==="PTP")
      links=p.getElementsByTagName('span')[0];
    var username=p.getElementsByTagName('strong')[0].getElementsByTagName('a')[0].textContent;

    var a=document.createElement('a');
    a.href='javascript:void(0);';
    a.innerHTML='Tag';
    if(current_site==="PTP")
      a.innerHTML='[Tag]';
    a.setAttribute('class', 'brackets');
    a.addEventListener('click', openTags.bind(undefined, username, p), false);
    links.appendChild(document.createTextNode(' - '));
    links.appendChild(a);

    var img;
    if(current_site==="RED")
      img=p.getElementsByTagName('img')[0];
    else if(current_site==="PTP")
      img=p.getElementsByClassName('forum-post__avatar__image')[0];
    if(img)
    {
      img.setAttribute('originalAvatar', img.src);
    }
  }
  /*
  var avatars=document.getElementsByClassName('avatar');
  for(var i=0; i<avatars.length; i++)
  {
    var avatar=avatars[i];
    addTagLinks(avatar);
    var img=avatar.getElementsByTagName('img')[0];
    if(img)
    {
      img.setAttribute('originalAvatar', img.src);
    }
  }*/

  addTags();
})();

function setProfile()
{
  if(window.location.href.indexOf('user.php?id=') === -1)
    return;
  var user;
  if(current_site==="RED")
    user=document.getElementsByTagName('h2')[0].getElementsByTagName('a')[0].textContent;
  else if(current_site==="PTP")
    user=document.getElementsByTagName('h2')[0].textContent;
  user=getUser(user)[0];
  var avatar;
    if(current_site==="RED")
      avatar=document.getElementsByClassName('box_image_avatar')[0].getElementsByTagName('img')[0];
    else if(current_site==="PTP")
      avatar=document.getElementsByClassName('sidebar-cover-image')[0];
  if(user.replacementAvatar)
  {
    avatar.src=user.replacementAvatar;
  }
  else
  {
    avatar.src=avatar.getAttribute('originalAvatar');
  }
  if(user.usernameColour)
  {
    var username;
    if(current_site==="RED")
      username=document.getElementsByTagName('h2')[0].getElementsByTagName('a')[0];
    else if(current_site==="PTP")
      username=document.getElementsByTagName('h2')[0];
    username.style.color=user.usernameColour;
  }
  if(user.customTitle)
  {
    document.getElementsByClassName('user_title')[0].innerHTML='('+user.customTitle+')';
  }
}


function checkHeight(height)
{
  if(height != document.body.clientHeight)
  {
    pageResized();
  }

  window.setTimeout(checkHeight.bind(undefined, document.body.clientHeight), 800);
}
/*
function addTagLinks(avatar)
{
  var tags=getTags();

  var postTable=avatar.parentNode;
  while(postTable.tagName != 'TABLE')
    postTable=postTable.parentNode;
  if(postTable.getAttribute('id') == 'preview_wrap_0')
    return;
  var username=postTable.getElementsByTagName('strong')[0].textContent;

  var id=postTable.getAttribute('id').split('post')[1];

  var a=document.createElement('a');
  a.setAttribute('class', 'tagLink');
  a.setAttribute('postId', id);
  var place = avatar.getBoundingClientRect();
  var style='position: absolute; z-index: 50000000; top: '+(place.top+window.scrollY)+'px; left: '+(place.left+window.scrollX)+'px; width: '+avatar.clientWidth+'px;';
  style+='text-align: center; color: blue; background: rgba(200,200,200,0.8); border-radius: 0px 0px 10px 10px;';
  a.setAttribute('style', style);

  a.innerHTML = 'Show user tags';
  a.href='javascript:void(0);';
  a.addEventListener('click', openTags.bind(undefined, username, postTable), false);
  document.body.appendChild(a);
  a.style.display='none';

  avatar.addEventListener('mouseover', mouseOver.bind(undefined, a), false);
  avatar.addEventListener('mouseout', mouseOut.bind(undefined, avatar, a), false);
}
*/
function pageResized()
{
  /*var tagLinks=document.getElementsByClassName('tagLink');
  for(var i=0; i<tagLinks.length; i++)
  {
    var t=tagLinks[i];
    var id=t.getAttribute('postId');
    var postTable=document.getElementById('post'+id);
    var avatar=postTable.getElementsByClassName('avatar')[0];

    var place = avatar.getBoundingClientRect();
    var style='position: absolute; z-index: 50000000; top: '+(place.top+window.scrollY)+'px; left: '+(place.left+window.scrollX)+'px; width: '+avatar.clientWidth+'px;';
    style+='text-align: center; color: blue; background: rgba(200,200,200,0.8); border-radius: 0px 0px 10px 10px;';
    t.setAttribute('style', style);
    t.style.display='none';
  }*/

  resetTags();
  addTags();
}

function resetTags()
{
  var ignoredQuotes=document.getElementsByClassName('toggleQuote');
  for(var i=0; i<ignoredQuotes.length; i++)
  {
    var ig=ignoredQuotes[i];
    ig.nextElementSibling.style.display='';
    ig.parentNode.removeChild(ig);
  }

  //var posts=document.getElementsByClassName('forum_post');
  var posts=document.querySelectorAll('.forum_post, .forum-post');
  var length;
  if(current_site==="RED")
    length=posts.length-1;
  else if(current_site==="PTP")
    length=posts.length;
  for(var i=0; i<length; i++)
  {
    var p=posts[i];
    var avatar;
    if(current_site==="RED")
      avatar=p.getElementsByClassName('avatar')[0];
    else if(current_site==="PTP")
      avatar=p.getElementsByClassName('forum-post__avatar')[0];

    var postTable=p;

    if(postTable.getAttribute('id') == 'preview_wrap_0')
      continue;
    if(p.id=='reply_box')
      continue;
    var u=postTable.getElementsByTagName('strong')[0].getElementsByTagName('a')[0];
    var username=u.textContent;


    var c=postTable.getElementsByClassName('user_title');
    if(c.length > 0)
    {
      var orig=c[0].getAttribute('original');
      if(orig)
        c[0].innerHTML=orig;
    }

    if(avatar)
    {
      var img=avatar.getElementsByTagName('img')[0];
      if(img)
      {
        var orig=img.getAttribute('originalAvatar');
        if(orig)
          img.src=img.getAttribute('originalAvatar');
      }
    }
    u.setAttribute('style', '');
    postTable.setAttribute('style', '');
    var tr;
    if(current_site==="RED")
      tr=postTable.getElementsByTagName('tr')[1];
    else if(current_site==="PTP")
      tr=postTable.getElementsByClassName('forum-post__avatar-and-body')[0];
    if(tr.getAttribute('stayHidden')!=="true")
    {
      tr.style.display='';
    }
    var id=postTable.getAttribute('id').split('post')[1];
    var tag=document.getElementById('tag'+id);
    if(tag)
      tag.parentNode.removeChild(tag);
  }
  var hardIgnores=document.getElementsByClassName('hardIgnoreLink');
  for(var i=0; i<hardIgnores.length; i++)
  {
    var h=hardIgnores[i];
    h.parentNode.removeChild(h);
  }
}

function addTags()
{
  var quotes=document.getElementsByTagName('blockquote');
  for(var i=0; i<quotes.length; i++)
  {
    var q=quotes[i];
    var username = q.previousElementSibling;
    if(username)
    {
      username=username.textContent.split(' ')[0];
      var user=getUser(username)[0];
      if(user.softIgnore || user.hardIgnore)
      {
        var a=document.createElement('a');
        a.href='javascript:void(0);';
        a.textContent='<Ignored>';
        a.addEventListener('click', toggleQuote.bind(undefined, a, q), false);
        a.setAttribute('class', 'toggleQuote');
        q.parentNode.insertBefore(a, q);
        if(q.getAttribute('unIgnored')=="true")
        {
          a.textContent='Ignore';
        }
        else
          q.style.display='none';
      }
    }
  }

  //var posts=document.getElementsByClassName('forum_post');
  var posts=document.querySelectorAll('.forum_post, .forum-post');
  var length;
  if(current_site==="RED")
    length=posts.length-1;
  else if(current_site==="PTP")
    length=posts.length;
  for(var i=0; i<length; i++)
  {
    var p=posts[i];
    var avatar;
    if(current_site==="RED")
      avatar=p.getElementsByClassName('avatar')[0];
    else if(current_site==="PTP")
      avatar=p.getElementsByClassName('forum-post__avatar')[0];

    var postTable=p;

    if(postTable.getAttribute('id') == 'preview_wrap_0')
      continue;
    if(p.id=='reply_box')
      continue;
    var u=postTable.getElementsByTagName('strong')[0].getElementsByTagName('a')[0];
    var username=u.textContent;

    var user=getUser(username)[0];
    if(user.replacementAvatar && avatar)
    {
      avatar.getElementsByTagName('img')[0].src=user.replacementAvatar;
    }
    if(user.usernameColour)
    {
      var style=u.getAttribute('style');
      if(!style)
        style='';
      u.setAttribute('style', style+' color: '+user.usernameColour+';');
    }
    if(user.postHighlight)
    {
      var style=postTable.getAttribute('style');
      postTable.setAttribute('style', 'box-shadow: '+user.postHighlight+' 0 0 5px 1px !important;');
    }
    if(user.customTitle)
    {
      var c=postTable.getElementsByClassName('user_title');
      if(c.length > 0)
        c=c[0];
      else
      {
        c=document.createElement('span');
        c.setAttribute('class', 'user_title');
        var before=postTable.getElementsByClassName('time')[0];
        before.parentNode.insertBefore(c, before);
      }
      if(!c.getAttribute('original'))
        c.setAttribute('original', c.innerHTML);

      c.innerHTML='('+user.customTitle+')';
    }
    if(user.tag && user.showTag)
    {
      var div=document.createElement('div');
      var id=postTable.getAttribute('id').split('post')[1];
      div.setAttribute('id', 'tag'+id);
      div.innerHTML = user.tag.replace(/\n/g,'<br />')+' ';
      if(!user.showTagInHeader)
      {
        var before=document.getElementById('bar'+id).firstElementChild;
        before.parentNode.insertBefore(div, before);
        div.setAttribute('style', 'display: inline-block; margin-right: 5px;');
        div.setAttribute('class', 'r10');
      }
      else
      {
        var first;
        if(!avatar)
        {
          avatar=postTable;
          first=avatar;
        }
        else
          first=avatar.firstElementChild;
        var place = postTable.getBoundingClientRect();
        var width=300;
        var left=place.left+window.scrollX-width-20;
        if(left<0)
          left=0;
        var style='position: absolute; z-index: 1001; top: '+(place.top+window.scrollY)+'px; left: '+left+'px; max-width: '+width+'px; text-align: center; color: white; background: rgba(20,20,20,0.7); border-radius: 20px 0px 0px 20px;';
        style+='font-size: large; box-shadow: inset '+(user.postHighlight ? user.postHighlight : 'black')+' 0 0 20px 0; padding: 10px;';
        div.setAttribute('style', style);
        document.body.appendChild(div);
        var avatarHeight=first.clientHeight;
        var top=place.top+window.scrollY+((avatarHeight-div.clientHeight)/2);
        div.style.top=top+'px';
        if(div.clientWidth < width)
        {
          left=place.left+window.scrollX-div.clientWidth;
          if(left<0)
            left=0;
          div.style.left=left+'px';
        }
      }
    }
    if(user.softIgnore)
    {

      var tr;
      if(current_site==="RED")
        tr=postTable.getElementsByTagName('tr')[1];
      else if(current_site==="PTP")
        tr=postTable.getElementsByClassName('forum-post__avatar-and-body')[0];
      tr.style.display='none';
    }
    if(user.hardIgnore)
    {
      var a=document.createElement('a');
      var hr=document.createElement('hr');
      hr.setAttribute('title', username);
      a.appendChild(hr);
      a.setAttribute('class', 'hardIgnoreLink');
      a.href=postTable.getElementsByTagName('strong')[0].getElementsByTagName('a')[0].href;
      postTable.parentNode.insertBefore(a, postTable);
      postTable.style.display='none';
    }
  }
}

function toggleQuote(a, q)
{
  if(a.innerHTML.indexOf('Ignored') != -1)
  {
    a.textContent = 'Ignore';
    q.style.display='';
    q.setAttribute('unIgnored', "true");
  }
  else
  {
    a.textContent = '<Ignored>';
    q.style.display='none';
    q.setAttribute('unIgnored', "false");
  }
}

function setEmpty(input)
{
  input.value="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";
  input.dispatchEvent(new Event('change'));
}

function openTags(username, postTable)
{
  var div=document.getElementById('chameleonTagsDiv');
  if(!div)
  {
    div=document.createElement('div');
    div.setAttribute('id', 'chameleonTagsDiv');
    document.body.appendChild(div);
    div.setAttribute('style', 'position: fixed; top: 20px; margin: auto; left: 0; right: 0; text-align: center; background: rgba(0,0,0,0.7); color: white; width: 80%; z-index: 1000;');
  }
  div.innerHTML = '<h2>'+username+'\'s Tags<br />';

  var user=getUser(username)[0];

  var input=document.createElement('input');
  input.placeholder='Replacement avatar URL';
  input.value = user.replacementAvatar ? user.replacementAvatar : '';
  input.addEventListener('change', changeTags.bind(undefined, div, username, postTable, input), false);
  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.setAttribute('style', 'display:block;');
  a.innerHTML="Set avatar to empty image";
  a.addEventListener('click', setEmpty.bind(undefined, input));
  div.appendChild(a);
  div.appendChild(input);

  div.appendChild(document.createElement('br'));

  var input=document.createElement('input');
  div.appendChild(input);
  input.placeholder='Replacement custom title';
  input.value = user.customTitle ? user.customTitle : '';
  input.addEventListener('change', changeTags.bind(undefined, div, username, postTable, input), false);

  div.appendChild(document.createElement('br'));

  var input=document.createElement('input');
  div.appendChild(input);
  input.placeholder='Post highlight colour';
  input.value = user.postHighlight ? user.postHighlight : '';
  input.addEventListener('change', changeTags.bind(undefined, div, username, postTable, input), false);

  div.appendChild(document.createElement('br'));

  var input=document.createElement('input');
  div.appendChild(input);
  input.placeholder='Username colour';
  input.value = user.usernameColour ? user.usernameColour : '';
  input.addEventListener('change', changeTags.bind(undefined, div, username, postTable, input), false);

  div.appendChild(document.createElement('br'));

  var input=document.createElement('textarea');
  input.setAttribute('id', 'tagTextarea');
  div.appendChild(input);
  input.setAttribute('style', 'text-align: center; border: none;');
  input.placeholder='Tag';
  input.value = user.tag ? user.tag : '';
  resize('tagTextarea');
  input.addEventListener('keyup', resize.bind(undefined, 'tagTextarea'), false);
  input.addEventListener('change', changeTags.bind(undefined, div, username, postTable, input), false);

  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  div.appendChild(a);
  a.innerHTML = 'Show tag: '+(user.showTag ? 'On' : 'Off');
  a.href='javascript:void(0);';
  a.addEventListener('click', changeTags.bind(undefined, div, username, postTable, a), false);

  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  div.appendChild(a);
  a.innerHTML = 'Show tag left of avatar: '+(user.showTagInHeader ? 'On' : 'Off');
  a.href='javascript:void(0);';
  a.addEventListener('click', changeTags.bind(undefined, div, username, postTable, a), false);

  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  div.appendChild(a);
  a.innerHTML = 'Soft ignore: '+(user.softIgnore ? 'On' : 'Off');
  a.href='javascript:void(0);';
  a.addEventListener('click', changeTags.bind(undefined, div, username, postTable, a), false);

  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  div.appendChild(a);
  a.innerHTML = 'Hard ignore: '+(user.hardIgnore ? 'On' : 'Off');
  a.href='javascript:void(0);';
  a.addEventListener('click', changeTags.bind(undefined, div, username, postTable, a), false);

  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  div.appendChild(a);
  a.innerHTML = 'Save';
  a.href='javascript:void(0);';
  a.addEventListener('click', saveAndClose.bind(undefined, div, username, postTable), false);
}

function changeTags(div, username, table, a)
{
  var user=getUser(username);
  var index=user[1];
  user=user[0];

  var inputs=div.getElementsByTagName('input');
  user.replacementAvatar = inputs[0].value;
  user.customTitle = inputs[1].value;
  user.postHighlight = inputs[2].value;
  user.usernameColour = inputs[3].value;

  var textareas=div.getElementsByTagName('textarea');
  user.tag=textareas[0].value;

  var as=div.getElementsByTagName('a');
  if(as[1] == a)
  {
    if(a.innerHTML.indexOf('On') != -1)
      user.showTag=false;
    else
      user.showTag=true;
  }
  if(as[2] == a)
  {
    if(a.innerHTML.indexOf('On') != -1)
      user.showTagInHeader=false;
    else
      user.showTagInHeader=true;
  }
  if(as[3] == a)
  {
    if(a.innerHTML.indexOf('On') != -1)
      user.softIgnore=false;
    else
      user.softIgnore=true;
  }
  if(as[4] == a)
  {
    if(a.innerHTML.indexOf('On') != -1)
      user.hardIgnore=false;
    else
      user.hardIgnore=true;
  }

  var tags=getTags();
  if(index != -1)
    tags[index]=user;
  else
  {
    user.username=username;
    tags.push(user);
  }
  window.localStorage.userTags = JSON.stringify(tags);

  openTags(username, table);
}

function saveAndClose(div, username, table)
{
  resetTags();
  addTags();
  setProfile();
  div.parentNode.removeChild(div);
}

/*
function mouseOver(a)
{
  a.style.display = 'initial';
}

function mouseOut(avatar, a, event)
{
  if(event.relatedTarget == avatar || event.relatedTarget == a)
    return;
  a.style.display = 'none';
}*/

function getUser(username)
{
  var tags=getTags();
  for(var i=0; i<tags.length; i++)
  {
    var t=tags[i];
    if(t.username === username)
      return [t, i];
  }
  return [{}, -1];
}

function getTags()
{
  var tags = window.localStorage.userTags;
  if(!tags)
  {
    tags = [];
  }
  else
    tags = JSON.parse(tags);
  return tags;  
}
