// ==UserScript==
// @name        LWM Market Utility
// @author      Prozyk
// @description Add Cost-per-battle to all market lots
// @match       https://www.lordswm.com/auction.php?*\
// @match       https://www.lordswm.com/auction.php?*art_type*
// @namespace https://greasyfork.org/users/722588
// @version 0.0.1.20210113191835
// @downloadURL https://update.greasyfork.org/scripts/419410/LWM%20Market%20Utility.user.js
// @updateURL https://update.greasyfork.org/scripts/419410/LWM%20Market%20Utility.meta.js
// ==/UserScript==




//Put above inside Userscript definition if also want cpb on all *weapons* page, rather than only art_specific
//Do at own risk, since it will initiate lot of requests to obtain all repair costs, might get admin's attention



// 1] Detect Table
// 3] Catch Relevant Values: Price, Dura, Name
// 4] Parse Repair Cost, store to name so don't have to recalculate
// 5] Attach form asking repair rate
// 6] Calculate CPB
// 7] Add Cpb, Repair till, and number of battles in Columns
// 8] Add sort abiility
// 9] Make CPB sort option part of dropdown

// (Maybe) 
// Add generic CPB calculator above page
// Contact Author with more ideas. 


console.log("Market Utility Script is On");
var xpath = "//td[contains(text(),'Bids')]";
var BidsElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

var table = BidsElement.parentNode.parentNode;
var rows = table.childNodes;
var settings = rows[0];
var header = rows[1];
var len = rows.length;

var  smithEffi = 90;
var smithCharge = 101;

var price = [];
var dura_cur = [];
var dura_max = [];
var art_name = [];
var repair_cost = [];
var repair_cost_dict = {};
var initiated = false;

var current_url = document.location.href;

var sleep_time = 10000;
if (current_url.includes("art_type")) sleep_time = 2000;


function extend_header(){
    var repair_header = document.createElement('td');
    repair_header.innerHTML = "<span align = center> Repair Cost </span> ";
    repair_header.setAttribute("width", "100");
    header.appendChild(repair_header);

    var cpb_header = document.createElement('td');
    cpb_header.innerHTML = "<span align = center> CPB </span> ";
    cpb_header.setAttribute("width", "100");
    header.appendChild(cpb_header);

    var final_header = document.createElement('td');
    final_header.innerHTML = "<span align = center> Repair Till </span> ";
    final_header.setAttribute("width", "100");
    header.appendChild(final_header);

    var usage_header = document.createElement('td');
    usage_header.innerHTML = "<span align = center> Total Fights </span> ";
    usage_header.setAttribute("width", "100");
    header.appendChild(usage_header);
}
function add_cpb_form(){
    settings.childNodes[0].setAttribute('colspan', "2");
    settings.childNodes[1].setAttribute('align', "center");
    settings.childNodes[1].setAttribute('valign', "center");
    settings.childNodes[1].setAttribute('colspan', "3");

    var myform = document.createElement('td');
    myform.setAttribute("align", "right");
    myform.setAttribute("valign", "center");
    myform.setAttribute("colspan", "4");
    var str =  "<table align = center>  <tr><td align = center> <b> Cost Per Battle</b> </td> </tr>";
    str +=  "<tr> <td align = center > Smith Efficiency :<input type=text id=smithEffi size = '4' value='90'>%</td></tr>";
    str += " <tr> <td align = center> Smith Charge <input type=text id=smithCharge  size = '4' value='101'>%</td></tr>"
    str += "<tr><td align = center> <input type = button value = 'Calculate' id = 'calculate' </td> </tr></table> ";
    myform.innerHTML = str;
    settings.appendChild(myform);

    document.getElementById('calculate').onclick = upgrade_table;
    document.getElementById('smithEffi').oninput = function(){
        smithEffi = document.getElementById('smithEffi').value
    };
    document.getElementById('smithCharge').oninput = function(){
        smithCharge = document.getElementById('smithCharge').value
    };
}
function parse_table(){
    var arts = new Set();
    for(var i = 2; i<len; i++){
        art_name[i] = rows[i].childNodes[0].textContent.split('-')[1].split('[')[0].trim();
        durability = rows[i].childNodes[0].textContent.split("Durability: ")[1];
        if (durability.includes("pcs")) durability = durability.substring(0, durability.length-6)
        dura_cur[i] = Number(durability.split('/')[0]);
        dura_max[i]= Number(durability.split('/')[1].split(" ")[0].match(/\d+/)[0]);

        price[i] = Number(rows[i].childNodes[2].textContent.replaceAll(',', '').match(/\d+/)[0]);
//        console.log(rows[i].childNodes[2].textContent.replace(, price[i]);
    
        if(!arts.has(art_name[i])){
            get_repair_cost(i);    
            arts.add(art_name[i]);
        }
    }
    console.log(arts);
}
function get_repair_cost(i){
    art_url = rows[i].childNodes[0].querySelectorAll('a')[1].href;
    var req = new XMLHttpRequest();
    req.open("GET", art_url, true); 
    req.overrideMimeType('text/html; charset=windows-1251');
    req.send();
    req.onreadystatechange = function(){
        var text = req.responseText;
    
        repair_cost_dict[art_name[i]] = Number(text.split("Repairing")[1].replace(',', '').split('<td>')[2].split('</td>')[0]);
        console.log(art_name[i], repair_cost_dict[art_name[i]]);
    }
}
function set_repairs(){

    new Promise(r => setTimeout(r, sleep_time)).then(() => {
        for(var i = 2; i<len; i++){
            repair_cost[i] = repair_cost_dict[art_name[i]];
            rows[i].innerHTML += "<td width=100> </td>".repeat(4);  
            rows[i].childNodes[5].innerHTML = repair_cost[i];
        }
    });
}
function set_opt_cpb(){        
    for(var i = 2; i<len; i++){
        var opt_cpb = cpb_calc(dura_cur[i], dura_max[i], price[i], repair_cost[i]);
        console.log(art_name[i], dura_cur[i], dura_max[i], price[i], repair_cost[i]);
        console.log(opt_cpb);
//         rows[i].childNodes[6].innerHTML = "Hello";        
        rows[i].childNodes[6].innerHTML = opt_cpb[0];
        rows[i].childNodes[7].innerHTML = "0/" + opt_cpb[1];        
        rows[i].childNodes[8].innerHTML = opt_cpb[2];
    }
}
function cpb_calc(currDura, maxDura, iniCost, repCost) {
    var tempMaxDura, tempDura, totDura, optDura, optFights;
    var iniCost, repCost;
    var se, sc;
    var totCostTillNow, costPerBattle = 0, minCPB;
    var i;
    var repCount = 1;
    //Assigning the values
    

    se = smithEffi / 100;
    sc = smithCharge / 100;
    tempMaxDura = maxDura;
    tempDura = currDura;
    totDura = tempDura;
    totCostTillNow = iniCost;
    costPerBattle = totCostTillNow / totDura;
    minCPB = costPerBattle;
    optDura = tempMaxDura;
    optFights = totDura; 


    for(i=1; i<=maxDura; i++)
    {
        totCostTillNow += parseFloat(repCost * sc);
        tempDura = parseInt(tempMaxDura * se);
        totDura += tempDura;
        costPerBattle = (totCostTillNow / parseFloat(totDura));
        tempMaxDura -= 1;
        if ( minCPB >=  costPerBattle )
        {
            minCPB = costPerBattle;
            optDura = tempMaxDura;
            optFights = totDura;
        }
    }
    
    optOut = [eval(minCPB.toFixed(2)), optDura, optFights];
    return optOut;
}
function add_sort_form(){
    dropdown = document.getElementById("ss")
    
    var option = document.createElement("option");
    option.value = "304";
    option.textContent = "Cost per Battle: Ascending";
    dropdown.appendChild(option);

    var option2 = document.createElement("option");
    option2.value = "0";
    option2.textContent = "Random Order";
    dropdown.appendChild(option2);
    
    dropdown.onchange = function(){
        if(dropdown.value != "304" && dropdown.value != "0") findsort(); //predefined by them
        else if (dropdown.value == "304") cpb_sort();
    }    
}
function cpb_sort(){
    
    var sign_sort = -1;
    var NumberC = 6;
	var sorted = [];
	var m, t, p, f, i, j;
	for(i=2; i<len; i++){
		sorted[i] = [];
		for(j=0; j<9; j++){
			sorted[i][j] = rows[i].childNodes[j].innerHTML;
		}
	}
	while(true){
		f = 0;
		for(i=2; i<len-1; i++){
			m = sign_sort*Number(sorted[i][NumberC]);
			t = sign_sort*Number(sorted[i+1][NumberC]);
			if(m<t){
				f = 1;
				for(j=0; j<9; j++){
					p = sorted[i][j];
					sorted[i][j]=sorted[i+1][j];
					sorted[i+1][j] = p;
				}
			}
		}
		if(f == 0)break;
	}
	for(i=2; i<len ; i++){
		for(j=0; j<9; j++){
			rows[i].childNodes[j].innerHTML = sorted[i][j];
		}
	}
}



function upgrade_table(){

    if(!initiated){
        initiated = true;
        add_cpb_form();
        document.getElementById('calculate').disabled =  true;
        extend_header();
        parse_table();
        set_repairs();

        new Promise(r => setTimeout(r, sleep_time + 2000)).then(() => {
            set_opt_cpb();
            document.getElementById('calculate').disabled = false;
            add_sort_form();
        })
    }
    else{
        document.getElementById("ss").value = "0";
        set_opt_cpb();
    }
}


upgrade_table();



















