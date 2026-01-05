// ==UserScript==
// @name        NeoTV用户屏蔽
// @namespace   NeoTV_User_Ban
// @include     http*://bbs.neotv.cn/*
// @require     http://cdn.bootcss.com/store.js/1.3.20/store.min.js
// @version     1.08
// @grant       none
// @run-at      document-dile
// @description NeoTV屏蔽用户及帖子标题
// @downloadURL https://update.greasyfork.org/scripts/29312/NeoTV%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/29312/NeoTV%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

function NTUB_Detail_InitDataBase()
{
  //console.log("Init Data Base:");
  store.set("NTUB_DataBase", "true");
  
  NTUB_Detail_Push("NTUB_BanList_User", "goldmadman");
  NTUB_Detail_Push("NTUB_BanList_Title", "goldmadman");
}

function NTUB_Detail_GetDataArray(space)
{
  var strnum = space + "_Num";
  var num = parseInt(store.get(strnum));
  
  //console.log(space +"[" + num + "]:");
  
  var array = [];
  
  for(var i = 0; i < num; i++)
  {
    array[i] = store.get(space+i);
  }
  
  return array;
}

function NTUB_Detail_Push(space, content)
{
  var strnum = space + "_Num";
  
  if(!store.has(strnum))
    store.set(strnum, "0");
  
  var num = parseInt(store.get(strnum));
  
  for(var i = 0; i < num; i++)
  {
    if(store.get(space + i) == content)
    {
      //console.log("[" + content + "] has already existed in [" + space + "].");
      
      return;
    }
  }
  
  var strdata = space + num;
  store.set(strdata, content);
  
  num++;
  store.set(strnum, "" + num);
}

function NTUB_Detail_Pop(space, content)
{
  var strnum = space + "_Num";
  
  if(!store.has(strnum))
    store.set(strnum, "0");
  
  var num = parseInt(store.get(strnum));
  
  var index = -1;
  
  for(var i = 0; i < num; i++)
  {
    if(index < 0 && store.get(space + i) == content)
    {
      index = i;
    }
    
    if(index >= 0)
    {
      if(i + 1 < num)
      {
        store.set(space + i, store.get(space + (i + 1)));
      }
      else
      {
        store.remove(space + i);
      }
    }
  }
  
  if(index < 0)
  {
    //console.log("[" + content + "] doesn't exist in [" + space + "].");
    
    return;
  }
  
  num--;
  store.set(strnum, "" + num);
}

function NTUB_Detail_Show(space)
{
  var strnum = space + "_Num";
  var num = parseInt(store.get(strnum));
  
  //console.log(space +"[" + num + "]:");
  
  for(var i = 0; i < num; i++)
  {
    //console.log(store.get(space+i));
  }
}

function NTUB_Detial_GetNewFormsHiddenNode()
{
  //hidden node. 
  var hn = document.getElementById("forumnew");
  
  if(!store.has("NTUB_DataBase"))
  {
    NTUB_Detail_InitDataBase();
  }
  
  //callback new. 
  var cbn = function()
  {
    var banlist_user = NTUB_Detail_GetDataArray("NTUB_BanList_User");
    var banlist_title = NTUB_Detail_GetDataArray("NTUB_BanList_Title");
    
    if($('separatorline'))
      var fmlist = $('separatorline').parentNode;
    
    if(!fmlist)
      return;
    
    var table = fmlist.rows;
    
    if(!table)
      return;
    
    var removelist = [];
    var removeindex = 0;
    
    for(var i = 0; i < table.length; i++)
    {
      var tr = table[i];
      if(!tr)
        continue;
      
      var common = tr.getElementsByClassName("common")[0];
      if(common)
      {
        var a = common.getElementsByTagName("a")[1];
        
        for(var j = 0; j < banlist_title.length; j++)
        {
          var re = new RegExp(banlist_title[j], "i");
          
          if(a.innerHTML.search(re) >= 0)
          {
            removelist[removeindex++] = tr.parentNode.id;
          }
        }
      }
      
      var conew = tr.getElementsByClassName("new")[0];
      if(conew)
      {
        var a = conew.getElementsByTagName("a")[1];
        
        for(var j = 0; j < banlist_title.length; j++)
        {
          var re = new RegExp(banlist_title[j], "i");
          
          if(a.innerHTML.search(re) >= 0)
          {
            removelist[removeindex++] = tr.parentNode.id;
          }
        }
      }
      
      var by = tr.getElementsByClassName("by");
      if(!by)
        continue;
      
      for(var j = 0; j < by.length; j++)
      {
        var cite = by[j].getElementsByTagName("cite")[0];
        if(!cite)
          continue;
        
        var a = cite.getElementsByTagName("a")[0];
        if(!a)
          continue;
        
        for(var k = 0; k < banlist_user.length; k++)
        {
          if(banlist_user[k] == a.innerHTML)
          {
            removelist[removeindex++] = tr.parentNode.id;
          }
        }
      }
    }
    
    //console.log("remove threads:");
    for(var i = 0; i < removelist.length; i++)
    {
      removetbodyrow(fmlist, removelist[i]);
      //console.log(removelist[i]);
    }
    
    var odd_table = fmlist.rows;
    var odd = 0;
    for(var i = 0; i < odd_table.length; i++)
    {
      tr = odd_table[i];
      
      if(tr.className == "ts" && i % 2 == 0)
        odd = 1;
      else
      {
        if(i % 2 == odd)
          tr.className = "odd_t";
        else
          tr.className = "";
      }
    }
  };
  
  //callback thread. 
  var cbt = function()
  {
    var banlist_user = NTUB_Detail_GetDataArray("NTUB_BanList_User");
    var banlist_title = NTUB_Detail_GetDataArray("NTUB_BanList_Title");
    
    var parent;
    var removelist = [];
    var removeindex = 0;
    
    var authi = document.getElementsByClassName("authi");
    if(authi)
    {
      for(var i = 0; i < authi.length; i++)
      {
        var a = authi[i].getElementsByTagName("a");
        if(a)
        {
          if(a.length > 0 && a[0].href.indexOf("home.php?mod=space&uid=") >= 0)
          {
            for(var j = 0; j < banlist_user.length; j++)
            {
              if(banlist_user[j] == a[0].innerHTML)
              {
                removelist[removeindex++] = authi[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
              }
            }
          }
        }
      }
    }
    
    var quote = document.getElementsByClassName("quote");
    if(quote)
    {
      for(var i = 0; i < quote.length; i++)
      {
        var a = quote[i].getElementsByTagName("a")
        if(a && a.length > 0)
        {
          var font = a[0].getElementsByTagName("font");
          if(font && font.length > 0)
          {
            var index = font[0].innerHTML.indexOf(" 发表于 ");
            if(index >= 0)
            {
              var user = font[0].innerHTML.substr(0, index)
              for(var j = 0; j < banlist_user.length; j++)
              {
                if(banlist_user[j] == user)
                {
                  var block = quote[i].getElementsByTagName("blockquote");
                  
                  if(block && block.length > 0)
                  {
                    console.log(block[0]);
                    var p = block[0].parentNode;
                    p.removeChild(block[0]);
                    p.style.height = "36px";
                    
                    var ban = document.createElement("div");
                    ban.innerHTML = '<font color="#999999">内容已屏蔽</font>';
                    
                    p.appendChild(ban);
                  }
                }
              }
            }
          }
        }
      }
    }
    
    var post = document.getElementById("postlist");
    if(post)
    {
      //console.log("remove threads:");
      for(var i = 0; i < removelist.length; i++)
      {
        post.removeChild(removelist[i]);
        //console.log(removelist[i]);
      }
    }
  };
  
  cbn();
  cbt();
  if(hn)
    hn.addEventListener('DOMNodeInserted', cbn, false);
  
  if($('separatorline'))
    var forum = $('separatorline').parentNode;
  if(forum)
    forum.addEventListener('DOMNodeInserted', cbn, false);
  
  //<div style="margin-top:10px;" class="inr_bor right_box"><div style="margin:4px">屏蔽用户  <input></div></div>
  var right_bar = document.getElementsByClassName("index_right")[0];
  var div_user = document.createElement("div");
  div_user.style.marginTop = "10px";
  div_user.setAttribute("class", "inr_bor right_box");
  div_user.innerHTML = '<div style="margin:4px"><div id="NTUB_Detail_Id_BanUser_List" style="float:left;margin:2px">用户</div><input id="NTUB_Detail_Id_BanUser_Input"><div id="NTUB_Detail_Id_BanUser_Ban" style="float:left;margin:2px;cursor:pointer;color:#FE0080">屏蔽</div><div id="NTUB_Detail_Id_BanUser_Release" style="float:left;margin:2px;cursor:pointer;color:#98D8E8">解除</div></div>';
  
  var div_title = document.createElement("div");
  div_title.style.marginTop = "10px";
  div_title.setAttribute("class", "inr_bor right_box");
  div_title.innerHTML = '<div style="margin:4px"><div id="NTUB_Detail_Id_BanTitle_List" style="float:left;margin:2px">标题</div><input id="NTUB_Detail_Id_BanTitle_Input"><div id="NTUB_Detail_Id_BanTitle_Ban" style="float:left;margin:2px;cursor:pointer;color:#FE0080">屏蔽</div><div id="NTUB_Detail_Id_BanTitle_Release" style="float:left;margin:2px;cursor:pointer;color:#98D8E8">解除</div></div>';
  
  right_bar.appendChild(div_user);
  right_bar.appendChild(div_title);
  
  var user_ban = function()
  {
    var user = document.getElementById("NTUB_Detail_Id_BanUser_Input").value;
    if(user)
      NTUB_Detail_Push("NTUB_BanList_User", user);
    
    cbn();
    cbt();
  };
  
  var user_release = function()
  {
    var user = document.getElementById("NTUB_Detail_Id_BanUser_Input").value;
    if(user)
      NTUB_Detail_Pop("NTUB_BanList_User", user);
  };
  
  var user_listshow = function()
  {
    var banlist_user = NTUB_Detail_GetDataArray("NTUB_BanList_User");
    alert(banlist_user);
  };
  
  var title_ban = function()
  {
    var title = document.getElementById("NTUB_Detail_Id_BanTitle_Input").value;
    if(title)
      NTUB_Detail_Push("NTUB_BanList_Title", title);
    
    cbn();
    cbt();
  };
  
  var title_release = function()
  {
    var title = document.getElementById("NTUB_Detail_Id_BanTitle_Input").value;
    if(title)
      NTUB_Detail_Pop("NTUB_BanList_Title", title);
  };
  
  var title_listshow = function()
  {
    var banlist_title = NTUB_Detail_GetDataArray("NTUB_BanList_Title");
    alert(banlist_title);
  };
  
  document.getElementById("NTUB_Detail_Id_BanUser_Ban").onclick = user_ban;
  document.getElementById("NTUB_Detail_Id_BanUser_Release").onclick = user_release;
  document.getElementById("NTUB_Detail_Id_BanUser_List").onclick = user_listshow;
  document.getElementById("NTUB_Detail_Id_BanTitle_Ban").onclick = title_ban;
  document.getElementById("NTUB_Detail_Id_BanTitle_Release").onclick = title_release;
  document.getElementById("NTUB_Detail_Id_BanTitle_List").onclick = title_listshow;
}

NTUB_Detial_GetNewFormsHiddenNode();
