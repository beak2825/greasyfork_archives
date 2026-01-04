// ==UserScript==
// @name             PSA.pm Open All Posts
// @namespace  tuktuk3103@gmail.com
// @description   Auto Clicks PSA.pm Post Buttons
// @include          *://psa.*/tv-show/*
// @include          *://psarips.com/tv-show/*
// @run-at            document-start
// @version          1.06
// @grant              none
// @icon                https://psa.re/wp-content/uploads/2021/10/cropped-PS-ICO-192x192.png
// @downloadURL https://update.greasyfork.org/scripts/449045/PSApm%20Open%20All%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/449045/PSApm%20Open%20All%20Posts.meta.js
// ==/UserScript==


(function ClickPSA() {
  
  var q, s;
  // Include menus to select your favourite quality and season
  window.addEventListener("DOMContentLoaded", function() {
    
    document.querySelector("h1.entry-title").insertAdjacentHTML('afterend', '<br><br><form onsubmit="return false;"><label for="myList">Choose Quality:</label>&nbsp;&nbsp;&nbsp;&nbsp;<select id = "myList" onchange = "favQ()"><option selected>720p</option><option>1080p</option><option>2160p</option></select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label for="sNum">Choose Season:</label>&nbsp;&nbsp;&nbsp;&nbsp;<input id="sNum" type="number" name="sNum" value="" min="1" max="42" placeholder="Leave it empty to open all seasons" onchange = "favS()"><fieldset><legend>Choose your link type:</legend><div><input type="checkbox" id="ddl" name="ddl" checked>&nbsp;&nbsp;&nbsp;&nbsp;<label for="ddl">DDL</label></div><div><input type="checkbox" id="torrent" name="torrent">&nbsp;&nbsp;&nbsp;&nbsp;<label for="torrent">Torrent</label></div></fieldset></form>');
    
    function favQ() {
    var mylist = document.getElementById("myList");
    q   = mylist.options[mylist.selectedIndex].text;
    }
    // Now inject this function
            var script3 = document.createElement("script")
            script3.setAttribute("type","text/javascript")
            script3.innerHTML = favQ.toString() + "favQ();"
            script3.id = ("Q")
            document.head.appendChild(script3)

    function favS() {
      s   = "";
      var sNum = document.getElementById("sNum");
      if (sNum.value<10&&sNum.value!="") s   = "S0" + sNum.value;
      else if (sNum.value!="") s   = "S" + sNum.value;
      else s   = "";
    }
    // Now inject this function
            var script4 = document.createElement("script")
            script4.setAttribute("type","text/javascript")
            script4.innerHTML = favS.toString() + "favS();"
            script4.id = ("S")
            document.head.appendChild(script4)
    
    function expandPosts() {
      var var1   = document.querySelectorAll('.sp-head:not(.unfolded');
      for(var i = var1.length; i--; i>-1) {
        if(var1[i].textContent.includes(s)){
          if(var1[i].textContent.includes(q)){
            var evt1 = document.createEvent("MouseEvents");
            evt1.initEvent("click", true, true);
            var1[i].dispatchEvent(evt1);
          }
        }
      }
    }
    // Now inject this function
            var script1 = document.createElement("script")
            script1.setAttribute("type","text/javascript")
            script1.innerHTML = expandPosts.toString() + "expandPosts();"
            script1.id = ("unfoldPosts")
            document.head.appendChild(script1)
            // Include button in right corner to expand posts
            var node1 = document.createElement("div");
            node1.setAttribute("style","position: fixed;" +
                                      "bottom: 0;" +
                                      "right: 28px;" +
                                      "cursor: pointer;" +
                                      "border: 1px solid #313131;" +
                                      "border-top-left-radius: 5px;" +
                                      "color: gold !important;" +
                                      "font-weight: 700;" +
                                      "background: #101000;" +
                                      "text-align: center;" +
                                      "font-size: 12px;" +
                                      "padding: 7px 15px;" +
                                      "z-index: 999999;");
            node1.setAttribute("onclick", "expandPosts();");
            node1.setAttribute("title", "Click here to expand posts");
            node1.innerHTML = "Unfold";
            node1.id = "unfold";
            document.body.appendChild(node1);
    
    function clickLinks() {
      var var2   = document.querySelectorAll('.sp-body:not(.folded)');
        const ddlCheckbox = document.querySelector('#ddl');
        const torrentCheckbox = document.querySelector('#torrent');
      for(var i = var2.length; i--; i>-1) {
        var evt2 = document.createEvent("MouseEvents");
        evt2.initEvent("click", true, true);
        if (ddlCheckbox.checked) var2[i].getElementsByTagName('a')[0].dispatchEvent(evt2);
        var evt3 = document.createEvent("MouseEvents");
        evt3.initEvent("click", true, true);
        if (ddlCheckbox.checked) if (var2[i].getElementsByTagName('a')[1].textContent.includes("Download")) var2[i].getElementsByTagName('a')[1].dispatchEvent(evt3);
        if (torrentCheckbox.checked) if (var2[i].getElementsByTagName('a')[1].textContent.includes("TORRENT")) var2[i].getElementsByTagName('a')[1].dispatchEvent(evt3);
      }
    }
    // Now inject this function
            var script2 = document.createElement("script")
            script2.setAttribute("type","text/javascript")
            script2.innerHTML = clickLinks.toString() + "clickLinks();"
            script2.id = ("exitLinks")
            document.head.appendChild(script2)
            // Include button in right corner to click links
            var node2 = document.createElement("div");
            node2.setAttribute("style","position: fixed;" +
                                      "bottom: 0;" +
                                      "right: 128px;" +
                                      "cursor: pointer;" +
                                      "border: 1px solid #313131;" +
                                      "border-top-left-radius: 5px;" +
                                      "color: gold !important;" +
                                      "font-weight: 700;" +
                                      "background: #101000;" +
                                      "text-align: center;" +
                                      "font-size: 12px;" +
                                      "padding: 7px 15px;" +
                                      "z-index: 999999;");
            node2.setAttribute("onclick", "clickLinks();");
            node2.setAttribute("title", "Click here to click links");
            node2.innerHTML = "Exit";
            node2.id = "exit";
            document.body.appendChild(node2);
    
    });
}());