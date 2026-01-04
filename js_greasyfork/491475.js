// ==UserScript==
// @name         VT - results export as csv
// @namespace    http://tampermonkey.net/
// @version      2023-12-27_v0.1
// @description  Propose le téléchargement des résultats sous la forme d'un fichier CSV
// @author       cyrilyxe
// @match        https://www.virustotal.com/gui/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=virustotal.com
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/491475/VT%20-%20results%20export%20as%20csv.user.js
// @updateURL https://update.greasyfork.org/scripts/491475/VT%20-%20results%20export%20as%20csv.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //generique ****************************************
    function NodeList_to_Array(nodeLst){
        return Array.prototype.slice.call(nodeLst);
    }
    function convert_querySelectorAll_to_array(nodeLst){
        return NodeList_to_Array(nodeLst);
    }

    function removeItem(arrayIn, item, occurences=1){ // fonction qui retire un objet de la liste <occurences> fois
        var index = arrayIn.indexOf(item);
        if(index>=0){
            var x = arrayIn.splice(index, occurences);
        }
        return arrayIn;
    }// ok
    function removeItems(arrayIn, item){ // fonction qui supprime toutes les occurences dans une liste
        var previousLength;
        do{
            previousLength = arrayIn.length;
            arrayIn = removeItem(arrayIn, item);
        }while(arrayIn.length!=previousLength);
        return arrayIn;
    } // ok
    function removeAllItems(arrayIn, items){ // fonction qui supprime toutes les occurences dans une liste de tous les items
        var item, i;
        for(i=0;i<items.length;i++){
            item = items[i]
            arrayIn = removeItems(arrayIn, item)
        }
        return arrayIn;
    } // ok
    //**************************************************

    //Work with shadows ********************************
    function recurciveShadows(DOMobject, lst_shadows=[]){ // fonction qui retourne les shadows (equivalent de iframe ou d'objet dans lesquel il faut rentrer)
        var i, children, child, nodeName
        if(DOMobject.shadowRoot){
            //console.log("shadow : ",DOMobject.nodeName, DOMobject);
            lst_shadows.push(DOMobject)
            children = NodeList_to_Array(DOMobject.shadowRoot.host.childNodes);
            if(children.length<=0){children = NodeList_to_Array(DOMobject.shadowRoot.childNodes);}
        }else{
            children = NodeList_to_Array(DOMobject.childNodes);
        }
        for(i=0;i<children.length;i++){
            child = children[i];
            //console.log("test ",child);
            lst_shadows = recurciveShadows(child, lst_shadows); // extend lst_shadows avec le resultat
        }
        return(lst_shadows);
    } // OK

    function className_for_querySelectorAll(className){ // fonction qui transforme une liste de classe en une liste pour queryselectorALl
        className = "."+className;
        className = className.replace(" ", ".");
        className = className.replace("..", ".");
        return className;
    } // ok
    function getElementsByClassName(className, base = document, lst_shadows=[]){ // fonction qui retourne la liste des objets de la classe meme si il y a des shadows
        var i, DOMobject, lst_DOMobjects_inShadow;
        className = className_for_querySelectorAll(className);
        var lst_DOMobjects = NodeList_to_Array(base.querySelectorAll(className));

        for(i=0; i<lst_shadows.length;i++){
            DOMobject = lst_shadows[i].shadowRoot;
            lst_DOMobjects_inShadow = NodeList_to_Array(DOMobject.querySelectorAll(className));
            lst_DOMobjects.push.apply(lst_DOMobjects, lst_DOMobjects_inShadow); // extend la list : https://stackoverflow.com/questions/1374126/how-to-extend-an-existing-javascript-array-with-another-array-without-creating
            // Array.prototype.push.apply(lst_DOMobjects,lst_DOMobjects_inShadow) ; // extend la list : https://stackoverflow.com/questions/1374126/how-to-extend-an-existing-javascript-array-with-another-array-without-creating
        }
        return lst_DOMobjects;
    } // OK

    function listShadowObjects(display=true, DOMobject=null){ // fonction qui retourne la liste des shadows
        if(DOMobject==null) {DOMobject = document.querySelector("body");}
        var lst_shadows = recurciveShadows(DOMobject);
        if(display){console.log(lst_shadows);}
        return lst_shadows;
    } // OK
    //**************************************************

    //Extraction des resultats VT *********************
    function get_VT_resultType(DOMobject){ // retourne le premier attribut apres nettoyage de ceux qui ne pourrait pas etre un indicateur ou nom
        var name="???"
        var items=["href", "class"]
        var arrayIn = DOMobject.getAttributeNames()
        arrayIn = removeAllItems(arrayIn, items);
        if(arrayIn.length>0){
            name = DOMobject.getAttribute(arrayIn[0]);
        }
        return name;
    } // ok
    function get_VT_header(DOMobject){ // retourne la premiere classe apres nettoyage de ceux qui ne pourrait pas etre un indicateur ou nom
        var name="???"
        var items=["column", "text-center", "center", "bg-transparent", "hstack"]
        var arrayIn = DOMobject.className.split(" ");
        arrayIn = removeAllItems(arrayIn, items);
        if(arrayIn.length>0){
            name = DOMobject.getAttribute(arrayIn[0]);
        }
        return name;
    }//ok

    function deduplication_dict_to_list_of_dict(lst_items, separator="\n"){ // fonction qui pour chacun des champs contient un separateur, sera splitté et recréé
        if(!Array.isArray(lst_items)){lst_items = [lst_items];}
        var i, item, keys, key, value, splittedValue, deduplicateOnce=false;

        do{
            for(i=0;i<lst_items.length;i++){
                item = lst_items[i];
                keys = Object.keys(item);

                for(key of keys) {
                    value = item[key];
                    splittedValue = value.split(separator);
                    if(splittedValue.length>1){ // il faut dedupliquer

                    }
                }
            }
        }while(deduplicateOnce);

        return lst_items;

    }
    function get_VT_result_row_as_list_of_dict(row){// potentiellement peut avoir des lignes doublées (innerText : avec \n ; donc duplicaiton des autres champs par sous ligne
        var lst_divs = NodeList_to_Array(row.querySelectorAll("div"));
        var lst_items, item={};

        var i, div, divHeader;
        for(i=0;i<lst_divs.length;i++){
            div = lst_divs[i];
            divHeader = get_VT_header(div);
            item[divHeader] = div.innerText;
        }

        // deduplication si necessaire (un champ contient un \n
        lst_items = deduplication_dict_to_list_of_dict(item);
    }
    function get_VT_result_rows_as_list_of_dict(rows){
        var i,row, lst_items=[];

        for(i=0;i<rows.length;i++){
            row = rows[i];

            if(row.className.indexOf("first")>=0){ // skip first
                continue;
            }
            lst_items.push.apply(lst_items, get_VT_result_row_as_list_of_dict(row)); // extendion ; extend
        }
        return lst_items;
    }

    function get_VT_result_rows(DOMobject){
        var className="entity-row";
        var lst_shadows = listShadowObjects(true, DOMobject);
        var lst_DOMobjects = getElementsByClassName(className, DOMobject, lst_shadows);

        var lst_items = get_VT_result_rows_as_list_of_dict(lst_DOMobjects);
        return lst_items
    }

    function get_VT_results(){
        var className="search-results";
        var lst_shadows = listShadowObjects(false);
        var lst_DOMobjects = getElementsByClassName(className, document, lst_shadows);

        var DOMobject, i, resultType, resultRows;
        console.log("lst_DOMobjects",lst_DOMobjects);
        for(i=0;i<lst_DOMobjects.length;i++){ // parcours chacun des type de resultat
            DOMobject = lst_DOMobjects[i];
            resultType=get_VT_resultType(DOMobject);

            resultRows = get_VT_result_rows(DOMobject);
            console.log(resultType,resultRows);
        }
    }

    //**************************************************

    function test(){
        get_VT_results();
        // console.log(resultType,resultRows);
    }

    //document.querySelector("vt-ui-shell").querySelector("search-view")
    //.shadowRoot

    GM.registerMenuCommand("list shadows",listShadowObjects);
    GM.registerMenuCommand("test",test);


    function getListFrom_result(resultBlock){ // fonction qui retourne la liste correspondante au résultat
        var lst_items = [];
    }
    function getListFrom_results(lst_resultBlock){ // fonction qui retourne les listes correspondantes au résultats
        var resultBlock, i;
        var lst_lst_items = [];

        for(i=0;i<lst_resultBlock.length;i++){
            resultBlock = lst_resultBlock[i];
            lst_lst_items.push(getListFrom_result(resultBlock));
        }
        return lst_lst_items;
    } // ok ?

    function getResults_RAW(){ // fonction qui retourne les blocs de resultats
        var className="search-results";
        var results;

        results = document.getElementsByClassName(className)
    }





    GM.registerMenuCommand("export Results",getResults_RAW);



    function getHeader_fromActualResult(){
        var className="first";
        var recordType=""
    }
    function getItems(){
        var className="entity-row";
    }
    function getAllItemFromClassName(className){

    }
    function getAllResult(){
        var className="search-results-body";
    }
    
})();