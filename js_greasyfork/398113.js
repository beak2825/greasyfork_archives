// ==UserScript==
// @name         GGn Description Broom
// @namespace    http://tampermonkey.net/
// @version      0.7.4
// @description  Fix descriptions and copy/paste system requirements from Steam/PCGamingWiki/Bigfish
// @author       GGn
// @match        https://gazellegames.net/torrents.php?action=editgroup*
// @match        https://gazellegames.net/upload.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398113/GGn%20Description%20Broom.user.js
// @updateURL https://update.greasyfork.org/scripts/398113/GGn%20Description%20Broom.meta.js
// ==/UserScript==

(function() {
    const $broomarea = $("textarea#album_desc").length ? $("textarea#album_desc"): $("textarea[name=body]");
    $broomarea.after(' <br/><input type="button" value="Broom!" id="broom">');
    const $broombutton = $('input#broom');

    $broombutton.click(function() {
        $broomarea.val(broomThat($broomarea.val()))
    });

    function broomThat(string) {
        var description = string;

        var regLists = /\n\s*\*\s*/g;
        description = description.replace(regLists, "\n[*]");

        var regCopyrights = /©|®|™/g;
        description = description.replace(regCopyrights, "");

        var labelAboutGame = "[align=center][b][u]About the game[/u][/b][/align]\n";
        var stringREG = /^(\[size\=3\]){0,1}\n{0,1}(\[(b|u|i|align\=center)\]\n{0,1}){0,4}(About\sthe\sGame|About\sThis\sGame|What\sis\sThis\sGame\?|About|Description)\s*:{0,1}(\n{0,1}\[\/(b|u|i|align|size)\]){0,4}(\s*:|:|)/i;
        description = description.replace(stringREG, labelAboutGame);
        var firstLetter = description.substr(0,1);
        if (firstLetter != "[") {
            var threeFirstLetters = description.substr(0,3);
            if (threeFirstLetters != "\n[") {
                description = labelAboutGame + description;
            }
        }

        //Features
        var labelFeatures = "\n[align=center][b][u]Features[/u][/b][/align]\n";
        var regFeatures = /\n(\[size\=3\]){0,1}\n{0,1}(\[(b|u|i|align\=center|size\=2)\]\n{0,1}){0,4}(Key\sFeatures|Main\sFeatures|Game\sFeatures|Other\sFeatures|Features\sof\sthe\sGame|Features|Featuring|Feautures)\s*:{0,1}\s*(\n{0,1}\[\/(b|u|i|align|size)\]){0,4}(\s*:|:|)/i;
        description = description.replace(regFeatures, labelFeatures);

        //Features detection
        if (!regFeatures.test(description)) {
            var n = description.indexOf("[quote]");
            var tempdescription = n == -1 ? description.substr(0): description.substr(0, n);
            //var regFeaturesList = /\n(\[\*\].*\n){3,20}/g;
            var regFeaturesList = /(.*)\n((\[\*\].*)\n){3,20}/g
            var featuresList = tempdescription.match(regFeaturesList);
            var lastLine = regFeaturesList.exec(featuresList);
            var regCheck1 = /.*:\s*$/gm;
            if (lastLine != undefined) {
                if (lastLine.length > 1) {
                    var lastLineRaw = lastLine[1];
                    if (!regCheck1.test(lastLineRaw) && !lastLineRaw.includes('[b]')) {
                        description = description.replace(featuresList, labelFeatures+featuresList);
                    }
                }
            }
        }

        //SysReq
        var regSysReq = /^(\[size\=3\]){0,1}\n{0,1}(\[(b|u|i|quote|align\=center|align\=left)\]\n{0,1}){0,5}\s*(System\sRequirements|Game\sSystem\sRequirements|Requirements|GOG\sSystem\sRequirements|Minimum\sSystem\sRequirements|System\sRequierments)\s*(:|\.){0,1}\s*(\n{0,1}\[\/(b|u|i|align|size)\]){0,5}(\s*:|:|)\n*(\n\[align\=(left|center)\]){0,1}/gmi
        var labelSysReq = "\n[quote][align=center][b][u]System Requirements[/u][/b][/align]\n";
        description = description.replace(regSysReq, labelSysReq);

        //Minimum
        var labelMinimum = "\n[b]Minimum[/b]";
        stringREG = /\n(\[\*\]\[(b|i)\]|((\s*|)\[\*\])|\[(b|i)\]|\*|)(\s*|)(Minimum\sSpecifications|Minimum\sSystem\sRequirements|Minimum\sRequirements|Minimum)(\s|)(:\s\[\/(b|i)\]|:\[\/(b|i)\]|\[\/(b|i)\]:|\[\/(b|i)\]|:)/gi;
        description = description.replace(stringREG, labelMinimum);

        //Recommended
        var labelRecommended = "\n[b]Recommended[/b]";
        stringREG = /\n(\[\*\]\[(b|i)\]|((\s*|)\[\*\])|\[(b|i)\]|\*|)(\s*|)(Recommended\sSpecifications|Recommended\sSystem\sRequirements|Re(c|cc)o(mm|m)ended)(\s|)(:\s\[\/(b|i)\]|:\[\/(b|i)\]|\[\/(b|i)\]:|\[\/(b|i)\]|:)/gi;
        description = description.replace(stringREG, labelRecommended);

        //OS
        var labelOS = "\n[*][b]OS[/b]:";
        stringREG = /\n(\[\*\]\[b\]|((\s*|)\[\*\])|\[b\]|\*|)(\s*|)(Supported\sOS|OS|Operating\sSystems|Operating\sSystem|Mac\sOS|System|Mac)(\s|)(:\s\[\/b\]|:\[\/b\]|\[\/b\]:|:)/gi;
        description = description.replace(stringREG, labelOS);

        //CPU
        var labelCPU = "\n[*][b]Processor[/b]:";
        stringREG = /\n(\[\*\]\[b\]|((\s*|)\[\*\])|\[b\]|\*|)(\s*|)(CPU\sType|CPU\sProcessor|CPU|Processor)(\s|)(:\s\[\/b\]|:\[\/b\]|\[\/b\]:|:)/gi;
        description = description.replace(stringREG, labelCPU);

        //CPU Speed
        var labelCPUSpeed = "\n[*][b]Processor Speed[/b]:";
        stringREG = /\n(\[\*\]\[b\]|((\s*|)\[\*\])|\[b\]|\*|)(\s*|)(CPU\sSpeed\sin\sMhz|Processor\sSpeed|CPU\sSpeed)(\s|)(:\s\[\/b\]|:\[\/b\]|\[\/b\]:|:)/gi;
        description = description.replace(stringREG, labelCPUSpeed);

        //Memory
        var labelRAM = "\n[*][b]Memory[/b]:";
        var regRAM = /\n(\[\*\]\[b\]|((\s*|)\[\*\])|\[b\]|\*|)(\s*|)(System\sRAM|RAM|System\sMemory|Memory)(\s|)(:\s\[\/b\]|:\[\/b\]|\[\/b\]:|:)/gi;
        description = description.replace(regRAM, labelRAM);

        //Storage
        var labelHDD = "\n[*][b]Storage[/b]:";
        var regHDD = /\n(\[\*\]\[b\]|((\s*|)\[\*\])|\[b\]|\*|)(\s*|)(Free\sHard\sDisk\sSpace|Hard\sDrive\sSpace|Hard\sDisk\sSpace|Hard\sDisk|Free\sSpace|Hard\sDrive|HDD\sSpace|HDD|Storage|Disk\sSpace|Free\sDisk\sSpace|Drive\sSpace|Available\sHard\sDisk\sSpace)(\s|)(:\s\[\/b\]|:\[\/b\]|\[\/b\]:|:)/gi;
        description = description.replace(regHDD, labelHDD);

        //Graphics
        var labelGPU = "\n[*][b]Graphics[/b]:";
        var regGPU = /\n(\[\*\]\[b\]|((\s*|)\[\*\])|\[b\]|\*|)(\s*|)(VGA|Graphics|Graphic\sCard|GPU|Video\sCard|Video|GFX)(\s|)(:\s\[\/b\]|:\[\/b\]|\[\/b\]:|:)/gi;
        description = description.replace(regGPU, labelGPU);

        var labelATIGPU = "\n[*][b]Graphics (ATI)[/b]:";
        var regATIGPU = /\n(\[\*\]\[b\]|((\s*|)\[\*\])|\[b\]|\*|)(\s*|)((Video\sCard|Video|Graphics)\s\(ATI\))(\s|)(:\s\[\/b\]|:\[\/b\]|\[\/b\]:|:)/gi;
        description = description.replace(regATIGPU, labelATIGPU);

        var labelNVidiaGPU = "\n[*][b]Graphics (NVidia)[/b]:";
        var regNVidiaGPU = /\n(\[\*\]\[b\]|((\s*|)\[\*\])|\[b\]|\*|)(\s*|)((Video\sCard|Video|Graphics)\s\(NVidia\))(\s|)(:\s\[\/b\]|:\[\/b\]|\[\/b\]:|:)/gi;
        description = description.replace(regNVidiaGPU, labelNVidiaGPU);

        var labelIntelGPU = "\n[*][b]Graphics (Intel)[/b]:";
        var regIntelGPU = /\n(\[\*\]\[b\]|((\s*|)\[\*\])|\[b\]|\*|)(\s*|)((Video\sCard|Video|Graphics)\s\(Intel\))(\s|)(:\s\[\/b\]|:\[\/b\]|\[\/b\]:|:)/gi;
        description = description.replace(regIntelGPU, labelIntelGPU);

        //Graphics RAM
        var labelGPURAM = "\n[*][b]Video Memory[/b]:";
        var regGPURAM = /\n(\[\*\]\[b\]|((\s*|)\[\*\])|\[b\]|\*|)(\s*|)(Video\sRAM|VRAM|Video\sMemory|Video\sMemory\s\(VRam\))(\s|)(:\s\[\/b\]|:\[\/b\]|\[\/b\]:|:)/gi;
        description = description.replace(regGPURAM, labelGPURAM);

        //Sound
        var labelSound = "\n[*][b]Sound Card[/b]:";
        var regSound = /\n(\[\*\]\[b\]|((\s*|)\[\*\])|\[b\]|\*|)(\s*|)(Sound\sCard|Sound)(\s|)(:\s\[\/b\]|:\[\/b\]|\[\/b\]:|:)/gi;
        description = description.replace(regSound, labelSound);

        //DirectX
        var labelDirectX = "\n[*][b]DirectX[/b]:";
        description = description.replace("DirectX®", "DirectX");
        stringREG = /\n(\[\*\]\[b\]|((\s*|)\[\*\])|\[b\]|\*|)(\s*|)(DirectX\sVersion|DirectX®|DirectX®\sVersion|DirectX|Direct\sX|DX)(\s|)(:\s\[\/b\]|:\[\/b\]|\[\/b\]:|:)/gi;
        description = description.replace(stringREG, labelDirectX);

        //Notes
        var labelAdditional = "\n[*][b]Additional Notes[/b]:";
        stringREG = /\n(\[\*\]\[b\]|((\s*|)\[\*\])|\[b\]|\*|)(\s*|)(Additional\sNotes|Additional|Notice|Please\snote|Notes)(\s|)(:\s\[\/b\]|:\[\/b\]|\[\/b\]:|:)/gi;
        description = description.replace(stringREG, labelAdditional);

        //Other
        var labelOther = "\n[*][b]Other[/b]:";
        var regOther = /\n(\[\*\]\[b\]|((\s*|)\[\*\])|\[b\]|\*|)(\s*|)(Other\sRequirements|Other|Peripherals)(\s|)(:\s\[\/b\]|:\[\/b\]|\[\/b\]:|:)/gi;
        description = description.replace(regOther, labelOther);

        //Network
        var labelNetwork = "\n[*][b]Network[/b]:";
        var regNetwork = /\n(\[\*\]\[b\]|((\s*|)\[\*\])|\[b\]|\*|)(\s*|)(Network|Internet)(\s|)(:\s\[\/b\]|:\[\/b\]|\[\/b\]:|:)/gi;
        description = description.replace(regNetwork, labelNetwork);

        //Drive
        var labelDrive = "\n[*][b]Drive[/b]:";
        stringREG = /\n(\[\*\]\[b\]|((\s*|)\[\*\])|\[b\]|\*|)(\s*|)(CD\sDrive\sSpeed|Disc\sDrive|CD-ROM|DVD\sDrive)(\s|)(:\s\[\/b\]|:\[\/b\]|\[\/b\]:|:)/gi;
        description = description.replace(stringREG, labelDrive);

        //Supported Joysticks Controllers
        var labelControllers = "\n[*][b]Controllers[/b]:";
        var regControllers = /\n(\[\*\]\[b\]|((\s*|)\[\*\])|\[b\]|\*|)(\s*|)(Controllers|Supported\sJoysticks|Input)(\s|)(:\s\[\/b\]|:\[\/b\]|\[\/b\]:|:)/gi;
        description = description.replace(regControllers, labelControllers);

        //pcgw
        var pcgwOS = /\n(Operating\sSystem\s\(OS\)\t)(.*)\t(.*)/i;
        var pcgwCPU = /\n(Processor\s\(CPU\)\t)(.*)\t(.*)/i;
        var pcgwRAM = /\n(System\sMemory\s\(RAM\)\t)(.*)\t(.*)/i;
        var pcgwHDD = /\n(Hard\sDisk\sDrive\s\(HDD\)\t)(.*)\t(.*)/i;
        var pcgwGPU = /\n(Video\sCard\s\(GPU\)\t)(.*)\t(.*)/i;
        if (pcgwOS.test(description)) {
            var before = "";
            var after = "";
            var arrayOS = description.match(pcgwOS);
            var arrayCPU = description.match(pcgwCPU);
            var arrayHDD = description.match(pcgwHDD);
            var arrayRAM = description.match(pcgwRAM);
            var arrayGPU = description.match(pcgwGPU);
            if (arrayCPU[3] != "" || arrayGPU[3] != "" || arrayRAM[3] != "" || arrayHDD[3] != "" || arrayOS[3] != "") {
                before = labelSysReq+labelMinimum;
                after = labelRecommended;
                after = arrayOS[3] != "" ? after+labelOS+" "+arrayOS[3]: after;
                after = arrayCPU[3] != "" ? after+labelCPU+" "+arrayCPU[3]: after;
                after = arrayRAM[3] != "" ? after+labelRAM+" "+arrayRAM[3]: after;
                after = arrayGPU[3] != "" ? after+labelGPU+" "+arrayGPU[3]: after;
                after = arrayHDD[3] != "" ? after+labelHDD+" "+arrayHDD[3]: after;
            }

            description = description.replace(pcgwOS, before+labelOS+" "+arrayOS[2]);
            description = description.replace(pcgwCPU, labelCPU+" "+arrayCPU[2]);
            description = description.replace(pcgwRAM, labelRAM+" "+arrayRAM[2]);
            description = description.replace(pcgwHDD, labelHDD+" "+arrayHDD[2]);
            description = description.replace(pcgwGPU, labelGPU+" "+arrayGPU[2]+after);
        }


        if (description.includes("[quote]") && !description.includes("[/quote]")) {
            description = description.replace("\n[/align]", "[/quote]");
            if (!description.includes("[/quote]")) {
                description = description + "[/quote]";
            }
        }

        if (!description.includes("\n"+labelFeatures)) {
            description = description.replace(labelFeatures, "\n"+labelFeatures);
        }

        if (description.includes("\n[b]Minimum[/b]") && !description.includes("\n[b]Recommended[/b]")) {
            description = description.replace("\n[b]Minimum[/b]", "\n");
        }
        var regLines = /\[\/align\]\n*/gi;
        description = description.replace(regLines, "[/align]\n");

        var regFeaturesLines2 = /\n(-|■|★|•)(\t|\s)/g;
        description = description.replace(regFeaturesLines2, "\n[*]");

        var regFeaturesLines = /\n*\s*\[\*\]\s*/g;
        description = description.replace(regFeaturesLines, "\n[*]");

        var regSpacing1 = /\n{2,10}/g;
        description = description.replace(regSpacing1, "\n\n");

        var regSpacing2 = /\n{2,10}\[align\=center\]/g;
        description = description.replace(regSpacing2, "\n\n[align=center]");

        var regSpacing3 = /\n*\[quote\]/g;
        description = description.replace(regSpacing3, "\n\n[quote]");

        var regSpacing5 = /\nundefined\n*\[\/quote\]/g;
        description = description.replace(regSpacing5, "\n[/quote]");

        var regSpacing4 = "\n"+labelRecommended
        description = description.replace(regSpacing4, labelRecommended);

        var regQuote = /\n*\[\/quote\].*/gi;
        description = description.replace(regQuote, "[/quote]");
        return description;
    }
})();