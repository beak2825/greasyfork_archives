// ==UserScript==
// @name        att&ck customer
// @namespace   Violentmonkey Scripts
// @match       https://attack.mitre.org/techniques/*
// @grant       none
// @version     2.0.0
// @author      zigfn
// @description 2019/12/30 下午17:05:12
// @downloadURL https://update.greasyfork.org/scripts/393579/attck%20customer.user.js
// @updateURL https://update.greasyfork.org/scripts/393579/attck%20customer.meta.js
// ==/UserScript==
// 
// 
// 翻译表述卡片
var card_body = $(".card-body").children().children()
for (var i = 0; i < card_body.length; i++) {
    switch (card_body.eq(i).text().trim()) {
        case "Tactic:":
            card_body.eq(i).html("<strong>策略:</strong> ");
            break;
        case "Platform:":
            card_body.eq(i).html("<strong>平台:</strong> ");
            break;
        case "Permissions Required:":
            card_body.eq(i).html("<strong>所需权限:</strong> ");
            break;
        case "Data Sources:":
            card_body.eq(i).html("<strong>数据源:</strong> ");
            break;
        case "Defense Bypassed:":
            card_body.eq(i).html("<strong>防御绕过:</strong> ");
            break;
        case "Contributors:":
            card_body.eq(i).html("<strong>贡献者:</strong> ");
            break;
        case "System Requirements:":
            card_body.eq(i).html("<strong>系统要求:</strong> ");
            break;
        case "Version:":
            card_body.eq(i).html("<strong>版本:</strong> ");
            break;
        case "ID:":
            card_body.eq(i).html("<strong>ID:</strong> ");
            break;
        case "CAPEC ID:":
            card_body.eq(i).html("<strong>CAPEC ID:</strong> ");
            break;
        default:
    }
}
var divs = $(".card-body").children()
for (var i = 0; i < card_body.length; i++) {
    divs.eq(i).after(`<p id=cardbody${i}></p>`);
    $(`#cardbody${i}`).append(divs.eq(i))
}
divs.children().unwrap()



// 分离apt组织行为与攻击工具表格
$("#mitigations").before('<h2 class="pt-3" id="tools">攻击工具</h2>');
$("#mitigations").before('<table class="table table-bordered table-alternate mt-2"> <thead> <tr>  <th scope="col">名称</th><th scope="col">描述</th><th scope="col">属性</th> </tr></thead><tbody  id="software_table"></tbody> </table>');

$(".table > thead > tr > th:nth-child(1)").eq(0).text("名称");
$(".table > thead > tr > th:nth-child(1)").eq(0).after('<th scope="col">攻击方法</th>');
$(".table > thead > tr > th:nth-child(3)").eq(0).text("描述");
// 工具属性map
softwareMap=new Map([["3PARA RAT","APT专属"],["4H RAT","APT专属"],["adbupd","APT专属"],["Adups","恶意软件"],["ADVSTORESHELL","APT专属"],["Agent Tesla","APT专属"],["Agent.btz","恶意软件"],["Allwinner","恶意软件"],["Android/Chuli.A","恶意软件"],["ANDROIDOS_ANSERVER.A","恶意软件"],["AndroRAT","恶意软件"],["Arp","Windows附件"],["ASPXSpy","APT专属"],["Astaroth","恶意软件"],["at","Windows附件"],["AuditCred","APT专属"],["AutoIt backdoor","APT专属"],["Azorult","商业木马"],["BabyShark","恶意软件"],["Backdoor.Oldrea","APT专属"],["BACKSPACE","APT专属"],["BADCALL","APT专属"],["BADNEWS","APT专属"],["BadPatch","APT专属"],["Bandook","商业木马"],["Bankshot","APT专属"],["BBSRAT","恶意软件"],["BISCUIT","APT专属"],["Bisonal","APT专属"],["BITSAdmin","Windows附件"],["BLACKCOFFEE","APT专属"],["BlackEnergy","恶意软件"],["BONDUPDATER","APT专属"],["BOOSTWRITE","APT专属"],["BOOTRASH","恶意软件"],["BrainTest","恶意软件"],["Brave Prince","恶意软件"],["Briba","APT专属"],["BS2005","APT专属"],["BUBBLEWRAP","APT专属"],["Cachedump","闭源软件"],["CALENDAR","APT专属"],["Calisto","恶意软件"],["CallMe","恶意软件"],["Cannon","恶意软件"],["Carbanak","APT专属"],["Carbon","APT专属"],["Cardinal RAT","恶意软件"],["Catchamas","恶意软件"],["CCBkdr","恶意软件"],["certutil","Windows附件"],["Chaos","恶意软件"],["Charger","恶意软件"],["ChChes","APT专属"],["Cherry Picker","恶意软件"],["China Chopper","闭源软件"],["CHOPSTICK","APT专属"],["CloudDuke","APT专属"],["cmd","Windows附件"],["Cobalt Strike","商业软件"],["Cobian RAT","恶意软件"],["CoinTicker","恶意软件"],["Comnie","恶意软件"],["ComRAT","APT专属"],["CORALDECK","APT专属"],["CORESHELL","APT专属"],["CosmicDuke","APT专属"],["CozyCar","APT专属"],["Crimson","恶意软件"],["CrossRAT","APT专属"],["DarkComet","APT专属"],["Daserf","间谍软件"],["DDKONG","APT专属"],["DealersChoice","APT专属"],["Dendroid","恶意软件"],["Denis","恶意软件"],["Derusbi","APT专属"],["Dipsind","APT专属"],["DOGCALL","APT专属"],["Dok","恶意软件"],["Downdelph","APT专属"],["DownPaper","APT专属"],["DressCode","恶意软件"],["Dridex","APT专属"],["DroidJack","恶意软件"],["dsquery","Windows附件"],["DualToy","恶意软件"],["Duqu","恶意软件"],["DustySky","恶意软件"],["Dyre","商业木马"],["Ebury","后门软件"],["Elise","后门软件"],["ELMER","APT专属"],["Emissary","后门软件"],["Emotet","恶意软件"],["Empire","开源软件"],["Epic","APT专属"],["esentutl","Windows附件"],["EvilBunny","恶意软件"],["EvilGrab","钓鱼软件"],["Exaramel for Linux","后门软件"],["Exaramel for Windows","后门软件"],["Exodus","Android后门软件"],["Expand","Windows附件"],["FakeM","后门软件"],["FALLCHILL","APT专属"],["Felismus","APT专属"],["FELIXROOT","后门软件"],["Fgdump","开源软件"],["Final1stspy","恶意软件"],["FinFisher","恶意软件"],["Flame","恶意工具包"],["FLASHFLOOD","APT专属"],["FlawedAmmyy","APT专属"],["FlawedGrace","APT专属"],["FlexiSpy","商业软件"],["FLIPSIDE","后门软件"],["Forfiles","Windows附件"],["FruitFly","恶意软件"],["FTP","工具"],["Fysbis","APT专属"],["Gazer","APT专属"],["GeminiDuke","APT专属"],["gh0st RAT","开源工具"],["GLOOXMAIL","APT专属"],["Gold Dragon","恶意软件"],["Gooligan","恶意软件"],["GravityRAT","恶意软件"],["GreyEnergy","恶意软件"],["GRIFFON","APT专属"],["gsecdump","开源工具"],["Gustuff","恶意软件"],["H1N1","恶意软件"],["Hacking Team UEFI Rootkit","商业软件"],["HALFBAKED","恶意软件"],["HAMMERTOSS","APT专属"],["HAPPYWORK","APT专属"],["HARDRAIN","APT专属"],["Havij","商业软件"],["HAWKBALL","恶意软件"],["hcdLoader","APT专属"],["HDoor","APT专属"],["Helminth","后门软件"],["Hi-Zor","恶意软件"],["HiddenWasp","恶意软件"],["HIDEDRV","APT专属"],["Hikit","恶意软件"],["HOMEFRY","恶意软件"],["HOPLIGHT","恶意软件"],["HTRAN","代理工具"],["HTTPBrowser","恶意软件"],["httpclient","APT专属"],["HummingBad","恶意软件"],["HummingWhale","恶意软件"],["Hydraq","恶意软件"],["HyperBro","APT专属"],["ifconfig","Linux工具"],["iKitten","恶意软件"],["Impacket","开源软件"],["InnaputRAT","恶意软件"],["InvisiMole","恶意软件"],["Invoke-PSImage","工具"],["ipconfig","Windows附件"],["ISMInjector","恶意软件"],["Ixeshe","恶意软件"],["Janicab","恶意软件"],["JCry","恶意软件"],["JHUHUGIT","APT专属"],["JPIN","恶意软件"],["jRAT","商业软件"],["Judy","恶意软件"],["KARAE","APT专属"],["Kasidet","恶意软件"],["Kazuar","恶意软件"],["KeyBoy","恶意软件"],["Keydnap","恶意软件"],["KEYMARBLE","恶意软件"],["KeyRaider","恶意软件"],["Koadic","开源工具"],["Komplex","APT专属"],["KOMPROGO","APT专属"],["KONNI","APT专属"],["Kwampirs","APT专属"],["LaZagne","开源软件"],["LightNeuron","恶意软件"],["Linfo","恶意软件"],["Linux Rabbit","恶意软件"],["LockerGoga","恶意软件"],["LoJax","APT专属"],["LOWBALL","APT专属"],["Lslsass","开源工具"],["Lurid","恶意软件"],["Machete","恶意软件"],["MacSpy","恶意软件"],["MailSniper","商业软件"],["Marcher","渗透工具"],["Matroyshka","恶意软件"],["MazarBOT","恶意软件"],["meek","开源软件"],["Micropsia","恶意软件"],["Mimikatz","工具"],["MimiPenguin","工具"],["Miner-C","恶意软件"],["MiniDuke","APT专属"],["MirageFox","APT专属"],["Mis-Type","后门软件"],["Misdat","后门软件"],["Mivast","后门软件"],["MobileOrder","APT专属"],["Monokle","恶意软件"],["MoonWind","恶意远控软件"],["More_eggs","后门软件"],["Mosquito","APT专属"],["MURKYTOP","APT专属"],["Naid","后门软件"],["NanHaiShu","恶意远控软件"],["NanoCore","恶意远控软件"],["NavRAT","恶意远控软件"],["nbtstat","Windows附件"],["NDiskMonitor","后门软件"],["Nerex","后门软件"],["Net","Windows附件"],["Net Crawler","恶意软件"],["NETEAGLE","后门软件"],["netsh","Windows附件"],["netstat","Windows附件"],["NetTraveler","APT专属"],["NETWIRE","恶意远控软件"],["Nidiran","APT专属"],["njRAT","恶意远控软件"],["Nltest","恶意软件"],["NOKKI","恶意远控软件"],["NotCompatible","恶意软件"],["NotPetya","恶意软件"],["OBAD","恶意软件"],["OceanSalt","恶意软件"],["Octopus","恶意软件"],["OLDBAIT","APT专属"],["OldBoot","恶意软件集"],["Olympic Destroyer","恶意软件"],["OnionDuke","APT专属"],["OopsIE","恶意软件"],["Orz","恶意软件"],["OSInfo","APT专属"],["OSX/Shlayer","恶意软件"],["OSX_OCEANLOTUS.D","APT专属"],["OwaAuth","恶意软件"],["P2P ZeuS","恶意软件"],["Pallas","APT专属"],["Pasam","后门软件<br/>APT专属"],["Pass-The-Hash Toolkit","密码工具"],["Pegasus for Android","恶意软件"],["Pegasus for iOS","恶意软件"],["PHOREAL","后门软件<br/>APT专属"],["PinchDuke","恶意软件<br/>APT专属"],["Ping","网络工具"],["Pisloader","APT专属<br/>恶意软件"],["PJApps","恶意软件集"],["PLAINTEE","恶意软件<br/>APT专属"],["PlugX","恶意远控软件"],["pngdowner","恶意软件<br/>APT专属"],["PoisonIvy","恶意远控软件"],["POORAIM","后门软件<br/>APT专属"],["PoshC2","远控框架<br/>开源软件"],["POSHSPY","后门软件<br/>APT专属"],["Power Loader","恶意软件"],["PowerDuke","恶意软件<br/>APT专属"],["POWERSOURCE","恶意软件"],["PowerSploit","攻击框架<br/>开源软件"],["PowerStallion","后门软件<br/>APT专属"],["POWERSTATS","后门软件<br/>APT专属"],["POWERTON","后门软件<br/>APT专属"],["POWRUNER","c2软件"],["Prikormka","恶意软件集"],["Proton","后门软件"],["Proxysvc","恶意软件<br/>APT专属"],["PsExec","Windows工具"],["Psylo","木马<br/>APT专属"],["Pteranodon","后门软件<br/>APT专属"],["PUNCHBUGGY","后门软件<br/>APT专属"],["PUNCHTRACK","恶意软件<br/>APT专属"],["Pupy","后渗透工具<br/>开源软件"],["pwdump","Windows工具"],["QUADAGENT","后门软件<br/>APT专属"],["QuasarRAT","远控工具<br/>开源软件"],["RARSTONE","恶意软件<br/>APT专属"],["RATANKBA","远控软件<br/>APT专属"],["RawDisk","Windows工具"],["RawPOS","恶意软件"],["RCSAndroid","恶意软件"],["RDFSNIFFER","恶意软件"],["Reaver","恶意软件集"],["RedDrop","恶意软件"],["RedLeaves","恶意软件<br/>APT专属"],["Reg","Windows附件"],["Regin","恶意软件"],["Remcos","远控软件<br/>商业软件"],["Remexi","木马"],["RemoteCMD","恶意软件<br/>APT专属"],["Remsec","恶意软件"],["Responder","开源工具"],["Revenge RAT","远控工具<br/>开源软件"],["RGDoor","后门软件"],["Riltok","恶意软件"],["RIPTIDE","后门软件<br/>APT专属"],["RobbinHood","勒索软件"],["ROCKBOOT","恶意软件<br/>APT专属"],["RogueRobin","恶意软件<br/>APT专属"],["ROKRAT","远控软件<br/>APT专属"],["Rotexy","恶意软件"],["route","Windows附件"],["Rover","恶意软件"],["RTM","恶意软件<br/>APT专属"],["Ruler","恶意软件<br/>开源工具"],["RuMMS","恶意软件集"],["RunningRAT","恶意软件"],["S-Type","后门软件<br/>APT专属"],["Sakula","恶意远控软件"],["SamSam","勒索软件"],["schtasks","Windows附件"],["SDelete","Windows工具"],["SeaDuke","恶意软件<br/>APT专属"],["Seasalt","恶意软件<br/>APT专属"],["SEASHARPEE","webshell<br/>APT专属"],["ServHelper","后门软件"],["Shamoon","恶意软件"],["ShiftyBug","恶意软件"],["SHIPSHAPE","恶意软件<br/>APT专属"],["SHOTPUT","后门软件<br/>APT专属"],["SHUTTERSPEED","后门软件<br/>APT专属"],["Skeleton Key","后门软件"],["Skygofree","恶意软件"],["SLOWDRIFT","后门软件<br/>APT专属"],["Smoke Loader","恶意软件"],["SNUGRIDE","恶意软件<br/>APT专属"],["Socksbot","后门软件"],["SOUNDBITE","后门软件<br/>APT专属"],["SPACESHIP","恶意软件<br/>APT专属"],["SpeakUp","后门软件"],["spwebmember","Windows工具"],["SpyDealer","恶意软件"],["SpyNote RAT","恶意软件"],["sqlmap","开源工具"],["SQLRat","恶意软件"],["SslMM","恶意软件<br/>APT专属"],["Starloader","恶意软件"],["Stealth Mango","恶意软件"],["StoneDrill","恶意软件<br/>APT专属"],["StreamEx","恶意软件<br/>APT专属"],["Sykipot","恶意软件"],["SynAck","木马"],["Sys10","后门软件<br/>APT专属"],["Systeminfo","Windows工具"],["T9000","后门软件"],["Taidoor","恶意软件"],["Tangelo","恶意软件"],["Tasklist","Windows工具"],["TDTESS","后门软件<br/>APT专属"],["TEXTMATE","后门软件"],["TINYTYPHON","后门软件"],["TinyZBot","恶意软件<br/>APT专属"],["Tor","代理工具"],["TrickBot","恶意软件<br/>APT专属"],["Trojan-SMS.AndroidOS.Agent.ao","恶意软件"],["Trojan-SMS.AndroidOS.FakeInst.a","恶意软件"],["Trojan-SMS.AndroidOS.OpFake.a","恶意软件"],["Trojan.Karagany","后门软件<br/>代码泄露"],["Trojan.Mebromi","恶意软件"],["Truvasys","恶意软件<br/>APT专属"],["TURNEDUP","后门软件<br/>APT专属"],["Twitoor","恶意软件"],["TYPEFRAME","恶意软件<br/>APT专属"],["UACMe","开源工具"],["UBoatRAT","恶意远控软件"],["Umbreon","恶意软件"],["Unknown Logger","恶意远控软件"],["UPPERCUT","后门软件<br/>APT专属"],["Uroburos","恶意软件<br/>APT专属"],["Ursnif","木马"],["USBStealer","恶意软件<br/>APT专属"],["Vasport","后门软件<br/>APT专属"],["VERMIN","恶意远控软件<br/>部分开源"],["Volgmer","木马"],["WannaCry","勒索软件"],["WEBC2","后门软件<br/>APT专属"],["Wiarp","后门软件<br/>APT专属"],["Windows Credential Editor","Windows工具"],["WINDSHIELD","后门软件<br/>APT专属"],["WINERACK","后门软件<br/>APT专属"],["Winexe","Windows工具<br/>开源"],["Wingbird","后门软件<br/>APT专属"],["WinMM","后门软件<br/>APT专属"],["Winnti","木马"],["Wiper","恶意软件集"],["WireLurker","恶意软件集"],["X-Agent for Android","恶意软件"],["XAgentOSX","木马<br/>APT专属"],["Xbash","恶意软件"],["Xbot","恶意软件集"],["xCmd","远控工具<br/>开源软件"],["XcodeGhost","恶意软件"],["XLoader","恶意软件"],["XTunnel","c2软件"],["Yahoyah","木马<br/>APT专属"],["YiSpecter","恶意软件"],["yty","恶意工具框架"],["Zebrocy","木马<br/>APT专属"],["ZergHelper","恶意软件"],["Zeroaccess","恶意软件"],["ZeroT","木马<br/>APT专属"],["Zeus Panda","恶意软件"],["ZLib","后门软件<br/>APT专属"],["zwShell","后门软件<br/>APT专属"],["ZxShell","后门软件"]])


var tr = $("#v-attckmatrix > div.row > div > div > div > table:nth-child(4)").find("tr");
for (var i = 1; i < tr.length; i++) {
    var tdArr = tr.eq(i).find("td");
    var aptname = tdArr.eq(0).find("a").attr("href");
    if (!String(aptname).includes("group")) {
        tr.eq(i).append("<td>"+softwareMap.get(tdArr.eq(0).text().trim())+"</td>")
        $("#software_table").append(tr.eq(i));
        continue
    }
    tdArr.eq(0).after("<td></td>");
}



$("#examples").text("APT示例");
$("#mitigations").text("缓解措施");
$("#detection").text("攻击检测");
$("#references").text("参考");
$(".table > thead > tr > th:nth-child(1)").eq(2).text("措施");
$(".table > thead > tr > th:nth-child(2)").eq(2).text("描述");

// 将参考两列引用归为一列
var col1 = $(".col").eq(0);
col1.contents().each(function () {
    $(this).insertBefore(col1);
});
col1.remove();
var col2 = $(".col").eq(0);
col2.contents().each(function () {
    $(this).insertBefore(col2);
});
col2.remove();

var ol2 = $("ol").eq(2).children();

ol2.each(function () {
    $("ol").eq(1).append($(this));
});

