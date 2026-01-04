// ==UserScript==
// @name F5 Frontend Enhancements
// @description F5 BIG-IP Frontend UI Enhancements
// @match https://*/tmui/Control/*
// @homepage https://devcentral.f5.com/s/articles/WebUI-Tweaks
// @author https://loadbalancing.se/about
// @run-at document-end
// @version 25
// @namespace https://raw.githubusercontent.com/timriker/F5-UI-FrontendEnhancements/master/F5-Frontend-Enhancements.js
// @supportURL https://devcentral.f5.com/s/articles/webui-tweaks-v12-1109
// @license MIT
// @grant none
// @require https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/495900/F5%20Frontend%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/495900/F5%20Frontend%20Enhancements.meta.js
// ==/UserScript==
/* globals jQuery,$,codeEditor */

/***************************************************************************************
                        Begin Config section
****************************************************************************************/

    /**************************************************************
    How many rules you want to see in the rule assignment window

    Default:
    iRulesCount = 40;
    ***************************************************************/

    var iRulesCount = 40;

    /**************************************************************
    How many monitors you want to show in the monitor selection

    Default:
    MonitorCount = 30;
    ***************************************************************/

    var MonitorCount = 30;

    /**************************************************************
    How many data group list entries to show

    Default:
    DatagroupListCount = 30;
    ***************************************************************/

    var DatagroupListCount = 30;

    /**************************************************************
    Set http monitor name default suffix

    Default:
    HttpMonitorSuffix = "";
    ***************************************************************/

    var HttpMonitorSuffix = "-http_monitor";

    /**************************************************************
    Set the default pool name

    Default:
    DefaultPoolName = "";
    ***************************************************************/

    var DefaultPoolName = "pool_";

    /**************************************************************
    Set the default action on pool down when creating pools

    Default:
    DefaultActionOnPoolDown = 0;

    Options:
    0 = None
    1 = Reject
    2 = Drop
    ***************************************************************/

    var DefaultActionOnPoolDown = 1;

    /**************************************************************
    Set the default action on pool down when creating pools
    Default = 0;

    Options:
    0 = Round Robin
    1 = Ratio (member)
    2 = Least Connections (member)
    3 = Observed (member)
    4 = Predictive (member)
    5 = Ratio (node)
    6 = Least connections (node)
    7 = Fastest (node)
    8 = Observed (node)
    9 = Predictive (node)
    10 = Dynamic Ratio (node)
    11 = Fastest (application)
    12 = Least sessions
    13 = Dynamic ratio (member)
    14 = Weighted Least Connections (member)
    15 = Weighted Least Connections (node)
    16 = Ratio (session)
    17 = Ratio Least connections (member)
    18 = Ratio Least connections (node)
    **************************************************************/

    var DefaultLBMethod = 4;

    /**************************************************************
    Choose Node List as default when creating pools

    Default:
    ChooseNodeAsDefault = 0;

    Options:
    0 = No
    1 = Yes
    **************************************************************/

    var ChooseNodeAsDefault = 1;

    /**************************************************************
    Add default certificate signing alternatives
    First one defined is always the default one

    This one is a bit tricky to format, look at the example carefully

    Options:
    false = No
    true = Yes

    Example that creates two options:
    var csroptions = {
                Company1: {
                    OptionName: 'Company 1',
                    CommonName: '[Example *.domain.com]',
                    Division: 'Stockholm office',
                    Organization: 'My Office address',
                    Locality: 'Stockholm',
                    StateProvince: 'Stockholm',
                    Country: 'SE',
                    Email: 'office@company.se',
                    SubjectAlt: ''
                }
            ,
                Company2: {
                    OptionName: 'Another company',
                    CommonName: '[Example *.domain.com]',
                    Division: 'Oslo office',
                    Organization: 'My Oslo Office address',
                    Locality: 'Oslo',
                    StateProvince: 'Oslo',
                    Country: 'NO',
                    Email: 'office@company.no',
                    SubjectAlt: ''
                }
            }
    **************************************************************/

    var csroptions = {
                "Company1": {
                    "OptionName": "Company 1",
                    "CommonName": "[Example *.domain.com]",
                    "Division": "Stockholm office",
                    "Organization": "My Office address",
                    "Locality": "Stockholm",
                    "StateProvince": "Stockholm",
                    "Country": "SE",
                    "Email": "office@company.se",
                    "SubjectAlt": ""
                }
            ,
                "Company2": {
                    "OptionName": "Another company",
                    "CommonName": "[Example *.domain.com]",
                    "Division": "Oslo office",
                    "Organization": "My Oslo Office address",
                    "Locality": "Oslo",
                    "StateProvince": "Oslo",
                    "Country": "NO",
                    "Email": "office@company.no",
                    "SubjectAlt": ""
                }
            }

    /*****************************************************************************
    Select this default chain certificate when creating client SSL profiles

    Default:
    defaultChain = "";

    defaultChain = "/Common/mychain.crt";
    *******************************************************************************/

    var defaultChain = "/Common/ca-bundle.crt";

    /*************************************************************************
    Chooses a default parent profile when creating client SSL profiles

    Default:
    defaultClientSSLParentProfile = "";

    defaultClientSSLParentProfile = "/Common/myParentProfile";
    ***************************************************************************/

    var defaultClientSSLParentProfile = "";

    /*************************************************************************
    Deactivate the choice to activate the Christmas theme altogether

    Default (allow the choice):
    allowChristmas = false;

    Don't allow the choice:
    allowChristmas = true;
    ***************************************************************************/

    var allowChristmas = true;

    /**************************************************************************
    How often should the script update the LTM log stats (in seconds)
    ltmLogCheckInterval = 30;
    **************************************************************************/

    var ltmLogCheckInterval = 30;

/***************************************************************************************
                        End Config section
****************************************************************************************/

//Make sure that the tampermonkey jQuery does not tamper with F5's scripts
this.$ = this.jQuery = jQuery.noConflict(true);

//Declare global ajax queue limit
var tamperDataGroupLists = new Array();
var detectedarr = [];

var poolStatuses;

var versionInfo = $(parent.top.document).find("div#deviceid div span").attr("title");
var version = versionInfo.split(" ")[1];
var majorVersion = version.split(".")[0];

var logDatabase;

var ltmLogPatterns = {
    "poolFailures": new function(){
        this.enabled = true;
        this.name = "Pool failures";
        this.isMatching = function(event){
            return(event.logEvent.match(/^Pool.+monitor status down/) !== null);
        }
    },
    "nodeFailures": new function(){
        this.enabled = true;
        this.name = "Node failures";
        this.isMatching = function(event){
            return(event.logEvent.match(/^Node.+monitor status down/) !== null);
        }
    },
    "errors": new function(){
        this.enabled = true;
        this.name = "Errors";
        this.isMatching = function(event){
            return(event.logLevel === "error");
        }
    },
    "warnings": new function(){
        this.enabled = true;
        this.name = "Warnings";
        this.isMatching = function(event){
            return(event.logLevel === "warning");
        }
    },
    "tclErrors": new function(){
        this.enabled = true;
        this.name = "TCL Errors";
        this.isMatching = function(event){
            return(event.logEvent.match(/^TCL error/) !== null);
        }
    },
    "aggressiveMode": new function(){
        this.enabled = true;
        this.name = "Aggressive Mode"
        this.isMatching = function(event){
            return(event.logEvent.match(/aggressive mode activated/) !== null);
        }
    },
    "addressConflicts": new function(){
        this.enabled = true;
        this.name = "Address Conflicts"
        this.isMatching = function(event){
            return(event.logEvent.match(/address conflict detected for/) !== null);
        }
    }
}

var enhancementFunctions = {

    "enhanceiRuleProperties": new function(){
        // Scans for data group lists in an iRule and adds data group lists on the side
        this.name = "Improve iRule editor";
        this.description = `<ul>
                                <li>Scans iRule for data group lists</li>
                                <li>Adds detected data group lists to the right side of the iRule editor</li>
                                <li>Hovering the mouse over an iRule shows the data group list content</li>
                            </ul>`;
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return uriContains("/tmui/Control/jspmap/tmui/locallb/rule/properties.jsp")
            && this.appliesToVersion.indexOf(majorVersion) != -1
            && this.enabled;
        };
        this.enhance = improveiRuleProperties;
    },
    "improveiRuleSelection": new function(){
        this.name = "Improve virtual server iRules management";
        this.description = `<ul>
                                <li>Increases the selection box</li>
                                <li>Adds double click to move between sections.</li>
                            </ul>`;
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return uriContains("/tmui/Control/form?__handler=/tmui/locallb/virtual_server/resources&__source=Manage")
                && this.appliesToVersion.indexOf(majorVersion) != -1
                && this.enabled;
        };
        this.enhance = improveiRuleSelection;
    },
    "addHTTPMonitorSuffix": new function(){
        this.name = "Adds HTTP monitor suffix to pool names";
        this.description = `<ul>
                                <li>Adds monitor prefixes when creating pools</li>
                            </ul>`;
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return $("select[name=mon_type]").length > 0
                && this.appliesToVersion.indexOf(majorVersion) != -1
                && this.enabled;
        };
        this.enhance = addHTTPMonitorSuffix;
    },
    "makeCurrentPartitionObjectsBold": new function(){
        this.name = "Make current partition objects bold";
        this.description = `<ul>
                                <li>Adds monitor prefixes</li>
                            </ul>`;
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return uriContains('/list.jsp')
                && this.appliesToVersion.indexOf(majorVersion) != -1
                && this.enabled;
        };
        this.enhance = makeCurrentPartitionObjectsBold;
    },
    "improvePoolProperties": new function(){
        this.name = "Enhance the pool properties page";
        this.description = `<ul>
                                <li>Makes monitor selection bigger</li>
                                <li>Adds double click functionality</li>
                            </ul>`;
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return uriContains("/tmui/Control/jspmap/tmui/locallb/pool/properties.jsp?name")
                && this.appliesToVersion.indexOf(majorVersion) != -1
                && this.enabled;
        };
        this.enhance = improvePoolProperties;
    },
    "improvePoolCreation": new function(){
        this.name = "Enhance the pool creation page";
        this.description = `<ul>
                                <li>Makes monitor selection bigger</li>
                                <li>Adds double click functionality</li>
                            </ul>`;
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return uriContains("/tmui/Control/jspmap/tmui/locallb/pool/create.jsp")
                && this.appliesToVersion.indexOf(majorVersion) != -1
                && this.enabled;
        };
        this.enhance = improvePoolCreation;
    },
    "improvePoolMemberProperties": new function(){
        this.name = "Enhance the pool member properties page";
        this.description = `<ul>
                                <li>Adds monitor tests for HTTP monitors</li>
                            </ul>`;
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return uriContains("/tmui/Control/jspmap/tmui/locallb/pool/member/properties.jsp")
                && this.appliesToVersion.indexOf(majorVersion) != -1
                && this.enabled;
        };
        this.enhance = improvePoolMemberProperties;
    },
    "improveCertKeyChainSelection": new function(){
        this.name = "Client SSL Profile enhancements";
        this.description = `<ul>
                                <li>Automatically selects certificate and keys matching the name of the client SSL profile</li>
                                <li>Selects a default chain certificate according to the script configuration</li>
                            </ul>`;
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return $('input[name="cert_key_chain_override"]').length > 0
                && this.appliesToVersion.indexOf(majorVersion) != -1
                && this.enabled;
        };
        this.enhance = improveCertKeyChainSelection;
    },
    "improveVirtualServerResources": new function(){
        this.name = "Improve Virtual Server resource tab";
        this.description = `<ul>
                                <li>Adds a shortcut to the configured default pool</li>
                            </ul>`;
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return uriContains("/tmui/Control/jspmap/tmui/locallb/virtual_server/resources.jsp")
                && this.appliesToVersion.indexOf(majorVersion) != -1
                && this.enabled;
        };
        this.enhance = improveVirtualServerResources;
    },
    "improveVirtualServerProperties": new function(){
        this.name = "Improve Virtual Server properties page";
        this.description = `<ul>
                                <li>Double click to the multiple selection lists</li>
                            </ul>`;
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return uriContains("/tmui/Control/jspmap/tmui/locallb/virtual_server/properties.jsp")
                && this.appliesToVersion.indexOf(majorVersion) != -1
                && this.enabled;
        };
        this.enhance = improveVirtualServerProperties;
    },
    "improveDataGroupListProperties": new function(){
        this.name = "Data group list editing safe guards";
        this.description = `<ul>
                                <li>Disabled the update button while the key/value fields contains values not in the list to protect from accidentally removing something by mistake.</li>
                            </ul>`;
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return uriContains("/tmui/Control/jspmap/tmui/locallb/datagroup/properties.jsp")
                && this.appliesToVersion.indexOf(majorVersion) != -1
                && this.enabled;
        };
        this.enhance = improveDataGroupListProperties;
    },
    "improveDataGroupListEditing": new function(){
        this.name = "Add data group list editing features";
        this.description = `<ul>
                                <li>Adds the possibility to free-text edit, import, export and merge lists.</li>
                            </ul>`;
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return (uriContains("/tmui/Control/jspmap/tmui/locallb/datagroup/properties.jsp")
                || uriContains("/tmui/Control/jspmap/tmui/locallb/datagroup/create.jsp")
                || uriContains("/tmui/locallb/datagroup/properties"))
                && this.appliesToVersion.indexOf(majorVersion) != -1
                && this.enabled;
        };
        this.enhance = improveDataGroupListEditing;
    },
    "improveClientSSLProfileCreation": new function(){
        this.name = "Improves the client SSL profile creation";
        this.description = `<ul>
                                <li>Automatically selects a parent profile according to the script configuration</li>
                            </ul>`;
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return uriContains("/tmui/Control/jspmap/tmui/locallb/profile/clientssl/create.jsp")
                && this.appliesToVersion.indexOf(majorVersion) != -1
                && this.enabled;
        };
        this.enhance = improveClientSSLProfileCreation;
    },
    "improvePoolList": new function(){
        this.name = "Improves the pool list";
        this.description = `<ul>
                                <li>Gives more granular pool state symbols</li>
                                <li>Hovering the mouse of the state symbol shows the members and their states</li>
                            </ul>
                            <font color="red">Warning: On <i>very</i> large configurations (~2000 pools) this <i><b>can</b></i> be detrimental to the HTTPD process.
                            <b>This is not a risk for the application delivery itself</b>, but <i>may</i> cause the process to be restarted.</font>`;
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return uriContains("/tmui/Control/jspmap/tmui/locallb/pool/list.jsp")
                && this.appliesToVersion.indexOf(majorVersion) != -1
                && this.enabled;
        };
        this.enhance = improvePoolList;
    },
    "addPartitionFilter": new function(){
        this.name = "Partition filter";
        this.description = `<ul>
                                <li>Adds a free text partition filter to ease partition selection</li>
                            </ul>`
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return $(parent.top.document).find("input#partitionFilter").length == 0
                && this.appliesToVersion.indexOf(majorVersion) != -1
                && this.enabled;
        };
        this.enhance = addPartitionFilter;
    },
    "addChristmasTheme": new function(){
        this.name = "Christmas theme";
        this.description = `<ul>
                                <li>Allows the user to enable/disable Christmas theme during December</li>
                            </ul>`
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return isItChristmas()
                && allowChristmas
                && this.appliesToVersion.indexOf(majorVersion) != -1
                && this.enabled;
        };
        this.enhance = showChristmasOption;
    },
    "addCSRDropDownMenu": new function(){
        this.name = "CSR profiles";
        this.description = `<ul>
                                <li>Adds a drop down menu with predefined CSR options</li>
                            </ul>`;
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return uriContains("/tmui/Control/jspmap/tmui/locallb/ssl_certificate/create.jsp")
                && this.appliesToVersion.indexOf(majorVersion) != -1
                && this.enabled;
        };
        this.enhance = addCSRDropDownMenu;
    }, "addLTMLogSummary": new function(){
        this.name = "LTM log features";
        this.description = `<ul>
                                <li>Adds information from the LTM log to the top bar</li>
                                <li>Shows pool failures in the pool list</li>
                            </ul>`;
        this.enabled = true;
        this.appliesToVersion = ["11", "12", "13", "14", "15"];
        this.applicable = function(){
            return uriContains("/tmui/Control/jspmap/tmui/overview/welcome/introduction.jsp")
                && this.appliesToVersion.indexOf(majorVersion) != -1
                && this.enabled;
        };
        this.enhance = startLTMLogFetcher;
    }
}

for(let i in enhancementFunctions){
    let f = enhancementFunctions[i];
    if(f.applicable()){
        f.enhance();
    }
}

/**************************************************************************
 * Modify the top frame
 **************************************************************************/

String.prototype.hashCode = function(){
    let hash = 0;
    if (this.length == 0) return hash;
    for (let i = 0; i < this.length; i++) {
        let char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function startLTMLogFetcher(){
    //Check if the database contains anything
    if(typeof(logDatabase) === "undefined"){
        let rawData = localStorage.getItem("ltmLog") || "{\"content\":{},\"lastSynced\":null}";
        logDatabase = JSON.parse(rawData);
        //updateLTMLogStatistics(getLTMLogStatisticsSummary(logDatabase));
        initiateLTMLogStatistics();
    }
    if(logDatabase.lastSynced){
        let lastSynced = new Date(logDatabase.lastSynced);
        let now = new Date();
        let seconds = (now.getTime() - lastSynced.getTime()) / 1000;
    }
    let fetchLTMLog = function(){
        $.ajax({
            url: "https://" + window.location.host + "/tmui/Control/jspmap/tmui/system/log/list_ltm.jsp",
            type: "GET",
            success: function(response) {
                $(response).find("table.list tbody tr").each(function(){
                    let message = {}
                    let row = $(this).find("td");
                    message.timeStamp = $(row[0]).text().trim();
                    message.logLevel = $(row[1]).text().trim();
                    message.host = $(row[2]).text().trim();
                    message.service = $(row[3]).text().trim();
                    message.statusCode = $(row[4]).text().trim();
                    message.logEvent = $(row[5]).text().trim();
                    let data = "";
                    for(let i in message){
                        data += message[i]
                    }
                    if(!(data in logDatabase)){
                        logDatabase.content[data] = message
                    }
                    logDatabase.lastSynced = new Date();
                })
                updateLTMLogStatistics(getLTMLogStatisticsSummary(logDatabase));
                localStorage.setItem("ltmLog", JSON.stringify(logDatabase));
            }
        })
    }
    fetchLTMLog();
    setInterval(fetchLTMLog, ltmLogCheckInterval*1000);
}

function initiateLTMLogStatistics(){
    let topFrame = $(parent.top.document);
    if(topFrame.find("div.ltmLogStats").length == 0){
        let styleTag = $(`<style>
                                .ltmLogStats {
                                    float: left;
                                    padding: 0 15px;
                                    border-right: 1px dotted #444;
                                    margin: 0;
                                }
                        </style>`);
        topFrame.find('html > head').append(styleTag);
        let html = ``;
        let parameterList = [];
        for(let i in ltmLogPatterns){
            if(parameterList.length == 2){
                html += `<div class="ltmLogStats" id="ltmLogStats">` + parameterList.join("") + `</div>`
                parameterList = [];
            }
            parameterList.push(`
                    <div class="" id="logStats` + i + `">
                        <label>` + ltmLogPatterns[i].name + `:</label>
                        <span>Loading...</span>
                    </div>`
            );
        }
        if(parameterList.length != 0){
            html += `<div class="ltmLogStats">` + parameterList.join("") + `</div>`
        }
        topFrame.find("div#userinfo").last().after(html);
    }

}

function updateLTMLogStatistics(summary){
    let topFrame = $(parent.top.document);
    if(topFrame.find("div.ltmLogStats").length != 0){
        let i = 0
        for(let stats in summary){
            let statsSpan = topFrame.find("div#logStats" + stats + " span");
            statsSpan.fadeOut(300);
            statsSpan.html(summary[stats]);
            statsSpan.fadeIn(300);
        }
    }
}

function getLTMLogStatisticsSummary(logDatabase){
    let summary = {};
    let events = logDatabase.content;
    for(let f in ltmLogPatterns){
        let logTest = ltmLogPatterns[f];
        if(logTest.enabled){
            summary[f] = 0;
        }
    }
    for(let i in events){
        let event = events[i];
        for(let functionName in ltmLogPatterns){
            let f = ltmLogPatterns[functionName];
            if(f.isMatching(event)){
                summary[functionName]++;
            }
        }
    }
    return(summary);
}

function isItChristmas(){
    let d = new Date();
    return d.getMonth() == 11;
}

function showChristmasOption(){
    if($(parent.top.document).find("input#grinch").length == 0){
        let partitionDiv = $(parent.top.document).find("div#partition");
        partitionDiv.after(`
            <div id="christmasdiv" style="float:right;border-left: 1px dotted #444; padding: 5px;">
                <span style='font-family: "Comic Sans MS", "Comic Sans";color:#f92c2c;font-size:14px;'>Merry Christmas! Which one are you? </span>
                <form action="" style="display:inline;">
                    <input name="ChristmasButton" class="christmasButton" type="radio" id="grinch" value="grinch"> Grinch
                    <input name="ChristmasButton" class="christmasButton"type="radio" id="santa" value="santa"> Santa
                </form>
            <div>
        `);
        if(localStorage.getItem("tamperMonkey-snowActivated") === "true"){
            letItSnow();
            $(parent.top.document).find("input#santa").attr("checked", true);
        } else {
            $(parent.top.document).find("input#grinch").attr("checked", true);
        }
        $(parent.top.document).find("input.christmasButton").on("click", function(){
            if($(this).val() === "santa"){
                letItSnow();
                localStorage.setItem("tamperMonkey-snowActivated", "true");
            } else {
                $(parent.top.document).find("#xmasdiv").remove();
                $(parent.top.document).find("#santahat").remove();
                localStorage.setItem("tamperMonkey-snowActivated", "false")
            }
        })
    }
}

// This function handles the Christmas theme (santa hat on the F5 ball and snow)
function letItSnow(){
    if(parent.top.document.getElementById("xmasdiv") === null){
        let b = parent.top.document.getElementById("banner");
        let logo = parent.top.document.getElementById("logo");
        let image = $(logo).find("img");
        let position = image.position();
        let santacap = "data:image/png;base64,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";
        $(logo).prepend("<div id=\"santahat\" style=\"position:absolute;left:" + (position.left - 3) + "px;top:" + (position.top - 20) + "px;pointer-events: none;\"><img id=\"santacap\" src=\"" + santacap + "\"\></div>");
        $(b).before("<div id=\"xmasdiv\" style=\"position:absolute;left:0px;top:" + b.offsetTop + "px;width:100%;height:105.38px;width:" + b.offsetWidth + ";z-index:999;overflow:hidden;pointer-events: none;\"><canvas id=\"xmassnow\" class=\"snow\"></canvas></div>")
        let canvas = parent.top.document.getElementById("xmassnow");
        let w = b.offsetWidth
        let h = b.offsetHeight
        let ctx = canvas.getContext('2d'),
        windowW = w,
        windowH = h,
        numFlakes = 200,
        flakes = [];

        function Flake(x, y) {
            let maxWeight = 5,
            maxSpeed = 0.5;
            this.x = x;
            this.y = y;
            this.r = randomBetween(0, 1);
            this.a = randomBetween(0, Math.PI);
            this.aStep = 0.01;
            this.weight = randomBetween(2, maxWeight);
            this.alpha = (this.weight / maxWeight);
            this.speed = (this.weight / maxWeight) * maxSpeed;
            this.update = function() {
                this.x += Math.cos(this.a) * this.r;
                this.a += this.aStep;
                this.y += this.speed;
            }
        }

        function init() {
            let i = numFlakes,
            flake,
            x,
            y;
            while (i--) {
                x = randomBetween(0, windowW, true);
                y = randomBetween(0, windowH, true);
                flake = new Flake(x, y);
                flakes.push(flake);
            }
            scaleCanvas();
            loop();
        }

        function scaleCanvas() {
            canvas.width = windowW;
            canvas.height = windowH;
        }

        function loop() {
            let i = flakes.length,
            z,
            dist,
            flakeA,
            flakeB;
            // clear canvas
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, windowW, windowH);
            ctx.restore();
            // loop of hell
            while (i--) {
                flakeA = flakes[i];
                flakeA.update();
                /*for (z = 0; z < flakes.length; z++) {
                  flakeB = flakes[z];
                  if (flakeA !== flakeB && distanceBetween(flakeA, flakeB) < 150) {
                    ctx.beginPath();
                    ctx.moveTo(flakeA.x, flakeA.y);
                    ctx.lineTo(flakeB.x, flakeB.y);
                    ctx.strokeStyle = '#444444';
                    ctx.stroke();
                    ctx.closePath();
                  }
                }*/
                ctx.beginPath();
                ctx.arc(flakeA.x, flakeA.y, flakeA.weight, 0, 2 * Math.PI, false);
                ctx.fillStyle = 'rgba(255, 255, 255, ' + flakeA.alpha + ')';
                ctx.fill();
                if (flakeA.y >= windowH) {
                  flakeA.y = -flakeA.weight;
                }
            }
            requestAnimationFrame(loop);
        }

        function randomBetween(min, max, round) {
            let num = Math.random() * (max - min + 1) + min;
            if (round) {
                return Math.floor(num);
            } else {
                return num;
            }
        }

        function distanceBetween(vector1, vector2) {
          let dx = vector2.x - vector1.x,
              dy = vector2.y - vector1.y;
          return Math.sqrt(dx*dx + dy*dy);
        }

        init();
    }
}

function addPartitionFilter(){
    let partitionDiv = $(parent.top.document).find("div#partition");
    // Add the filter input and the label
    partitionDiv.prepend("<input size=10 id=\"partitionFilter\"/>  ")
    partitionDiv.prepend("<label>Partition filter <a title=\"Hit enter to activate the selected partition\" id=\"partitionFilterHelp\" href=\"https://loadbalancing.se/f5-webui-tweaks/#Partition_filtering\" target=\"_blank\">[?]</a>: </label>");
    let partitionDropDown = partitionDiv.find("select#partition_control");
    let partitonOptions = partitionDropDown.find("option");
    let partitionFilterInput = partitionDiv.find("input#partitionFilter");
    partitionFilterInput.on("keyup", function(e){
        if(e.keyCode === 13){
            triggerEvent("change", parent.top.document.querySelector("div#partition select#partition_control"))
            return;
        }
        let searchValue = this.value;
        // Set the local storage in order to re-populate the filter upon page reload
        localStorage.setItem("tamperMonkey-PartitionFilter", searchValue);
        let re = new RegExp(searchValue, "i");
        partitonOptions.each(function(){
            if($(this).val().match(re) || $(this).val() === "[All]"){
                $(this).attr("ismatch", "true")
                $(this).show();
            } else {
                $(this).attr("ismatch", "false")
                $(this).hide();
            }
        });
        let selectedOption = partitionDropDown.find("option:selected");
        let selectedOptionValue = selectedOption.val() || ""
        let matchedCount = partitionDropDown.find("option[ismatch='true']").length;
        if(!selectedOptionValue.match(re) && matchedCount > 0){
            selectedOption.removeAttr("selected");
            partitionDropDown.find("option[ismatch='true']:eq(0)").attr("selected", "selected");
        }
    })
    partitionFilterInput.val(localStorage.getItem("tamperMonkey-PartitionFilter") || "").trigger("keyup");
}

/**************************************************************************
 * iRule improvements
 **************************************************************************/
function improveiRuleProperties(){
    // Show the data group lists used in an iRule
    cacheDataGroupLists(function(dataGroupLists){
        //This part prepares the iRule definition table for the data group lists (adds a third column)
        $("table#general_table thead tr.tablehead td").attr("colspan", 3);
        $("table#general_table tr").not("#definition_ace_row").each(function(){
            $(this).find("td").eq(1).attr("colspan", 2);
        });
        $("tr#definition_ace_row").append("<td id=\"dglist\" class=\"settings\"></td>").css({
            "vertical-align": "top"
        });
        $("tr#definition_ace_row td.settings").css("width","80%");
        //This command generates the data group lists (if any)
        getDataGroupListsFromRule($("textarea#rule_definition").val());
        //getDataGroupListsFromRuleOld($("textarea#rule_definition").val());
        //Update the list on every key stroke
        $(document).on("keyup", function(){
            let iRuleContent = codeEditor.gSettings.editor.container.env.document.doc.$lines.join("\n");
            getDataGroupListsFromRule(iRuleContent);
            //getDataGroupListsFromRuleOld($("textarea#rule_definition").val());
        });
    });
}

// Caches a list of all the data group lists available in Common and the current partition (if any)
function cacheDataGroupLists(updateDGPage){
    let DataGroupListLink = "https://" + window.location.host + "/tmui/Control/jspmap/tmui/locallb/datagroup/list.jsp";
    // We want to get all data group lists in case there is a direct reference
    let currentPartition = getCookie("F5_CURRENT_PARTITION");
    replaceCookie("F5_CURRENT_PARTITION", "\"[All]\"");
    //Request the iRule page to see if the instance exists or not
    $.ajax({
        url: DataGroupListLink,
        type: "GET",
        success: function(response) {
            let dataGroupListLinks = $(response).find('table.list tbody#list_body tr td:nth-child(3) a');
            for(let i = 0; i < dataGroupListLinks.length; i++){
                let link = dataGroupListLinks[i].href;
                let name = link.split("name=")[1];
                tamperDataGroupLists.push(name);
            }
            replaceCookie("F5_CURRENT_PARTITION", currentPartition);
            updateDGPage();
        }
    });
}

//Parses data group list html to get the key/value pairs for the hover information
function parseDataGroupValues(dg, showBalloon){
    let dgLink = 'https://' + window.location.host + '/tmui/Control/jspmap/tmui/locallb/datagroup/properties.jsp?name=' + dg;
    let html;
    $.ajax({
        url: dgLink,
        type: "GET",
        success: function(htmlresponse) {
            let matches = htmlresponse.match(/<option value="[^"]+(\\x0a)?.+?" >/g);
            //Set the header
            html = '<span style="color:blue">Key</span> = <span style="color:red">Value</span>'
            if(matches){
                for(let i=0; i < matches.length; i++){
                    let match = matches[i].replace('<option value="', '').replace('" >', '')
                    let matcharr = match.split('\\x0a')
                    if(matcharr.length == 2){
                        html += '<br><span style="color:blue">' + matcharr[0] + '</span> = <span style="color:red">' + matcharr[1] + '</span>';
                    } else {
                        html += '<br><span style="color:blue">' + matcharr[0] + '</span> = <span style="color:red">""</span>';
                    }
                }
            } else {
                html += "<br><span style=\"color:blue\">Empty data group list</span>";
            }
            //Show the balloon using the callback function
            showBalloon(html);
        },
        async: false
    });
    return html;
}

function getDataGroupListsFromRule(str){
    "use strict"
    let lines = str.split("\n");
    let partitionPrefix = "/" + getCookie("F5_CURRENT_PARTITION") + "/";
    let foundDataGroupLists = {};
    let updateDGObject = function(dg){
        let partition = dg.split("/")[1];
        let name = dg.split("/")[2];
        if(!(partition in foundDataGroupLists)){
            foundDataGroupLists[partition] = new Array();
        }
        foundDataGroupLists[partition].push(name);
    };
    for(let i = 0; i < lines.length; i++){
        // Skip lines that start with a comment
        if((lines[i].match(/^\s*#/))){
            continue;
        }
        if(lines[i].indexOf("class ") > -1){
            let words = lines[i].split(/[\s\[\]]/);
            let classIndex = words.indexOf("class");
            words.map(function(word, index){
                if(index < classIndex){
                    return;
                }
                if(word !== ""){
                    if(tamperDataGroupLists.indexOf(word) > -1){
                        updateDGObject(word);
                    } else if(tamperDataGroupLists.indexOf(partitionPrefix + word) > -1){
                        updateDGObject(partitionPrefix + word);
                    } else if(tamperDataGroupLists.indexOf("/Common/" + word) > -1){
                        updateDGObject("/Common/" + word);
                    }
                }
            });
        }
    }
    let html = "<div id=\"dglabel\"><span style=\"font-weight:bold\">Detected Data group lists:</span><hr>";
    if (Object.keys(foundDataGroupLists).length === 0 && foundDataGroupLists.constructor === Object){
        html += "None";
    } else {
        for(let partition in foundDataGroupLists){
            let list = foundDataGroupLists[partition];
            html += `
                <div style="padding-bottom:5px;">
                    <span style="font-weight:bold;">/` + partition + `:</span>`;
            for(let i = 0; i < list.length; i++){
                let fullPath = "/" + partition + "/" + list[i];
                html += `
                    <br>
                    <a href="https://` + window.location.host + `/tmui/Control/jspmap/tmui/locallb/datagroup/properties.jsp?name=` + fullPath + `" data-name="` + fullPath + `">` + list[i] + `</a>`;
            }
            html += `
                <br>
                </div>`
        }
    }
    html += "</div>";
    $("td#dglist").html(html);
    $("td#dglist a").each(function(){
        let name = this.getAttribute("data-name");
        $(this).on("mouseover", function(){
            if(this.data === undefined){
                this.data = parseDataGroupValues(name, (html) => $(this).showBalloon({
                        position: "left",
                        css: {
                            whitespace: "nowrap"
                        },
                        showDuration: 0,
                        hideDuration: 0,
                        contents: html
                }));
            } else {
                $(this).showBalloon({
                        position: "left",
                        css: {
                            whitespace: "nowrap"
                        },
                        showDuration: 0,
                        hideDuration: 0,
                        contents: this.data
                });
            }
        });
        $(this).on("mouseleave", function(){
            $(this).hideBalloon();
        });
    })
}

/**************************************************************************
 * Data group list improvements
 **************************************************************************/
function improveDataGroupListEditing(){
    let css = `select.xxlarge { resize: both; }`;
    addGlobalStyle(css);
    //Increase the size of the lists
    $("select").not("#datagroup_type_select").attr("size", DatagroupListCount);
    //Add extra cell and buttons for bulk import
    $("table#records thead tr.tablehead td").after(`<td>
                                                        <div class="title">Bulk import text</div>
                                                    </td>
                                                    `);
    $("table#records tbody tr td.settings").after(`<td class="settings" id="dgbulkimport">
                                                    <textarea cols="60" rows="` + (DatagroupListCount + 8) + `" class="bulkcontent"/>
                                                    <br>
                                                    <input type="button" value="Merge lists" id="bulkMerge"/>
                                                    <input type="button" value="Replace list" id="bulkReplace"/>
                                                    <input type="button" value="Edit all" id="bulkEdit"/>
                                                    <input type="button" value="Edit selected" id="bulkSelected"/>
                                                    <input type="button" value="Help" id="bulkHelp" onClick="window.open('https://loadbalancing.se/webui-tweaks-manual/#Data_group_list_editing','_blank')"/>
                                                    </td>
                                                    `
                                            )
    //Attach the functions to the buttons
    $("input#bulkMerge").on("click", function(){
        "use strict";
        //First get the data
        let importListArr = $("textarea.bulkcontent:visible").val().split("\n");
        let currentListArr = [];
        $("select:visible").last().find("option").each(function(){
            currentListArr.push($(this).text().trim())
        })
        //Create objects from the arrays
        let importObj = createDGListObject(importListArr);
        let currentObj = createDGListObject(currentListArr);
        let selectList = "";
        for(let key in importObj){
            let value = importObj[key];
            let optionValue = value === "" ? key : (key + "\\x0a" + value);
            let optionText = value === "" ? key : (key + " := " + value);
            if(!(key in currentObj)){
                selectList += "<option value=\"" + optionValue + "\" selected>"
                    + optionText + "</option>";
            }
        }
        $("select:visible").last().append(selectList);
        $("input#bulkReplace").prop("disabled", false);
        $("input#bulkEdit").prop("disabled", false);
        $("input#update").prop("disabled", false);
    })
    $("input#bulkReplace").on("click", function(){
        "use strict";
        //First get the data
        let importListArr = $("textarea.bulkcontent:visible").val().split("\n");
        //Create an object from the array
        let importObj = createDGListObject(importListArr);
        //Remove current options
        $("select:visible").last().find("option").remove();
        let selectList = "";
        for(let key in importObj){
            let value = importObj[key];
            let optionValue = value === "" ? key : (key + "\\x0a" + value);
            let optionText = value === "" ? key : (key + " := " + value);
            selectList += "<option value=\"" + optionValue + "\" selected>" + optionText + "</option>";
        }
        $("select:visible").last().append(selectList);
        $("input#bulkEdit").prop("disabled", false);
        $("input#update").prop("disabled", false);
    })
    $("input#bulkEdit").on("click", function(){
        let keyVals = []
        $("select:visible").last().find("option").each(function(){
            keyVals.push($(this).text().trim())
            $(this).remove();
        })
        $("input#bulkEdit").prop("disabled", true);
        $("input#update").prop("disabled", true);
        $("textarea.bulkcontent:visible").val(keyVals.join("\n"));
    })
    $("input#bulkSelected").on("click", function(){
        let keyVals = []
        $("select:visible").last().find("option:selected").each(function(){
            keyVals.push($(this).text().trim())
            $(this).remove();
        })
        $("input#bulkReplace").prop("disabled", true);
        $("input#bulkEdit").prop("disabled", true);
        $("input#update").prop("disabled", true);
        $("textarea.bulkcontent:visible").val(keyVals.join("\n"));
    })
}

function improveDataGroupListProperties(){
    $("input[name=string_input], input[name=string_pair_value], input#string_add_button").on("keyup change input focus click", function(){
        let key = $("input[name=string_input]").val();
        let value = $("input[name=string_pair_value]").val();
        let currentList = [];
        $('select#class_string_item option').each(function(){
            currentList.push($(this).val());
        })
        if(key.length){
            let listItem = "";
            if(value === ""){
                listItem = key;
            } else {
                listItem = key + "\\x0a" + value;
            }
            if(currentList.indexOf(listItem) === -1){
                $("input#update").prop("disabled", true);
            } else {
                $("input#update").prop("disabled", false);
            }
        } else if(currentList.length && currentList.length === 0){
            $("input#update").prop("disabled", true);
        } else {
            $("input#update").prop("disabled", false);
        }
    })
    $("input#edit_string").on("click", function(){
        $("input#update").prop("disabled", true);
    })
}

function createDGListObject(lines){
    let bulkImportObj = {}
    //Creating object and ignoring duplicates
    lines.map(function(line){
        // break on first := if present
        let lineArr = line.split(/\s*:=\s*(.*)/i)
        let key = lineArr[0];
        let value = lineArr[1] || "";
        if(!(key in bulkImportObj)){
            bulkImportObj[key] = value;
        }
    });
    return bulkImportObj
}

/**************************************************************************
 * Virtual server improvements
 **************************************************************************/
function improveVirtualServerProperties(){
    let css = `select.large { resize: both; }`;
    addGlobalStyle(css);
    //  SSL Profile (client)
    addDoubleClick("selectedclientsslprofiles", "availableclientsslprofiles_button");
    addDoubleClick("availableclientsslprofiles", "selectedclientsslprofiles_button");
    //  SSL Profile (server)
    addDoubleClick("selectedserversslprofiles", "availableserversslprofiles_button");
    addDoubleClick("availableserversslprofiles", "selectedserversslprofiles_button");
    //  VLANs and Tunnels
    addDoubleClick("selected_vlans", "available_vlans_button");
    addDoubleClick("available_vlans", "selected_vlans_button");
}

function improveiRuleSelection(){
    // Add double click feature
    addDoubleClick("rule_references", "assigned_rules_button");
    addDoubleClick("assigned_rules", "rule_references_button");
}

function improveVirtualServerResources(){
    let selecteddefaultpool = $('input[name=default_pool_before]').val();
    if(selecteddefaultpool != 'NO_SELECTION'){
        $('input[name=default_pool_before]').after('<a href="https://' + window.location.host + '/tmui/Control/jspmap/tmui/locallb/pool/properties.jsp?name=' + selecteddefaultpool + '"><input type="button" value="Show default pool"/></a>')
    }
}

/**************************************************************************
 * Pool improvements
 **************************************************************************/
function improvePoolList(){
    addGlobalStyle('div.tamperpoolstatus{position:relative;}div.tamperpoolstatus table.list{position:relative;width:100%;border:1px solid #999 }div.tamperpoolstatus table.list tbody tr.color0{background:#deddd9}div.tamperpoolstatus table.list tbody tr.color0 td{border-bottom:1px solid #c4c2be}div.tamperpoolstatus table.list tbody tr.inner td,div.tamperpoolstatus table.list tbody tr.innerbold td{padding:3px 5px;border-bottom:none;white-space:nowrap}div.tamperpoolstatus table.list tbody tr.color1{background:#fff}div.tamperpoolstatus table.list tbody tr.color2{background:#f7f6f5}div.tamperpoolstatus table.list tbody tr.innerbold td{font-weight:700}div.tamperpoolstatus table.list tbody td{vertical-align:top;padding:6px 5px 4px;border-bottom:1px solid #ddd;white-space:nowrap}div.tamperpoolstatus table.list tbody td input{margin-top:0}div.tamperpoolstatus table.list tbody td img{padding-top:1px}div.tamperpoolstatus table.list div.customtooltip div,div.tamperpoolstatus table.list div.filter div{padding:3px 5px}div.tamperpoolstatus table.list tbody td.first{border-left:1px solid #999}div.tamperpoolstatus table.list tbody td.last{border-right:1px solid #999}div.tamperpoolstatus table.list tbody td.column1,div.tamperpoolstatus table.list tbody td.column2{border-left:1px solid #ddd}div.tamperpoolstatus table.list div.customtooltip,div.tamperpoolstatus table.list div.filter{position:absolute;z-index:1;margin-top:2px;border:1px solid #666;background:#deddd9}div.tamperpoolstatus table.list div.customtooltip div a.close{color:red;font-weight:700}div.tamperpoolstatus table.list div.filter div.current{margin:1px;padding:3px;border:1px solid #999;background:#eee}div.tamperpoolstatus table.list tbody tr.expanded td,div.tamperpoolstatus table.list tbody tr.notlast td{border-bottom:none!important}div.tamperpoolstatus table.list .expired{padding-left:17px;background:url(../images/status_certificate_expired.gif) left center no-repeat}div.tamperpoolstatus table.list .warning{padding-left:17px;background:url(../images/status_certificate_warning.gif) left center no-repeat}div.tamperpoolstatus table.list tbody tr.collapsible-parent td a{vertical-align:top}div.tamperpoolstatus table.list thead tr td div.collapsible-toggle.expanded{background:url(/xui/common/images/icon_toggle_all_minus.gif) no-repeat;width:15px;height:15px;display:inline-block;cursor:pointer;zoom:1}div.tamperpoolstatus table.list tbody tr.expanded td div.collapsible-toggle{background:url(/xui/common/images/icon_toggle_minus.gif) no-repeat;width:12px;height:12px;margin:0 auto;zoom:1}div.tamperpoolstatus table.list thead tr td div.collapsible-toggle.collapsed{background:url(/xui/common/images/icon_toggle_all_plus.gif) no-repeat;width:15px;height:15px;display:inline-block;cursor:pointer;zoom:1}div.tamperpoolstatus table.list tbody tr.collapsed td div.collapsible-toggle{background:url(/xui/common/images/icon_toggle_plus.gif) no-repeat;width:12px;height:12px;margin:0 auto;zoom:1}div.tamperpoolstatus table.list tbody tr.set-whitespace-normal td{white-space:normal}div.tamperpoolstatus table.list tbody.group_move_placeholder{display:table-row}div.tamperpoolstatus table.list tbody tr.handle td.first{width:15px;background:url(/tmui/tmui/skins/Default/images/icon_gripper.png) 50% no-repeat!important;cursor:url(/xui/common/images/openhand.cur),default}div.tamperpoolstatus thead tr.columnhead td div.reorder{width:16px;height:16px;background:url(/xui/common/images/cursor-openhand.png) center no-repeat}div.tamperpoolstatus table.list .highlight{background:#dbefff!important;cursor:url(/xui/common/images/openhand.cur),default}div.tamperpoolstatus table.list .highlight a{cursor:url(/xui/common/images/openhand.cur),default}div.tamperpoolstatus div.section{margin:10px 0}div.tamperpoolstatus thead tr.tablehead td{border-bottom:1px solid #999;vertical-align:bottom}div.tamperpoolstatus thead tr.tablehead div{padding-bottom:3px;white-space:nowrap}div.tamperpoolstatus thead tr.tablehead div.title{float:left;margin-top:.5em;color:#000;font-weight:700}div.tamperpoolstatus thead tr.tablehead div.advancedtoggle{float:left;margin:0 0 0 5px;color:#000}div.tamperpoolstatus thead tr.tablehead div.search{float:left}div.tamperpoolstatus thead tr.tablehead div.searchnofloat{clear:both;float:left}div.tamperpoolstatus thead tr.tablehead div.search input.search,div.tamperpoolstatus thead tr.tablehead div.searchnofloat input.search{width:240px}div.tamperpoolstatus thead tr.tablehead div.buttons{float:right}div.buttons input[type=button],div.tamperpoolstatus thead tr.tablehead div.buttons input[type=button],div.tamperpoolstatus thead tr.tablehead div.buttons input[type=submit]{padding:0 5px}div.tamperpoolstatus thead tr.tablehead div.buttons input.checkall{margin-right:9px}div.tamperpoolstatus thead tr.tablehead div.grouptitle{margin:0 3px 0 2px;padding:1px 10px;border:1px solid #999;border-bottom:none;background:#deddd9;text-align:center;font-weight:700}div.tamperpoolstatus thead tr.columnhead td{padding:5px;border-bottom:1px solid #999;border-top:1px solid #999;border-left:1px solid #999;background:url(../images/background_list_head.gif) #deddd9;white-space:nowrap}div.tamperpoolstatus thead tr.columnhead td.last{border-right:1px solid #999}div.tamperpoolstatus thead tr.columnhead td a{display:block;width:expression("1%");padding-top:1px;margin-top:-1px;color:#000}div.tamperpoolstatus thead tr.columnhead td a.filteroff{margin-top:0;padding-left:20px;background:url(../images/button_filter_off.gif) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td a.filteron{margin-top:0;padding-left:20px;background:url(../images/button_filter_on.gif) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td a.selectall{margin-top:0;width:15px;background:url(../images/button_select_all.gif) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td a.selectall:hover{text-decoration:none}div.tamperpoolstatus thead tr.columnhead td a.sortoff{margin-top:0;padding-left:12px;background:url(../images/button_sort_off.gif) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td a.sorton{margin-top:0;padding-left:12px;background:url(../images/button_sort_on.gif) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td a.sortup{margin-top:0;padding-left:12px;background:url(../images/button_sort_up.gif) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td a.sortdown{margin-top:0;padding-left:12px;background:url(../images/button_sort_down.gif) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td .greenflag,div.tamperpoolstatus thead tr.columnhead td .redflag,div.tamperpoolstatus thead tr.columnhead td .yellowflag{display:block;width:expression("1%");padding-top:1px;padding-left:20px}div.tamperpoolstatus thead tr.columnhead td .greenflag{background:url(../images/status_flag_green.gif) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td .yellowflag{background:url(../images/status_flag_yellow.gif) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td .redflag{background:url(../images/status_flag_red.gif) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td .activedevice,div.tamperpoolstatus thead tr.columnhead td .failsafefaultdevice,div.tamperpoolstatus thead tr.columnhead td .impaireddevice,div.tamperpoolstatus thead tr.columnhead td .maintenancedevice,div.tamperpoolstatus thead tr.columnhead td .offlinedevice,div.tamperpoolstatus thead tr.columnhead td .replacementdevice,div.tamperpoolstatus thead tr.columnhead td .standbydevice,div.tamperpoolstatus thead tr.columnhead td .unknowndevice,div.tamperpoolstatus thead tr.columnhead td .unreachabledevice{display:block;width:expression("1%");padding:2px 0 2px 27px}div.tamperpoolstatus thead tr.columnhead td .activedevice{background:url(../images/status_filter_device_active.png) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td .standbydevice{background:url(../images/status_filter_device_standby.png) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td .failsafefaultdevice{background:url(../images/status_filter_device_failsafe_fault.png) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td .offlinedevice{background:url(../images/status_filter_device_offline.png) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td .forcedofflinedevice{display:block;width:expression("1%");padding:2px 0 2px 27px;background:url(../images/status_filter_device_forcedoffline.png) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td .unknowndevice{background:url(../images/status_filter_device_present_unknown.png) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td .impaireddevice{background:url(../images/status_filter_device_impaired.gif) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td .maintenancedevice{background:url(../images/status_filter_device_maint.gif) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td .replacementdevice{background:url(../images/status_filter_device_replacement.gif) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td .unreachabledevice{background:url(../images/status_filter_device_unreachable.gif) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td .available,div.tamperpoolstatus thead tr.columnhead td .offline,div.tamperpoolstatus thead tr.columnhead td .unavailable,div.tamperpoolstatus thead tr.columnhead td .unknown{display:block;width:expression("1%");padding-top:1px;padding-left:20px}div.tamperpoolstatus thead tr.columnhead td .available{background:url(../images/status_circle_green.png) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td .unavailable{background:url(../images/status_triangle_yellow.png) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td .offline{background:url(../images/status_diamond_red.png) left center no-repeat}div.tamperpoolstatus thead tr.columnhead td .unknown{background:url(../images/status_square_blue.png) left center no-repeat}div.tamperpoolstatus table.head td.wizardtext{padding-top:10px}div.tamperpoolstatus table.tablefoot{width:100%}div.tamperpoolstatus table.tablefoot td{vertical-align:top}div.tamperpoolstatus table.tablefoot div{padding:3px 0 20px}div.tamperpoolstatus table.tablefoot div.buttons{float:left}div.tamperpoolstatus table.tablefoot div.buttons input[type=button],div.tamperpoolstatus table.tablefoot div.buttons input[type=submit]{padding:0 5px}div.tamperpoolstatus table.tablefoot div.pagecontrols{float:right}');
    let poolStatuses = {}
    let oldMessage = $(parent.top.document).find("div#message div#messagetype div#messagetext").text();
    // Check when the loading screen for pools has disappears and then show a member statuses.
    let statusInterval = setInterval(function(){
        if(!$(parent.top.document).find("div#message").is(":visible")){
            $(parent.top.document).find("div#message div#messagetype div#messagetext").text("Loading member statuses...");
            $(parent.top.document).find("div#message").show();
            clearInterval(statusInterval);
        }
    } , 100);
    $.ajax({
        url: "https://" + window.location.host + "/tmui/Control/jspmap/tmui/locallb/pool/stats.jsp?SearchString=*&",
        type: "GET",
        success: function(response) {
            $(response).find("tbody#list_body tr")
            .filter(function() {
                return this.id.match(/\/.+\//);
            })
            .each(function(){
                let poolName = this.id.replace(/_member_row_[0-9]+$/i, "");
                if(!(poolName in poolStatuses)){
                    poolStatuses[poolName] = {};
                }
                let memberName = $(this).find("td").eq(3).text().trim();
                let statusIcon = $(this).find("td").eq(1).find("img").attr("src");
                let title = $(this).find("td").eq(1).find("img").attr("title");
                poolStatuses[poolName][memberName] = { "icon": statusIcon, "title": title };
            });
            $("tbody#list_body tr").each(function(){
                let poolName = $(this).find("td").eq(2).find("a").attr("href").replace(/.+name=/i, "");
                let existingIcons = [];
                if(poolName in poolStatuses){
                    let memberStatuses = poolStatuses[poolName];
                    for(let memberStatus in memberStatuses){
                        if(existingIcons.indexOf(memberStatuses[memberStatus].icon) === -1){
                            existingIcons.push(memberStatuses[memberStatus].icon);
                        }
                    }
                    if(existingIcons.length > 1){
                        let html = "<div data-poolname=\"" + poolName + "\" class=\"tamperpoolstatus\" style=\"margin-left:21px;margin-bottom:15px;\">";
                        for(let i = 0; i < existingIcons.length; i++){
                            let iconURL = existingIcons[i].replace(/\/.*_/i, "/tmui/tmui/skins/Default/images/status_circle_");
                            switch (i){
                                case 0:
                                    html += "<div style=\"z-index:1;position:absolute;max-width:6.7px;overflow:hidden;\"><img src=\"" + iconURL + "\"/></div>"
                                    break;
                                case 1:
                                    html += "<div style=\"z-index:1;position:absolute;left:6.7px;max-width:6.5px;overflow:hidden;direction:rtl;\"><img src=\"" + iconURL + "\"/></div>"
                                    break;
                                case 2:
                                    html += "<div style=\"z-index:2;position:absolute;max-height:7.5px;left:0.2px;overflow:hidden;\"><img src=\"" + iconURL + "\"/></div>"
                                    break;
                                case 3:
                                    html += "<div style=\"z-index:4;position:absolute;max-width:6.5px;max-height:7.5px;overflow:hidden;\"><img src=\"/tmui/tmui/skins/Default/images/status_circle_blue.png\"/></div>"
                                    break;
                            }
                        }
                        html += "</div>";
                        $(this).find("td").eq(1).html(html);
                    } else {
                        let html = "<div data-poolname=\"" + poolName + "\" style=\"position:relative;padding-top:1px\"><img src=\"" + existingIcons + "\"/></div>"
                        $(this).find("td").eq(1).html(html);
                    }
                    $(this).find("td").eq(1).find("div").on("mouseover", function(){
                        poolName = $(this).attr("data-poolname");
                        if(poolName in poolStatuses){
                            let table = "<div class=\"tamperpoolstatus\"><table class=\"list\" style=\"opacity:1\"><thead id=\"list_header\"><tr class=\"columnhead\"><td></td><td>Member</td><td>Status</td></tr></thead><tbody>";
                            memberStatuses = poolStatuses[poolName];
                            let i = 0;
                            for(let member in memberStatuses){
                                table += "<tr class=\"color" + ((i%2)+1) + "\"><td align=\"center\"><img src=\"" + memberStatuses[member].icon + "\"/></td><td>" + member + "</td><td>" + memberStatuses[member].title + "</td></tr>";
                                i++;
                            }
                            table += "</tbody></table></div>";
                            $(this).balloon({ position: "right", css: { whitespace: "nowrap", boxShadow: null, opacity: "1", padding: "0px", border: "0px", background: "rgba(0, 0, 255,1)" }, minLifetime: 0, tipSize:0, showDuration: 0, hideDuration: 0, contents: table });
                        }
                    });
                    //For some reason I need to trigger this at least one ahead of time in order to get the popup to show on the first attempt
                    $(this).find("td").eq(1).find("div").trigger("mouseover");
                    $(this).find("td").eq(1).find("div").trigger("mouseout");
                }
            })
            $(parent.top.document).find("div#message").fadeOut(function(){
                $(parent.top.document).find("div#message div#messagetype div#messagetext").text(oldMessage);
            });
        }
    })
}

function improvePoolProperties(){
    // Increase the select box sizes
    $("#monitor_rule").attr("size", MonitorCount);
    $("#available_monitor_select").attr("size", MonitorCount);
    // Add double click feature
    addDoubleClick("monitor_rule", "available_monitor_select_button");
    addDoubleClick("available_monitor_select", "monitor_rule_button");
}

function improvePoolCreation(){
    // Increase the select box sizes
    $("#monitor_rule").attr("size", MonitorCount);
    $("#available_monitor_select").attr("size", MonitorCount);
    // Add double click feature
    addDoubleClick("monitor_rule", "available_monitor_select_button");
    addDoubleClick("available_monitor_select", "monitor_rule_button");
    // Set the default pool name suffix
    $("#pool_name").find("input[name=name]").attr("value", DefaultPoolName);
    // Set the default action on pool down value
    $("#action_on_service_down").find("option[value=\"" + DefaultActionOnPoolDown + "\"]").attr("SELECTED", "");
    // Set the default LB Method
    $("#lb_mode").find("option[value=\"" + DefaultLBMethod + "\"]").attr("SELECTED", "");
    // If configured, choose node as default when selecting pool members
    if(ChooseNodeAsDefault){
        if(majorVersion === "11"){
            $("#member_address_radio_address").attr("unchecked","");
            $("#member_address_radio_node").attr("checked","");
            $("#member_address_radio_node").click();
        } else if(["11", "12", "13", "14", "15"].indexOf(majorVersion) != -1){
            $("tr#member_address_selection td input").eq(0).attr("unchecked", "");
            $("tr#member_address_selection td input").eq(4).attr("checked", "");
            $("tr#member_address_selection td input").eq(4).click();
        }
    }
}

function addHTTPMonitorSuffix(){
    if($("select[name=mon_type]").find(":selected").text().trim() == "HTTP"){
        let monitorname = $("input[name=monitor_name]").attr("value");
        if($("input[name=monitor_name]").length && monitorname == "") {
            $("input[name=monitor_name]").attr("value", HttpMonitorSuffix);
        } else if ($("input[name=monitor_name]").length && !(endsWith(monitorname, HttpMonitorSuffix))) {
            monitorname = monitorname + HttpMonitorSuffix;
            $("input[name=monitor_name]").attr("value", monitorname);
        }
    }
}

// Adds monitor test strings to the pool member details
function improvePoolMemberProperties(){
    if($("#member_address td").next().length && $("#member_port td").next().length){
        // Add double click feature
        addDoubleClick("monitor_rule", "available_monitor_select_button");
        addDoubleClick("available_monitor_select", "monitor_rule_button");
        //Add global style
        let css = `a.monitortest {  position: relative;  display: inline;  color:#000000;}
                a.monitortest p {  position: absolute;  color: #000;  top:-50px;  left:-55px;
                background: #f7f6f5;  border: 1px solid #000;  padding-left:5px;  padding-right:5px;
                padding-top:2px;  padding-bottom:0px;  height: 30px;  text-align: center;
                visibility: hidden;  border-radius: 2px;  font-size:12px;  font-weight:bold; }
                a:hover.monitortest p {  visibility: visible;  bottom: 30px;  z-index: 999; }
                .monitorcopybox { width:140px;font-weight:normal;font-size:10px;margin-bottom:1px;}
                button.monitortestbutton { font-size:12px; }`;
        addGlobalStyle(css);
        let ip = $("#member_address td.settings").text().trim();
        let port = $("#member_port td.settings").text().trim();
        $('#general_table tbody tr td.settings').not('tr#member_health_monitors_status').each(function(){
            $(this).attr("colspan", 2);
        });
        $('#health_monitor_table tbody tr').not(".monitorheaderrow").each(function(key,value){
            let monitorurl = $(value).find('td a').attr("href");
            $.ajax({
                url: "https://" + window.location.host + monitorurl,
                type: "GET",
                ip: ip,
                port: port,
                success: function(response) {
                    "use strict";
                    let type = "";
                    let sendstring;
                    if($(response).find("#monitor_send_string").length){
                        sendstring = $(response).find("#monitor_send_string").text().trim();
                        type = $(response).find("#div_general_table tbody tr td:contains('Type')").next().text().trim();
                    } else if ($(response).find("#div_configuration_table table tbody tr td:contains('Send String')")) {
                        // Default monitors does not have the same page structure as the normal ones. Needs special treatment.
                        sendstring = $(response).find("#div_configuration_table table tbody tr").find("td:contains('Send String')").next().text().trim();
                        type = $(response).find("#general_table tbody tr").find("td:contains('Type')").next().text().trim();
                    }
                    if(type == "HTTP" || type == "HTTPS"){
                        let commands = getMonitorRequestParameters(sendstring, type, ip, port);
                        let html = "";
                        for(let c in commands.commands){
                            html += `<a href="javascript:void(0);" class="monitortest">
                                        <input type="button" class="monitortestbutton" value="` + c + `"/>
                                        <p>` + commands.commands[c].title + `(CRTL+C)
                                        <br>
                                        <input id="` + c.toLowerCase() + `link" class="monitorcopybox" type="text" value='` + commands.commands[c].string + `'>
                                        </p>
                                    </a>`;
                        }
                        $(value).append("<td valign=\"middle\">" + html + " </td>");
                    } else {
                        $(value).append("<td valign=\"middle\" class=\"monitortests\">N/A</td>");
                    }
                },
                async: false
            });
        });
        //Attach an onmouseover function which focuses and selects the text
        if($('.monitortest').length){
            $('.monitortest').mouseover(function(){
                $(this).find("p input").focus();
                $(this).find("p input").select();
                let inputstring = $(this).find('p input').attr('value');
                $(this).attr("href", "javascript:prompt('The command','" + inputstring.replace(/\'/g,"\\'") + "')");
            });
        }
        //Remove the parent padding first
        $('#health_monitor_table').parent().css('padding','0px');
        //Add a row with headers
        $('#health_monitor_table tbody tr:first').before('<tr class="monitorheaderrow"><td class="monitorheadercell">Monitors</td><td class="monitorheadercell">Monitor tests</td></tr>');
        //Make the headers bold
        $('#health_monitor_table tbody tr.monitorheaderrow td').css({
            'font-weight' : 'bold',
            'border-right' : '1px solid #dddddd'
        });
        //Add padding
        $('#health_monitor_table tr td').css({
            'padding' : '5px'
        });
        $('#health_monitor_table tr td').not('.monitorheadercell').css({
            'border-right' : '1px solid #dddddd',
            'border-top' : '1px solid #dddddd',
        });
        $('#health_monitor_table tr td.monitortests').css('text-align','center');
    }
}

function getMonitorRequestParameters(sendstring, type, ip, port){
    "use strict";
    let headers = [];
    let protocol = "";
    let commandObj = {
        "commands": {
            "HTTP": {
                "title": "",
                "command": ""
            },
            "Curl": {
                "title": "",
                "command": ""
            },
            "Netcat": {
                "title": "",
                "command": ""
            }
        },
        "success": true
    }
    let sendstringarr = sendstring.split(" ");
    let verb = sendstringarr[0];
    let uri = sendstringarr[1].replace("\\r\\n", "");
    if (/^HTTP[S]?$/.test(type)){
        protocol = type.toLowerCase();
    }
    //So far we only support HTTP GET request
    if( verb === "GET" || verb === "HEAD"){
        //Parse for headers
        let headersarr = sendstring.split('\\r\\n');
        let i;
        if(headersarr.length > 2){
            for(i in headersarr){
                let header = headersarr[i];
                if(header.indexOf(":") >= 0){
                    if(header.split(":").length == 2){
                        headers.push(header);
                    }
                }
            }
        }
        let commandstring = 'curl -vvv';
        if (verb === "HEAD"){
            commandstring += " -I"
        }
        if(headers.length > 0){
            for(i in headers){
               let headerarr = headers[i].split(":");
               let headername = headerarr[0].trim();
               let headervalue = headerarr[1].trim();
               headervalue = headervalue.replace(/\"/g,'\\&quot;');
               commandstring += ' --header &quot;' + headername + ':' + headervalue + '&quot;';
            }
        }
        commandstring += ' ' + protocol + '://' + ip + ':' + port + uri
        commandObj.commands.Curl.title = "Curl Command";
        commandObj.commands.Curl.string = commandstring;
        commandObj.commands.Netcat.title = "Netcat Command";
        commandObj.commands.Netcat.string = "echo -ne \"" + sendstring + "\" | nc " + ip + " " + port;
        commandObj.commands.HTTP.title = "HTTP Link";
        commandObj.commands.HTTP.string = protocol + '://' + ip + ':' + port + uri;
    } else {
        commandObj.success = false;
    }
    return commandObj;
}

/**************************************************************************
 * Client SSL Profile Improvements
 **************************************************************************/
function improveClientSSLProfileCreation(){
    if(defaultClientSSLParentProfile !== ""){
        setTimeout(function(){
            $('select#parent_profile_name').val(defaultClientSSLParentProfile);
            $('select#parent_profile_name').trigger("change");
        }, 1000);
    }
    $("input[name='certificate_name']").on("keyup", function(){
        $("input[name='common_name']").val($(this).val().replace(/^star\./g, "*."));
    });
    setTimeout(function(){
        $("select[name='issuer']").val("Certificate Authority");
        $("select[name='issuer']").trigger("change");
    }, 500);
}

function improveCertKeyChainSelection(){
    $('input[name="cert_key_chain_override"]').on("click", matchCertAndKey);
    $('input[name="add_modal_button"]').on("mouseup", function(){
        setTimeout(function(){
            let currentPartition = getCookie("F5_CURRENT_PARTITION");
            let profileName = $("input[name='profile_name']").val();
            if($("select#cert option[value='/" + currentPartition + "/" + profileName + ".crt']").length > 0){
                $('select#cert').val("/" + currentPartition + "/" + profileName + ".crt");
                $('select#key').val("/" + currentPartition + "/" + profileName + ".key");
            } else if ($("select#cert option[value='/Common/" + profileName + ".crt']").length > 0){
                $('select#cert').val("/Common/" + profileName + ".crt");
                $('select#key').val("/Common/" + profileName + ".key");
            }
            $('select#chain').val(defaultChain)
        }, 500);
    });
}

function matchCertAndKey(){
    $('select#chain').val(defaultChain)
    $('select#cert').on("change", function(){
        let certName = $(this).val();
        let probableKeyName = certName.replace(/\.crt$/, ".key");
        $('select#key').val(probableKeyName);
        if(defaultChain !== ""){
            $('select#chain').val(defaultChain)
        }
    });
}

/**************************************************************************
 * SSL certificate creation improvements
 **************************************************************************/
function addCSRDropDownMenu(){
    //A certificate is being created and the default certificate signing setting has been enabled
    let csrdropdown = '<select id="csrdropdownmenu">';
    for(let option in csroptions){
        csrdropdown += '<option value="' + option + '">' + csroptions[option].OptionName + '</option>';
    }
    $('#configuration_table tbody').append('<tr><td class="label required">Certificate type</td><td class="settings">' + csrdropdown + '</td></tr>')
    $('#configuration_table tbody tr td #csrdropdownmenu').change(function() {
        //Change to Certificate authority
        $('#certificate_table tbody tr td select[name=issuer]').val("Certificate Authority");
        //Reflect the changes to the form using the in build function
        $('#certificate_table tbody tr td select[name=issuer]').trigger("onchange");
        //Get the options for the currently selected certificate and populate the table
        let selectedcsroption = csroptions[this.value];
        //Populate the common name
        $('#certificate_table tbody tr td input[name=common_name]').val(selectedcsroption.CommonName)
        $('#certificate_table tbody tr td input[name=division]').val(selectedcsroption.Division)
        $('#certificate_table tbody tr td input[name=organization]').val(selectedcsroption.Organization)
        $('#certificate_table tbody tr td input[name=locality]').val(selectedcsroption.Locality)
        $('#certificate_table tbody tr td input[name=state_or_province]').val(selectedcsroption.StateProvince)
        $('#certificate_table tbody tr td select[name=country_select]').val(selectedcsroption.Country)
        $('#certificate_table tbody tr td input[name=email_address]').val(selectedcsroption.Email)
        $('#certificate_table tbody tr td input[name=subject_alternative_name]').val(selectedcsroption.SubjectAlt)
        //Update the country variable using the in build script
        $('#certificate_table tbody tr td select[name=country_select]').trigger("onchange");
    });
    //Set the default value
    setTimeout(function(){
        $('#configuration_table tbody tr td #csrdropdownmenu').trigger("change");
    }, 500);
}

/**************************************************************************
 * Generic functions
 **************************************************************************/
function makeCurrentPartitionObjectsBold(){
    //Get the current partition
    let currentpartition = getCookie("F5_CURRENT_PARTITION")
    $("tbody#list_body tr td a").filter(function(){
        return $(this).attr("href").indexOf("/" + currentpartition + "") >= 0
    }).each(function(){
        $(this).css('font-weight', 700);
    });
}

/**************************************************************************
 * Helper functions
 **************************************************************************/
// Used to in cases where jQuery caches the selector at the begining of the script.
function triggerEvent(ev, el){
    "use strict";
    let event = document.createEvent('HTMLEvents');
    event.initEvent(ev, true, true);
    el.dispatchEvent(event);
}

function log(s, c = "black"){
    console.log("%c " + s, "color: " + c);
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

// Credit to Michael Jenkins for this one.
// https://github.com/jangins101/
function addDoubleClick(el, btn) {
    $("#" + el).dblclick(function() { $("#" + btn).click(); });
}

//Taken from sourceforge
function addGlobalStyle(css) {
    let head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

//Get a cookie value. Used to get the current partition
//Shamelessly stolen from https://gist.github.com/thoov/984751
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i=0; i<ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function setCookie(name,value,days) {
    let expires;
    if (days) {
        let date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toGMTString();
    }
    else expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function deleteCookie(name) {
    setCookie(name,"",-1);
}

function replaceCookie(name, value, days){
    deleteCookie(name);
    setCookie(name, value, days);
}

function getUrlVars(){
    let vars = [], hash;
    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(let i = 0; i < hashes.length; i++){
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

//Tests if browser uri contains string
function uriContains(s) {
    "use strict";
    let uri = (document.location.pathname + document.location.search);
    return uri.indexOf(s) >= 0;
}
