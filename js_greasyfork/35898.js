// ==UserScript==
// @name         Sandbox-View
// @version      1.5
// @description  Sandbox-View, ver 1.5
// @author       Aaron Knudsen
// @match        *://*.stackexchange.com/*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/161566
// @downloadURL https://update.greasyfork.org/scripts/35898/Sandbox-View.user.js
// @updateURL https://update.greasyfork.org/scripts/35898/Sandbox-View.meta.js
// ==/UserScript==

function InjectSandboxScript() {

  var OPENED = false;
  $("body").prepend('<div id="SandboxViewer" style="display:none; width: inherit; height: inherit;"></div>');
  $("body").prepend('<div id="SandboxPopdisp" style="display: none; z-index: 5; position: fixed; background: rgba(0, 0, 0, 0.75); color: white; top: 50%; left: 50%; line-height: 70px; text-align: center; font-size: 36px; font-weight: bold; height: 70px; width: 120px; border-radius: 8px; transform: translateY(-50%) translateX(-50%);"></div>');
  $('#SandboxViewer').prepend('<div id="SandboxBlur" style="position: fixed;z-index:2;width:100%;height:100%;background:rgba(0,0,0,0.5)"></div>');
  $('#SandboxViewer').append('<div id="SandboxContent" style="position: fixed; overflow: scroll; z-index: 3; width: 100%; height: 100%;box-sizing:border-box;top: 50%;left: 50%;transform: translateY(-50%) translateX(-50%);background: #FAFAFA;padding: 1.2em;display: -webkit-flex;display: flex;"><div style="color: gray;position: fixed;cursor: pointer;top: 0px;left: 5px;font-size: 14px;" id="closeviewer">x</div><span id="USERLOAD">Loading...</span></div>');

  $(".topbar .topbar-wrapper .network-items").append('<a id="SandboxViewerToggle" class="topbar-icon yes-hover" style="z-index:1;width: 36px; background-image: url(http://i.stack.imgur.com/lBskr.png); background-size: 19px 19px; background-position: 8px 7px"></a>');

  var POSTCOUNTER = 0;

  function PopupDisplay(text) {
    $("#SandboxPopdisp").html(text);
    $("#SandboxPopdisp").fadeIn(200, function () {
      $(this).delay(1000).fadeOut(200);
    });
  }

  function VotePost(post, state) {
    // States:
    // 2 - Upvote
    // 3 - Downvote
    // 10- Delete
    // Post: http://<site>.com/posts/<post_id>/vote/<state>
    GM_xmlhttpRequest({
      method: "POST",
      data: "fkey=" + StackExchange.options.user.fkey,
      url: post+"/vote/"+state,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload:function(response) {
      }
    });
  }
  function PostPost(title, body, id) {
    console.log(title, body);
    GM_xmlhttpRequest({
      method: "POST",
      data:"qualityBanWarningShown=False&priorAttemptCount=0&title="+title+"&post-text="+encodeURIComponent(body)+"&fkey=" + StackExchange.options.user.fkey + "&author=&wmd-input-42=&tagnames=" + body.match(/\[tag:[^\]]+/g).map(function(l){return l.slice(5);}).join(","),
      url: "http://codegolf.stackexchange.com/questions/ask/submit/",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload:function(response){
        var url  = (response.responseText.match(/<meta property="og:url" content="([^"]+)/)||[])[1];
        var title= $(response.responseText).find("title").text();
        var win = window.open(url, title || "Post From the Sandbox");
        VotePost("http://meta.codegolf.stackexchange.com/posts/" + id, 10);
        win.document.write(response.responseText);
      }
    });
    /*
qualityBanWarningShown=False
priorAttemptCount=0
title=Title
post-text=Post Text
&fkey=6ee389d149f11254dcdb48f1951bde39
author=
N/A - i1l=paJXO3BPSH4DO0J6scE0O0t++dqGmOIuxSBMxRqy4Gs=
tagnames=discussion,code-golf
wmd-input-42=
*/
  }

  $(document).on('click', "#SandboxViewerToggle", function() {
    $('#SandboxViewer').fadeIn(100);
    if (OPENED === false) {
      OPENED = true;
      $("#SandboxViewerToggle").css("background-image", "url(http://i.stack.imgur.com/lBskr.png)");
      GetChallenges(StackExchange.options.user.userId, function(posts) {
        var HTML = "";
        HTML += '<h1>Your Sandboxed Posts</h1><div><ul>' + (posts.map(function(post) {
          return '<li><b><a href="' + post.url + '">' + post.title + '</a></b>' +
            '<br><span>score: <span style="color: green;">+' + post.score.up + '</span>'+
            ' <span style="color: red">-' + post.score.down + '</span></span>' +
            '<br><span>active: ' + TimeSince( post.active ) + '</span>'
          // + '<br><a class="Fmtom" data-postid="'+post.id+'">Post to main</a></li>';
        }).join("\n") || "</ul><div>You currently have no Sandboxed posts</div><ul>") + '</ul></div>';

        HTML += '<h1>Latest Activity</h1><div>' + (GetComments(posts).map(function(comment, i, a) {
          return '<div '+
            (i == a.length - 1 ? "" : ' style="border-bottom: 1px solid #DDD; padding-bottom: 8px; margin-bottom: 8px"')+'><b><a href="' + comment.postlink + '">' + comment.post + '</a></b>, <a href="http://codegolf.stackexchange.com/users/' + comment.userid + '">' + comment.user + '</a>: ' + comment.text + " - <a href=\"" + comment.link + "\">" + TimeSince(comment.timestamp) + "</a></div>";
        }).join("") || "<div>You currently have no Sandboxed posts</div>") + '</div>';
        $("#SandboxContent").prepend('<div style="width: 33%; -webkit-flex-direction: column; flex-direction: column; overflow: auto;">' + HTML + "</div>");
      });
      GetChallenges("*nofilter*", function(posts) {

        function UpdatePreviewComments() {
          var Comments = GetComments([posts[POSTCOUNTER]]).reverse();
          var LIMIT = 2;
          var a = false;
          if (Comments.length > LIMIT) a = true;
          $("#SandboxPreviewComments").html( (a ? '<div style="padding: 5px 2px; border-bottom: 1px solid #DDD; margin-bottom: 3px;"><a id="SPshow">(show all)</a></div>' : "") + Comments.map(function(comment,index,a) {
            return '<div class="'+(a.length-index>LIMIT?"SPrevH":"")+'" style="'+(a.length-index>LIMIT?"display:none;":"")+'padding: 5px 2px; border-bottom: 1px solid #DDD; margin-bottom: 3px;">'+
              '<a href="http://codegolf.stackexchange.com/users/'+comment.userid+'">' + comment.user +
              '</a>: <span>'+comment.text+'</span> &mdash; <a href="'+comment.link+'">'+
              TimeSince(comment.timestamp)+'</a> </div>'
          }).join("\n") + "<div><textarea id=\"FCText\" placeholder=\"Comment...\" style=\"height: 30px;width: 80%;outline: none;border-radius: 2px;\"></textarea><button id=\"FComment\" style=\"vertical-align: top;max-width: 20%;margin-left: 8px;\">Post</button></div>");
          $(document).on('click', "#SPshow", function() {
            $(".SPrevH").show();
            $("#SPshow").html("(hide some comments)");
            $("#SPshow").attr("id", "SPhide");
          });

          $(document).on('click', "#SPhide", function() {
            $(".SPrevH").hide();
            $("#SPhide").html("(show all comments)");
            $("#SPhide").attr("id", "SPshow");
          });
        }

        function ConstructPost(post) {
          UpdatePreviewComments();
          $(".FVoteActive").removeClass("FVoteActive");
          $(".FVoteUp").attr('src', 'http://i.stack.imgur.com/EQ1ko.png');
          $(".FVoteDown").attr('src', 'http://i.stack.imgur.com/OwtQb.png');
          return '<div>' + post.body + '</div>';
        }

        function CommentPost(post, comment) {
          GM_xmlhttpRequest({
            method: "POST",
            data: "fkey=" + StackExchange.options.user.fkey + "&comment=" + encodeURIComponent(comment),
            url: post+"/comments/",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            onload:function(response){
              PopupDisplay(" &nbsp;Posted. &nbsp;");
              UpdatePreviewComments();
            }
          });
        }

        var HTML = "";
        HTML += '<div><div style="text-align: left; float: left; margin-bottom: 10px;">'+
          '<button class="FLink">See in Sandbox</button><br>'+
          '<button id="FPREV" disabled>Previous Challenge</button> <button class="sandboxbtn FNEXT">Next</button><button id="FHIDE">Don\'t show this again</button></div>'+
          '<div style="text-align: right; float: right; margin-top: 15px;">' +

          'Voting / Commenting is currently unsupported on GreaseMonkey due to sandboxing' +
          '<img style="height: 40px; cursor: pointer" src="http://i.stack.imgur.com/EQ1ko.png" class="FVoteUp">' +
          '<img style="height: 40px; cursor: pointer" src="http://i.stack.imgur.com/OwtQb.png" class="FVoteDown">'+
          '</div></div>'+
          '<div id="SandboxChallengePreview" style="width: 100%;flex: 1;overflow: scroll; box-shadow: 0px 0px 2px #CCC inset; padding: 12px;">' + ConstructPost(posts[POSTCOUNTER]) + '</div><div id="SandboxPreviewComments"></div>';

        $("#SandboxContent").append('<div style="width: 63%; margin-left: 2%; -webkit-flex-direction: column; flex-direction: column; display: flex;">' + HTML + '</div>');
        UpdatePreviewComments();
        $(".sandboxbtn").click(function() {
          $("#SandboxChallengePreview, #SandboxPreviewComments").fadeTo(100, 0, function() {
            setTimeout(function() {
              $("#SandboxChallengePreview").html(ConstructPost(posts[++POSTCOUNTER]));
              UpdatePreviewComments();
              $("#SandboxChallengePreview, #SandboxPreviewComments").fadeTo(100, 1);
              if(POSTCOUNTER === 0) $("#FPREV").prop('disabled', true);
              else $("#FPREV").prop('disabled', false);
            }, 200);
          });
        });
        $("#FPREV").click(function(){
          $("#SandboxChallengePreview, #SandboxPreviewComments").fadeTo(100, 0, function() {
            setTimeout(function() {
              $("#SandboxChallengePreview").html(ConstructPost(posts[--POSTCOUNTER]));
              UpdatePreviewComments();
              $("#SandboxChallengePreview, #SandboxPreviewComments").fadeTo(100, 1);
              if(POSTCOUNTER === 0) $("#FPREV").prop('disabled', true);
              else $("#FPREV").prop('disabled', false);
            }, 200);
          });
        });
        $("#FHIDE").click(function() {
          var H=JSON.parse(localStorage.getItem("FHIDE") || '[]');
          H.push(posts[POSTCOUNTER].id);
          localStorage.setItem("FHIDE", JSON.stringify(H));
          $(".FNEXT").click();
        });
        $(document).on('click', ".FVoteUp:not(.FVoteActive)", function() {
          VotePost("http://meta.codegolf.stackexchange.com/posts/" + posts[POSTCOUNTER].id, 2);
          // PopupDisplay("+1'd"); 
          $(".FVoteActive").removeClass("FVoteActive");
          $(".FVoteDown").attr('src', 'http://i.stack.imgur.com/OwtQb.png');
          $(".FVoteUp").attr('src', 'http://i.stack.imgur.com/iu7y5.png');
          $(".FVoteUp").addClass("FVoteActive");
        });
        $(document).on('click', ".FVoteDown:not(.FVoteActive)", function() {
          VotePost("http://meta.codegolf.stackexchange.com/posts/" + posts[POSTCOUNTER].id, 3);
          // PopupDisplay("-1'd"); 
          $(".FVoteActive").removeClass("FVoteActive");
          $(".FVoteUp").attr('src', 'http://i.stack.imgur.com/EQ1ko.png');
          $(".FVoteDown").attr('src', 'http://i.stack.imgur.com/LyK6V.png');
          $(".FVoteDown").addClass("FVoteActive");
        });
        $(document).on('click', ".FVoteActive", function() {
          VotePost("http://meta.codegolf.stackexchange.com/posts/" + posts[POSTCOUNTER].id, 0);
          // PopupDisplay("&plusmn;0");
          $(".FVoteActive").removeClass("FVoteActive");
          $(".FVoteUp").attr('src', 'http://i.stack.imgur.com/EQ1ko.png');
          $(".FVoteDown").attr('src', 'http://i.stack.imgur.com/OwtQb.png');
        })
        $("#FComment").click(function(){
          CommentPost("http://meta.codegolf.stackexchange.com/posts/" + posts[POSTCOUNTER].id, $("#FCText").val());
        });
        $(".FLink").click(function(){ window.open(posts[POSTCOUNTER].url, "_blank"); });
        $(".Fmtom").click(function(){ Request("GET", "http://api.stackexchange.com/2.2/answers/"+$(this).data('postid')+"?order=desc&sort=activity&key=Ccn4VoktkZPX*Haf3)iubw((&site=meta.codegolf&filter=!GeEyUcJFJeRCA", function(response) {
          var res = JSON.parse(response.responseText).items[0].body_markdown;
          PostPost(GetPostTitle(res), res, $(this).data('postid'));
        }); });
      });
      $("#USERLOAD").remove();
    }
  });

  $('#SandboxBlur, #closeviewer').click(function() {
    $('#SandboxViewer').fadeOut(100);
  });

  /*== Functions ==*/
  function FormatDate(d) {
    return [d.getMonth() + 1, d.getDate(), d.getYear()+1900].join('/') + ' ' +
      [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()].join(':');
  }

  function TimeSince(d) {
    var s = Math.floor((new Date() - new Date(+(d+'e3'))) / 1000);
    var interval = Math.floor(s / 31536000);
    if (interval > 1) return interval + " years ago";
    interval = Math.floor(s / 2592000);
    if (interval > 1) return interval + " months ago";
    interval = Math.floor(s / 86400);
    if (interval > 1) return interval + " days ago";
    interval = Math.floor(s / 3600);
    if (interval > 1) return interval + " hours ago";
    interval = Math.floor(s / 60);
    if (interval > 1) return interval + " minutes ago";
    return Math.floor(s) + " seconds ago";
  }

  function GetComments(posts) {
    return posts.reduce(function(data, post) {
      var comments = post.comments || [];
      comments.forEach(function(cm) {
        data.push({
          timestamp: cm.creation_date,
          user: cm.owner.display_name,
          userid: cm.owner.user_id,
          postlink: post.post.link,
          link: cm.link,
          text: cm.body,
          post: GetPostTitle(post.post.body_markdown)
        });
      });
      data.sort(function(a, b) {
        return b.timestamp - a.timestamp;
      });
      return data;
    }, []);
  }

  function GetPostTitle(markdown) {
    return (markdown.match(/(?:\n|^)#+(.+)/) || ["", "Unknown Title"])[1];
  }

  function GetChallenges(userid, callback) {
    GetUserPosts(userid, function(posts) {
      callback(posts.map(function(p) {
        //console.log(p);
        return {
          title: GetPostTitle(p.body_markdown),
          score: {
            up: p.up_vote_count,
            down: p.down_vote_count
          },
          url: p.link,
          comments: p.comments,
          id: p.answer_id,
          body: p.body,
          post: p,
          active: p.last_activity_date
        };
      }));
    });
  }

  function OpenSockets() {
    var ws = new WebSocket("ws://qa.sockets.stackexchange.com/");
    ws.onmessage = function(e) {
      // If this shows up then it's good
      console.log("Hi, you must be looking at your console wondering what the heck this message means. It means you should be happy that this message is being logged otherwise something very wrong happened");
      try {
        var wsd = JSON.parse(JSON.parse(e.data).data);
        if (wsd.a === "answer-add") {
          // answer added
          $("#SandboxViewerToggle").css("background-image", "url(http://i.stack.imgur.com/COtrF.png)");
        }
      } catch(e) {
        console.log("error during websocket update");
      }
    };
    ws.onopen = function() {
      ws.send("202-question-2140");
    }
  }

  if (true) OpenSockets(); // Use WS?

  function GetUserPosts(userid, callback) {
    ///
    var hideitem = JSON.parse(localStorage.getItem("FHIDE") || '[]');
    if (userid === "*nofilter*") {
      Request("GET", "https://api.stackexchange.com/2.2/questions/2140/answers?order=desc&sort=activity&key=Ccn4VoktkZPX*Haf3)iubw((&site=meta.codegolf&filter=!-2qNq(tTGQYRU3SZ87hedUU)5htvSK6RNae3(IkBC-M8i", function(req) {
        var items = JSON.parse(req.response).items;
        callback(items.filter(function(item) {
          return !~hideitem.indexOf(item.answer_id) && item.owner.user_id !== StackExchange.options.user.userId;
        }));
      });
    } else {
      Request("GET", "http://api.stackexchange.com/2.2/search/excerpts?order=desc&sort=activity&title=Sandbox%20for%20Proposed%20Challenges&user="+StackExchange.options.user.userId+"&site=meta.codegolf", function(data) {
        var items = JSON.parse(data.response).items;
        function Loop(i, a) {
          if (i > items.length - 1) {
            callback(a);
          } else {
            Request("GET", 'http://api.stackexchange.com/2.2/answers/'+items[i].answer_id+'?pagesize=100&order=desc&sort=activity&site=meta.codegolf&filter=!-2qNq(tTGQYRU3SZ87hedUU)5htvSK6RNae3(IkBC-M8i', function(r) {
              a.push(JSON.parse(r.response).items[0]);
              Loop(i + 1, a);
            });
          }
        }
        Loop(0, []);
      });
    }
  }

  function Request(type, url, callback) {
    var r = new XMLHttpRequest();
    r.onreadystatechange = function() {
      if (r.readyState === 4)
        if (r.status === 200) callback(r);
    };
    r.open(type, url);
    if (type.toUpperCase() === "POST") r.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    r.send();
  }
}

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ InjectSandboxScript +')();'));
(document.body || document.head || document.documentElement).appendChild(script);