// ==UserScript==
// @name         NVD_extract_values
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  simple code pour extraire les scores et vecteurs pour une cve depuis nvd
// @author       cyril D.
// @match        https://nvd.nist.gov/vuln/detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nist.gov
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511025/NVD_extract_values.user.js
// @updateURL https://update.greasyfork.org/scripts/511025/NVD_extract_values.meta.js
// ==/UserScript==

(function() {


    function extract_nvd_dict_values(returnFonction = null, doc=document, debug=false){ // nvd_return = returnFonction(nvd_return, version, type_, tail, score, vector) et let nvd_return = new Map();
                // v1.0 du 01/10/2024
        if (returnFonction === null) {returnFonction=function default_returnFonction(nvd_return, version, type_, tail, score, vector) {return nvd_return;}}
        let id_shell_score="Cvss<version><type>CalculatorAnchor<tail>";
        let id_shell_vector="vuln-cvss<version>-<type>-vector";
        let class_shell_vector="tooltipCvss<version><type>Metrics";

        let list_version=[2,3,4];
        let list_type=["","Nist", "Cna", "Adp"];
        let list_tail=["", "NA"];

        let list_na=["n/a", "na", "ØØ"]
        let nvd_return = new Map();

        let what, score, vector, prefixe_map;
        for (const version of list_version) {
            for (const type_ of list_type) {
                for (const tail of list_tail) {
                    let lowerType=type_.toLowerCase();
                    if(type_ == "" || lowerType == "nist" || lowerType == "nvd"){
                        what="";
                    }else{
                        what="_CNA";
                    }
                    prefixe_map = `v${version}${what}`;
                    score=""
                    vector=""
                    let id_score = id_shell_score.replace("<version>",version).replace("<type>",type_).replace("<tail>",tail);
                    try{
                        let elem_score = doc.getElementById(id_score);
                        score = elem_score.innerText;
                        score = score.trim();
                        score = score.split(' ')[0];
                        if(debug){console.log(prefixe_map, score.toLowerCase());}
                        if(!list_na.includes(score.toLowerCase())) {
                            score=parseInt(score.replace(/\./g, ''),10)/10; // remplace le texte x.y en xy puis divise par 10 pour recuperer la version numérique
                        }
                    }catch{}
                    let id_vector = id_shell_vector.replace("<version>",version).replace("<type>",type_).replace("<tail>",tail).toLowerCase();
                    try{
                        let elem_vector = doc.getElementById(id_vector);
                        vector=elem_vector.innerText;
                    }catch{ // on va essayer avec la class
                        let class_vector = class_shell_vector.replace("<version>",version).replace("<type>",type_).replace("<tail>",tail);
                        try{
                            let elems_vector = doc.getElementsByClassName(class_vector);
                            if(elems_vector.length>0){ // on prend le premier
                                vector=elems_vector[0].innerText;
                            }
                        }catch{}
                    }
                    if(debug){console.log(prefixe_map, score, vector);}
                    nvd_return = returnFonction(nvd_return, version, type_, tail, score, vector)
                }
            }
        }
        return nvd_return
    }
    console.log(extract_nvd_dict_values(null, document,true));

})();