	

    // ==UserScript==
    // @name           Game Over Stats Logger
    // @namespace      http://*kingsofchaos.com/*
    // @description    Inserts Intel Logs Into A Database...
    // @include        http://*kingsofchaos.com/*
	// @run-at document-body
// @version 0.0.1.20150724130324
// @downloadURL https://update.greasyfork.org/scripts/11046/Game%20Over%20Stats%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/11046/Game%20Over%20Stats%20Logger.meta.js
    // ==/UserScript==
     
    /*
    Game Over by Baigo & September is licensed under a Creative Commons Attribution-Noncommercial-No Derivative Works 3.0 Unported International License.
    To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-nd/3.0/
    or send a letter to Creative Commons, 171 Second Street, Suite 300, San Francisco, California, 94105, USA.
    */
     
    // Caching Preferences
    var Cache_statsphp_timeout = 5*60;
    var Cache_attackphp_timeout = 5*60;
    var Cache_status_timeout = 10*60;       // used to check for war status, new version and custom top on base.php
    var Selfupdate_timeout = 10*60;
     
    /*
    var Cache_statsphp_timeout = 0;
    var Cache_attackphp_timeout = 0;
    var Cache_status_timeout = 10*60;       // used to check for war status, new version and custom top on base.php
    var Selfupdate_timeout = 0;
    */
     
    // Check html completeness
    if(document.body.innerHTML.indexOf("logout.php") < 0
    || document.body.innerHTML.indexOf("is a registered trademark of Kings of Chaos") < 0)
    {
        throw new Error("Incomplete html!"); // logged out or incomplete page
		
    }
     
    if(DetectRunningInstance() == true)
    {
        alert("You are running multiple instances of the GO script!\nManually remove any duplicates from the Greasemonkey menu.");
       
        throw new Error("Multiple instances of GO script!");
    }
     
    // Globals
    var GO_version = 3.9;
    var GO_server = "http://www.srforums.net/baigo/script/";
     
    var GO_username = GM_getValue("GO_username", "");
    var GO_password = GM_getValue("GO_password", "");
    var GO_statid = GM_getValue("GO_statid", "");
    var GO_uniqid = GM_getValue("GO_uniqid", "");
     
    var soldiers =[];       // used on some pages like train.php, mercs.php
    var mercs = [];          // available mercs
    var bfPlayers = []; // list of stats for players on the current bf
     
    var gold = GetGold();
    var url = document.location.toString();
    var weaponList = ["Blackpowder Missile", "Invisibility Shield", "Chariot", "Dragonskin", "Nunchaku", "Lookout Tower"];
    CheckEligibility();
    // Initial modifications
    RemoveAdvertisement();
    AddMenuItems();

    AddBfSearch();

    CheckExpForNextTech();

    if(url.indexOf("/base.php") > 0)
    {
        BasePHP();
    }
    else if(url.indexOf("/armory.php") > 0)
    {
        ArmoryPHP();
    }
    else if(url.indexOf("/train.php") > 0)
    {
        TrainPHP();
    }
    else if(url.indexOf("/mercs.php") > 0)
    {
        MercsPHP();
    }
    else if(url.indexOf("/attacklog.php") > 0)
    {
        AttacklogPHP();
    }
    else if(url.indexOf("/stats.php") > 0)
    {
        StatsPHP();
    }
    else if(url.indexOf("/attack.php") > 0)
    {
        AttackPHP();
    }
    else if(url.indexOf("/inteldetail.php") > 0)
    {
        InteldetailPHP();
    }
    else if(url.indexOf("/detail.php") > 0)
    {
        DetailPHP();
    }
    else if(url.indexOf("/battlefield.php") > 0)
    {
        BattlefieldPHP();
    }
    else if(url.indexOf("/writemail.php") > 0)
    {
        writemail();
    }
     
    ScrollIntoContent();
     
    /*****************************************************************************/
    /********************************* PAGES *************************************/
    /*****************************************************************************/
     
    function BasePHP()
    {
        var statid = GetText("b>Name</b", "id=", "\"");
        var username = GetText("b>Name</b", "\">", "<");
        var uniqid = GetText("uniqid=", "\"");
       
        if(!statid || !username || !uniqid) return;
       
        GM_setValue("GO_username", username);
        GM_setValue("GO_statid", statid);
        GM_setValue("GO_uniqid", uniqid);
       
        // Display the custom div on top
        GM_xmlhttpRequest(
        {
            method: "GET",
            url: GO_server + "checkstatus.php?whoami=" + username + "&password=" + GO_password + "&userid=" + statid + "&recruitid=" + uniqid,
            onload: function(r)
            {
                            if(r.responseText.indexOf("<div id='x'></div>") >= 0)
                            {
                                    if(GM_getValue("GO_Eligible", 0) == 0)
                                    {
                                            alert("Access Granted!");
                                    }
                                    GM_setValue("GO_Eligible", 1);
                            }
           
                if(r.responseText == "Unregistered")
                {
                    var customDiv = document.createElement("div");
                    customDiv.innerHTML = "<br><center><table class=table_lines width=100%><tr><th style=\"background-color:red; height: 4ex;\">Your have not registerd a GO account!</th></tr>"
                                        + "<tr><td>Click <a href=# id=registerGO onClick=\"return false;\">here</a> to register your GO account."
                                        + "<br><br>If this is not working, contact an administrator via IRC or KoC PM.</td></tr>"
                                        + "</table></center><br><br>";
                    document.getElementsByClassName("content")[0].insertBefore(customDiv, document.getElementsByClassName('table_lines')[0]);
                   
                    document.getElementById('registerGO').addEventListener('click', function(){ BasePHP_OnRegisterGO(username, statid, uniqid, GO_password); }, false);
                }
                else if(r.responseText == "Invalid Password")
                {
                    var customDiv = document.createElement("div");
                    customDiv.innerHTML = "<br><center><table class=table_lines width=100%><tr><th style=\"background-color:red; height: 4ex;\">Your GO password is invalid!</th></tr>"
                                        + "<tr><td>Click <a href=# id=putGOPassword onClick=\"return false;\">here</a> to re-enter your GO password."
                                        + "<br><br>If you do not remember your GO password, contact an administrator via IRC or KoC PM.</td></tr>"
                                        + "</table></center><br><br>";
                    document.getElementsByClassName("content")[0].insertBefore(customDiv, document.getElementsByClassName('table_lines')[0]);
                   
                    document.getElementById('putGOPassword').addEventListener('click', function(){ BasePHP_OnPutGOPassword(username, GO_password); }, false);
                }
                else if(r.responseText == "Not Activated")
                {
                    var customDiv = document.createElement("div");
                    customDiv.innerHTML = "<br><center><table class=table_lines width=100%><tr><th style=\"background-color:#DD8800; height: 4ex;\">Your GO account is not activated!</th></tr>"
                                        + "<tr><td>If this is taking too long, contact an administrator via IRC or KoC PM.</td></tr>"
                                        + "</table></center><br><br>";
                    document.getElementsByClassName("content")[0].insertBefore(customDiv, document.getElementsByClassName('table_lines')[0]);
                }
                else
                {                
                    var customDiv = document.createElement("div");
                    customDiv.innerHTML = r.responseText.indexOf("<div id='x'>") >= 0 ? r.responseText : "<center><b>Server is currently down. Please wait a few minutes.</b></center><br>";
                   
                    document.getElementsByClassName("content")[0].insertBefore(customDiv, document.getElementsByClassName('table_lines')[0]);
                                   
                                    //update script if required.
                                    var currentver = GetTextIn(r.responseText,'[version]','[/version]');
                                   
									// zmeb
                                   // if(currentver.length > 0 && currentver != GO_version)
                                  //  {
                                   //         alert("You're using an old version of SR's GO!.");
                                  //          GM_openInTab(GO_server + '/download/game_over_stats_logger.user.js');
                                  //  }
                                   
                }
            }
        });
       
        // Show hourly income
        var MOTable = GetTable("Military Overview");
        if(MOTable)
        {
            var tbgRow = GetTableRow(MOTable, 0, "<b>Projected Income");
            if(tbgRow >= 0)
            {
                var tbg = GetTextIn(MOTable.rows[tbgRow].cells[1].innerHTML, "", " ").replace(/,/g, "");
                MOTable.insertRow(tbgRow + 1).innerHTML = "<td><b>Hourly Income</b></td><td>" + AddCommas((tbg * 60).toString()) + " Gold (in 60 mins)</td>";
            }
        }
       
        // Record officer bonus
        var officerBonus = GetText("in today (x ",")");
        if(!officerBonus) officerBonus = 1;
        GM_setValue("GO_currentOfficerBonus", officerBonus);
       
        // Update own stats
        var sa = GetText(">Strike Action<", "\">", "<").replace(/,/g, "");
        var da = GetText(">Defensive Action<", "\">", "<").replace(/,/g, "");
        var spy = GetText(">Spy Rating<", "\">", "<").replace(/,/g, "");
        var sentry = GetText(">Sentry Rating<", "\">", "<").replace(/,/g, "");
       
        var th = GetTag2('th', "Military Effectiveness");
        th.innerHTML = "<button style='" + (window.innerWidth < 1280 ? "height:2em;margin-top:0.25em;" : "") + "width:10ex;margin-right:-10ex;float:left' id=bSelfUpdate>Update</button>" + th.innerHTML + " " + (window.innerWidth < 1280 ? "<br />" : "") + "<span id=sSelfUpdate></span>";
       
        var needsSelfUpdate = false;
        var elapsed = 0;
       
        var lastOwnUpdate = GM_getValue("GO_Selfupdate_time", "");
        if(lastOwnUpdate == "")
        {
            needsSelfUpdate = true;
        }
        else
        {
            elapsed = UnixTimestamp() - parseInt(lastOwnUpdate, 10);
           
            if(elapsed > Selfupdate_timeout)
            {
                needsSelfUpdate = true;
            }
        }
       
        if(needsSelfUpdate)
        {
            SelfUpdate(sa, da, spy, sentry);
        }
        else
        {
            document.getElementById("sSelfUpdate").innerHTML = "(Updated " + ago(elapsed) + ")";
        }
       
        // Add the GO options button
        var table = GetTable("Preferences");
        if(table)
        {
            // find correct place to put the GO options button
            // if cannot find, -1 will insert at the end of the table
            var butIdx = -1;
           
            for(i = 0; i < table.rows.length; i++)
            {
                if(table.rows[i].innerHTML.indexOf("Change E-Mail") >= 0)
                {
                    butIdx = i;
                    break;
                }
            }
       
            table.insertRow(butIdx).innerHTML = "<td align=center><a style=\"cursor:pointer\" id=bOpenGoOptions>Go Options</a>";
            document.getElementById('bOpenGoOptions').addEventListener('click', BasePHP_OnToggleGOOptions, false);
           
            // Add the GO options
            var goOptions = "<table width=100% class=table_lines cellspacing=0 cellpadding=8><tr><th colspan=2>GO Options</th></tr>"
                          + "<tr><td align=right width=60%><label for=goOptionRemoveAdv>Remove advertisement</label></td><td><input type=checkbox id=goOptionRemoveAdv " + (GM_getValue("GO_OptionRemoveAdv", 1) == 0 ? "" : "checked") + "></input></td></tr>"
                          + "<tr><td align=right><label for=goOptionScrollIntoContent>Scroll into the content</label></td><td><input type=checkbox id=goOptionScrollIntoContent " + (GM_getValue("GO_OptionScrollIntoContent", 1) == 0 ? "" : "checked") + "></input></td></tr>"
                          + "<tr><td align=right><label for=goOptionSpecialEffects>Special effects</label></td><td><input type=checkbox id=goOptionSpecialEffects " + (GM_getValue("GO_OptionSpecialEffects", 1) == 0 ? "" : "checked") + "></input></td></tr>"
                          + "<tr><td align=right>Password</td><td><input id=goOptionPassword value=\"" + GM_getValue("GO_password", "") + "\"></input></td></tr>"
                          + "<tr><td colspan=2 align=right style=\"border-bottom:0; padding:2em;\"><button id=bSaveGoOptions>Save</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id=bCancelGoOptions>Cancel</button></td></tr>"
                          + "</table>";
           
            var goOptionsContainerDiv = document.createElement('div');
            goOptionsContainerDiv.innerHTML = "<div id=dGoOptionsContainer style=\"display:none; position:fixed; width:100%; height:100%; left:0; top:0; background-color:gray; opacity:0.50; z-index:10;\"></div>";
           
            var goOptionsDiv = document.createElement('div');
            goOptionsDiv.innerHTML = "<div id=dGoOptions style=\"display:none; position:fixed; width:60ex; height:21em; left:50%; margin-left:-30ex; top:50%; margin-top:-10em; background-color:black; z-index:15; padding:10px;\">" + goOptions + "</div>";
           
            document.body.appendChild(goOptionsContainerDiv);
            document.body.appendChild(goOptionsDiv);
           
            document.getElementById('bSaveGoOptions').addEventListener('click', BasePHP_OnSaveGOOptions, false);
            document.getElementById('bCancelGoOptions').addEventListener('click', BasePHP_OnToggleGOOptions, false);
        }
       
        // Expand/collapse tables
        ExpandCollapseTable("Grow Your Army");
        ExpandCollapseTable("Notice from Commander");
        ExpandCollapseTable("Recent Attacks on You");
        ExpandCollapseTable("Military Overview");
        ExpandCollapseTable("Military Effectiveness");
        ExpandCollapseTable("Previous Logins");
        ExpandCollapseTable("Preferences");
        ExpandCollapseTable("Officers");
       
        // Listen the self update button (this has to be after expcol section cuz it also adds another listener on the th)
        document.getElementById('bSelfUpdate').addEventListener('click', function(){ SelfUpdate(sa, da, spy, sentry); OnExpColTable("Military Effectiveness"); }, false);
    }
     
    function AttacklogPHP()
    {
     
        // Do not add stuff if not eligible
        if(GM_getValue("GO_Eligible", 0) == 0)
        {
            return;
        }
     
        var serverString = '';
        var table = document.getElementsByClassName('table_lines attacklog')[0].innerHTML //Attacks on you....
        var x = attackLogExtract(table,"on");
        serverString +=    x
       
       
        table = document.getElementsByClassName('table_lines attacklog')[1].innerHTML //Attacks by you
        x = attackLogExtract(table,"off");
        serverString += x
           
            GM_xmlhttpRequest(
            {
                    method: "POST",
                    url: GO_server + "backbone.php?code=attacklog&whoami=" + GO_username + "&password=" + GO_password + "&whoamid=" + GO_statid,
                    headers: { 'Content-type' : 'application/x-www-form-urlencoded' },
                    data: encodeURI("code=attacklog&whoami=" + GO_username + "&password=" + GO_password + "&whoamid=" + GO_statid + "&data=" + serverString),
                    onload: function(r)
                    {
                            if(r.status == 200)
                            {
                                    if(r.responseText.indexOf("Access Denied") >= 0)
                                    {
                                            GM_setValue("GO_Eligible", 0);
                                            return;
                                    }
                            }
                    }
            });
             
        function attackLogExtract(table, type)
        {
            var LogTable = table.split('<tr>');
            var postStr = '';
                 for(i=3;i<LogTable.length;i++){        
                    if(String(LogTable[i]).match("detail.php?"))
                    {
                        if(!String(LogTable[i]).match("not active"))
                        {
                            var user = FindText(FindText(LogTable[i],"stats.php","</td"),">","<")
                            var rid = FindText(LogTable[i],"_id=",'"');
                           
                            if(String(LogTable[i]).match("Attack defended"))
                            {
                                var gold=0;
                                var atype = 'defended';
                            }else{
                                var atype = 'succesful';
                                var gold = String(FindText(LogTable[i],FindText(LogTable[i],"_id=",'"') + '">',' Gold')).replace(/,/g, '');
                            }
                           
                            var elost = FindText(LogTable[i].split('detail.php?attack_id=')[1],'<td align="right">','</td>');
                           
                            if(type=="on")
                            {
                                postStr = postStr + user + ":" + GM_getValue("GO_username") + ":" + gold + ":" + elost + ":" + atype + ":" + rid + "*";
                               
                            }else{
                                postStr = postStr + GM_getValue("GO_username") + ":" + user + ":" + gold + ":" + elost + ":" + atype + ":" + rid + "*";
                            }                    
                        }
                    }        
                }
            return postStr;
        }
    }
     
    function ArmoryPHP()
    {
     
        // Do not add stuff if not eligible
        if(GM_getValue("GO_Eligible", 0) == 0)
        {
            return;
        }
     
        // Update own stats
        var sa = GetText(">Strike Action<", "\">", "<").replace(/,/g, "");
        var da = GetText(">Defensive Action<", "\">", "<").replace(/,/g, "");
        var spy = GetText(">Spy Rating<", "\">", "<").replace(/,/g, "");
        var sentry = GetText(">Sentry Rating<", "\">", "<").replace(/,/g, "");
       
        var th = GetTag2('th', "Military Effectiveness");
        th.innerHTML = "<button style='" + (window.innerWidth < 1280 ? "height:2em;margin-top:0.25em;" : "") + "width:10ex;margin-right:-10ex;float:left' id=bSelfUpdate>Update</button>" + th.innerHTML + " " + (window.innerWidth < 1280 ? "<br />" : "") + "<span id=sSelfUpdate></span>";
       
        var needsSelfUpdate = false;
        var elapsed = 0;
       
        var lastOwnUpdate = GM_getValue("GO_Selfupdate_time", "");
        if(lastOwnUpdate == "")
        {
            needsSelfUpdate = true;
        }
        else
        {
            elapsed = UnixTimestamp() - parseInt(lastOwnUpdate, 10);
           
            if(elapsed > Selfupdate_timeout)
            {
                needsSelfUpdate = true;
            }
        }
       
        if(needsSelfUpdate)
        {
            SelfUpdate(sa, da, spy, sentry);
        }
        else
        {
            document.getElementById("sSelfUpdate").innerHTML = "(Updated " + ago(elapsed) + ")";
        }
       
        // Listen the self update button
        document.getElementById('bSelfUpdate').addEventListener('click', function(){ SelfUpdate(sa, da, spy, sentry); }, false);
       
       
        // Read current weapons and tools
        var weaponsTable = GetTable("Current Weapon Inventory");
        var toolsTable = GetTable("Current Tool Inventory");
        var buyWeaponsTable = GetTable("Buy Weapons");
       
        var weapons = [];   // holds the number of current weapons+tools (length is same as the global weaponList)
        var totalSellValue = 0;
        var totalInvestedValue = 0;
       
        var totalAttackWeapons = 0;
        var totalDefenseWeapons = 0;
        var totalSpyTools = 0;
        var totalSentryTools = 0;
       
        for(var i = 0; i < weaponList.length; i++)
        {
            weapons.push(0);
        }
       
        var passedDefenseWeapons = 0;
        var idxDefenseWeaponsTh = -1;
       
        for(var i = 1; i < weaponsTable.rows.length; i++)
        {
            if(weaponsTable.rows[i].cells.length < 4) continue;
           
            var wepName = weaponsTable.rows[i].cells[0].innerHTML;
            if(wepName == "Defense Weapons")
            {
                passedDefenseWeapons = 1;
                idxDefenseWeaponsTh = i;
                continue;
            }
            if(wepName == "Attack Weapons")
            {
                continue;
            }
           
            var wepCount = parseInt( weaponsTable.rows[i].cells[1].innerHTML.replace(/,/g, "") );
            var wepSell = parseInt( GetTextIn(weaponsTable.rows[i].cells[3].innerHTML, "Sell for ", " Gold").replace(/,/g, "") );
           
            totalSellValue += (wepCount * wepSell);
           
            var j = GetTableRow(buyWeaponsTable, 0, wepName);
            if(j >= 0)
            {
                var wepCost = parseInt( buyWeaponsTable.rows[j].cells[2].innerHTML.replace(/,/g, "") );
                totalInvestedValue += (wepCount * wepCost);
            }
           
            var idx = weaponList.indexOf(wepName);
            if(idx >= 0)
            {
                weapons[idx] = wepCount;
            }
           
            if(passedDefenseWeapons == 0)
            {
                totalAttackWeapons += wepCount;
            }
            else
            {
                totalDefenseWeapons += wepCount;
            }
        }
       
        // same for the tools
        var passedSentryTools = 0;
        var idxSentryToolsTh = -1;
       
        for(var i = 1; i < toolsTable.rows.length; i++)
        {
            if(toolsTable.rows[i].cells.length < 4) continue;
           
            var wepName = toolsTable.rows[i].cells[0].innerHTML;
            if(wepName == "Sentry Tools")
            {
                passedSentryTools = 1;
                idxSentryToolsTh = i;
                continue;
            }
            if(wepName == "Spy Tools")
            {
                continue;
            }
           
            var wepCount = parseInt( toolsTable.rows[i].cells[1].innerHTML.replace(/,/g, "") );
            var wepSell = parseInt( GetTextIn(toolsTable.rows[i].cells[3].innerHTML, "Sell for ", " Gold").replace(/,/g, "") );
           
            totalSellValue += (wepCount * wepSell);
           
            var j = GetTableRow(buyWeaponsTable, 0, wepName);
            if(j >= 0)
            {
                var wepCost = parseInt( buyWeaponsTable.rows[j].cells[2].innerHTML.replace(/,/g, "") );
                totalInvestedValue += (wepCount * wepCost);
            }
           
            var idx = weaponList.indexOf(wepName);
            if(idx >= 0)
            {
                weapons[idx] = wepCount;
            }
           
            if(passedSentryTools == 0)
            {
                totalSpyTools += wepCount;
            }
            else
            {
                totalSentryTools += wepCount;
            }
        }
       
        // show the aat (weapons)
        for(var i = 1; i < weaponsTable.rows.length; i++)
        {
            if(weaponsTable.rows[i].cells.length < 4) continue;
           
            var wepName = weaponsTable.rows[i].cells[0].innerHTML;
            if(wepName == "Defense Weapons" || wepName == "Attack Weapons")
            {
                weaponsTable.rows[i].innerHTML = weaponsTable.rows[i].innerHTML.replace("Weapons</th>", "Weapons</th><th class=subh align=right>AAT</th>");
                continue;
            }
           
            var wepCount = parseInt( weaponsTable.rows[i].cells[1].innerHTML.replace(/,/g, "") );
           
            var j = GetTableRow(buyWeaponsTable, 0, wepName);
            var wepCost = parseInt( buyWeaponsTable.rows[j].cells[2].innerHTML.replace(/,/g, "") );
           
            var aat = parseInt( Math.floor(totalInvestedValue / (wepCost * 400)) );
           
            weaponsTable.rows[i].insertCell(1).innerHTML = AddCommas(Math.min(aat, wepCount).toString());
            weaponsTable.rows[i].cells[1].setAttribute('align', "right");
        }
       
        // show the aat (tools)    
        for(var i = 1; i < toolsTable.rows.length; i++)
        {
            if(toolsTable.rows[i].cells.length < 4) continue;
           
            var wepName = toolsTable.rows[i].cells[0].innerHTML;
            if(wepName == "Sentry Tools" || wepName == "Spy Tools")
            {
                toolsTable.rows[i].innerHTML = toolsTable.rows[i].innerHTML.replace("Tools</th>", "Tools</th><th class=subh align=right>AAT</th>");
                continue;
            }
           
            var wepCount = parseInt( toolsTable.rows[i].cells[1].innerHTML.replace(/,/g, "") );
           
            var j = GetTableRow(buyWeaponsTable, 0, wepName);
            var wepCost = parseInt( buyWeaponsTable.rows[j].cells[2].innerHTML.replace(/,/g, "") );
           
            var aat = parseInt( Math.floor(totalInvestedValue / (wepCost * 400)) );
           
            toolsTable.rows[i].insertCell(1).innerHTML = AddCommas(Math.min(aat, wepCount).toString());
            toolsTable.rows[i].cells[1].setAttribute('align', "right");
        }
       
        // Show how much weapon is held
        GetSoldiers();
       
        if(totalAttackWeapons > 0)
        {
            var attackSoldiers = soldiers[0] + soldiers[1] + soldiers[4] + soldiers[5];
            var unheld = totalAttackWeapons - attackSoldiers;
            if(unheld > 0)
            {
                weaponsTable.rows[1].cells[0].innerHTML += " <span style='color:red; border-left: 1px solid white'>&nbsp;Unheld: " + unheld + "</span>";
            }
        }
       
        if(totalDefenseWeapons > 0)
        {
            var defenseSoldiers = soldiers[2] + soldiers[3] + soldiers[4] + soldiers[5];
            var unheld = totalDefenseWeapons - defenseSoldiers;
            if(unheld > 0)
            {
                weaponsTable.rows[idxDefenseWeaponsTh].cells[0].innerHTML += " <span style='color:red; border-left: 1px solid white'>&nbsp;Unheld: " + unheld + "</span>";
            }
        }
       
        if(totalSpyTools > 0)
        {
            var unheld = totalSpyTools - soldiers[6];
            if(unheld > 0)
            {
                toolsTable.rows[1].cells[0].innerHTML += " <span style='color:red; border-left: 1px solid white'>&nbsp;Unheld: " + unheld + "</span>";
            }
        }
       
        if(totalSentryTools > 0)
        {
            var unheld = totalSentryTools - soldiers[7];
            if(unheld > 0)
            {
                toolsTable.rows[idxSentryToolsTh].cells[0].innerHTML += " <span style='color:red; border-left: 1px solid white'>&nbsp;Unheld: " + unheld + "</span>";
            }
        }
       
        // Fix the width of the weapons and tools table together
        if(weaponsTable.rows.length > 2)
        {
            weaponsTable.rows[1].cells[0].width = '20%';
            weaponsTable.rows[1].cells[1].width = '15%';
            weaponsTable.rows[1].cells[2].width = '15%';
            weaponsTable.rows[1].cells[3].width = '15%';
            weaponsTable.rows[1].cells[4].width = '35%';
        }
       
        if(toolsTable.rows.length > 2)
        {
            toolsTable.rows[1].cells[0].width = '20%';
            toolsTable.rows[1].cells[1].width = '15%';
            toolsTable.rows[1].cells[2].width = '15%';
            toolsTable.rows[1].cells[3].width = '15%';
            toolsTable.rows[1].cells[4].width = '35%';
        }
       
        // Fix the centerization of strength in tools table
        for(var i = 0; i < toolsTable.rows.length; i++)
        {
            if(toolsTable.rows[i].cells.length >= 5)
            {
                toolsTable.rows[i].cells[3].align = "right";
               
                // make the tools sell form 90% to align with the weapons
                var toolId = GetTextIn(toolsTable.rows[i].cells[4].innerHTML, "scrapsell[", "]");
                if(toolId == "")
                {
                    continue;
                }
               
                var e = document.getElementsByName("scrapsell[" + toolId + "]");
                if(e.length != 1)
                {
                    continue;
                }
               
                e[0].parentNode.parentNode.parentNode.parentNode.width = "90%";
                e[0].parentNode.parentNode.parentNode.parentNode.align = "center";
            }
        }
       
        // Show the armory value
        toolsTable.insertRow(-1).innerHTML = "<td colspan=5></td>";
        toolsTable.insertRow(-1).innerHTML = "<td colspan=5 align=center style='background-color:#003333; border-bottom:0'><strong>Your sell value: " + AddCommas(totalSellValue.toString()) + " Gold</strong></td>";
       
        // Lighten up the repair all button are if money is enough
        var repairBut = GetElement('input', "Repair all");
        if(repairBut)
        {
            var repairGold = Math.ceil( GetTextIn(repairBut.value, "for ", " ").replace(/,/g, "") );
           
            if(gold >= repairGold)
            {
                repairBut.style.backgroundColor = "#005500";
            }
            else
            {
                repairBut.style.backgroundColor = "#880000";
            }
        }
       
        // Check for loss
        var lostLog = [];
       
        var nowDate = new Date();
        var now = nowDate.getTime();
       
        var BPM = 0
        var CH = 0
        var DS = 0
        var IS = 0
       
        for(var i = 0; i < weaponList.length; i++)
        {
            if(weaponList[i] == 'Invisibility Shield') { IS = weapons[i]; }
            if(weaponList[i] == 'Dragonskin') { DS = weapons[i]; }
            if(weaponList[i] == 'Blackpowder Missile') { BPM = weapons[i]; }
            if(weaponList[i] == 'Chariot') { CH = weapons[i]; }
     
            var oldCount = GM_getValue("GO_armory_" + weaponList[i].replace(/ /g, "_"), -1);
            var soldCount = GM_getValue("GO_armory_" + weaponList[i].replace(/ /g, "_") + "_sold", 0);
           
            oldCount -= soldCount;
           
            if(weapons[i] < oldCount)
            {
                lostLog.push((oldCount - weapons[i]) + ":" + weaponList[i] + ":" + now);
            }
           
            GM_setValue("GO_armory_" + weaponList[i].replace(/ /g, "_"), weapons[i]);
            GM_setValue("GO_armory_" + weaponList[i].replace(/ /g, "_") + "_sold", 0);
        }
       
        // Keep the last 10 logs of lost weapons
        var lostLogGlobal = [];
       
        for(var i = 0; i < 10; i++)
        {
            lostLogGlobal.push(GM_getValue("GO_lost_wep_log_" + i, "::"));
        }
       
        // Add to the lost weapon log
        var lostLogTop = [];    // to show at the top of the page
       
        for(var i = 0; i < lostLog.length; i++)
        {
            lostLogGlobal.unshift(lostLog[i]);
           
            var lostWepDetails = lostLog[i].split(":");
            lostLogTop.push("You are missing " + lostWepDetails[0] + " " + lostWepDetails[1] + (lostWepDetails[0] > 1 ? "s" : ""));
        }
       
        if(lostLogTop.length > 0)
        {
            weaponsTable.insertRow(0).innerHTML = "<td colspan=5 style='background-color:red'><strong>" + lostLogTop.join("<br>") + "</strong></td>";
           
            // Special effect, I made this, dont steal!
            if(GM_getValue("GO_OptionSpecialEffects", 1) != 0)
            {
                var bloodDiv = document.createElement('div');
                bloodDiv.setAttribute('style', "position:fixed; left:0; top:0; width:100%; height:100%; background-color:red; opacity:1.0; z-index:1000;");
                bloodDiv.setAttribute('id', "bloodDiv");
                document.body.appendChild(bloodDiv);
               
                setTimeout(ArmoryPHP_ReduceBloodEffect, 100);
            }
        }
     
       
       
        // When to upgrade (Added By Shane)
    var htmlHead = document.getElementsByTagName("head")[0].innerHTML;  
    var myRace = FindText(FindText(htmlHead,'<link href="/images/css/common.css" rel="','css" r'),'/css/','.');
    var saBonus=1;
    var daBonus=1;
     
     
    var techMulti = GM_getValue("GO_currentTech", 1);
    var officerBonus = GM_getValue("GO_currentOfficerBonus", 1);
     
    switch(myRace)
    {
        case 'Dwarves': { daBonus = 1.4; break }
        case 'Orcs': { daBonus = 1.2;saBonus = 1.35; break }
    }
     
        var upgradeTable = GetTable("Armory Autofill Preferences");
        upgradeTable.insertRow(-1).innerHTML = "<td colspan=3></td>";
        upgradeTable.insertRow(-1).innerHTML = "<th colspan=3>Upgrade Table</th>";    
       
        var myFort = FindText(FindText(document.body.innerHTML,'Current Fortification','<td align="center">'),'<td>','</td>').split(" (")[0]
        var mySiege = FindText(FindText(document.body.innerHTML,'Current Siege Technolog','<td align="center">'),'<td>','</td>').split(" (")[0]
     
        FortArray = FortList(myFort).split('|');
        SiegeArray = SiegeList(mySiege).split('|');
        // Returns: Multiply | Next Upgrade | Next Price | Next Multiply
     
        var BPMMsg = '';
        var CHMsg = '';
        var ISMsg = '';
        var DSMsg = '';
       
       
       
        var attackSol = ((((soldiers[0] + soldiers[1]) * 5) * techMulti) * officerBonus);
        var defenceSol = ((((soldiers[2] + soldiers[3]) * 5) * techMulti) * officerBonus);
        var untrainedSol = ((((soldiers[4] + soldiers[5]) * 4) * techMulti) * officerBonus);
     
     
       
    if((!isNaN(BPM)) && (!isNaN(CH))) {
     
        if(SiegeArray[1] != 'Max') // We have some upgrades left.
        {
            var currentSA = ((((BPM*SiegeArray[0])*1000)*6)*saBonus + ((((CH*SiegeArray[0])*600)*6)*saBonus));  // Forumla is correct.
     
            var tmpcurrentSA =  addCommas(Math.round((((currentSA * techMulti) * officerBonus) + attackSol) + untrainedSol));
           
           
            var sellBPM = Math.round(removeComma(SiegeArray[2]) / 700000);
            var sellCH = Math.round(removeComma(SiegeArray[2]) / 315000);
           
            var newBPM = BPM-sellBPM; //New amount of BPM after selling for upgrade.
            var newCH = CH-sellCH;
           
            var newSA = (((newBPM*SiegeArray[3])*1000)*6)*saBonus + (((CH*SiegeArray[3])*600)*6)*saBonus;
            var newSACH = (((newCH*SiegeArray[3])*600)*6)*saBonus + (((BPM*SiegeArray[3])*1000)*6)*saBonus
     
            if(currentSA < newSA)
            {
                if(sellBPM < BPM)
                {            
                    BPMMsg += "Sell " + sellBPM + " BPMs and buy " + SiegeArray[1];
                    BPMMsg += "<br>You'll gain " + addCommas(Math.round(((newSA-currentSA) * techMulti)*officerBonus)) + " SA...";
                }else{
                    BPMMsg += 'Its not profitable to buy ' + SiegeArray[1] + ' yet with BPMs';
                }
               
                if(currentSA < newSACH)
                {
                    if(sellCH < CH){
                        CHMsg += "Sell " + sellCH + " Chariots and buy " + SiegeArray[1];
                        CHMsg += "<br>You'll gain " + addCommas(Math.round(((newSACH-currentSA) * techMulti)*officerBonus)) + " SA...";
                    }else{
                        CHMsg += 'Its not profitable to buy ' + SiegeArray[1] + ' yet with CHs';
                    }
                }else{
                    CHMsg += 'Its not profitable to buy ' + SiegeArray[1] + ' yet with CHs';
                }                
            }else{
                BPMMsg += 'Its not profitable to buy ' + SiegeArray[1] + ' yet with BPMs';
                if(currentSA < newSACH)
                {
                    if(sellCH < CH)
                    {                
                        CHMsg += "Sell " + sellCH + " Chariots and buy " + SiegeArray[1];
                        CHMsg += "<br>You'll gain " + addCommas(Math.round(((newSACH-currentSA) * techMulti)*officerBonus)) + " SA...";
                    } else {
                                            CHMsg += 'Its not profitable to buy ' + SiegeArray[1] + ' yet with CHs';
                                    }
                }else{            
                    CHMsg += 'Its not profitable to buy ' + SiegeArray[1] + ' yet with CHs';
                }
               
            }
        }else{
            CHMsg = 'Already got all sa upgrades.';
            BPMMsg = 'Already got all sa upgrades.';
        }
    }else{
            CHMsg = "Couldn't detect your Chariots.";
            BPMMsg = "Couldn't detect your BPMs.";
    }
     
     
     
     
    if((!isNaN(IS)) && (!isNaN(DS))) {
        if(FortArray[1] != 'Max') // We have some upgrades left.
        {
            //alert((((1*FortArray[0])*256)*5)*daBonus);  //  41,813,923
            var currentDA = ((((IS*FortArray[0])*1000)*6)*daBonus + (((DS*FortArray[0])*256)*6)*daBonus);  // Forumla is correct.
     
            var tmpcurrentDA =  addCommas(Math.round((((currentDA * techMulti) * officerBonus) + defenceSol) + untrainedSol));
           
            var sellIS = Math.round(removeComma(FortArray[2]) / 700000);
            var sellDS = Math.round(removeComma(FortArray[2]) / 140000);
           
            var newIS = IS-sellIS; //New amount of IS after selling for upgrade.
            var newDS = DS-sellDS; //New amount of DS after selling for upgrade.
           
            var newDA = ((((newIS*FortArray[3])*1000)*6)*daBonus + (((DS*FortArray[3])*256)*6)*daBonus);  // Forumla is correct.
           
            var newDADS = ((((newDS*FortArray[3])*256)*6)*daBonus + (((IS*FortArray[3])*1000)*6)*daBonus);  // Forumla is correct.
           
            if(currentDA < newDA)
            {
                if(newIS < IS){
                    ISMsg += "Sell " + sellIS + " ISs and buy " + FortArray[1];
                    ISMsg += "<br>You'll gain " + addCommas(Math.round(((newDA-currentDA) * techMulti)*officerBonus))+ " DA...";
                }else{
                    ISMsg += 'Its not profitable to buy ' + FortArray[1] + ' yet with ISs';
                }
               
                if(currentDA < newDADS)
                {
                    if(sellDS < DS){
                        DSMsg += "Sell " + sellDS + " Dragon Skins and buy " + FortArray[1];
                        DSMsg += "<br>You'll gain " + addCommas(Math.round(((newDADS-currentDA) * techMulti)*officerBonus))+ " DA...";
                    }else{
                        DSMsg += 'Its not profitable to buy ' + FortArray[1] + ' yet with Dragon Skins';
                    }
                } else {
                                    DSMsg = 'Its not profitable to buy ' + FortArray[1] + ' with Dragon Skins';
                            }
            }else{
                ISMsg += 'Its not profitable to buy ' + FortArray[1] + ' yet with ISs';
                if(currentDA < newDADS)
                {
                    if(sellDS < DS){
                        DSMsg += "Sell " + sellDS + " DSs and buy " + FortArray[1];
                        DSMsg += "<br>You'll gain " + addCommas(Math.round(((newDADS-currentDA) * techMulti)*officerBonus))+ " DA...";
                    }else{
                        DSMsg = 'Its not profitable to buy ' + FortArray[1] + ' with Dragon Skins';
                    }
                }else{
                    DSMsg = 'Its not profitable to buy ' + FortArray[1] + ' with Dragon Skins';
                }
            }
        }else{
            ISMsg = 'Already got all sa upgrades.';
            DSMsg = 'Already got all da upgrades.';
        }
    }else{
        upgradeMsgDA = "Couldn't detect your IS [or] DS count";
    }
     
     
       
                upgradeTable.insertRow(-1).innerHTML = "<td align=right>SA Upgrade</td>"
                                                  + "<td align=left>BPM</td>"
                                                  + "<td align=left>" + BPMMsg + "</td>";
                                                 
                upgradeTable.insertRow(-1).innerHTML = "<td align=right>SA Upgrade</td>"
                                                  + "<td align=left>Chariots</td>"
                                                  + "<td align=left>" + CHMsg + "</td>";
                                                 
                upgradeTable.insertRow(-1).innerHTML = "<td align=right>DA Upgrade</td>"
                                                  + "<td align=left>IS</td>"
                                                  + "<td align=left>" + ISMsg + "</td>";
                                                 
                upgradeTable.insertRow(-1).innerHTML = "<td align=right>DA Upgrade</td>"
                                                  + "<td align=left>Dragon Skins</td>"
                                                  + "<td align=left>" + DSMsg + "</td>";
       
        upgradeTable.insertRow(-1).innerHTML = "<td colspan=3 align=center><button id=upgradeTest onClick=\"return false;\" style='width:9ex'>Read me</button></td>";
       
        document.getElementById('upgradeTest').addEventListener('click', function(event) {
            var testUpgrade = "Upgrade Table is in its beta stage, to ensure people don't make mistakes; use this as a guildline\n\n";
            testUpgrade += "Your SA is: " + addCommas(sa) + "\n";
            testUpgrade += "Our formula calculated your SA to be: " + tmpcurrentSA + "\n";
            testUpgrade += "If these two values are similar; its safe to trust our upgrade suggestions.\n\n";
           
            testUpgrade += "Your DA is: " + addCommas(da) + "\n";
            testUpgrade += "Our formula calculated your DA to be: " + tmpcurrentDA + "\n";
            testUpgrade += "If these two values are similar; its safe to trust our upgrade suggestions.\n\n";
           
            testUpgrade += "Please give your feedback to a high ranking member of SR.";
     
            testUpgrade += "\n\n\n If the numbers are highly wrong, please visit training page, and command centre so GO can store your officer bonus; and tech bonus.";
            testUpgrade += "\n\n Please note: Our formula only calculates big weapons, it doesn't include soilders and small weapons.";
            alert(testUpgrade);
           
        }, false);
       
     
       
        // End of when to upgrade.
       
       
        // Lost weapons log
        var lostTable = GetTable("Armory Autofill Preferences");
        lostTable.insertRow(-1).innerHTML = "<td colspan=3></td>";
        lostTable.insertRow(-1).innerHTML = "<th colspan=3>Lost Weapons Log</th>";
       
        var anyLossLogged = false;
       
        for(var i = 0; i < 10; i++)
        {
            GM_setValue("GO_lost_wep_log_" + i, lostLogGlobal[i]);
           
            if(lostLogGlobal[i].length > 2) // at least "::"
            {
                var lostWepDetails = lostLogGlobal[i].split(":");
               
                // fix plural
                lostWepDetails[1] += (lostWepDetails[0] > 1 ? "s" : "");
               
                // compute elapsed time
                var elapsed = now - parseInt(lostWepDetails[2]);
                lostWepDetails[2] = elapsed > 0 ? PrintableTime(elapsed) + " ago" : "NOW!";
               
                if(elapsed == 0)
                {
                    lostWepDetails[0] = "<strong style='color:red'>" + lostWepDetails[0] + "</strong>";
                    lostWepDetails[1] = "<strong style='color:red'>" + lostWepDetails[1] + "</strong>";
                    lostWepDetails[2] = "<strong style='color:red'>" + lostWepDetails[2] + "</strong>";
                }
               
                lostTable.insertRow(-1).innerHTML = "<td align=right>" + lostWepDetails[0] + "</td>"
                                                  + "<td align=left>" + lostWepDetails[1] + "</td>"
                                                  + "<td align=left>" + lostWepDetails[2] + "</td>";
               
                anyLossLogged = true;
            }
        }
       
        if(!anyLossLogged)
        {
            lostTable.insertRow(-1).innerHTML = "<td colspan=3 align=center>Nothing has been logged yet.</td>";
        }
       
        // Listen to sell buttons so that sells wont be logged as missing
        var sellButtons = document.getElementsByName('doscrapsell');
        for(var i = 0; i < sellButtons.length; i++)
        {
            sellButtons[i].addEventListener('click', ArmoryPHP_OnSellButton, false);
        }
       
        // Add a clear button for the lost weapons log
        lostTable.insertRow(-1).innerHTML = "<td colspan=3 align=center><button id=clearLostLog onClick=\"return false;\" style='width:9ex'>Clear</button></td>";
        document.getElementById('clearLostLog').addEventListener('click', ArmoryPHP_OnClearLostLog, false);
     
        // Add helper buttons for buying
        buyWeaponsTable.rows[1].cells[3].setAttribute('colspan', 2);
       
        for(var i = 2; i < buyWeaponsTable.rows.length; i++)
        {
            if(buyWeaponsTable.rows[i].cells[0].innerHTML.indexOf("Defense Weapons") >= 0)
            {
                buyWeaponsTable.rows[i].cells[3].setAttribute('colspan', 2);
                continue;
            }
           
            if(buyWeaponsTable.rows[i].cells[0].innerHTML.indexOf("Spy Tools") >= 0)
            {
                buyWeaponsTable.rows[i].cells[3].setAttribute('colspan', 2);
                continue;
            }
            if(buyWeaponsTable.rows[i].cells[0].innerHTML.indexOf("Sentry Tools") >= 0)
            {
                buyWeaponsTable.rows[i].cells[3].setAttribute('colspan', 2);
                continue;
            }
     
            if(buyWeaponsTable.rows[i].cells[0].innerHTML.indexOf("Buy Tools") >= 0) continue;        
            if(buyWeaponsTable.rows[i].cells.length < 4) continue;
           
            buybutId = GetTextIn(buyWeaponsTable.rows[i].cells[3].innerHTML, "name=\"", "\"");
            buyWeaponsTable.rows[i].insertCell(4).innerHTML = "<button id=" + buybutId + " onClick='return false'>0</button>";
            buyWeaponsTable.rows[i].cells[4].align = "center";
            document.getElementById(buybutId).addEventListener('click', function(){ document.getElementsByName(this.id)[0].value = this.innerHTML; ArmoryPHP_UpdateWeaponButtons(); }, false);
            document.getElementsByName(buybutId)[0].addEventListener('blur', ArmoryPHP_UpdateWeaponButtons, false);
        }
           
        ArmoryPHP_UpdateWeaponButtons();
     
    }
     
    function TrainPHP()
    {
     
        // Do not add stuff if not eligible
        if(GM_getValue("GO_Eligible", 0) == 0)
        {
            return;
        }
     
        GetSoldiers();
       
        // Put helper buttons for training
        AddSoldierButton("Attack Specialist", "assign_attack", TrainPHP_OnAssignSoldier);
        AddSoldierButton("Defense Specialist", "assign_defense", TrainPHP_OnAssignSoldier);
        AddSoldierButton("Spy", "assign_spy", TrainPHP_OnAssignSoldier);
        AddSoldierButton("Sentry", "assign_sentry", TrainPHP_OnAssignSoldier);
       
        document.getElementsByName('train[attacker]')[0].addEventListener('blur', TrainPHP_UpdateTrainingButtons, false);
        document.getElementsByName('train[defender]')[0].addEventListener('blur', TrainPHP_UpdateTrainingButtons, false);
        document.getElementsByName('train[spy]')[0].addEventListener('blur', TrainPHP_UpdateTrainingButtons, false);
        document.getElementsByName('train[sentry]')[0].addEventListener('blur', TrainPHP_UpdateTrainingButtons, false);
           
        TrainPHP_UpdateTrainingButtons();
       
        // Fix the training table spannings (after adding the helper buttons)
        var t = GetTag('th', "Train Your Troops");
        if(t) t.attributes.getNamedItem('colspan').value++;
       
        t = GetTag('th', "Quantity");
        if(t) t.setAttribute('colspan', 2);
       
        t = GetElement('input', "Train!");
        if(t) t.parentNode.attributes.getNamedItem('colspan').value++;
       
        t = GetTag('td', "Reassign Attack Specialist");
        if(t) t.parentNode.innerHTML += "<td>&nbsp;</td>";
       
        t = GetTag('td', "Reassign Defense Specialist");
        if(t) t.parentNode.innerHTML += "<td>&nbsp;</td>";
       
       
        // Add a Clean button next to the train button
        var input = GetElement('input', "Train!");
        if(input)
        {
            input.parentNode.innerHTML += "<button style=\"margin-left: 6px\" id=clear_training onClick=\"return false;\">Clear</button>";
            document.getElementById('clear_training').addEventListener('click', TrainPHP_ClearTraining, false);
           
            // Colorize the buttons' row
            input = GetElement('input', "Train!"); // need to get again as its invalid after modifying the parent's innerHTML 2 lines before
            input.parentNode.style.backgroundColor = "#222222";
        }
       
        // Remove the ! from the Train button (no other spending button has it)
        t = GetElement('input', "Train!");
        if(t) t.value = "Train";
       
        // Hide the list of techs
        var table = GetTable("Technological Development");
        if(table && table.rows.length > 3)
        {
            table.rows[2].cells[0].innerHTML += "<span id=toggle_techs style=\"float:right;\"><tt>-</tt></span>";
            table.rows[2].addEventListener('click', TrainPHP_OnToggleTechs, false);
            table.rows[2].style.cursor = 'pointer';
     
            // By default, hide techs
            TrainPHP_OnToggleTechs();
        }
       
        var x = GetText("upgrade_tech", "(x ", " ");
        GM_setValue("GO_currentTech", x ? x : "1.0");
       
        // Get the required exp for the next tech
        var t = GetElement('input', "Research!");
        if(t)
        {
            var exp = GetTextIn(t.value.toString(), "(", " ");
            if(!exp) exp = "1000000000";
           
            GM_setValue("GO_nextTechExp", parseInt(exp.replace(/,/g, ""), 10));
        }
     
    }
     
    function MercsPHP()
    {
     
        // Do not add stuff if not eligible
        if(GM_getValue("GO_Eligible", 0) == 0)
        {
            return;
        }
     
        GetSoldiers();
        GetAvailableMercs();
       
        // Put helper buttons for training
        AddSoldierButton("Attack Specialist", "assign_attack", MercsPHP_OnAssignMerc);
        AddSoldierButton("Defense Specialist", "assign_defense", MercsPHP_OnAssignMerc);
        AddSoldierButton("Untrained", "assign_untrained", MercsPHP_OnAssignMerc);
       
        document.getElementsByName('mercs[attack]')[0].addEventListener('blur', MercsPHP_UpdateMercButtons, false);
        document.getElementsByName('mercs[defend]')[0].addEventListener('blur', MercsPHP_UpdateMercButtons, false);
        document.getElementsByName('mercs[general]')[0].addEventListener('blur', MercsPHP_UpdateMercButtons, false);
     
        MercsPHP_UpdateMercButtons();
       
        // Fix the mercs table spannings and shorten some headers
        var t = GetTag('th', "Buy Mercenaries");
        if(t) t.attributes.getNamedItem('colspan').value++;
     
        t = GetTag('th', "Quantity to Buy");
        if(t) t.setAttribute('colspan', 2);
       
        t = GetElement('input', "Buy");
        if(t) t.parentNode.attributes.getNamedItem('colspan').value++;
       
        t =  GetTag('th', "Quantity Available");
        if(t) t.innerHTML = "Available";
       
        t = GetTag('th', "Quantity to Buy");
        if(t) t.innerHTML = "Quantity";
       
        // Fix a design bug (main contaioner table is not 100% width in mercs.php)
        GetTag('span', "-").parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.setAttribute('width', '100%');
       
        // Add a clean button next to the buy button
        var input = GetElement('input', "Buy");
        if(input)
        {
            input.parentNode.innerHTML += "<button style=\"margin-left: 6px\" id=clear_mercs onClick=\"return false;\">Clear</button>"
                                       +  "<span id=mercsWarningSpan style=\"float:right; width:20ex; margin-left:-20ex;\"></span>";
            document.getElementById('clear_mercs').addEventListener('click', MercsPHP_ClearMercs, false);
           
            input = GetElement('input', "Buy");
            input.parentNode.style.backgroundColor = "#222222";
        }
    }
     
    function StatsPHP()
    {
        // Get the statid
        var statid = GetTextIn(url + '&', "stats.php?id=", "&");
       
        if(!IsNumeric(statid))
        {
            CustomPage(statid);
            return;
        }
       
        // Show invalid user's previous data if available
        if(document.body.innerHTML.indexOf("Invalid User ID") > 0)
        {
            GM_xmlhttpRequest(
            {
                method: "GET",
                url: GO_server + "backbone.php?code=inactive&whoami=" + GO_username + "&password=" + GO_password + "&whoamid=" + GO_statid + "&userid=" + statid,
                onload: function(r)
                {
					if(r.status == 200)
                    {
                        if(r.responseText.indexOf("Access Denied") >= 0)
						{
						alert(r.responseText.indexOf("Access Denied"));
                                                    GM_setValue("GO_Eligible", 0);
                            return;
                        }
                        if(r.responseText.length > 0)
                        {
                            var td = GetContentTD();
						
                                                    if(td)
                                                    {
														
                                                            td.innerHTML = td.innerHTML.replace("<h3>Error</h3>\nInvalid User ID", r.responseText);
                                                    }
					
                        }
                    }
                }
            });
     
            return;
        }
           
            // log attack type
        document.addEventListener('click', function(event)
        {
                    if(event.target.value)
                    {
                            if( event.target.value.length > 5)
                            {
                                    var value = String(event.target.value);
                                   
                                    var p = value.indexOf("Raid")
                                    if(p)
                                    {
                                            document.cookie = "attackType=notRaid;";
                                    }else{
                                            document.cookie = "attackType=raid;";
                                    }                
                            }
                    }
        }, true);
       
       
        // Gather user specific information
        var username = GetText(">Name:<", "<td>", "<").trim();
     
        var commander = GetText(">Commander:<", "<td>", "</td>");
        if(commander != "None") commander = GetText(">Commander:<", "\">", "<");
       
        var supreme = GetText(">Supreme Commander", "\">", "<");
        if(supreme == "") supreme = "None";
       
        var chain = GetText(">Chain Name:", "<td>", "</td>");
        if(chain == "") chain = "None";
       
        var alliance = GetText(">Alliances:", "<b>", "alliances.php?id=", ">", "<");
        if(alliance == "") alliance = "None";
       
        var treasury = GetText(">Treasury:", "<td>", "</td>").replace(/,/g, "");
        if(treasury == "") treasury = "???";
       
        var morale = GetText(">Army Morale:", "<td>", "</td>").replace(/,/g, "");
       
        var race = GetText(">Race:", "<td>", "</td>");
       
        var rank = GetText("b>Rank:", "<td>", "</td>").replace(/,/g, "");
       
        var tff = GetText(">Army Size:", "<td>", "</td>").replace(/,/g, "");
       
       
        // Add place holders for additional data, such as treasury, tbg, ...
        var userTable = GetTable("User Stats");
        if(!userTable) return;
       
        var treasuryRow = 0; // this should be here to check if we added a row for treasury or not
       
        for(i = 0; i < userTable.rows.length; i++)
        {
            if(userTable.rows[i].innerHTML.indexOf("Army Morale") >= 0)
            {
                if(treasury == "???")
                {
                    treasuryRow = userTable.insertRow(i+1);
     
                    treasuryRow.insertCell(0).innerHTML = "<b>Treasury:</b>";
                    treasuryRow.insertCell(1).innerHTML = "Loading...";
                }
               
                var tbgRow = userTable.insertRow(i + 2);
                tbgRow.insertCell(0).innerHTML = "<b>TBG (1h):</b>";
                tbgRow.insertCell(1).innerHTML = AddCommas( Math.floor(tff * 60 * (race == "Dwarves" ? 1.15 : (race == "Humans" ? 1.3 : 1))).toString() );
               
                break;
            }
        }
       
        // Add place holders for user's stats
        var th = GetTag('th', "Recent Battles");
        if(!th) th = GetTag('th', "Recent Intelligence");
        if(!th) th = GetTag('th', "Officers");
        if(!th) return;
       
        var statsTableHtml = "<table width=100% class=table_lines cellspacing=0 cellpadding=6>"
                           + "<tr><th colspan=3>" + username + "'s Stats<button style='" + (window.innerWidth < 1280 ? "height:2em;margin-top:0.25em;" : "") + "width:10ex;margin-left:-10ex;float:right' id=bReload>Reload</button>" + (window.innerWidth < 1280 ? "<br />" : "") + "<span id=sTargetStats></span></th></tr>"
                           + "<tr><td width=30%><b>Strike Action</b></td><td align=right id=DB_sa width=40%>Loading...</td><td align=right id=DB_saTime>&nbsp;</td></tr>"
                           + "<tr><td><b>Defensive Action</b></td><td align=right id=DB_da>Loading...</td><td align=right id=DB_daTime>&nbsp;</td></tr>"
                           + "<tr><td><b>Spy Rating</b></td><td align=right id=DB_spy>Loading...</td><td align=right id=DB_spyTime>&nbsp;</td></tr>"
                           + "<tr><td><b>Sentry Rating</b></td><td align=right id=DB_sentry>Loading...</td><td align=right id=DB_sentryTime>&nbsp;</td></tr>"
                           + "</table><br /><br />";
       
        var statsPlace = th.parentNode.parentNode.parentNode.parentNode;
        statsPlace.innerHTML = statsTableHtml + statsPlace.innerHTML;
     
        // Show additional information about the target
        // Check if we have this target's details in cache
        var cacheOld = true;
       
        var responseText = GM_getValue("GOcache_stats.php_" + username, "");
        if(responseText.length > 0)
        {
            // Load target's details from cache
            var cacheTime = parseInt(GetTextIn(responseText, "", ":"), 10);
            var elapsed = UnixTimestamp() - cacheTime;
           
            // keep cache for a predefined amount of time
            if(elapsed <= Cache_statsphp_timeout)
            {
                StatsPHP_Fill(responseText, treasuryRow);
               
                cacheOld = false;
               
                var span = document.getElementById("sTargetStats");
                if(span)
                {
                    span.innerHTML = " (Cached " + ago(elapsed) + ")";
                }
            }
        }
       
        if(cacheOld)
        {
            StatsPHP_Request(username, statid, commander, supreme, chain, alliance, race, treasury, morale, rank, tff, treasuryRow);
        }
       
        // Listen the reload button
        document.getElementById('bReload').addEventListener('click', function() { this.style.display='none'; StatsPHP_Request(username, statid, commander, supreme, chain, alliance, race, treasury, morale, rank, tff, treasuryRow); }, false);
       
        // Collapse the recent battles and intelligence
        ExpandCollapseTable("Recent Battles");
        ExpandCollapseTable("Recent Intelligence");
     
        // Remove the ! from make commander button
        var t = GetElement('input', "Make " + username + " my commander!");
        if(t) t.value = "Make " + username + " my commander";
     
        /* Redesign the user table */
        var userTable = GetTag('th', "User Stats").parentNode.parentNode;
       
        // Shorten supreme commander
        if(userTable.rows[3].cells[0].innerHTML.indexOf("Supreme") >= 0)
        {
            userTable.rows[3].cells[0].innerHTML = "<b>Supreme:</b>";
        }
       
        // Merge rank and highest rank rows
        var rowId = GetTableRow(userTable, 0, "Rank:");
        if(rowId >= 0)
        {
            userTable.rows[rowId].cells[1].innerHTML += " &nbsp; ( " + userTable.rows[rowId + 1].cells[1].innerHTML + " )";
            userTable.deleteRow(rowId + 1);
        }
       
        // Merge buddy status and buddy button rows
        var rowId = GetTableRow(userTable, 0, "Buddy");
        if(rowId >= 0)
        {
            var buddyStatus = userTable.rows[rowId].cells[1].innerHTML;
            buddyStatus = buddyStatus.substring(0, buddyStatus.indexOf(">") + 1);
            buddyStatus = buddyStatus.replace(">", ">&nbsp;&nbsp;");
     
            var buddyForm = userTable.rows[rowId + 1].cells[0].innerHTML.replace("Recognize player as", "");
            userTable.rows[rowId].innerHTML = "<td><b>Buddy Status:</b></td><td style='padding-top:20px;'>" + buddyForm.replace("post\">", "post\">" + buddyStatus) + "</td>";
     
            userTable.deleteRow(rowId + 1);
            userTable.deleteRow(rowId - 1); // remove the empty row
        }
       
        // Collapse the alliances except the primary
        var rowId = GetTableRow(userTable, 0, "Alliances");
        if(rowId >= 0)
        {
            var expandedAlliances = userTable.rows[rowId].cells[1].innerHTML;
           
            var alliances = expandedAlliances.split(",");
            var primaryAlliance = 0;
           
            for(i = 0; i < alliances.length; i++)
            {
                if(alliances[i].indexOf("(Primary)") >= 0)
                {
                    primaryAlliance = alliances[i];
                    break;
                }
            }
           
            if(primaryAlliance)
            {
                userTable.rows[rowId].cells[1].innerHTML = primaryAlliance;
               
                if(alliances.length > 1)
                {
                    userTable.rows[rowId].cells[1].innerHTML += ", <a style=\"cursor:pointer;\" id=showAlliances>(+)</a>";
                   
                    document.getElementById('showAlliances').addEventListener('click', function(){ this.parentNode.innerHTML = expandedAlliances; }, false);
                }
            }
        }
    }
     
    function AttackPHP()
    {
     
        // Do not add stuff if not eligible
        if(GM_getValue("GO_Eligible", 0) == 0)
        {
            return;
        }
     
        var doc = document.body.innerHTML;
        if(doc.indexOf("Invalid User ID") > 0) return;
       
        document.addEventListener('click', function(event)
        {
            if(event.target.value)
            {
                if( event.target.value.length > 5)
                {
                    var value = String(event.target.value);
                   
                    var p = value.indexOf("Raid")
                    if(p)
                    {
                        document.cookie = "attackType=notRaid;";
                    }else{
                        document.cookie = "attackType=raid;";
                    }                
                }
            }
        }, true);
       
        // Check for "a turn is taking place"
        if(doc.indexOf("A turn is taking place.") > 0)
        {
            setTimeout("window.location = document.referrer", 1000);
            return;
        }
       
        var username = GetText("Target:", "\">", "<");
        if(username == "") return;
       
        // Fix the width of Target: to display the target's name properly
        var table = GetTable("Attack Mission");
        if(table) table.rows[1].cells[0].width = '50%';
       
        // Add another sab button
        table = GetTable("Sabotage Mission");
        if(table) table.insertRow(1).innerHTML = "<td colspan=2 align=center><input name=spybut0 onclick=\"document.spy.spybut0.value='Sabotaging..'; document.spy.spybut0.disabled=true; document.spy.submit();\" type=submit value=\"Sab!\"></td>";
       
        // Change the original sab button to 'sab' instead of 'send spies'
        document.getElementsByName('spybut')[0].value = "Sab!";
       
        // Target maxed
        if(doc.indexOf("has already suffered heavy losses") >= 0)
        {
            GM_xmlhttpRequest(
            {
                method: "GET",
                url: GO_server + "backbone.php?code=maxed&whoami=" + GO_username + "&whoamid=" + GO_statid + "&password=" + GO_password + "&target=" + username
            });
        }
       
        // Put an additional +1 / +5 button next to the weapon amount in sab form
        document.getElementsByName('numsab')[0].parentNode.innerHTML += "<button style=\"margin-left: 20px;\" onClick=\"document.spy.numsab.value = parseInt(document.spy.numsab.value, 10) + 1; return false;\">+1</button>"
                                                                      + "<button style=\"margin-left: 20px;\" onClick=\"document.spy.numsab.value = parseInt(document.spy.numsab.value, 10) + 5; return false;\">+5</button>";
     
        // Put an additional +1 button next to the number of spies    
        document.getElementsByName('numspies')[0].parentNode.innerHTML += "<button style=\"margin-left: 20px;\" onClick=\"document.spy.numspies.value = parseInt(document.spy.numspies.value, 10) + 1; return false;\">+1</button>";
     
        // Add place holders for user's stats and move your stats above the personnel table
        var th = GetTag('th', "<span ");
        var statsPlace = th.parentNode.parentNode.parentNode.parentNode;
       
        var statsTableHtml = "<table width=100% class=table_lines cellspacing=0 cellpadding=6>"
                           + "<tr><th colspan=3>" + username + "'s Stats<button style='" + (window.innerWidth < 1280 ? "height:2em;margin-top:0.25em;" : "") + "width:10ex;margin-left:-10ex;float:right' id=bReload>Reload</button>" + (window.innerWidth < 1280 ? "<br />" : "") + "<span id=sTargetStats></span></th></tr>"
                           + "<tr><td width=30%><b>Strike Action</b></td><td align=right id=DB_sa width=40%>Loading...</td><td align=right id=DB_saTime>&nbsp;</td></tr>"
                           + "<tr><td><b>Defensive Action</b></td><td align=right id=DB_da>Loading...</td><td align=right id=DB_daTime>&nbsp;</td></tr>"
                           + "<tr><td><b>Spy Rating</b></td><td align=right id=DB_spy>Loading...</td><td align=right id=DB_spyTime>&nbsp;</td></tr>"
                           + "<tr><td><b>Sentry Rating</b></td><td align=right id=DB_sentry>Loading...</td><td align=right id=DB_sentryTime>&nbsp;</td></tr>"
                           + "<tr style='background-color:#111100;'><td><b>Recent Gold</b></td><td align=right id=DB_gold>Loading...</td><td align=right id=DB_goldTime>&nbsp;</td></tr>"
                           + "</table><br /><br />";
                           
        var inventoryTableHtml = "<table width=100% class=table_lines border=0 cellspacing=0 cellpadding=6>"
                               + "<tr><th colspan=4>" + username + "'s Inventory</th></tr>"
                               + "<tr><th class=subh width=30%>Weapon</th><th class=subh colspan=2>Quantity</th><th class=subh width=%20>AAT</th></tr>"
                               + "<tr><td>Blackpowder Missile</td><td align=right id=DB_bpm>Loading...</td><td left=right id=DB_bpmTime>&nbsp;</td><td align=center id=DB_bpmAat>Loading...</td>"
                               + "<tr><td>Chariot</td><td align=right id=DB_ch>Loading...</td><td align=left id=DB_chTime>&nbsp;</td><td align=center id=DB_chAat>Loading...</td>"
                               + "<tr><td>Invisibility Shield</td><td align=right id=DB_is>Loading...</td><td align=left id=DB_isTime>&nbsp;</td><td align=center id=DB_isAat>Loading...</td>"
                               + "<tr><td>Dragonskin</td><td align=right id=DB_ds>Loading...</td><td align=left id=DB_dsTime>&nbsp;</td><td align=center id=DB_dsAat>Loading...</td>"
                               + "<tr><td>Nunchaku</td><td align=right id=DB_nun>Loading...</td><td align=left id=DB_nunTime>&nbsp;</td><td align=center id=DB_nunAat>Loading...</td>"
                               + "<tr><td>Lookout Tower</td><td align=right id=DB_lt>Loading...</td><td align=left id=DB_ltTime>&nbsp;</td><td align=center id=DB_ltAat>Loading...</td>"
                               + "</table>";
       
     
        // Remove the Personnel table, which is useless
        var personnelTableHtml = GetTag('th', "<span").parentNode.parentNode.innerHTML;
        statsPlace.innerHTML = statsPlace.innerHTML.replace(personnelTableHtml, "<br>");
       
        statsPlace.innerHTML = statsTableHtml + inventoryTableHtml + statsPlace.innerHTML;
       
        // Add place holders for the target's inventory and the last sab
        var sabotageTable = GetTag('th', "Sabotage Mission").parentNode.parentNode;
       
        var lastSabRow = sabotageTable.insertRow(sabotageTable.rows.length - 1);
        lastSabRow.insertCell(0).innerHTML = "Last Sab";
        lastSabRow.insertCell(1).innerHTML = "Loading...";
        lastSabRow.cells[0].width = "50%";
       
        // Does the script remembers your sab options? If not, last sab will be taken as the option
        var sabRemember = false;
       
            //baigo's fix.
            if(GM_getValue("GO_sab_cnt_" + username, 11)>=1)
            {
                    var sabRemember = true;
            }
           
        // Show additional information about the target
        // Check if we have this target's details in cache
        var cacheOld = true;
       
        var responseText = GM_getValue("GOcache_attack.php_" + username, "");
        if(responseText.length > 0)
        {
            // Load target's details from cache
            var cacheTime = parseInt(GetTextIn(responseText, "", ":"), 10);
            var elapsed = UnixTimestamp() - cacheTime;
           
            // keep cache for a predefined amount of time
            if(elapsed <= Cache_attackphp_timeout)
            {
                AttackPHP_Fill(responseText, lastSabRow, sabRemember);
               
                cacheOld = false;
               
                var span = document.getElementById("sTargetStats");
                if(span)
                {
                    span.innerHTML = " (Cached " + ago(elapsed) + ")";
                }
            }
        }
       
        if(cacheOld)
        {
            AttackPHP_Request(username, lastSabRow, sabRemember);
        }
       
        // Listen the reload button
        document.getElementById('bReload').addEventListener('click', function() { this.style.display='none'; AttackPHP_Request(username, lastSabRow, sabRemember); }, false);
           
        // Remember sabotage settings for this target
        document.getElementsByTagName('select')[0].value = GM_getValue("GO_sab_wep_" + username, 74);
        document.getElementsByName('numsab')[0].value = GM_getValue("GO_sab_cnt_" + username, 11);
        document.getElementsByName('numspies')[0].value = GM_getValue("GO_sab_spies_" + username, 1);
        document.getElementsByTagName('select')[1].value = GM_getValue("GO_sab_turns_" + username, 5);
       
        sabRemember = (GM_getValue("GO_sab_wep_" + username, -1) != -1);
       
        // Lower aat if cannot get through
        if(document.body.innerHTML.indexOf("you will never be able to get away") > 0)
        {
            if(document.getElementsByName('numsab')[0].value > 0)
            {
                document.getElementsByName('numsab')[0].value -= 1;
            }
        }
       
        // Listen the sab form
        document.getElementsByTagName('form')[2].addEventListener('submit', function() { AttackPHP_OnSubmitSab(username); }, false);
     
    }
     
    function InteldetailPHP()
    {
     
        // Do not add stuff if not eligible
        if(GM_getValue("GO_Eligible", 0) == 0)
        {
            return;
        }
     
        var doc = document.body.innerHTML;
       
        if(doc.indexOf("Your Chief of Intelligence dispatches") >= 0)   // Sab
        {
            if(doc.indexOf("armory undetected,") >= 0) // Sab got through
            {
                var reportId = url.substring(54, url.length);
                var sabbee = GetText("Your spies successfully enter ", "'s");
                var weapon = GetText("attempt to sabotage", "weapons of type ", ".");
                var amount = GetText("and destroy ", " of the ").replace(/,/g, "");
                if(amount == "") amount = 0;
               
                // Place holder for the logging
                var but = GetElement('input', "Attack / Spy Again");
                but.parentNode.innerHTML = but.parentNode.innerHTML + "<span id=logSab style=\"margin-left: 20px;\">Logging your sab...</span>";
               
                GM_xmlhttpRequest(
                {
                    method: "GET",
                    url: GO_server + "backbone.php?code=logsabs&whoami=" + GO_username + "&whoamid=" + GO_statid + "&password=" + GO_password + "&target=" + sabbee + "&weapon=" + weapon + "&amount=" + amount + "&rid=" + reportId,
                    onload: function(r)
                    {
                        if(r.status == 200)
                        {
                            document.getElementById('logSab').innerHTML = r.responseText;
                        }
                    }
                });
            }
     
        }
        else    // Recon
        {
            if(doc.indexOf("with the information gathered") >= 0)
            {
                // Record recon
                var reportId = url.substring(54, url.length);
                var username = GetText("your spy sneaks into ", "'s camp");
                var sa = GetText(">Strike Action:<", "\">", "<").replace(/,/g, "");
                var da = GetText(">Defensive Action<", "\">", "<").replace(/,/g, "");
                var spy = GetText(">Spy Rating<", "\">", "<").replace(/,/g, "");
                var sentry = GetText(">Sentry Rating<", "\">", "<").replace(/,/g, "");
                var coverts = GetText(">Covert Operatives:<", "\">", "<").replace(/,/g, "");
                var turns = GetText(">Attack Turns:<", "\">", "<").replace(/,/g, "");
                var treasury = GetText(">Treasury<", "\">", "<").replace(/,/g, "").replace(" Gold", "");
                var statid = GetText('name="id" value="', '"');
                var up = GetText(">Unit Production:<", "\">", "<").replace(/,/g, "");
                                                   
                var soldiers = GetText("<td>Soldiers</td>","</tr>").match(/[^><]+?(?=<|$)/g,"");
                var sa_sol = soldiers[1];
                var da_sol = soldiers[3];
                var untrained = soldiers[5];
                           
                            var BPM = "???";
                            var BPM_dmg = "???";
                var IS = "???";
                            var IS_dmg = "???";
                var DS = "???";
                            var DS_dmg = "???";
                var CHR = "???";
                            var CHR_dmg = "???";
                var NUN = "???";
                var LT = "???";
                            var Guard_Dog = "???";
                            var Skeleton_Key = "???";
                            var Grappling_Hook = "???";
                           
                            var numerator = "???";
                            var denominator = "???";
               
                var table = GetTag('th', "Weapons").parentNode.parentNode;
               
                for(i = 2; i < table.rows.length; i++)
                {
                    if(table.rows[i].cells.length < 4) continue;
                   
                    var wepName = table.rows[i].cells[0].innerHTML;
                    var wepType = table.rows[i].cells[1].innerHTML;
                    var wepCount = table.rows[i].cells[2].innerHTML.replace(/,/g, "");
                                   
                    var wepStrength = table.rows[i].cells[3].innerHTML.replace(/,/g, "");
                                    wepStrength = wepStrength.split('/');
                                    var numerator = wepStrength[0].replace(/,/g, "");
                                    var denominator = wepStrength[1].replace(/,/g, "");
                                   
                                    if (wepCount == "???" && numerator == "???" && denominator == "???") continue;
                                   
                    if(wepName == "Blackpowder Missile")
                    {
                        BPM = wepCount;
                                            BPM_dmg = numerator;
                    }
                    else if(wepName == "Invisibility Shield")
                    {
                        IS = wepCount;
                                            IS_dmg = numerator;
                    }
                    else if(wepName == "Dragonskin")
                    {
                        DS = wepCount;
                                            DS_dmg = numerator;
                    }
                    else if(wepName == "Chariot")
                    {
                        CHR = wepCount;
                                            CHR_dmg = numerator;
                    }
                    else if(wepName == "Nunchaku")
                    {
                        NUN = wepCount;
                    }
                    else if(wepName == "Lookout Tower")
                    {
                        LT = wepCount;
                    }
                                    else if(wepName == "Guard Dog")
                                    {
                                            Guard_Dog = wepCount;
                                    }
                                    else if(wepName == "Skeleton Key")
                                    {
                                            Skeleton_Key = wepCount;
                                    }
                                    else if(wepName == "Grappling Hook")
                                    {
                                            Grappling_Hook = wepCount;
                                    }
     
                    if((wepType == "Attack") && (numerator == "1000" || denominator == "1000"))
                    {
                        BPM = wepCount;
                                            BPM_dmg = numerator;
                    }
                    else if((wepType == "Attack") && (numerator == "600" || denominator == "600"))
                    {
                        CHR = wepCount;
                                            CHR_dmg = numerator;
                    }
                    if((wepType == "Defend") && (numerator == "1000" || denominator == "1000"))
                    {
                        IS = wepCount;
                                            IS_dmg = numerator;
                    }
                    if((wepType == "Defend") && (numerator == "256" || denominator == "256"))
                    {
                        DS = wepCount;
                                            DS_dmg = numerator;
                    }
                    if((wepType == "Spy") && (numerator == "1000" || denominator == "1000"))
                    {
                        NUN = wepCount;
                    }
                                    if((wepType == "Spy") && (numerator == "600" || denominator == "600"))
                                    {
                                            Skeleton_Key = wepCount;
                                    }
                                    if((wepType == "Spy") && (numerator == "250" || denominator == "250"))
                                    {
                                            Grappling_Hook = wepCount;
                                    }
                    if((wepType == "Sentry") && (numerator == "1000" || denominator == "1000"))
                    {
                        LT = wepCount;
                    }
                                    if((wepType == "Sentry") && (numerator == "250" || denominator == "250"))
                                    {
                                            Guard_Dog = wepCount;
                                    }
                }
     
                            var weapons = "[bpm]" + BPM + "[/bpm][is]" + IS + "[/is][is_dmg]" + IS_dmg + "[/is_dmg][nun]" + NUN + "[/nun][lt]" + LT + "[/lt][ch]" + CHR + "[/ch][ds]" + DS + "[/ds][ds_dmg]" + DS_dmg + "[/ds_dmg][skeleton]" + Skeleton_Key + "[/skeleton][hooks]" + Grappling_Hook + "[/hooks][dogs]" + Guard_Dog + "[/dogs]";
                           
                // Place holder for the logging
                var th = GetTag('th', "Treasury");
                th.parentNode.parentNode.innerHTML += "<tr><td></td></tr><tr><td style='padding-left: 4ex; border-bottom:0'><span id=logRecon style=\"margin-left: 20px;\">Logging your recon...</span></td></tr>";
               
                GM_xmlhttpRequest(
                {
                    method: "GET",
                    url: GO_server + "backbone.php?code=reconpage&whoami=" + GO_username + "&password=" + GO_password + "&whoamid=" + GO_statid + "&username=" + username + "&sa=" + sa + "&da=" + da + "&spy=" + spy  + "&sentry=" + sentry + "&userid=" + statid + "&gold=" + treasury + "&coverts=" + coverts + "&turns=" + turns + "&weapons=" + weapons + "&untrained=" + untrained + "&da_sol=" + da_sol + "&up=" + up +  "&rid=" + reportId,
                    onload: function(r)
                    {
                        if(r.status == 200)
                        {
                            document.getElementById('logRecon').innerHTML = r.responseText;
                        }
                    }
                });
            }
            else
            {
                // Go back
                //document.getElementsByTagName('form')[0].submit();
            }
        }
    }
     
    function DetailPHP()
    {
     
        // Do not add stuff if not eligible
        if(GM_getValue("GO_Eligible", 0) == 0)
        {
            return;
        }
       
        if(url.indexOf("suspense=1") >= 0)
        {
            // Remove suspense
            var th = GetTag('th', "Battle Report");
            var content = th.parentNode.parentNode.parentNode.parentNode;
           
            var scriptSource = GetTextIn(content.innerHTML, "<script", "</script>");
     
            if(scriptSource != "")
            {
                var content2 = content.innerHTML.replace(scriptSource, ">");
               
                content2 = content2.replace("table_lines battle", "table_lines");
                content2 = content2.replace("display: none", "");
     
                content.innerHTML = content2;
            }
        }
       
        // Scroll down to the useful part
        var but = GetElement('input', "Attack / Spy Again");
        but.scrollIntoView();
       
        // Log the attack
        var attackType = GetText("your soldiers are trained ", " specialists");
        if(attackType != "attack")
        {
            // Log only attacks from our players ;)
            return;
        }
       
        var reportId = url.indexOf("suspense") >= 0 ? GetTextIn(url, "_id=", "&suspense") : url.substring(49, url.length);
        var treasury = 0;
        var opponent = GetText("casualties!", "<p>", "'s forces").trim();
        var result = document.body.innerHTML.indexOf("You <font ") > 0 ? "Successful" : "Defended";
       
        if(document.body.innerHTML.indexOf("You stole") >= 0)
        {
            treasury = parseInt( GetText("You stole", ">", "<").replace(/,/g, "") );
        }
       
        var untrained = 0;
       
        if(document.body.innerHTML.indexOf("untrained soldiers with weapons and ") >= 0)
        {
            untrained += parseInt(GetText("The enemy has <b>","</b> untrained soldiers").replace(/,/g,""));
            untrained += parseInt(GetText("untrained soldiers with weapons and <b>","</b> with no weapons").replace(/,/g,""));
        }
       
     
        if(document.body.innerHTML.indexOf(">None</font> of the enemy's ") >= 0)
        {
            if(GetText("None</font> of the enemy's "," untrained soldiers have weapons"))
            {
                untrained += parseInt(GetText("None</font> of the enemy's "," untrained soldiers have weapons").replace(/,/,""));
            }
        }
           
        var elost = 0;
        if(document.body.innerHTML.indexOf("The enemy sustains ") >= 0)
        {
            elost = parseInt(String(FindText(GetText('The enemy sustains','/fon'),">","<")).replace(/,/g, ''));
        }
     
        // Add a place holder for the result of the logging
        var but = GetElement('input', "Attack / Spy Again");
        but.parentNode.innerHTML = but.parentNode.innerHTML += "<span id=\"logAttack\" style=\"margin-left: 20px;\">Logging your attack...</span>";
     
        if ( Get_Cookie("attackType") == "raid" )
        {
            var aType = "raid";
        }else if(treasury > 1)
        {
            var aType = "succesful";
        }else{
            var aType = "defended";
        }
       
     
        document.cookie = "attackType=notRaid;";
     
        GM_xmlhttpRequest(
        {
            method: "GET",
            url: GO_server + "backbone.php?code=logattacks&whoami=" + GO_username + "&password=" + GO_password + "&whoamid=" + GO_statid + "&target=" + opponent + "&type=" + result + "&gold=" + treasury + "&untrained=" + untrained + "&rid=" + reportId + "&type=" + aType + "&elost=" + elost,
            onload: function(r)
            {
                if(r.status == 200)
                {
                    document.getElementById('logAttack').innerHTML = r.responseText;
                }
            }
        });
     
    }
     
    function BattlefieldPHP()
    {
     
        // Do not add stuff if not eligible
        if(GM_getValue("GO_Eligible", 0) == 0)
        {
            return;
        }
     
        // Disable ajax navigation on koc
        GetContentTD().innerHTML = GetContentTD().innerHTML;
     
        // Find the bf table    
        var tables = document.getElementsByClassName("table_lines battlefield");
        if(tables.length == 0) return;
       
        bfTable = tables[0];
     
        // Add next and back buttons at top
        if(bfTable.rows.length > 11)
        {
            bfTable.insertRow(1).innerHTML = bfTable.rows[bfTable.rows.length - 1].innerHTML;
            bfTable.rows[1].style.backgroundColor = "#222222";
        }
        bfTable.rows[bfTable.rows.length - 1].style.backgroundColor = "#222222";
       
        // Dont let the alliance column dominate
        bfTable.rows[0].cells[1].width = "15%";
       
        // Log bf gold
        var logList = "";
       
        for(var i = 0; i < bfTable.rows.length; i++)
        {
            if(bfTable.rows[i].cells.length != 7) continue;
           
            var usernameInner = bfTable.rows[i].cells[2].innerHTML;
            var username = GetTextIn(usernameInner, ">", "<");
            var statid = GetTextIn(usernameInner, "id=", "\"");
           
            var tff = bfTable.rows[i].cells[3].innerHTML.replace(/,/g, "");
            var treasury = bfTable.rows[i].cells[5].innerHTML.replace(/,/g, "").replace(" Gold", "");
            var rank = bfTable.rows[i].cells[6].innerHTML.replace(/,/g, "");
           
            logList += "#username=" + username + "*gold=" + treasury + "*tff=" + tff + "*userid=" + statid + "*rank=" + rank;
           
            // Also make username links open in new tab
            bfTable.rows[i].cells[2].innerHTML = bfTable.rows[i].cells[2].innerHTML.replace("href=", "target=_blank href=");
        }
       
        var statDiv = document.createElement('div');
        statDiv.setAttribute('id', "statDiv");
        statDiv.setAttribute('style', "text-align:center; position:fixed; right:10px; bottom:10px; width:15ex; border:1px solid gray; background-color:black; color:white; font-size:10pt;");
        statDiv.innerHTML = "Loading...";
        document.body.appendChild(statDiv);
       
        GM_xmlhttpRequest(
        {
            method: "POST",
            url: GO_server + "backbone.php",
            headers: { 'Content-type' : 'application/x-www-form-urlencoded' },
            data: encodeURI("code=logbattlefield&whoami=" + GO_username + "&password=" + GO_password + "&whoamid=" + GO_statid + "&fill=" + GM_getValue("GO_fillBattlefield", 1) + "&list=" + logList),
            onload: function(r)
            {
                if(r.status != 200) return;
               
                if(GM_getValue("GO_fillBattlefield", 1) != 1) return;
               
                document.getElementById('statDiv').innerHTML = "Loaded!";
     
                for(var i = 0; i < bfTable.rows.length; i++)
                {
                    if(bfTable.rows[i].cells.length != 7) continue;
                   
                    var username = GetTextIn(bfTable.rows[i].cells[2].innerHTML, ">", "<");
                    var data = GetTextIn(r.responseText, "[" + username + "]", "[/" + username + "]");
                    if(data == "") continue;
                   
                    if(bfTable.rows[i].cells[5].innerHTML == "??? Gold")
                    {
                        bfTable.rows[i].cells[5].innerHTML =  GetTextIn(data, "[aGOLD]", "[/aGOLD]") + " &nbsp <span style='color:yellow'>" + GetTextIn(data, "[GOLD]", "[/GOLD]") + "</span> Gold";
                    }
                   
                    var sa = GetTextIn(data, "[SA]", "[/SA]");
                    var da = GetTextIn(data, "[DA]", "[/DA]");
                    var spy = GetTextIn(data, "[SPY]", "[/SPY]");
                    var sentry = GetTextIn(data, "[SENTRY]", "[/SENTRY]");
                   
                    var saTime = GetTextIn(data, "[aSA]", "[/aSA]");
                    var daTime = GetTextIn(data, "[aDA]", "[/aDA]");
                    var spyTime = GetTextIn(data, "[aSPY]", "[/aSPY]");
                    var sentryTime = GetTextIn(data, "[aSENTRY]", "[/aSENTRY]");
                   
                    var player = [username, sa, saTime, da, daTime, spy, spyTime, sentry, sentryTime];
                    bfPlayers[i] = player;
                   
                    bfTable.rows[i].addEventListener('mouseover', BattlefieldPHP_OnShowStat, true);
                    bfTable.rows[i].addEventListener('mouseout', function(){ document.getElementById('statDiv').style.display = 'none'; }, true);
                }
            }
        });
       
        // Add an option to fill the battlefield
        bfTable.rows[0].cells[0].innerHTML = "<input type=checkbox id=FillBattlefield " + (GM_getValue("GO_fillBattlefield", 1) == 1 ? "checked" : "") + "><label for=FillBattlefield>Fill</label>";
        document.getElementById('FillBattlefield').addEventListener('click', function(){ GM_setValue("GO_fillBattlefield", this.checked ? 1 : 0); window.location = window.location; }, false);
       
        if(GM_getValue("GO_fillBattlefield", 1) != 1)
        {
            statDiv.innerHTML = "Logged!";
        }
       
        // Add an option to sort gold
        bfTable.rows[0].cells[4].innerHTML = "<input type=checkbox style='verticle-align:middle' id=SortTreasury " + (GM_getValue("GO_sortTreasury", 1) == 1 ? "checked" : "") + "><label for=SortTreasury>Sort Treasury</label>";
        document.getElementById('SortTreasury').addEventListener('click', function(){ GM_setValue("GO_sortTreasury", this.checked ? 1 : 0); window.location = window.location; }, false);
       
        if(GM_getValue("GO_sortTreasury", 1) == 1)
        {
            var bf_gold = [];
            var bf_ids = [];
            var bf_rank = [];
            var bf_ids0 = [];   //unsorted original row ids
            var bf_html = [];
       
            // Sort the treasury
            for(var i = 0; i < bfTable.rows.length; i++)
            {
                if(bfTable.rows[i].cells.length < 7)
                {
                    continue;
                }
               
                // remove the user's own row bg color
                bfTable.rows[i].setAttribute('bgColor', null);
               
                var gold_i = parseInt( bfTable.rows[i].cells[5].innerHTML.replace(/,/g, "").replace(" Gold", ""), 10 );
               
                if(isNaN(gold_i))
                {
                    gold_i = -1;
                }
               
                bf_gold.push(gold_i);
                bf_ids.push(i);
                bf_ids0.push(i);
                bf_html[i] = bfTable.rows[i].innerHTML.toString();
                bf_rank.push(parseInt(bfTable.rows[i].cells[6].innerHTML.replace(/,/g, "")));
            }
           
            // actual sorting is on integers
            for(var i = 0; i < bf_gold.length; i++)
            {
                for(var j = i + 1; j < bf_gold.length; j++)
                {
                    var swap = 0;
                   
                    if(bf_gold[j] > bf_gold[i])
                    {
                        swap = 1;
                    }
                    else if(bf_rank[j] < bf_rank[i])
                    {
                        swap = 1;
                    }
     
                    if(swap)
                    {
                        var tmp = bf_gold[i];
                        bf_gold[i] = bf_gold[j];
                        bf_gold[j] = tmp;
                       
                        tmp = bf_ids[i];
                        bf_ids[i] = bf_ids[j];
                        bf_ids[j] = tmp;
                       
                        tmp = bf_rank[i];
                        bf_rank[i] = bf_rank[j];
                        bf_rank[j] = tmp;
                    }
                }
            }
           
            // replace the rows using the sorted row ids
            for(var i = 0; i < bf_gold.length; i++)
            {
                bfTable.rows[bf_ids0[i]].innerHTML = bf_html[bf_ids[i]];
            }
        }
    }
     
    function BattlefieldPHP_OnShowStat()
    {
        var username = GetTextIn(this.cells[2].innerHTML, ">", "<");
       
        var idx = -1;
       
        for(var i = 0; i < bfPlayers.length; i++)
        {
            if(bfPlayers[i] && bfPlayers[i][0] == username)
            {
                idx = i;
                break;
            }
        }
       
        if(idx < 0) return;
       
        var sa = bfPlayers[idx][1];
        var da = bfPlayers[idx][3];
        var spy = bfPlayers[idx][5];
        var sentry = bfPlayers[idx][7];
       
        var saTime = bfPlayers[idx][2];
        var daTime = bfPlayers[idx][4];
        var spyTime = bfPlayers[idx][6];
        var sentryTime = bfPlayers[idx][8];
       
        var statDiv = document.getElementById('statDiv');
     
        statDiv.innerHTML = "<table width=100% class=table_lines cellspacing=0 cellpadding=6>"
                          + "<tr><th colspan=3>" + username + "'s Stats</th></tr>"
                          + "<tr><td><b>Attack</b></td><td align=right id=DB_sa>" + sa + "</td><td align=right id=DB_saTime>" + saTime + "</td></tr>"
                          + "<tr><td><b>Defense</b></td><td align=right id=DB_da>" + da + "</td><td align=right id=DB_daTime>" + daTime + "</td></tr>"
                          + "<tr><td><b>Spy</b></td><td align=right id=DB_spy>" + spy + "</td><td align=right id=DB_spyTime>" + spyTime + "</td></tr>"
                          + "<tr><td><b>Sentry</b></td><td align=right id=DB_sentry>" + sentry + "</td><td align=right id=DB_sentryTime>" + sentryTime + "</td></tr>"
                          + "</table>";
                         
        statDiv.style.width = "60ex";
        statDiv.style.display = '';
    }
     
    /*****************************************************************************/
    /********************************* FUNCTIONS *********************************/
    /*****************************************************************************/
     
    function AddCommas(val)
    {
        var val2 = "";
       
        for(var i = val.length - 1, j = 1; i >= 0; i--, j++)
        {
            val2 += val[i];
           
            if(j % 3 == 0 && i)
            {
                val2 += ",";
            }
        }
       
        var val3 = "";
       
        for(var i = val2.length - 1; i >= 0; i--)
        {
            val3 += val2[i];
        }
       
        return val3;
    }
     
    //first n-1 args are 'begin', last one is end, should send at least 2 args
    function GetText()
    {
        var doc = document.body.innerHTML;
       
        var pos = 0;
       
        for(z = 0; z < (arguments.length - 1); z++)
        {
            pos = doc.indexOf(arguments[z], pos);
            if(pos < 0) return "";
           
            pos += arguments[z].length;
        }
       
        var pos2 = doc.indexOf(arguments[arguments.length - 1], pos);
        if(pos2 < 0) return "";
       
        return doc.substring(pos, pos2);
    }
     
    //the very first argumant is the text to search in, the rest is the same as GeText
    function GetTextIn()
    {
        var pos = 0;
     
        for(var i = 1; i < (arguments.length - 1); i++)
        {
            pos = arguments[0].indexOf(arguments[i], pos);
            if(pos < 0) return "";
           
            pos += arguments[i].length;
        }
       
        var pos2 = arguments[0].indexOf(arguments[arguments.length - 1], pos);
        if(pos2 < 0) return "";
       
        return arguments[0].substring(pos, pos2);
    }
     
    function GetTag(tag, inner)
    {
        var tagList = document.getElementsByTagName(tag);
       
        for(z = 0; z < tagList.length; z++)
        {
            if(tagList[z].innerHTML.indexOf(inner) == 0)
            {
                return tagList[z];
            }
        }
       
        return 0;
    }
     
    function GetTag2(tag, inner)
    {
        var tagList = document.getElementsByTagName(tag);
       
        for(z = 0; z < tagList.length; z++)
        {
            if(tagList[z].innerHTML.indexOf(inner) >= 0)
            {
                return tagList[z];
            }
        }
       
        return 0;
    }
     
    function GetElement(elem, val)
    {
        var elemList = document.getElementsByTagName(elem);
       
        for(var i = 0; i < elemList.length; i++)
        {
            if(elemList[i].value.toString().indexOf(val) == 0)
            {
                return elemList[i];
            }
        }
       
        return 0;
    }
     
    function GetTable(thInner)
    {
        var th = GetTag('th', thInner);
        if(!th) return 0;
       
        return th.parentNode.parentNode;
    }
     
    // returns 0-based index
    function GetTableRow(table, cellId, inner)
    {
        for(var i = 0; i < table.rows.length; i++)
        {
            if(table.rows[i].cells[cellId].innerHTML.indexOf(inner) >= 0)
            {
                return i;
            }
        }
       
        return -1;
    }
     
    function GetContentTD()
    {
        var tables = document.getElementsByClassName("content");
        if(tables.length == 0) return 0;
       
        return tables[0];
    }
     
    // Convert ms to ... ago
    function PrintableTime(elapsedMs)
    {
        var secs = elapsedMs / 1000;
       
        var months = parseInt( Math.floor(secs / 2592000) );
        secs -= months * 2592000;
       
        var days = parseInt( Math.floor(secs / 86400) );
        secs -= days * 86400;
       
        var hours = parseInt( Math.floor(secs / 3600) );
        secs -= hours * 3600;
       
        var minutes = parseInt( Math.floor(secs / 60) );
        secs -= minutes * 3600;
       
        secs = parseInt( Math.floor(secs) );
       
        var str = "";
       
        if(months > 0) str += (months + " month" + (months > 1 ? "s " : " "));
        if(days > 0) str += (days + " day" + (days > 1 ? "s " : " "));
        if(hours > 0) str += (hours + " hour" + (hours > 1 ? "s " : " "));
        if(minutes > 0) str += (minutes + " minute" + (minutes > 1 ? "s " : " "));
        if(secs > 0) str += (secs + " second" + (secs > 1 ? "s " : " "));
       
        return str.trim();
    }
     
    function GetGold()
    {
        var goldText = GetText("Gold:", ">", "<");
        if(goldText == "") return 0;
       
        return parseInt( goldText.trim().replace(/,/g, "").replace('M', '000000') );
    }
     
    function GetSoldier(type)
    {
        var soldierText = GetText(type, "right\">", "<");
        if(soldierText == "") return 0;
     
        return parseInt( soldierText.replace(/,/g, "") );
    }
     
    function GetSoldiers()
    {
        var tas = GetSoldier("Trained Attack Soldiers");
        var tam = GetSoldier("Trained Attack Mercenaries");
        var tds = GetSoldier("Trained Defense Soldiers");
        var tdm = GetSoldier("Trained Defense Mercenaries");
        var us  = GetSoldier("Untrained Soldiers");
        var um  = GetSoldier("Untrained Mercenaries");
        var spy = GetSoldier("Spies");
        var sentry = GetSoldier("Sentries");
        var tff = GetSoldier("Total Fighting Force");
       
        soldiers[0] = tas;
        soldiers[1] = tam;
        soldiers[2] = tds;
        soldiers[3] = tdm;
        soldiers[4] = us;
        soldiers[5] = um;
        soldiers[6] = spy;
        soldiers[7] = sentry;
        soldiers[8] = tff;
    }
     
    function GetAvailableMerc(type)
    {
        var mercText = GetText('>' + type + '<', "right\">", "right\">", "<");
        if(mercText == "None" || mercText == "") return 0;
       
        return parseInt( mercText.replace(/,/g, "") );
    }
     
    function GetAvailableMercs()
    {
        var am = GetAvailableMerc("Attack Specialist");
        var dm = GetAvailableMerc("Defense Specialist");
        var um = GetAvailableMerc("Untrained");
       
        mercs[0] = am;
        mercs[1] = dm;
        mercs[2] = um;
       
        //return {'am' : am, 'dm' : dm, 'um' : um};
    }
     
    function AddSoldierButton(soldierName, buttonId, callback)
    {
        var td = GetTag('td', soldierName);
     
        if(td)
        {
            td.parentNode.innerHTML += "<td><button id=" + buttonId + " onClick=\"return false;\">0</button></td>";
           
            document.getElementById(buttonId).addEventListener('click', callback, false);
        }
    }
     
    function ExpandCollapseTable(header)
    {
        var th = GetTag2('th', header);
        if(!th) return;
       
        th.innerHTML += "<span id=toggle_" + header.replace(/ /g, "_") + " style=\"float:right\"><tt>-</tt></span>";
        th.addEventListener('click', function(){ OnExpColTable(header); }, false);
        th.style.cursor = "pointer";
       
        // 1: expanded, 0: collapsed
        if(GM_getValue("GO_expcol_" + header.replace(/ /g, "_"), 1) == 0)
        {
            OnExpColTable(header);
        }
    }
     
    function OnExpColTable(header)
    {
        var th = GetTag2('th', header);
        if(!th) return;
       
        var table = th.parentNode.parentNode;
        if(table.rows.length < 2) return;
       
        var disp = (table.rows[1].style.display == "none" ? "" : "none");
       
        for(i = 1; i < table.rows.length; i++)
        {
            table.rows[i].style.display = disp;
        }
       
        document.getElementById('toggle_' + header.replace(/ /g, "_")).innerHTML = "<tt>" + (disp == "none" ? "+" : "-") + "</tt>";
     
        GM_setValue("GO_expcol_" + header.replace(/ /g, "_"), disp == "none" ? 0 : 1);
    }
     
    function AddMenuItems()
    {
        // Do not add menu items on base.php if not eligible
        if(GM_getValue("GO_Eligible", 0) == 0)
        {
            return;
        }
       
        var td0 = GetTag('td', "<img src=\"/images/menubar/age");
        if(!td0) return;
       
        var table = td0.parentNode.parentNode;
       
        var menu_attack_idx = -1;
       
        // Find the attack link on the menu and add "targets" and "farmlist" links there
        for(i = 0; i < table.rows.length; i++)
        {
            if(table.rows[i].cells[0].innerHTML.indexOf("attack.php") > 0)
            {
                menu_attack_idx = i;
               
                table.insertRow(i + 1).insertCell(0).innerHTML =
                    "<a href=\"stats.php?id=targetlist\"><img alt=\"Target List\" src=\"" + GO_server + "images/menubar_targets.gif\"></a>";
               
                table.insertRow(i + 2).insertCell(0).innerHTML =
                    "<a href=\"stats.php?id=farmlist\"><img alt=\"Farm List\" src=\"" + GO_server + "images/menubar_farmlist.gif\"></a>";
                   
                break;
            }
        }
     
        // Insert "Links" link after buddylist link
        for(i = 0; i < table.rows.length; i++)
        {
            if(table.rows[i].cells[0].innerHTML.indexOf("buddylist.php") > 0)
            {
                table.insertRow(i + 1).insertCell(0).innerHTML =
                    "<a href=\"stats.php?id=links\"><img alt=\"Third Party Links\" src=\"" + GO_server + "images/links.gif\"></a>";
               
                break;
            }
        }
     
        // check if there was a war last time    
        var warStatus = GM_getValue("GO_war_status", 0);
        var warLink = GM_getValue("GO_war_link", "");
       
        if(warStatus > 0 && menu_attack_idx >= 0)
        {
            // Add new menu item for the war
            table.insertRow(menu_attack_idx + 1).insertCell(0).innerHTML
                = "<a target=_blank href=\"" + warLink + "\"><img alt=\"War missions!\" src=\"" + GO_server + "images/missions.gif\"></a>";
        }
       
        // Check and update the war status
        var needsCheckWar = false;
       
        var lastCheck = GM_getValue("GO_LastWarCheck_time", "");
        if(lastCheck == "")
        {
            needsCheckWar = true;
        }
        else
        {
            var elapsed = UnixTimestamp() - parseInt(lastCheck, 10);
           
            if(elapsed > Cache_status_timeout)
            {
                needsCheckWar = true;
            }
        }
       
        if(needsCheckWar)
        {
            GM_xmlhttpRequest(
            {
                method: "GET",
                url: GO_server + "missions.php",
                onload: function(r)
                {
                    if(r.status != 200) return;
                   
                    if(r.responseText.indexOf("hide") < 0)
                    {
                        warLink = r.responseText.replace("[NAME]", GO_username);
                       
                        GM_setValue("GO_war_status", 1);
                        GM_setValue("GO_war_link", warLink);
                    }
                    else
                    {
                        // Switch off the war status
                        GM_setValue("GO_war_status", 0);
                        GM_setValue("GO_war_link", "");
                    }
                   
                    GM_setValue("GO_LastWarCheck_time", UnixTimestamp().toString());
                }
            });
        }
    }
     
    function AddBfSearch()
    {
        var links = document.getElementsByTagName('a');
       
        var firefoxLink = 0;
       
        for(var i = 0; i < links.length; i++)
        {
            if(links[i].href.indexOf("spreadfirefox") >= 0)
            {
                firefoxLink = links[i];
                break;
            }
        }
       
        if(firefoxLink)
        {
            firefoxLink.parentNode.innerHTML = "<table border=\"0\" cellpadding=\"6\" cellspacing=\"0\" width=\"100%\"><tr><th>Battlefield</th></tr><tr><td align=\"center\"><input type=text id=bfSearchName style='width:120px;' /></td></tr><tr><td align=\"center\"><button id=bfSearchButton onClick=\"window.location='http://www.kingsofchaos.com/battlefield.php?search=' + document.getElementById('bfSearchName').value;\">Search</button></td></tr>";
        }
    }
     
    function RemoveAdvertisement()
    {
        if(GM_getValue("GO_OptionRemoveAdv", 1) == 0) return;
       
        var iframes = document.getElementsByTagName('iframe');
       
        if(iframes.length == 0) return;
     
        // remove the top adv
        iframes[0].parentNode.innerHTML = "";
       
        if(iframes.length == 2) // after removing the top adv, 2 remains on the armory
        {
            // armory
            for(i = 0; i < 2; i++)
            {
                if(iframes[i].getAttribute("width") == 300) // remove the armory adv
                {
                    iframes[i].parentNode.innerHTML = "";
                    break;
                }
            }
        }
       
        // now only one iframe is left in any case, the vertical ad
        var td = iframes[0].parentNode.parentNode.parentNode.parentNode.parentNode;
        td.innerHTML = "";
        td.width = 0;
    }
     
    function CheckUpdate()
    {
        var needsCheckUpdate = false;
       
        var lastUpdate = GM_getValue("GO_LastUpdateCheck_time", "");
        if(lastUpdate == "")
        {
            needsCheckUpdate = true;
        }
        else
        {
            var elapsed = UnixTimestamp() - parseInt(lastUpdate, 10);
           
            if(elapsed > Cache_status_timeout)
            {
                needsCheckUpdate = true;
            }
        }
       
        if(needsCheckUpdate)
        {
            GM_xmlhttpRequest(
            {
                method: 'GET',
                url: GO_server + "ver.php",
                onload: function(r)
                {
                    var currentver = GetTextIn(r.responseText,'[ver]','[/ver]');
     
                 //   if(currentver.length > 0 && currentver != GO_version)
                 //   {
                 //       alert("You're using an old version of SR's GO!.");
                 //       GM_openInTab(GO_server + '/download/game_over_stats_logger.user.js');
                 //   }
                   
                    GM_setValue("GO_LastUpdateCheck_time", UnixTimestamp().toString());
                }
            });
        }
    }
     
    function CheckExpForNextTech()
    {
        var targetExp = GM_getValue("GO_nextTechExp", -1);
        if(targetExp < 0) return;
       
        var expText = GetText("Experience:", "color", ">", "<");
        if(!expText) return;
       
        var curExp = parseInt( expText.trim().replace(/,/g, ""), 10 );
        if(isNaN(curExp)) return;
       
        if(curExp >= targetExp)
        {
            var tag = GetTag('td', "Experience:");
            if(tag)
            {
                tag.style.color = "#CC0000";
            }
        }
    }
     
    function DetectRunningInstance()
    {
        if(document.getElementById('InstanceDiv'))
        {
            return true;
        }
     
        var instanceDiv = document.createElement('div');
        instanceDiv.style.display = 'none';
        instanceDiv.setAttribute('id', "InstanceDiv");
        document.body.appendChild(instanceDiv);
     
        return false;
    }
     
    function ScrollIntoContent()
    {
        if(GM_getValue("GO_OptionScrollIntoContent", 1) == 0) return;
       
        // on detail php, it scrolls itself
        if(url.indexOf("/detail.php") > 0) return;
       
        // do it
        var td = GetContentTD();
        if(!td) return;
       
        td.scrollIntoView();
    }
     
    function SelfUpdate(sa, da, spy, sentry)
    {
        if(sa && da && spy && sentry)
        {
            document.getElementById('sSelfUpdate').innerHTML = "(Updating...)";
           
            GM_xmlhttpRequest(
            {
                method: "GET",
                url: GO_server + "backbone.php?code=selfupdate&whoami=" + GO_username + "&password=" + GO_password +  "&whoamid="
                   + GO_statid + "&sa=" + sa + "&da=" + da + "&spy=" + spy  + "&sentry=" + sentry,
                onload: function(r)
                {
                    if(r.status == 200)
                    {
                        document.getElementById('sSelfUpdate').innerHTML = "(Updated just now)";
                       
                        GM_setValue("GO_Selfupdate_time", UnixTimestamp().toString());
                    }
                }
            });
        }
    }
     
    function CheckEligibility()
    {
        // check GO password from server and disable GO on anypage except base.php if necessary
        // people out of SR shouldnt be able to use GO for train, mercs, armory pages and such
       
        // this ofcourse excludes base.php where it is checked by default
        if(url.indexOf("/base.php") > 0)
        {
            return;
        }
       
        var needEligCheck = false;
       
        var lastEligCheck = GM_getValue("GO_EligibilityCheck_time", "");
        if(lastEligCheck == "")
        {
            needEligCheck = true;
        }
        else
        {
            var elapsed = UnixTimestamp() - parseInt(lastEligCheck, 10);
           
            if(elapsed > Cache_status_timeout)
            {
                needEligCheck = true;
            }
        }
       
        if(needEligCheck)
        {
            GM_xmlhttpRequest(
            {
                method: "GET",
                url: GO_server + "eligibility.php?whoami=" + GO_username + "&password=" + GO_password + "&userid=" + GO_statid + "&recruitid=" + GO_uniqid,
                onload: function(r)
                {
                    if(r.status != 200)
                    {
                        GM_setValue("GO_Eligible", 0);
                    }
                    else
                    {
                        if(r.responseText.indexOf("granted") >= 0)
                        {
                                                    //alert(r.responseText);
                            GM_setValue("GO_Eligible", 1);
                        }
                        else
                        {
                                                    //alert(r.responseText);
                            GM_setValue("GO_Eligible", 0);
                                                    GM_setValue("GO_EligibilityCheck_time", UnixTimestamp().toString());
                                                    alert("Not eligible to use GO!");
                                                    throw new Error("Not eligible to use GO!");
                        }
                       
                        GM_setValue("GO_EligibilityCheck_time", UnixTimestamp().toString());
                                           
                                            //update script if required.
                                            var currentver = GetTextIn(r.responseText,'[version]','[/version]');
                                           
                                        //    if(currentver.length > 0 && currentver != GO_version)
                                        //    {
                                        //            alert("You're using an old version of SR's GO!.");
                                        //            GM_openInTab(GO_server + '/download/game_over_stats_logger.user.js');
                                        //    }
                                           
                    }
                }
            });
        }
            /*
        else
        {
            if(GM_getValue("GO_Eligible", 0) == 0)
            {
                alert("Not eligible to use GO!");
                throw new Error("Not eligible to use GO!");
            }
        }
            */
    }
     
    /*************************** base.php Functions ******************************/
     
    function BasePHP_OnRegisterGO(username, statid, uniqid, password, email)
    {
        // ask for password
        var ret = password;
        while(true)
        {
            ret = prompt("Hello " + username + "!\nEnter your GO password:", password);
            if(ret == null)
            {
                return;
            }
           
            if(ret.length > 0)
            {
                break;
            }
        };
       
        password = ret;
        GM_setValue("GO_password", password);
        GM_setValue("password", password);
       
        // ask for email
        ret = "";
        while(true)
        {
            ret = prompt("Hello " + username + "!\nFor password recovery, GO needs a valid email.\nEnter an email for your GO account:");
            if(ret == null)
            {
                return;
            }
           
            if(ret.length > 0)
            {
                break;
            }
        }
       
        var email = ret;
       
        GM_xmlhttpRequest(
        {
            method: "GET",
            url: GO_server + "register.php?username=" + username + "&password=" + password + "&userid=" + statid + "&recruitid=" + uniqid + "&email=" + email
        });
       
        alert("Your registration details have been sent to the SR server.\n"
            + "Please wait until an SR administrator activates your GO account.\n");
    }
     
    function BasePHP_OnPutGOPassword(username, password)
    {
        // ask for password
        var ret = password;
        while(true)
        {
            ret = prompt("Hello " + username + "!\nEnter your GO password:", password);
            if(ret == null)
            {
                return;
            }
           
            if(ret.length > 0)
            {
                break;
            }
        };
     
        password = ret;
        GM_setValue("GO_password", password);
        GM_setValue("password", password);
     
        window.location = "http://www.kingsofchaos.com/base.php";
    }
     
    function BasePHP_OnToggleGOOptions()
    {
        if(document.getElementById('dGoOptionsContainer').style.display == '')
        {
            document.getElementById('dGoOptionsContainer').style.display = 'none';
            document.getElementById('dGoOptions').style.display = 'none';
        }
        else
        {
            document.getElementById('dGoOptionsContainer').style.display = '';
            document.getElementById('dGoOptions').style.display = '';
        }
    }
     
    function BasePHP_OnSaveGOOptions()
    {
        GM_setValue("GO_OptionRemoveAdv", document.getElementById('goOptionRemoveAdv').checked == true ? 1 : 0);
        GM_setValue("GO_OptionScrollIntoContent", document.getElementById('goOptionScrollIntoContent').checked == true ? 1 : 0);
        GM_setValue("GO_OptionSpecialEffects", document.getElementById('goOptionSpecialEffects').checked == true ? 1 : 0);
       
        GM_setValue("GO_password", document.getElementById("goOptionPassword").value);
       
        // hide the options
        BasePHP_OnToggleGOOptions();
       
        window.location = "base.php";
    }
     
     
    /*************************** armory.php Functions *****************************/
    function ArmoryPHP_OnClearLostLog()
    {
        var cf = confirm("Are you sure you want to clear the log?");
        if(!cf) return;
       
        for(var i = 0; i < 10; i++)
        {
            GM_setValue("GO_lost_wep_log_" + i, "::");
        }
       
        window.location = "armory.php";
    }
     
    function ArmoryPHP_ReduceBloodEffect()
    {
        var bloodDiv = document.getElementById('bloodDiv');
       
        bloodDiv.style.opacity -= 0.1;
       
        if(bloodDiv.style.opacity > 0)
        {
            setTimeout(ArmoryPHP_ReduceBloodEffect, 100);
        }
        else
        {
            bloodDiv.style.display = 'none';
        }
    }
     
    function ArmoryPHP_UpdateWeaponButtons()
    {
        var totalGoldNeed = 0;
       
        var buyTable = GetTable("Buy Weapons");
       
        for(var i = 2; i < buyTable.rows.length; i++)
        {
            if(buyTable.rows[i].cells.length < 5) continue;
           
            var buybutId = GetTextIn(buyTable.rows[i].cells[3].innerHTML, "name=\"", "\"");
           
            var wepCost = parseInt( buyTable.rows[i].cells[2].innerHTML.replace(/,/g, "") );
           
            var wepCount = parseInt( document.getElementsByName(buybutId)[0].value, 10 );
           
            if(isNaN(wepCount) || wepCount < 0)
            {
                wepCount = 0;
                document.getElementsByName(buybutId)[0].value = 0;
            }
           
            totalGoldNeed += (wepCost * wepCount);
        }
       
        if(totalGoldNeed > gold)
        {
            if(this.name.length > 0)
            {
                this.value = 0;
     
                ArmoryPHP_UpdateWeaponButtons();
               
                return;
            }
        }
       
        // Update the buttons with the left amount and compose the buying note
        var leftGold = gold - totalGoldNeed;
        var buyingNote = [];
       
        for(var i = 2; i < buyTable.rows.length; i++)
        {
            if(buyTable.rows[i].cells.length < 5) continue;
           
            var buybutId = GetTextIn(buyTable.rows[i].cells[3].innerHTML, "name=\"", "\"");
           
            var wepCost = parseInt( buyTable.rows[i].cells[2].innerHTML.replace(/,/g, "") );
           
            var wepCount = parseInt( document.getElementsByName(buybutId)[0].value, 10 );
           
            document.getElementById(buybutId).innerHTML = wepCount + Math.floor( leftGold / wepCost );
           
            // buying note
            var wepName = buyTable.rows[i].cells[0].innerHTML;
           
            if(weaponList.indexOf(wepName) >= 0 && wepCount > 0)
            {
                buyingNote.push(wepCount + " " + wepName + (wepCount > 1 ? "s" : ""));
            }
        }
       
        // Update the buying note
        document.getElementById('BuyingNote').innerHTML = (buyingNote.length == 0 ? "Nothing" : buyingNote.join("<br />"));
    }
     
    function ArmoryPHP_OnClearBuyButtons()
    {
        var buyTable = GetTable("Buy Weapons");
       
        for(var i = 2; i < buyTable.rows.length; i++)
        {
            if(buyTable.rows[i].cells.length < 5) continue;
           
            var buybutId = GetTextIn(buyTable.rows[i].cells[3].innerHTML, "name=\"", "\"");
           
            document.getElementsByName(buybutId)[0].value = 0;
        }
       
        ArmoryPHP_UpdateWeaponButtons();
    }
     
    function ArmoryPHP_OnSellButton()
    {
        var wepId = GetTextIn(this.parentNode.parentNode.innerHTML, "scrapsell[", "]");
     
        var wepBuyBut = document.getElementById("buy_weapon[" + wepId + "]");
        if(!wepBuyBut) return;
       
        var wepName = wepBuyBut.parentNode.parentNode.cells[0].innerHTML;
        if(weaponList.indexOf(wepName) < 0) return;
       
        var wepSellCount = parseInt( document.getElementsByName('scrapsell[' + wepId + ']')[0].value, 10 );
        if(wepSellCount < 0) return;
       
        GM_setValue("GO_armory_" + wepName.replace(/ /g, "_") + "_sold", wepSellCount);
    }
     
    /*************************** stats.php Functions *****************************/
     
    function StatsPHP_Request(target, statid, commander, supreme, chain, alliance, race, treasury, morale, rank, tff, treasuryRow)
    {
        document.getElementById('DB_sa').innerHTML = "Loading...";
        document.getElementById('DB_da').innerHTML = "Loading...";
        document.getElementById('DB_spy').innerHTML = "Loading...";
        document.getElementById('DB_sentry').innerHTML = "Loading...";
       
        document.getElementById('DB_saTime').innerHTML = "Loading...";
        document.getElementById('DB_daTime').innerHTML = "Loading...";
        document.getElementById('DB_spyTime').innerHTML = "Loading...";
        document.getElementById('DB_sentryTime').innerHTML = "Loading...";
       
        if(treasuryRow)
        {
            treasuryRow.cells[1].innerHTML = "Loading...";
        }
       
        document.getElementById("sTargetStats").innerHTML = "";
                   
        // Update the database and get details about this target (fill placeholders)
        GM_xmlhttpRequest(
        {
            method: "GET",
            url: GO_server + "backbone.php?code=statspage&whoami=" + GO_username + "&password=" + GO_password + "&whoamid=" + GO_statid + "&username=" + target + "&userid=" + statid + "&commander=" + commander + "&supremecommander=" + supreme + "&chain=" + chain + "&alliance=" + alliance + "&race=" + race  + "&gold=" + treasury + "&morale=" + morale + "&rank=" + rank + "&tff=" + tff,
            onload: function(r)
            {
                if(r.status == 200)
                {
                    if(r.responseText.indexOf("Access Denied") >= 0)
                    {
                                            GM_setValue("GO_Eligible", 0);
                        return;
                    }
                   
                    StatsPHP_Fill(r.responseText, treasuryRow);
                   
                    GM_setValue("GOcache_stats.php_" + target, UnixTimestamp().toString() + ":" + r.responseText);
                   
                    document.getElementById("sTargetStats").innerHTML = "(Cached just now)";
                }
               
                document.getElementById('bReload').style.display = '';
            }
        });
    }
     
    function StatsPHP_Fill(responseText, treasuryRow)
    {
        document.getElementById('DB_sa').innerHTML = GetTextIn(responseText, "[SA]", "[/SA]");
        document.getElementById('DB_da').innerHTML = GetTextIn(responseText, "[DA]", "[/DA]");
        document.getElementById('DB_spy').innerHTML = GetTextIn(responseText, "[SPY]", "[/SPY]");
        document.getElementById('DB_sentry').innerHTML = GetTextIn(responseText, "[SENTRY]", "[/SENTRY]");
       
        document.getElementById('DB_saTime').innerHTML = GetTextIn(responseText, "[aSA]", "[/aSA]");
        document.getElementById('DB_daTime').innerHTML = GetTextIn(responseText, "[aDA]", "[/aDA]");
        document.getElementById('DB_spyTime').innerHTML = GetTextIn(responseText, "[aSPY]", "[/aSPY]");
        document.getElementById('DB_sentryTime').innerHTML = GetTextIn(responseText, "[aSENTRY]", "[/aSENTRY]");
       
        var DB_gold = GetTextIn(responseText, "[GOLD]", "[/GOLD]");
        var DB_goldTime = GetTextIn(responseText, "[aGOLD]", "[/aGOLD]");
       
        // Update treasury
        if(treasuryRow)
        {
            treasuryRow.cells[1].innerHTML = DB_gold + "<span style=\"margin-left: 20px;\">( " + DB_goldTime + " )</span>";
        }
    }
     
    /*************************** attack.php Functions *****************************/
     
    function AttackPHP_OnSubmitSab(targetname)
    {
        // Remember sabotage settings for this target
        GM_setValue("GO_sab_wep_" + targetname, document.getElementsByTagName('select')[0].value);
        GM_setValue("GO_sab_cnt_" + targetname, document.getElementsByName('numsab')[0].value);
        GM_setValue("GO_sab_spies_" + targetname, document.getElementsByName('numspies')[0].value);
        GM_setValue("GO_sab_turns_" + targetname, document.getElementsByTagName('select')[1].value);
    }
     
    function AttackPHP_Request(target, lastSabRow, sabRemember)
    {
        document.getElementById('DB_sa').innerHTML = "Loading...";
        document.getElementById('DB_da').innerHTML = "Loading...";
        document.getElementById('DB_spy').innerHTML = "Loading...";
        document.getElementById('DB_sentry').innerHTML = "Loading...";
       
        document.getElementById('DB_saTime').innerHTML = "Loading...";
        document.getElementById('DB_daTime').innerHTML = "Loading...";
        document.getElementById('DB_spyTime').innerHTML = "Loading...";
        document.getElementById('DB_sentryTime').innerHTML = "Loading...";
       
        document.getElementById('DB_gold').innerHTML = "Loading...";
        document.getElementById('DB_goldTime').innerHTML = "Loading...";
     
        lastSabRow.cells[0].innerHTML = "Last Sab";
        lastSabRow.cells[1].innerHTML = "Loading...";
       
        document.getElementById('DB_bpm').innerHTML = "Loading...";
        document.getElementById('DB_ch').innerHTML = "Loading...";
        document.getElementById('DB_is').innerHTML = "Loading...";
        document.getElementById('DB_ds').innerHTML = "Loading...";
        document.getElementById('DB_nun').innerHTML = "Loading...";
        document.getElementById('DB_lt').innerHTML = "Loading...";
       
        document.getElementById('DB_bpmTime').innerHTML = "Loading...";
        document.getElementById('DB_chTime').innerHTML = "Loading...";
        document.getElementById('DB_isTime').innerHTML = "Loading...";
        document.getElementById('DB_dsTime').innerHTML = "Loading...";
        document.getElementById('DB_nunTime').innerHTML = "Loading...";
        document.getElementById('DB_ltTime').innerHTML = "Loading...";
       
        document.getElementById('DB_bpmAat').innerHTML = "Loading...";
        document.getElementById('DB_chAat').innerHTML = "Loading...";
        document.getElementById('DB_isAat').innerHTML = "Loading...";
        document.getElementById('DB_dsAat').innerHTML = "Loading...";
        document.getElementById('DB_nunAat').innerHTML = "Loading...";
        document.getElementById('DB_ltAat').innerHTML = "Loading...";
       
        document.getElementById("sTargetStats").innerHTML = "";
       
       
        GM_xmlhttpRequest(
        {
            method: "GET",
            url: GO_server + "backbone.php?code=aat&whoami=" + GO_username + "&password=" + GO_password + "&whoamid=" + GO_statid + "&username=" + target,
            onload: function(r)
            {
                if(r.status == 200)
                {
                    if(r.responseText.indexOf("Access Denied") >= 0)
                    {
                                            GM_setValue("GO_Eligible", 0);
                        return;
                    }
                   
                    AttackPHP_Fill(r.responseText, lastSabRow, sabRemember);
                   
                    GM_setValue("GOcache_attack.php_" + target, UnixTimestamp().toString() + ":" + r.responseText);
                   
                    document.getElementById("sTargetStats").innerHTML = "(Cached just now)";
                }
               
                document.getElementById('bReload').style.display = '';
            }
        });
    }
     
    function AttackPHP_Fill(responseText, lastSabRow, sabRemember)
    {
        document.getElementById('DB_sa').innerHTML = GetTextIn(responseText, "[SA]", "[/SA]");
        document.getElementById('DB_da').innerHTML = GetTextIn(responseText, "[DA]", "[/DA]");
        document.getElementById('DB_spy').innerHTML = GetTextIn(responseText, "[SPY]", "[/SPY]");
        document.getElementById('DB_sentry').innerHTML = GetTextIn(responseText, "[SENTRY]", "[/SENTRY]");
       
        document.getElementById('DB_saTime').innerHTML = GetTextIn(responseText, "[tSA]", "[/tSA]");
        document.getElementById('DB_daTime').innerHTML = GetTextIn(responseText, "[tDA]", "[/tDA]");
        document.getElementById('DB_spyTime').innerHTML = GetTextIn(responseText, "[tSPY]", "[/tSPY]");
        document.getElementById('DB_sentryTime').innerHTML = GetTextIn(responseText, "[tSENTRY]", "[/tSENTRY]");
       
        document.getElementById('DB_gold').innerHTML = GetTextIn(responseText, "[GOLD]", "[/GOLD]");
        document.getElementById('DB_goldTime').innerHTML = GetTextIn(responseText, "[tGOLD]", "[/tGOLD]");
     
        var lastSabber = GetTextIn(responseText, "[uSAB]", "[/uSAB]");
        var lastWep = GetTextIn(responseText, "[bSAB]", "[/bSAB]");
     
        lastSabRow.cells[0].innerHTML += "&nbsp;&nbsp;" + GetTextIn(responseText, "[tSAB]", "[/tSAB]");
        lastSabRow.cells[1].innerHTML = (lastWep == "" ? "Never" : lastWep + "&nbsp;&nbsp;&nbsp;by " + lastSabber);
       
        document.getElementById('DB_bpm').innerHTML = GetTextIn(responseText, "[BPM]", "[/BPM]");
        document.getElementById('DB_ch').innerHTML = GetTextIn(responseText, "[CH]", "[/CH]");
        document.getElementById('DB_is').innerHTML = GetTextIn(responseText, "[IS]", "[/IS]");
        document.getElementById('DB_ds').innerHTML = GetTextIn(responseText, "[DS]", "[/DS]");
        document.getElementById('DB_nun').innerHTML = GetTextIn(responseText, "[NUN]", "[/NUN]");
        document.getElementById('DB_lt').innerHTML = GetTextIn(responseText, "[LT]", "[/LT]");
       
        document.getElementById('DB_bpmTime').innerHTML = GetTextIn(responseText, "[tBPM]", "[/tBPM]");
        document.getElementById('DB_chTime').innerHTML = GetTextIn(responseText, "[tCH]", "[/tCH]");
        document.getElementById('DB_isTime').innerHTML = GetTextIn(responseText, "[tIS]", "[/tIS]");
        document.getElementById('DB_dsTime').innerHTML = GetTextIn(responseText, "[tDS]", "[/tDS]");
        document.getElementById('DB_nunTime').innerHTML = GetTextIn(responseText, "[tNUN]", "[/tNUN]");
        document.getElementById('DB_ltTime').innerHTML = GetTextIn(responseText, "[tLT]", "[/tLT]");
       
        document.getElementById('DB_bpmAat').innerHTML = GetTextIn(responseText, "[bBPM]", "[/bBPM]");
        document.getElementById('DB_chAat').innerHTML = GetTextIn(responseText, "[bCH]", "[/bCH]");
        document.getElementById('DB_isAat').innerHTML = GetTextIn(responseText, "[bIS]", "[/bIS]");
        document.getElementById('DB_dsAat').innerHTML = GetTextIn(responseText, "[bDS]", "[/bDS]");
        document.getElementById('DB_nunAat').innerHTML = GetTextIn(responseText, "[bNUN]", "[/bNUN]");
        document.getElementById('DB_ltAat').innerHTML = GetTextIn(responseText, "[bLT]", "[/bLT]");
       
        // Update button meanings in the inventory table
        var aatButtons = document.getElementsByName("aatButton");
     
        for(i = 0; i < aatButtons.length; i++)
        {
            aatButtons[i].addEventListener('click', function()
            {
                document.getElementsByTagName('select')[0].value = GetText("label=\"" + this.getAttribute("weapon").trim() + "\"", "value=\"", "\"");
                document.getElementsByName('numsab')[0].value = parseInt(this.innerHTML.replace(/,/g, ""));
               
            }, false);
           
            if(aatButtons.length == 7 && i == 0)    // skip the last sab button
                continue;
           
            aatButtons[i].style.width = "80%";
        }
       
        // If the script cannot remember the sab options agains this opponent, take the last sab
        if(!sabRemember)
        {
            if(aatButtons.length == 7)  // if there is a last sab
            {
                aatButtons[0].click();
            }
            else    // if there is no last sab, take LT aat
            {
                aatButtons[5].click();
            }
        }
    }
     
    /*************************** train.php Functions *****************************/
     
    function TrainPHP_OnAssignSoldier()
    {
        switch(this.id)
        {
            case 'assign_attack':
                document.getElementsByName('train[attacker]')[0].value = document.getElementById(this.id).innerHTML;
                break;
           
            case 'assign_defense':
                document.getElementsByName('train[defender]')[0].value = document.getElementById(this.id).innerHTML;
                break;
           
            case 'assign_spy':
                document.getElementsByName('train[spy]')[0].value = document.getElementById(this.id).innerHTML;
                break;
           
            case 'assign_sentry':
                document.getElementsByName('train[sentry]')[0].value = document.getElementById(this.id).innerHTML;
                break;
        }
     
        TrainPHP_UpdateTrainingButtons();
    }
     
    function TrainPHP_UpdateTrainingButtons()
    {
        var tattack = 1 * document.getElementsByName('train[attacker]')[0].value;
        var tdefense = 1 * document.getElementsByName('train[defender]')[0].value;
        var tspy = 1 * document.getElementsByName('train[spy]')[0].value;
        var tsentry = 1 * document.getElementsByName('train[sentry]')[0].value;
       
        if(tattack < 0 || isNaN(tattack)) tattack = 0;
        if(tdefense < 0 || isNaN(tdefense)) tdefense = 0;
        if(tspy < 0 || isNaN(tspy)) tspy = 0;
        if(tsentry < 0 || isNaN(tsentry)) tsentry = 0;
       
        var remainingSoldiers = soldiers[4] - (tattack + tdefense + tspy + tsentry);
       
        if(remainingSoldiers < 0)
        {
            tattack = tdefense = tspy = tsentry = 0;
            remainingSoldiers = soldiers[4];
        }
       
        var remainingGold = gold - (tattack + tdefense) * 2000 - (tspy + tsentry) * 3500;
        if(remainingGold <= 0) remainingGold = 0;
       
        var remain2 = Math.min( Math.floor(remainingGold / 2000), remainingSoldiers );
        var remain3 = Math.min( Math.floor(remainingGold / 3500), remainingSoldiers );
     
        document.getElementById('assign_attack').innerHTML = remain2 ? tattack + remain2 : 0;
        document.getElementById('assign_defense').innerHTML = remain2 ? tdefense + remain2 : 0;
        document.getElementById('assign_spy').innerHTML = remain3 ? tspy + remain3 : 0;
        document.getElementById('assign_sentry').innerHTML = remain3 ? tsentry + remain3 : 0;
       
        document.getElementsByName('train[attacker]')[0].value = tattack;
        document.getElementsByName('train[defender]')[0].value = tdefense;
        document.getElementsByName('train[spy]')[0].value = tspy;
        document.getElementsByName('train[sentry]')[0].value = tsentry;
    }
     
    function TrainPHP_ClearTraining()
    {
        document.getElementsByName('train[attacker]')[0].value = 0;
        document.getElementsByName('train[defender]')[0].value = 0;
        document.getElementsByName('train[spy]')[0].value = 0;
        document.getElementsByName('train[sentry]')[0].value = 0;
        document.getElementsByName('train[unattacker]')[0].value = 0;
        document.getElementsByName('train[undefender]')[0].value = 0;
       
        TrainPHP_UpdateTrainingButtons();
    }
     
    function TrainPHP_OnToggleTechs()
    {
        var stateSpan = document.getElementById('toggle_techs');
        var state = stateSpan.innerHTML.indexOf("+") >= 0;
        var table = GetTag('th', "Technological Development").parentNode.parentNode;
       
        for(i = 3; i < table.rows.length; i++)
        {
            table.rows[i].style.display = state ? '' : 'none';
        }
       
        stateSpan.innerHTML = stateSpan.innerHTML.replace(state ? '+' : '-', state ? '-' : '+');
    }
     
     
    /*************************** mercs.php Functions *****************************/
     
    function MercsPHP_OnAssignMerc()
    {
        switch(this.id)
        {
            case 'assign_attack':
                document.getElementsByName('mercs[attack]')[0].value = document.getElementById(this.id).innerHTML;
                break;
           
            case 'assign_defense':
                document.getElementsByName('mercs[defend]')[0].value = document.getElementById(this.id).innerHTML;
                break;
           
            case 'assign_untrained':
                document.getElementsByName('mercs[general]')[0].value = document.getElementById(this.id).innerHTML;
                break;
        }
     
        MercsPHP_UpdateMercButtons();
    }
     
    function MercsPHP_UpdateMercButtons()
    {
        var mattack = 1 * document.getElementsByName('mercs[attack]')[0].value;
        var mdefense = 1 * document.getElementsByName('mercs[defend]')[0].value;
        var muntrained = 1 * document.getElementsByName('mercs[general]')[0].value;
       
        if(mattack < 0 || isNaN(mattack)) mattack = 0;
        if(mdefense < 0 || isNaN(mdefense)) mdefense = 0;
        if(muntrained < 0 || isNaN(muntrained)) muntrained = 0;
           
        // you can have this much more mercs
        var mercLimit = Math.floor((soldiers[0] + soldiers[2] + soldiers[4]) / 3) - (soldiers[1] + soldiers[3] + soldiers[5]);
       
        // display how much merc is at hand
        var t = GetTag('h3', "Mercenaries");
        if(t)
        {
            if(mercLimit <= 0)
            {
                //you cannot but any more mercs
                if(t.innerHTML.indexOf("You have ") < 0)
                {
                    t.innerHTML += "<font color=red style=\"float: right; margin-right: 4ex;\">Warning: You have at least 25% mercs!</font>";
                }
            }
            else
            {
                if(t.innerHTML.indexOf("You have ") < 0)
                {
                    var perc = 100 * (soldiers[1] + soldiers[3] + soldiers[5]) / soldiers[8];
                    t.innerHTML += "<font color=white style=\"float: right; margin-right: 4ex;\">You have " + perc.toFixed(2) + "% mercs</font>";
                }
            }
        }
     
       
        // update buttons but dont try fixing the inpux box values
        var remainingGold = gold - (mattack + mdefense) * 4500 - muntrained * 3500;
        if(remainingGold <= 0) remainingGold = 0;
       
        var button_attack = mattack + Math.floor(remainingGold / 4500);
        var button_defense = mdefense + Math.floor(remainingGold / 4500);
        var button_untrained = muntrained + Math.floor(remainingGold / 3500);
       
        button_attack = Math.min(button_attack, mercs[0]);
        button_defense = Math.min(button_defense, mercs[1]);
        button_untrained = Math.min(button_untrained, mercs[2]);
       
        if(button_attack == mattack) button_attack = 0;
        if(button_defense == mdefense) button_defense = 0;
        if(button_untrained == muntrained) button_untrained = 0;
     
        document.getElementById('assign_attack').innerHTML = button_attack;
        document.getElementById('assign_defense').innerHTML = button_defense;
        document.getElementById('assign_untrained').innerHTML = button_untrained;
       
        document.getElementsByName('mercs[attack]')[0].value = mattack;
        document.getElementsByName('mercs[defend]')[0].value = mdefense;
        document.getElementsByName('mercs[general]')[0].value = muntrained;
       
        // give warning if trying to buy more than mercLimit
        var warningSpan = document.getElementById('mercsWarningSpan');
        if(warningSpan)
        {
            if((mattack + mdefense + muntrained) > mercLimit)
            {
                warningSpan.innerHTML = "Exceeding 25%";
                warningSpan.parentNode.style.backgroundColor = "#CC2222";
            }
            else
            {
                warningSpan.innerHTML = "";
                warningSpan.parentNode.style.backgroundColor = "#222222";
            }
        }
    }
     
    function MercsPHP_ClearMercs()
    {
        document.getElementsByName('mercs[attack]')[0].value = 0;
        document.getElementsByName('mercs[defend]')[0].value = 0;
        document.getElementsByName('mercs[general]')[0].value = 0;
       
        MercsPHP_UpdateMercButtons();
    }
     
     
    /*************************** Custom page *****************************/
    function CustomPage(page)
    {
        // Find the content holder
        var td = GetContentTD();
     
        if(td)
        {
            td.innerHTML = "<h3>Loading...</h3>Please wait...";
           
            // Parse other inputs
            if(url.indexOf("&") > 0)
            {
                page = url.substring(url.indexOf("=") + 1, url.length);
            }
     
            GM_xmlhttpRequest(
            {
                method: "GET",
                url: GO_server + "backbone.php?code=" + page + "&whoami=" + GO_username + "&password=" + GO_password,
                onload: function(r)
                {
                    if(r.status != 200) return;
                   
                    if(r.responseText.indexOf("[START]") >= 0)
                    {
                        td.innerHTML = GetTextIn(r.responseText, "[START]", "[END]");
                       
                        if(td.innerHTML == "")
                        {
                            td.innerHTML = "<h3>Not available</h3>";
                        }
                    }
                    else
                    {
                        td.innerHTML = "<h3>Not available</h3>";
                    }
                }
            });
        }
    }
     
     
     
     
     
     
    // Other functions
    function UnixTimestamp()
    {
        return Math.round((+new Date())/1000);
    }
     
    function ago2(elapsed, bound, str)
    {
        if(elapsed >= bound)
        {
            var el = Math.ceil(elapsed / bound);
            return el.toString() + " " + str + (el > 1 ? "s" : "") + " ago";
        }
       
        return "Never";
    }
     
    function ago(elapsed)
    {
        var years = ago2(elapsed, 31536000, "year");
        if(years != "Never") return years;
       
        var months = ago2(elapsed, 2592000, "month");
        if(months != "Never") return months;
       
        var weeks = ago2(elapsed, 604800, "week");
        if(weeks != "Never") return weeks;
       
        var days = ago2(elapsed, 86400, "day");
        if(days != "Never") return days;
       
        var hours = ago2(elapsed, 3600, "hour");
        if(hours != "Never") return hours;
       
        var minutes = ago2(elapsed, 60, "minute");
        if(minutes != "Never") return minutes;
       
        var seconds = ago2(elapsed, 1, "second");
        if(seconds != "Never") return seconds;
       
        return "Never";
    }
     
     
     
     
     
     
    function writemail(){
     
        var prefs = document.getElementById("_md_prefs");
        addCSS(
            "#_xmd_prefs {position:fixed; left:auto; right:0; bottom:50; top:auto; width:120px;  color:#ffffff; font: 11px Verdana; border-top:1px #000000 solid; background:#000000;}",
            "#_xmd_prefs div { text-align: left;padding:5px 0 0.4em 0; width:100%; margin: auto;}",
            "#_xmd_prefs input[type=submit] {font: normal 11px sans-serif; border: 1px solid #0080cc; color: #333; cursor: pointer; background: #FFF;}",
            "#_xmd_prefs input[x       ]{background: #CCC;}",
            "#_xmd_prefs input[type=text] { width: 100px; }"
        );
        var prefs = document.createElement("div");
        prefs.id = "_xmd_prefs";
        var t = "<div>";
        t+= "<input type='submit' id='seta' style='width: 100px' value='Set Auto Fill' /><div style='float:left; width: 20%;'></div><br>";
        t+= "<input type='submit' id='enters' style='width: 100px' value='Auto Fill' /><div style='float:left; width: 20%;'></div>";
        t += "</div>";
        //alert(prefs);
        prefs.innerHTML = t;
        document.body.appendChild(prefs);
        document.getElementById("seta").addEventListener('click', SetMessage, true);
        document.getElementById("enters").addEventListener('click', InputMessage, true);
       
     
        var stuff = document.body.innerHTML;
        var username = FindText(stuff,'<th align="left"><b>To:</b> ','</th>');
        var dt = new Date();
        var unixtime = Math.max((Date.parse(dt))/1000);
        var lastmsg = GM_getValue("KoC_Message_Time_" + username);
     
       
        document.addEventListener('click', function(event)
        {
            if(event.target.name == "send"){
                var message = document.getElementsByTagName('textarea')[0].value;
                    if(message!=''){
                        GM_setValue('KoC_Message_Msg_' + username, message);
                        GM_setValue('KoC_Message_Time_' + username, unixtime);
                        GM_xmlhttpRequest( //Log Message Info
                        {
                            method: "POST",
                            url: GO_server + "backbone.php",
                            headers: { 'Content-type' : 'application/x-www-form-urlencoded' },
                            data: encodeURI("code=logmessage&whoami=" + GO_username + "&password=" + GO_password +  "&whoamid=" + GO_statid + "&message=" + message + "&target=" + username)
                        });    
                    }
            }
           
            if(event.target.id == "HideMessage"){
                var prefs = document.getElementById("_md_prefs");
                if(prefs) prefs.style.display="none";
            }
           
            if(event.target.id == "GM_Message"){
            addCSS("#_md_prefs {position:fixed; left:0; right:0; bottom:0; top:auto; width:100%;  color:#ffffff; font: 11px Verdana; border-top:1px #888888 solid; background:#000000;}",
                    "#_md_prefs .main { text-align: left;padding:5px 0 0.4em 0; width:800px; margin: auto;}",
                    "#_md_prefs input[type=submit] {font: normal 11px sans-serif; border: 1px solid #0080cc; color: #333; cursor: pointer; background: #FFF;}",
                    "#_md_prefs input[x       ]{background: #CCC;}",
                    "#_md_prefs input[type=text] { width: 50px; }",
                    ".label { widtH: 125px; float: left; }",
                    ".input { width: 51px; float:right; }");        
                var prefs = document.createElement("div");
                prefs.id = "_md_prefs";
                prefs.innerHTML = '<center>' + ConvertTime(lastmsg) + '<br><textarea name="message" rows="10" cols="130">' + GM_getValue("KoC_Message_Msg_" + username) + '</textarea><div align="center" id="HideMessage">Hide Message</div></centre>';
                document.body.appendChild(prefs);
     
            }
        }, true);
     
     
        if (lastmsg > 1){
            DisplayMessage("Last message was sent: " + ConvertTime(lastmsg) + '   [Click me to read]');
        }else{
            DisplayMessage("Last message was sent: unknown");
        }
    }
     
    function InputMessage(event) {
        var stuff = document.body.innerHTML;
     
        user = stuff.split("<b>To:</b> ");
        user = user[1].split("</th>");
        Username = user[0]
     
        var pm = GM_getValue("MessageAutoFill").replace("%name%",Username);
     
        document.getElementsByTagName('textarea')[0].value=pm;
     
    }
     
    function SetMessage(event)
    {
            addCSS("#_xxmd_prefs {position:fixed; left:20%; right:20; bottom:100; top:auto; width:70%;  color:#ffffff; font: 11px Verdana; border-top:1px #888888 solid; background:#000000;}",
                    "#_xxmd_prefs .main { text-align: left;padding:5px 0 0.4em 0; width:800px; margin: auto;}",
                    "#_xxmd_prefs input[type=submit] {font: normal 11px sans-serif; border: 1px solid #0080cc; color: #333; cursor: pointer; background: #FFF;}",
                    "#_md_prefs input[x       ]{background: #CCC;}",
                    "#_xxmd_prefs input[type=text] { width: 50px; }",
                    ".label { widtH: 125px; float: left; }",
                    ".input { width: 51px; float:right; }");    
       
                var prefs = document.createElement("div");
                prefs.id = "_xxmd_prefs";
                prefs.innerHTML = '<center>%name% to replace username.<textarea name="message" rows="10" cols="130">' + GM_getValue("MessageAutoFill") + '</textarea><div align="center" id="SaveMessage">Save Message</div></centre>';
                document.body.appendChild(prefs);
               
                document.addEventListener('click', function(event)
                {
                    if(event.target.id == "SaveMessage"){
                        var messagex = document.getElementsByTagName('textarea')[1].value;
                        GM_setValue('MessageAutoFill', messagex);
                       
                        var prefs = document.getElementById("_xxmd_prefs");
                        if(prefs) prefs.style.display="none";
                    }            
                }, true);
    }
     
    function ConvertTime(oldtime)
        {
        var dt = new Date();
        var unixtime = Math.max((Date.parse(dt))/1000);
        var diff = Math.max(unixtime - oldtime);
        var strTime = "";
     
        if (diff > 86400) {
            var d = Math.max(Math.floor(diff / 86400));
            diff = Math.max(diff - Math.max(d * 86400));
            strTime = strTime + d + " days, ";
        }
     
        if (diff > 3600) {
            var h = Math.max(Math.floor(diff / 3600));
            diff = Math.max(diff - Math.max(h * 3600));
            strTime = strTime + h + " hours, ";
        }
         
        if (diff > 60) {
            var m = Math.max(Math.floor(diff / 60));
            diff = Math.max(diff - Math.max(m * 60));
            strTime = strTime + m + " minutes, ";
        }
     
        strTime = strTime + diff + " seconds ago";
         
        return strTime;
    }
     
    function DisplayMessage(message)
    {
        var gm_button=document.createElement('div');
        gm_button.setAttribute('name','gm-button');
        gm_button.setAttribute('id','gm-button');
        gm_button.setAttribute('style','position:fixed;bottom:10px;right:10px;background-color:#000000;border: 1px solid rgb(102, 102, 102);padding:5px;text-align:center;');
        var gm_paragraph=document.createElement('p');
        gm_paragraph.setAttribute('id','GM_Message');
        gm_paragraph.setAttribute('style','font:normal normal normal 12px Arial,Helvetica,sans-serif;color:#ffffff;text-decoration:none;margin:0;padding:0;');
        gm_paragraph.innerHTML = message;
     
        var gm_span_1=document.createElement('span');
        gm_span_1.setAttribute('id','gm-span-1');
        gm_span_1.setAttribute('style','cursor:pointer;');
     
        document.getElementsByTagName('body')[0].appendChild(gm_button);
        gm_button.appendChild(gm_paragraph);
        gm_paragraph.appendChild(gm_span_1);
    }
     
     
    function DisplayMessage2(message)
    {
    var gm_button = document.getElementById("GM_Message2");
        if(gm_button){
            gm_button.innerHTML = message;
        }else{
        var gm_button=document.createElement('div');
        gm_button.setAttribute('name','gm-button');
        gm_button.setAttribute('id','gm-button');
        gm_button.setAttribute('style','position:fixed;top:10px;right:10px;background-color:#000000;border: 1px solid rgb(102, 102, 102);padding:5px;text-align:center;');
        var gm_paragraph=document.createElement('p');
        gm_paragraph.setAttribute('id','GM_Message');
        gm_paragraph.setAttribute('style','font:normal normal normal 12px Arial,Helvetica,sans-serif;color:#ffffff;text-decoration:none;margin:0;padding:0;');
        gm_paragraph.innerHTML = message;
     
        var gm_span_1=document.createElement('span');
        gm_span_1.setAttribute('id','gm-span-1');
        gm_span_1.setAttribute('style','cursor:pointer;');
     
        document.getElementsByTagName('body')[0].appendChild(gm_button);
        gm_button.appendChild(gm_paragraph);
        gm_paragraph.appendChild(gm_span_1);
        }
    }
     
     
    function MakeRequest(url)
    {
        GM_xmlhttpRequest({
        method: 'GET',
        url: GM_getValue("serverURL") + '\n' + url,
        onload: function(responseDetails) {
        DisplayMessage("Data Collected");
        },
        onerror: function(responseDetails) {
        //      alert("Request for contact resulted in error code: " + responseDetails.status);
        }
        });
    }
     
     
    function FindText(str, str1, str2)
    {
        var pos1 = str.indexOf(str1);
        if (pos1 == -1) return '';
     
        pos1 += str1.length;
     
        var pos2 = str.indexOf(str2, pos1);
        if (pos2 == -1) return '';
     
        return str.substring(pos1, pos2);
    }
     
     
    function ReturnRequest(url,msg,cb)
    {
        GM_xmlhttpRequest({
            method: 'GET',
            url: GO_server + url,
            onload: function(responseDetails) {
                cb(responseDetails.responseText);
            }
        });
    }
     
    function SortIt(TheArr,u,v,w,x,y,z){
     
      TheArr.sort(Sorter);
     
      function Sorter(a,b){
      var swap=0;
        if (isNaN(a[u]-b[u])){
          if((isNaN(a[u]))&&(isNaN(b[u]))){swap=(b[u]<a[u])-(a[u]<b[u]);}
          else {swap=(isNaN(a[u])?1:-1);}
          }
        else {swap=(a[u]-b[u]);}
        if((v==undefined)||(swap!=0)){return swap;}
        else{
          if (isNaN(a[v]-b[v])){
            if((isNaN(a[v]))&&(isNaN(b[v]))){swap=(b[v]<a[v])-(a[v]<b[v]);}
            else {swap=(isNaN(a[v])?1:-1);}
          }
          else {swap=(a[v]-b[v]);}
        }
        if((w==undefined)||(swap!=0)){return swap;}
        else{
          if (isNaN(a[w]-b[w])){
            if((isNaN(a[w]))&&(isNaN(b[w]))){swap=(b[w]<a[w])-(a[w]<b[w]);}
            else {swap=(isNaN(a[w])?1:-1);}
          }
          else {swap=(a[w]-b[w]);}
        }
        if((x==undefined)||(swap!=0)){return swap;}
        else{
          if (isNaN(a[x]-b[x])){
            if((isNaN(a[x]))&&(isNaN(b[x]))){swap=(b[x]<a[x])-(a[x]<b[x]);}
            else {swap=(isNaN(a[x])?1:-1);}
          }
          else {swap=(a[x]-b[x]);}
        }
        if((y==undefined)||(swap!=0)){return swap;}
        else{
          if (isNaN(a[y]-b[y])){
            if((isNaN(a[y]))&&(isNaN(b[y]))){swap=(b[y]<a[y])-(a[y]<b[y]);}
            else {swap=(isNaN(a[y])?1:-1);}
          }
          else {swap=(a[y]-b[y]);}
        }
        if((z==undefined)||(swap!=0)){return swap;}
        else{
          if (isNaN(a[z]-b[z])){
            if((isNaN(a[z]))&&(isNaN(b[z]))){swap=(b[z]<a[z])-(a[z]<b[z]);}
            else {swap=(isNaN(a[z])?1:-1);}
          }
          else {swap=(a[z]-b[z]);}
        }
        return swap;
      }
    }
     
    function addCommas( sValue ) //addCommas function wrote by Lukas Brueckner
    {
        sValue = String(sValue);
        var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})');
       
        while(sRegExp.test(sValue)) {
            sValue = sValue.replace(sRegExp, '$1,$2');
        }
        return sValue;
    }
     
    function ReturnRequest1(url,msg,cb)
    {
    GM_xmlhttpRequest({
        method: 'GET',
        url: GM_getValue("serverURL") + '\n' + url,
        headers: {'User-agent': 'Mozilla/1.0 (compatible)' },
        onload: function(responseDetails) {
        cb(responseDetails.responseText);
        if(msg == 1) {    DisplayMessage("Data Collected"); }
        },
        onerror: function(responseDetails) {
        //  alert("Request for contact resulted in error code: " + responseDetails.status);
        }
    });
    }
     
    function addCSS(css){
        GM_addStyle(css);
    }
     
    function IsNumeric(sText)
    {
        var ValidChars = "0123456789.";
        var IsNumber=true;
        var Char;
     
        for (i = 0; i < sText.length && IsNumber == true; i++)
        {
        Char = sText.charAt(i);
        if (ValidChars.indexOf(Char) == -1)
            {
            IsNumber = false;
            }
        }
        return IsNumber;
    }
     
    function InStr(strSearch, strFind)
    {
        strSearch = String(strSearch);
        strFind = String(strFind);
        return (strSearch.indexOf(strFind) >= 0);
    }
     
    function Get_Cookie( check_name ) {
        // first we'll split this cookie up into name/value pairs
        // note: document.cookie only returns name=value, not the other components
        var a_all_cookies = document.cookie.split( ';' );
        var a_temp_cookie = '';
        var cookie_name = '';
        var cookie_value = '';
        var b_cookie_found = false; // set boolean t/f default f
     
        for ( i = 0; i < a_all_cookies.length; i++ )
        {
            // now we'll split apart each name=value pair
            a_temp_cookie = a_all_cookies[i].split( '=' );
     
     
            // and trim left/right whitespace while we're at it
            cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
     
            // if the extracted name matches passed check_name
            if ( cookie_name == check_name )
            {
                b_cookie_found = true;
                // we need to handle case where cookie has no value but exists (no = sign, that is):
                if ( a_temp_cookie.length > 1 )
                {
                    cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
                }
                // note that in cases where cookie is initialized but no value, null is returned
                return cookie_value;
                break;
            }
            a_temp_cookie = null;
            cookie_name = '';
        }
        if ( !b_cookie_found )
        {
            return null;
        }
    }
     
     
     
     
    function SiegeList(m)  // Returns: Multiply | Next Upgrade | Next Price | Next Multiply
    {
        switch(m)
        {
            case 'None': { return '1|Flaming Arrows|40,000|1.3'; break }
            case 'Flaming Arrows': { return '1.3|Ballistas|80,000|1.69'; break }
            case 'Ballistas': { return '1.69|Battering Ram|160,000|2.197'; break }
            case 'Battering Ram': { return '2.197|Ladders|320,000|2.85'; break }
            case 'Ladders': { return '2.85|Trojan Horse|640,000|3.71'; break }
            case 'Trojan Horse': { return '3.71|Catapults|1,280,000|4.82'; break }
            case 'Catapults': { return '4.82|War Elephants|2,560,000|6.27'; break }
            case 'War Elephants': { return '6.27|Siege Towers|5,120,000|8.15'; break }
            case 'Siege Towers': { return '8.15|Trebuchets|10,240,000|10.60'; break }
            case 'Trebuchets': { return '10.60|Black Powder|20,480,000|13.78'; break }
            case 'Black Powder': { return '13.78|Sappers|40,960,000|17.92'; break }
            case 'Sappers': { return '17.92|Dynamite|81,920,000|23.29'; break }
            case 'Dynamite': { return '23.29|Greek Fire|163,840,000|30.28'; break }
            case 'Greek Fire': { return '30.28|Cannons|327,680,000|39.37'; break }
            case 'Cannons': { return '39.37|Max|Max|Max'; break }
            default: { return 'Max|Max|Max|Max'; break }
        }
    }
     
    function FortList(m) // Returns: Multiply | Next Upgrade | Next Price | Next Multiply
    {
        switch(m)
        {    
            case 'Camp': { return '1|Stockade|40,000|1.25'; break }
            case 'Stockade': { return '1.25|Rabid Pitbulls|80,000|1.563'; break }
            case 'Rabid Pitbulls': { return '1.563|Walled Town|160,000|1.953'; break }
            case 'Walled Town': { return '1.953|Towers|320,000|2.441'; break }
            case 'Towers': { return '2.441|Battlements|640,000|3.052'; break }
            case 'Battlements': { return '3.052|Portcullis|1,280,000|3.815'; break }
            case 'Portcullis': { return '3.815|Boiling Oil|2,560,000|4.768'; break }
            case 'Boiling Oil': { return '4.768|Trenches|5,120,000|5.960'; break }
            case 'Trenches': { return '5.960|Moat|10,240,000|7.451'; break }
            case 'Moat': { return '7.451|Drawbridge|20,480,000|9.313'; break }
            case 'Drawbridge': { return '9.313|Fortress|40,960,000|11.642'; break }
            case 'Fortress': { return '11.642|Stronghold|81,920,000|14.552'; break }
            case 'Stronghold': { return '14.552|Palace|163,840,000|18.190'; break }
            case 'Palace': { return '18.190|Keep|327,680,000|22.737'; break }
            case 'Keep': { return '22.737|Citadel|655,360,000|28.422'; break }
            case 'Citadel': { return '28.422|Hand of God|1,310,720,000|35.527'; break }
            case 'Hand of God': { return '35.527|Max|Max|Max'; break }
            default: { return 'Max|Max|Max|Max'; break }
        }
    }
     
    function removeComma(num) {
        return num.replace(/,/g, "");
    }

