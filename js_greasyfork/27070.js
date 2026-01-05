    // ==UserScript==
    // @name        Gazelle Group Merger
    // @namespace   GroupMerger
    // @description Patch for Gazelle's broken group merge
    // @include     https://apollo.rip/torrents.php?action=editgroup*
    // @include     https://passtheheadphones.me/torrents.php?action=editgroup*
    // @version     0.4
    // @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27070/Gazelle%20Group%20Merger.user.js
// @updateURL https://update.greasyfork.org/scripts/27070/Gazelle%20Group%20Merger.meta.js
    // ==/UserScript==
    //Replace the Merge button with a custom button which does not submit the form but uses AJAX.
    document.querySelector("[value=Merge]").outerHTML = "<input value='Merge' type='Button' id='groupMergeButton'>";
    document.getElementById("groupMergeButton").onclick = validateTorrents;
     
    //Generate the DOM divs for merging.
    document.getElementById("groupMergeButton").parentElement.id = "groupMergeButtonDiv"
    document.getElementById("groupMergeButtonDiv").parentElement.id = "groupMergeForm"
    var checkElement = document.createElement('div');
    checkElement.setAttribute('id','checkElement');
    checkElement.innerHTML = "Gazelle Group Merger by TNSepta v 0.4<div id='sourceHTML'></div><div id='sinkHTML'></div><div id='mergeOutput'></div>"
    checkElement.style="text-align: center;"
    groupMergeForm.insertBefore(checkElement,document.getElementById("groupMergeButtonDiv"))
    var sourceID = -1;
    var sinkID = -1;
    var sinkTitle = "";
     
    //Use Ajax to retrieve the data for the given group as well as the current
    //and list all of their torrent members.
    //Store the list of IDs to be merged in a list.
    var authkey = "";
    var toMoveTorrents = [];
    var isOR = 0;
    function getGroupTorrents(groupID,mode){
      var postObj = $.post(
      'torrents.php?id='+groupID,
      function(r){
        //Load the authkey from page HTML
        authkey = r.split('var authkey = "')[1].split('"')[0];
        //r is the return HTML from the page load.
        //Trim out the relevant sections.
        try{
        groupTitle = r.split("<h2>")[1].split("</h2>")[0]
        groupData = r.split('<div class="main_column">')[1].split('<div class="box torrent')[0]
        }catch(err){
          groupTitle = "<h2>Page load failed! ("+groupID+")</h2>"
          groupData = "";
        }
        if (mode == "sink")
        sinkTitle = groupTitle;
        if (mode == "source"){
          document.getElementById("sourceHTML").innerHTML += "<h2>Please confirm that you are merging the torrent <br> "+groupTitle+"</h2><br>"+groupData
          mergingTorrents = document.getElementById("sourceHTML").querySelectorAll('[title="Permalink"]');
          for (var i=0;i<mergingTorrents.length;i++){
            var torrentID = mergingTorrents[i].outerHTML.split("?torrentid=")[1].split('"')[0]
            toMoveTorrents.push(torrentID);
          }
          if (groupData.indexOf("Original Release") >= 0){
            isOR = 1;
            document.getElementById("sourceHTML").innerHTML+= "<br><h2>The source group contains Original Releases. Please fill in a release number for them in the torrent group box.</h2>"
          }
        }
        if (mode == "sink"){
          document.getElementById("sinkHTML").innerHTML += "<h2> into the torrent <br> "+groupTitle+"</h2><br>"+groupData
        }
      },
      'html'
      );
      postObj.fail(function(){
        //Failed to get data.
        document.getElementById("mergeOutput").innerHTML = "<h1>Torrent page load failed, aborting.</h1>";
        return;
      })
    }
     
    function validateTorrents(){
      //Retrieve the merge source and sink group IDs
      sourceID = document.querySelector("[name=groupid]").value;
      sinkID = document.querySelector("[name=targetgroupid]").value;
      if (sinkID.indexOf("id=") >= 0){
        sinkID = sinkID.split("id=")[1];
      }
      getGroupTorrents(sourceID,"source");
      getGroupTorrents(sinkID,"sink");
      document.getElementById("groupMergeButton").onclick = moveTorrents;
    }
     
    function moveTorrents(){
      if (document.getElementById("sourceHTML").innerHTML .length < 100 || document.getElementById("sinkHTML").innerHTML .length < 100){
        document.getElementById("mergeOutput").innerHTML = "<h1>Invalid input or output group specified!</h1>"
        return;
      }
      if (toMoveTorrents.length == 0){
        document.getElementById("mergeOutput").innerHTML = "<h1>No valid torrents found in source group!</h1>"
        return;
      }
      for (var i=0;i<toMoveTorrents.length;i++){
        moveTorrent(toMoveTorrents[i]);
      }
    }
     
    function moveTorrent(torGroup){
      var postObj = $.post(
                    '/torrents.php',
                    {"action":"editgroupid","auth":authkey,"torrentid":torGroup,"oldgroupid":sourceID,"groupid":sinkID,"confirm":"true"},
                    function(r){
          console.log(r);
          if (r.indexOf(sinkTitle) >= 0){
            document.getElementById("mergeOutput").innerHTML += "<br>Successfully moved torrent "+torGroup+" from <a href = /torrents.php?id="+sourceID+"> source ID "+sourceID+"</a> to <a href = /torrents.php?id="+sinkID+">target ID "+sinkID+"</a>";
          }else{
            document.getElementById("mergeOutput").innerHTML += "<br>Moving torrent "+torGroup+" was unsuccessful. Please reload the page and recheck.";
          }
                    },
                    'html'
            );
      postObj.fail(function(){
        //Failed to get data.
        document.getElementById("mergeOutput").innerHTML += "<br>Failed to move torrent "+torGroup;
        return;
      })
    }
     
    //