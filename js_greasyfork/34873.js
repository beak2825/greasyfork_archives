// ==UserScript==
// @name         PTP mafia gather votes
// @version      0.18
// @description  Get a full list of the votes between two posts
// @author       Chameleon
// @include      http*passthepopcorn.me/forums.php?*action=viewthread*
// @include      http*broadcasthe.net/forums.php?*action=viewthread*
// @include      http*what.cd/forums.php?*action=viewthread*
// @include      http*redacted.ch/forums.php?*action=viewthread*
// @include      http*s15.zetaboards.com/Annon_Mafia/topic/10121488/*
// @grant        none
// @namespace https://greasyfork.org/users/158316
// @downloadURL https://update.greasyfork.org/scripts/34873/PTP%20mafia%20gather%20votes.user.js
// @updateURL https://update.greasyfork.org/scripts/34873/PTP%20mafia%20gather%20votes.meta.js
// ==/UserScript==
// 0.15: Added PassTheHeadphones support
// 0.18: Changed PassTheHeadphones support to Redacted support

if(typeof(resize) == "undefined")
{
  resize = function(id)
  {
    var textarea = document.getElementById(id);
    if (textarea.scrollHeight > textarea.clientHeight)
    {
      textarea.style.overflowY = 'hidden';
      // + 16 = compensate for the innacuracy of the height calculation...
      // The only correct solution is to clone the textarea and get the
      // height from there.
      textarea.style.height = textarea.scrollHeight + 16 + 'px';
    }
  };
}
(function() {
  'use strict';

  var a=document.createElement('a');
  document.body.appendChild(a);
  a.innerHTML = 'Open vote counting';
  a.setAttribute('style', 'position: fixed; top: 25px; right: 5px; z-index: 5000;');
  a.href = 'javascript:void(0);';
  a.addEventListener('click', showDialog.bind(undefined, a), false);
})();

function showDialog(a)
{
  var div=document.getElementById('voteCounting');
  if(div)
  {
    a.innerHTML = 'Open vote counting';
    div.parentNode.removeChild(div);
    return;
  }

  a.innerHTML = 'Close vote counting';
  div=document.createElement('div');
  div.setAttribute('id', 'voteCounting');
  div.setAttribute('style', 'position: fixed; text-align: center; top: 50px; margin: auto; width: 615px; left: 0; right: 0; background: rgba(0,0,0,0.8); border-radius: 10px; padding: 10px; height: calc(100% - 60px); overflow-y: scroll; z-index:5000;');
  document.body.appendChild(div);
  var message = document.createElement('div');
  div.appendChild(message);

  var label = document.createElement('span');
  label.setAttribute('style', 'display: inline-block; width: 200px; text-align: right; padding-right: 5px;');
  label.innerHTML = 'Count from: ';
  div.appendChild(label);
  var from = document.createElement('input');
  from.setAttribute('style', 'width: 380px; border: none; text-align: center;');
  from.setAttribute('placeholder', 'From Post Link');
  from.value = window.localStorage.gatherVotesFrom ? window.localStorage.gatherVotesFrom : '';
  div.appendChild(from);
  div.appendChild(document.createElement('br'));

  var label = document.createElement('span');
  label.setAttribute('style', 'display: inline-block; width: 200px; text-align: right; padding-right: 5px;');
  label.innerHTML = 'Count to: ';
  div.appendChild(label);
  var to = document.createElement('input');
  to.setAttribute('style', 'width: 380px; border: none; text-align: center;');
  to.setAttribute('placeholder', 'To Post Link (empty for last post)');
  to.value = window.localStorage.gatherVotesTo ? window.localStorage.gatherVotesTo : '';
  div.appendChild(to);
  div.appendChild(document.createElement('br'));

  var label = document.createElement('span');
  label.setAttribute('style', 'display: inline-block; width: 200px; text-align: right; padding-right: 5px;');
  label.innerHTML = 'Majority number: ';
  div.appendChild(label);
  var majority = document.createElement('input');
  majority.setAttribute('style', 'width: 380px; border: none; text-align: center;');
  majority.setAttribute('placeholder', 'Max votes');
  majority.value = window.localStorage.gatherVotesMajority ? window.localStorage.gatherVotesMajority : '';
  div.appendChild(majority);
  div.appendChild(document.createElement('br'));

  var living=document.createElement('textarea');
  div.appendChild(living);
  living.setAttribute('id', 'postCountLiving');
  living.addEventListener('keyup', resize.bind(undefined, 'postCountLiving'), false);
  living.setAttribute('style', 'width: 580px; position: initial !important;');
  living.placeholder = "Living Players";
  living.value = window.localStorage.gatherVotesLiving ? window.localStorage.gatherVotesLiving : '';
  div.appendChild(document.createElement('br'));

  var a1=document.createElement('a');
  div.appendChild(a1);
  a1.innerHTML = 'Collect Votes';
  a1.href = 'javascript:void(0);';
  a1.addEventListener('click', collect.bind(undefined, message, from, to, majority, living), false);
  div.appendChild(document.createElement('br'));
  var a1=document.createElement('a');
  div.appendChild(a1);
  a1.innerHTML = 'Close vote counting';
  a1.href = 'javascript:void(0);';
  a1.addEventListener('click', showDialog.bind(undefined, a), false);
}

function collect(message, from, to, majority, living)
{
  var f=from.value;
  var t=to.value;
  var m=majority.value;
  var l=living.value;
  window.localStorage.gatherVotesFrom=f;
  window.localStorage.gatherVotesTo=t;
  window.localStorage.gatherVotesMajority=m;
  window.localStorage.gatherVotesLiving=l;
  if(!f)
  {
    message.innerHTML = 'From must be set';
    return;
  }

  var time = new Date();
  var votes = [];
  var users = [];
  if(l.length > 0)
  {
    var li=l.split('\n');
    for(var i=0; i<li.length; i++)
    {
      var user=li[i].split(":");
      users.push({user:user, count:0, averageLength:0});
    }
  }
  getCollect(message, f, t, votes, m, users, time);
}

function getCollect(message, f, t, votes, m, users, time)
{
  message.innerHTML = 'Collecting votes from '+f;
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = xhr_func.bind(undefined, message, xhr, parseCollect.bind(undefined, message, f, t, votes, m, users, time), getCollect.bind(undefined, message, f, t, votes, m, users, time));
  xhr.open("GET", f);
  xhr.send();
}

function parseCollect(message, f, t, votes, m, users, time, page)
{
  var div=document.createElement('div');
  div.innerHTML = page;
  var next = div.getElementsByClassName('pagination__link--next');
  if(window.location.host == "what.cd" || window.location.host == 'redacted.ch')
  {
    next = div.getElementsByClassName('pager_next');
  }
  else if(window.location.host == "broadcasthe.net")
  {
    var linkbox = div.getElementsByClassName('linkbox');
    if(linkbox.length > 0)
    {
      var as=linkbox[0].getElementsByTagName('a');
      if(as[as.length-2].textContent == "Next >")
      {
        next = [as[as.length-2]];
      }
    }
  }
  else if(window.location.host == "s15.zetaboards.com")
  {
    /*var as=div.getElementsByClassName('cat-pages')[0].getElementsByTagName('a');
    if(as.length > 0)
    {
      var a=as[as.length-1];
      console.log(a);
      console.log(as);
      if(a.getAttribute('rel') == 'next')
      {
        next=[a];
      }
    }*/
    next=div.getElementsByClassName('c_next');
    console.log(next);
    if(next.length > 0)
      next=next[0].getElementsByTagName('a');
  }
  if(next.length > 0)
    next = next[0].href;
  else
    next = false;
  console.log(next);
  var posts=div.getElementsByClassName('forum_post');
  if(window.location.host == "s15.zetaboards.com")
  {
    var posts=div.getElementsByClassName('c_post');
  }
  for(var i=0; i<posts.length; i++)
  {
    var p=posts[i];
    var user;
    if(window.location.host == "s15.zetaboards.com")
    {
      var temp=p.parentNode.previousElementSibling.getElementsByTagName('a');
      user=temp[0].textContent;
      var pid=parseInt(temp[temp.length-1].href.split('p=')[1]);
      var fid=parseInt(f.split('p=')[1]);
      if(fid >= pid)
        continue;

      var tid=parseInt(t.split('p=')[1]);
      if(pid >= tid)
      {
        doneCollecting(message, votes, m, users);
        return;
      }
    }
    else
    {
      if(p.id == "preview_wrap_0")
        continue;
      var pid = parseInt(p.id.split('post')[1]);
      var fid = f.split('#');
      if(fid.length > 1)
      {
        fid=parseInt(fid[1].split('post')[1]);
        if(fid >= pid)
          continue;
      }
      if(t)
      {
        if(p.id == t.split('#')[1])
        {
          doneCollecting(message, votes, m, users);
          return;
        }
      }
      user = p.getElementsByTagName('a')[1].textContent;
    }
    var exists = false;
    var postTextCount = 0;
    var p1 = p.getElementsByClassName('forum-post__bodyguard');
    if(p1.length == 0)
      p1 = p.getElementsByClassName('body');
    if(window.location.host == "s15.zetaboards.com")
      p1=[p];
    if(p1.length > 0)
    {
      var text = '';
      var p2 = p1[0];
      if(window.location.host == "what.cd" || window.location.host == 'broadcasthe.net' || window.location.host == "redacted.ch")
        p2 = p1[0].childNodes[1];
      for(var j=0; j<p2.childNodes.length; j++)
      {
        if(p2.childNodes[j].nodeType === 3)
          text += p2.childNodes[j].textContent;
      }
      postTextCount = text.length;
    }
    for(var j=0; j<users.length; j++)
    {
      var u=users[j];
      if(u.user[0] == user)
      {
        var temp=users[j].count*users[j].averageLength;
        users[j].count++;
        users[j].averageLength = (postTextCount+temp)/users[j].count;
        exists=true;
        break;
      }
    }
    if(!exists)
    {
      users.push({user:[user], count:1, averageLength:postTextCount});
    }
    var strongs;
    var userLink;
    if(window.location.host == "s15.zetaboards.com")
    {
      strongs=p.getElementsByTagName('strong');
      var temp=p.parentNode.previousElementSibling.getElementsByTagName('a');
      userLink=temp[temp.length-1].href;
    }
    else
    {
      userLink = p.getElementsByTagName('a')[0].href;
      var pb = p.getElementsByClassName('forum-post__body')[0];
      if(window.location.host == "what.cd" || window.location.host == "broadcasthe.net" || window.location.host == "redacted.ch")
        pb=p.getElementsByClassName('body')[0];
      strongs=pb.getElementsByTagName('strong');
    }
    for(var j=0; j<strongs.length; j++)
    {
      var s=strongs[j];
      if(s.innerHTML.indexOf('wrote:') != -1)
        continue;
      if((window.location.host.indexOf("what.cd") != -1 || window.location.host.indexOf("redacted.ch") != -1 || window.location.host.indexOf("broadcasthe.net") != -1) && (s.nextElementSibling && s.nextElementSibling.tagName == "BLOCKQUOTE"))
        continue;
      if(window.location.host.indexOf("passthepopcorn.me") != -1 && s.parentNode.parentNode.getAttribute('class') != 'forum-post__body')
        continue;
      if((window.location.host.indexOf("what.cd") != -1 || window.location.host.indexOf("redacted.ch") != -1 || window.location.host.indexOf("broadcasthe.net") != -1) && s.parentNode.parentNode.getAttribute('class') != 'body')
        continue;
      if(s.nextElementSibling && s.nextElementSibling.innerHTML == "Show")
        continue;
      if(s.parentNode.parentNode.tagName == "BLOCKQUOTE")
        continue;
      var votedFor = s.innerHTML.trim();
      for(var k=0; k<users.length; k++)
      {
        var u=users[k];
        for(var l=1; l<u.user.length; l++)
        {
          if(votedFor.toLowerCase() == u.user[l].toLowerCase())
          {
            votedFor = u.user[0];
            break;
          }
        }
      }
      if(votedFor.length > 30)
        continue;
      /*var exists=false;
            for(var k=0; k<votes.length; k++)
            {
                if(votes[k].user == user)
                {
                    exists=true;
                    votes[k].votes.push(votedFor);
                    break;
                }
            }
            if(!exists)
            {
                votes.push({user:user, userLink:userLink, votes:[votedFor]});
            }*/
      votes.push({user:user, userLink:userLink, vote:votedFor});
    }
  }
  if(next)
  {
    waitedASec(message, getCollect.bind(undefined, message, next, t, votes, m, users), time);
  }
  else
  {
    doneCollecting(message, votes, m, users);
  }
}

function sortUsers(a, b)
{
  return b.count-a.count;
}

function doneCollecting(message, votes, m, users)
{
  message.innerHTML = 'Finished';
  var d=message.parentNode;

  var uT=document.getElementById('userPostCount');
  if(!uT)
  {
    uT=document.createElement('textarea');
    uT.setAttribute('id', 'userPostCount');
    uT.setAttribute('style', 'width: 580px; position: initial !important;');
    d.appendChild(document.createElement('br'));
    d.appendChild(uT);
  }
  users.sort(sortUsers);
  uT.innerHTML = '[hide=User post counts ('+users.length+')]';
  for(var i=0; i<users.length; i++)
  {
    var u=users[i];
    uT.innerHTML += u.count+' : '+Math.round(u.averageLength)+' : '+u.user[0]+'\n';
  }
  uT.innerHTML += '[/hide]';
  resize('userPostCount');
  var t=document.getElementById('collecting');
  if(!t)
  {
    t=document.createElement('textarea');
    t.setAttribute('id', 'collecting');
    t.setAttribute('style', 'width: 580px; position: initial !important;');
  }
  t.innerHTML = '';
  d.appendChild(document.createElement('br'));
  d.appendChild(t);
  var tally=[];
  for(var i=votes.length-1; i>=0; i--)
  {
    var v=votes[i];
    var alreadyVoted=false;
    for(var j=0; j<tally.length; j++)
    {
      if(tally[j].user == v.user)
      {
        alreadyVoted = true;
        break;
      }
    }
    tally.push({user:v.user, userLink:v.userLink, votedFor:v.vote, lastVote:!alreadyVoted});
  }

  var done=[];
  tally = tally.reverse();
  for(var i=0; i<tally.length; i++)
  {
    var t1=tally[i];
    var exists=false;
    for(var j=0; j<done.length; j++)
    {
      if(done[j].votedFor.toLowerCase().replace(/ /g, '') == t1.votedFor.toLowerCase().replace(/ /g, ''))
      {
        if(t1.lastVote === true)
        {
          done[j].count++;
        }
        exists=true;
        break;
      }
    }
    if(!exists)
    {
      var count=1;
      if(t1.lastVote !== true)
        count=0;
      done.push({votedFor:t1.votedFor, count:count});
    }
  }

  t.innerHTML = '[align=center]';
  for(var i=0; i<done.length; i++)
  {
    var d1=done[i];
    t.innerHTML += d1.votedFor+': '+d1.count+'/'+m+'\n';
    for(var j=0; j<tally.length; j++)
    {
      var t1=tally[j];
      if(t1.votedFor.toLowerCase().replace(/ /g, '') == d1.votedFor.toLowerCase().replace(/ /g, ''))
      {
        if(!t1.lastVote)
        {
          t.innerHTML += '[s]';
        }
        t.innerHTML += '[url='+t1.userLink+']'+t1.user+'[/url]';
        if(!t1.lastVote)
        {
          t.innerHTML += '[/s]';
        }
        t.innerHTML += '\n';
      }
    }
    t.innerHTML += '\n';
  }
  t.innerHTML += '[/align]';
  resize('collecting');
}

// a helper function to wait at least one second between xmlhttp requests, to avoid overflowing the popcorn quota
function waitedASec(message, func, oldTime, delay)
{
  var time = new Date();
  if(isNaN(delay))
    delay = 1000;
  if((time - oldTime) < 1000)
  {
    window.setTimeout(func.bind(undefined, time), delay);
  }
  else
  {
    func(time);
  }
}

// a helper function that unwraps the returned xhr value and passes it to the function that takes the data
function xhr_func(messageDiv, xhr, func, repeatFunc)
{
  if(xhr.readyState == 4)
  {
    if(xhr.status == 200)
      func(xhr.responseText);
    else if(xhr.status == 429)
    {
      messageDiv.innerHTML += '<br />Popcorn quota triggered... Sorry.';
    }
    else
    {
      messageDiv.innerHTML += '<br />Error loading the page: '+xhr.status+', trying to reload the page in 1 second';
      window.setTimeout(repeatFunc, 1000);
    }
  }
}