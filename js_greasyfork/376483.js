// ==UserScript==
// @name        New GGn easy add to common collections XL (Now with Amiibo!)
// @namespace   https://gazellegames.net/torrents
// @description Add a group to often used collection from group page
// @include     https://gazellegames.net/torrents.php?id=*
// @version     1.2
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/376483/New%20GGn%20easy%20add%20to%20common%20collections%20XL%20%28Now%20with%20Amiibo%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/376483/New%20GGn%20easy%20add%20to%20common%20collections%20XL%20%28Now%20with%20Amiibo%21%29.meta.js
// ==/UserScript==

/******************* COLLECTIONS *************************
 format of every line: [collectionID, "Displayed Name"],
 to add a title, just use collectionID 0
 *********************************************************/
var collections = [
    [0   , "Stores"                  ],
    [133 , "Humble"                  ],
    [25  , "GOG"                     ],
    [1100, "Steam EA Linux"          ],
    [717 , "GOG InDev"               ],

    [0   , "Engines"                 ],
    [263 , "Unity"                   ],
    [562 , "GameMaker"               ],
    [245 , "Unreal"                  ],
    [657 , "Flash"                   ],
    [789 , "FNA"                     ],

    [0   , "Features"                ],
    [551 , "Nat. Controller Support" ],
    [961 , "Co-Op"                   ],
    [962 , "Local Co-Op"             ],
    [963 , "Local MP"                ],
    [476 , "Single Screen MP"        ],
    [77  , "LAN"                     ],


    [0   , "Themes"                  ],
    [902 , "Procedural Generation"   ],
    [856 , "Female Protagonist"      ],
    [586 , "Zombie"                  ],

    [0   , "Other"                   ],
    [969 , "GGn Internals"           ],
    [164 , "Crowdfunded"             ],

    [0   , "Nintendo"                ],
    [665 , "Nintendo Dev"            ],
    [664 , "Nintendo Pub"            ],
    [1409, "Amiibo Support"          ],
    [55  , "Mario Franchise"         ],
]
/* **************************************************** */

var col_links = '<tr><td style="width: 0; font-weight: bold">Add to:</td><td>';

collections.forEach(function (e, i, v) {
    if (e[0] == 0) {
        col_links += '</td></tr><tr><td>    ' + e[1] + ":</td><td> ";
    } else {
        col_links += '[<a href="javascript:;" id="add_to_coll_'+e[0]+'">'+e[1]+'</a>] ';
    }
});
col_links += "</td></tr></table>"

$("<table/>", {"id": "coltable"}).insertBefore(".description_div");

$("#coltable").html('»»» <a href="javascript:;" id="addcolls">Add to collections</a>');
document.getElementById('addcolls').addEventListener('click', function () {
    $("#coltable").html(col_links);
    collections.forEach(function (e, i, v) {
        if (e[0] != 0) {
            $("#add_to_coll_"+e[0]).click(function() { to_coll(e[0]); } );
        }
    });
});

function to_coll(collId){
    var http = new XMLHttpRequest();
    var url = "collections.php";
    var params = "action=add_torrent&auth="+authkey+"&collageid="+collId+"&url="+window.location.href;
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            document.getElementById("add_to_coll_"+collId).outerHTML = "ADDED";
            return true;
        }
    }
    http.send(params);
    return true;
}

