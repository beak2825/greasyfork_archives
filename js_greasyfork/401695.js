// ==UserScript==
// @name Color Code
// @version 1.3.1
// @description Color Code by Assignment Group
// @namespace Violentmonkey Scripts
// @match https://aut.service-now.com/task_list.do*
// @match https://aut.service-now.com/nav_to.do*
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/401695/Color%20Code.user.js
// @updateURL https://update.greasyfork.org/scripts/401695/Color%20Code.meta.js
// ==/UserScript==

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

var assignment_groups = [
  "Customer Experience (ICT)", 
  "Cybersecurity (ICT)", 
  "Networks (ICT)", 
  "ITSM System Administrators (ICT)", 
  "IT Service Management", 
  "Platforms (ICT)", 
  "Licensing & Vendor Management (ICT)", 
  "Student Applications (ICT)", 
  "Student Service Desk (ICT)", 
];

var username = g_user.userName;

var usernames_map = { 
                      // FS
                      "em11395":"Daniel Johnston", 
                      "pdouilla":"Polo Douillard",
                      "razhang":"Raymond Zhang",
                      "jrutherf":"Jonny Rutherfurd",
                      "dianaboo":"Diana Booysens",
                      "thansen":"Trent Hansen",
                      "ryia":"Robert Yia",
                      "jviaene":"John Viaene",
                      "gasingh":"Gagan Singh",
                      "co26953":"Val Constantino",
                      "vaconsta":"Val Constantino",
                      "co27236":"Sanju Daniel",
                      // SD
                      "rilal":"Ritesh Lal",
                      "ccoveney":"Craig Coveney",
                      "aanilkum":"Arjun Anilkumar",
                      "em14579":"Bailey Middleton",
                      "em13235":"Beheshteh Abrahimi",
                      "em14907":"Lavi Brar",
                      "em12259":"Karanjit Gahunia",
                      // RIP
                      "em11396":"Liam Hogg",
                      "em13828":"Michael Tupaea",
                      "alopez":"Andy Lopez",
                      "em10192":"Harikalan Asokan",
                      "em15293":"Ron Varghese",
                      "kmanu":"Kelly Manu",
                      "wlam":"William Lam",
                      "wclark":"Wayne Clark",
                      "em14873":"Manju Salagiriyappa",
                      // Hardware/Installs
                      "sakhan":"Sabeel Khan",
                      "crgilber":"Craig Gilbert",
                      "emidoran":"Eric Midoranda",
                      // SS
                      "gkean":"Gerard Kean",
                      // L3
                      "em10226":"Camilo Diaz",
                      "byeldon":"Ben Yeldon",
                      "swaz":"David Swasbrook",
                      "balladin":"Baber Alladin",
                      "pmusthya":"Pramida Musthyala",
                      "em12498":"Dehui Yan",
                      "devans":"Dan Evans",
                      "mdonovan":"Mark Donovan",
                      "bmuir":"Bruce Muir",
                      "gtulud":"Gian Tulud",
                      "knepia":"Kurt Nepia",
                      "em13775":"Colin Wong",
                      // OTHER
                      "em12505":"Scott Burgess",
                      "bcolloff":"Bruce Colloff",
                      "bmasson":"Bruce Masson",
                   };

var assignment_group_index;
var updated_by_index;
var status_index;
var updated;
// so we can highlight any dates in the short description
var short_desc_index;

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
var today = dd + '/' + mm + '/' + yyyy;

waitForKeyElements (
  "#hdr_task",
  find_column_order
);

function find_column_order(header)
{
  for (i = 0; i < header[0].childNodes.length; i++)
  {
    if (header[0].childNodes[i].childNodes[0].innerText.split("\n")[0] == "Assignment group")
    {
      assignment_group_index = i;
    }
    else if (header[0].childNodes[i].childNodes[0].innerText.split("\n")[0] == "Updated")
    {
      updated = i;
    }
    else if (header[0].childNodes[i].childNodes[0].innerText.split("\n")[0] == "Updated by")
    {
      updated_by_index = i;
    }
    else if (header[0].childNodes[i].childNodes[0].innerText.split("\n")[0] == "Status")
    {
      status_index = i;
    }
    else if (header[0].childNodes[i].childNodes[0].innerText.split("\n")[0] == "Short description")
    {
      short_desc_index = i;
    }
  }
}


waitForKeyElements (
  ".list_row",
  modify_row
);


function modify_row(row)
{
  //last_updated = row[0].childNodes[updated].innerText.split("\n")[1];
  last_updated = row[0].childNodes[updated].childNodes[2].innerText;
  last_updated_by = row[0].childNodes[updated_by_index].innerText;
  short_desc = row[0].childNodes[short_desc_index].innerHTML;
  
  if (short_desc.includes(today))
  {
    row[0].childNodes[short_desc_index].innerHTML = row[0].childNodes[short_desc_index].innerHTML.replace(today, '<p style="color:red;font-weight:bold;">'+today+"</p>")
  }
  
  if (last_updated_by in usernames_map)
  {
    row[0].childNodes[updated_by_index].innerText = usernames_map[last_updated_by];
  }
  
  //if (!team_usernames.includes(last_updated_by))
  if (!(last_updated_by in usernames_map))
  {
    // updated by the 'customer'
    row[0].childNodes[updated_by_index].style.color = "red";
  }
  else if (username != "" && username == last_updated_by)
  {
    // color it black
  }
  else
  {
    row[0].childNodes[updated_by_index].style.color = "green";
  }
  
  
  if (status_index != null && status_index != "")
  {
    if (row[0].childNodes[status_index].innerText == "Work in Progress" || (row[0].childNodes[status_index].innerText == "In Progress"))
    {
      row[0].childNodes[status_index].style.color = "red";
    }
  }
  
  if (assignment_group_index === undefined) 
  {  
    return
  }
  
  assignment_group = row[0].childNodes[assignment_group_index].childNodes[0].text;
  
  // need to do it this way to check with an array
  if (assignment_groups.includes(assignment_group))
  {
    // disable alternating row highlighting -- required!
    row[0].className = "list_row";
    
    if (assignment_group.includes("Customer Experience (ICT)"))
    {
      row[0].style.backgroundColor = "rgba(236,28,36,0.2)";
    }
    
    if (assignment_group.includes("Cybersecurity (ICT)"))
    {
      row[0].style.backgroundColor = "rgba(14,209,69,0.2)";
    }
    
    if (assignment_group.includes("Networks (ICT)"))
    {
      row[0].style.backgroundColor = "rgba(0,168,243,0.2)";
    }
    
    if (assignment_group.includes("ITSM System Administrators (ICT)"))
    {
      row[0].style.backgroundColor = "rgba(184,61,186,0.2)";
    }
    
    if (assignment_group.includes("IT Service Management"))
    {
      row[0].style.backgroundColor = "rgba(186,53,,0.2)";
    }
    
    if (assignment_group.includes("Platforms (ICT)"))
    {
      row[0].style.backgroundColor = "rgba(255,135,53,0.2)";
    }
    
    if (assignment_group.includes("Licensing & Vendor Management (ICT)"))
    {
      row[0].style.backgroundColor = "rgba(100,73,21,0.2)";
    }
    
    if (assignment_group.includes("Student Applications (ICT)"))
    {
      row[0].style.backgroundColor = "rgba(53,255,186,0.2)";
    }
    
    if (assignment_group.includes("Student Service Desk (ICT)"))
    {
      row[0].style.backgroundColor = "rgba(255,53,122,0.2)";
    }
    
    // Can't use this as it will apply the opacity to the text as well
    //row[0].style.backgroundColor = assignment_group_colors[assignment_group];
    //row[0].style.opacity = "0.25";
    //row[0].style.color = "black";
    
  }
}
