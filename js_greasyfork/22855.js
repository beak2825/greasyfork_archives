// ==UserScript==
// @name           Work Units Calculator BASIC
// @description    This script will calculate each VI team members work units based on number of migrations of each type. Carriers and terminations are hardcoded in since there is currently no tracking in place for these type of cases.
// @author         Alexander Douglas
// @include        http*://commercehub.my.salesforce.com*
// @version        0.6
// @namespace https://greasyfork.org/users/7909
// @downloadURL https://update.greasyfork.org/scripts/22855/Work%20Units%20Calculator%20BASIC.user.js
// @updateURL https://update.greasyfork.org/scripts/22855/Work%20Units%20Calculator%20BASIC.meta.js
// ==/UserScript==



window.addEventListener("load", function(e) {
    var nameLookup = [];
    var people = [];

    if(scrapeData(nameLookup,people)){ //Check to see if the table contains migration totals is present, if so then scrape the user data
        sortList(people); //Sort the user data by total work units
        createLeaderBoard(people); //Add a table to webpage displaying a leaderboard of workunits
    }
}, false);





/****************FUNCTIONS******************/

function Person(name){
    this.name = name;
    this.total = 0;
    this.migrations = 0;
    this.newMigrations = 0;
    this.browser = 0;
    this.integrated = 0;
    this.upgrade = 0;
    this.comms = 0;
    this.terms = 0;
}

/**
* Check to see if the table element containing total migrations exists on the current SalesForce page. If so, then scrape that data to populate two arrays.
* nameLookup - this is a array of all the names of each team member
* people - this is an array of Person objects. Each person will have a name and total work units value.
*/
function scrapeData(nameLookup,people){
    var tableRows;
    var tableCols;
    var name;
    var type;
    var amount;

    if(document.getElementById("dashboard_0_3")){   //this is for the Main Dashboard SalesForce
        tableRows = document.getElementById("dashboard_0_3").childNodes[0].childNodes[0].childNodes[0].childNodes[0].getElementsByTagName('tr');
        for(var i = 1; i < tableRows.length; i++){
           tableCols = tableRows[i].getElementsByTagName('td');
           name = tableCols[0].innerHTML.replace(/^<span[^>]*>|<\/span>$/g, '');
           type = tableCols[1].innerHTML.replace(/^<span[^>]*>|<\/span>$/g, '');
           amount = tableCols[2].innerHTML.replace(/^<span[^>]*>|<\/span>$/g, '');

           if(nameLookup.indexOf(name) < 0){
               nameLookup.push(name);
               people.push(new Person(name));
           }
           people[nameLookup.indexOf(name)].total += getWorkUnits(name,type,amount);
        }
        return true;
    }
    else if(document.getElementById("dashboard_0_0")){   //this is for my custom SalesForce Dashboard
        tableRows = document.getElementById("dashboard_0_0").childNodes[0].childNodes[0].childNodes[0].childNodes[0].getElementsByTagName('tr'); //Get the table element that holds migration totals
        for(var j = 1; j < tableRows.length; j++){  //loop through each element of the table to get the information on migrations
            tableCols = tableRows[j].getElementsByTagName('td');
            name = tableCols[0].innerHTML.replace(/^<span[^>]*>|<\/span>$/g, ''); //Get the persons name
            type = tableCols[1].innerHTML.replace(/^<span[^>]*>|<\/span>$/g, ''); //Get the migration type
            amount = tableCols[2].innerHTML.replace(/^<span[^>]*>|<\/span>$/g, ''); //Get the total migrations of that type for the current person

            if(nameLookup.indexOf(name) < 0){ //Check to see if the person already exists in nameLookup and people, if not push them into the array
                nameLookup.push(name);
                people.push(new Person(name));
            }

            if(type == "OrderStream" || type == "ProductStream" || type == "OrderStream and ProductStream")
               type = "Termination";
            people[nameLookup.indexOf(name)].total += getWorkUnits(name,type,amount);

            if(type != "Termination") //Exclude Terminations from total migrations
                people[nameLookup.indexOf(name)].migrations += amount*1;
            if(type == "Browser" || type =="Integrated") //Determine new business only
                people[nameLookup.indexOf(name)].newMigrations += amount*1;
            if(type == "Browser")
                people[nameLookup.indexOf(name)].browser = amount*1;
            else if(type == "Integrated")
                people[nameLookup.indexOf(name)].integrated = amount*1;
            else if(type == "Upgrade")
                people[nameLookup.indexOf(name)].upgrade = amount*1;
            else if(type == "Comms")
                people[nameLookup.indexOf(name)].comms = amount*1;
            else if(type == "Termination")
                people[nameLookup.indexOf(name)].terms += 0;

        } //END OF looping through table to get data
        return true;
    }
    else
        return false;
}


/**
* Given a persons name, migration type, and amount of migrations, calculate and return their total work units for that type of migration.
*/
function getWorkUnits(name,type,amount){
    var carrier = 0;
    var terms = 0;

    //These vars identify how many carriers and/or terminations a team member has since there is currently no automated tracking
    //var jayCarriers = 5;
    //var alexCarriers = 4;
    var jayCarriers = 0;
    var alexCarriers = 0;
    var jayCarriersNew = 0;
    var alexCarriersNew = 0;

    if(type == "Browser") //Calculate browser work units
       return amount*1.75;
    else if(type == "Integrated"){ //Calculate integrated work units (carriers and terminations included)
        if(name == "Jay Saunders"){
            carrier = jayCarriers * 18;
            carrier = carrier + (jayCarriersNew * 20);
        }
        else if(name == "Alex Douglas"){
            carrier = alexCarriers * 18;
            carrier = carrier + (alexCarriersNew * 20);
        }
        return (amount*7) + carrier;
    }
    else if(type == "Upgrade") //Calculate Upgrade work units
        return amount*6;
    else if(type == "Comms") //Calculate Comms work units
        return amount*4;
    else if(type == "Termination" || type == "OrderStream" || type == "ProductStream" || type == "OrderStream and ProductStream") //Calculate Terminations work units
        return 0;
}


/**
* Sort a list of people based on their total work units
*/
function sortList(people){
   for(var y = 0; y < people.length-1; y++){
       var max = y;
       for (var x = y+1; x < people.length; x++){
           if (people[x].total > people[max].total)
           max = x;
       }
       if(max != y){
           var b = people[y];
           people[y] = people[max];
           people[max] = b;
       }
   }
}


/**
* Create a <table> containing names and work units and add it to the webpage
*/
function createLeaderBoard(people){
   var text = "<table class='list'><tr><th>Rank</th><th>Name</th><th>Total Work Units</th><th>Total Migrations</th><th>New Business</th></tr>";
   var c = 1;
   for(var i = 0; i < people.length; i++){
       text = text + "<tr><td>" + c + "</td><td>" + people[i].name + "</td><td>" + people[i].total + "</td><td>" + people[i].migrations + "</td><td>" + people[i].newMigrations + "</td>";
       c++;
   }
   text = text + "</table>";


   var bLeader = calcMaxB(people);
   var iLeader = calcMaxI(people);
   var uLeader = calcMaxU(people);
   var cLeader = calcMaxC(people);
   var newBLeader = calcMaxNewB(people);
   var mLeader = calcMigrations(people);
   //var tLeader = calcMaxT(people);

   text += "<br/><b><u>Most Browsers:</u></b> " + bLeader;
   text += "<br/><b><u>Most Integrated:</u></b> " + iLeader;
   text += "<br/><b><u>Most Upgrades:</u></b> " + uLeader;
   text += "<br/><b><u>Most Comms:</u></b> " + cLeader;
   text += "<br/><b><u>Most Migrations:</u></b> " + mLeader;
   text += "<br/><b><u>Most New Business:</u></b> " + newBLeader;
   //text += "<br/><b><u>Most Terminations:</u></b> " + tLeader;

   if(document.getElementById("dashboard_0_3"))
       document.getElementById("dashboard_0_3").innerHTML = document.getElementById("dashboard_0_3").innerHTML + text;
   else
       document.getElementById("dashboard_0_0").innerHTML = document.getElementById("dashboard_0_0").innerHTML + text;
}


function calcMaxB(people){
    var max = 0;
    var leader = "";

    for(var j=0; j<people.length; j++){
        if(people[j].browser > max){
            max = people[j].browser * 1;
            leader = people[j].name;
        }
        else if(people[j].browser == max){
            leader += ", " + people[j].name;
        }
    }
    return leader;
}
function calcMaxI(people){
    var max = 0;
    var leader = "";

    for(var j=0; j<people.length; j++){
        if(people[j].integrated > max){
            max = people[j].integrated * 1;
            leader = people[j].name;
        }
        else if(people[j].integrated == max){
            leader += ", " + people[j].name;
        }
    }
    return leader;
}
function calcMaxU(people){
    var max = 0;
    var leader = "";

    for(var j=0; j<people.length; j++){
        if(people[j].upgrade > max){
            max = people[j].upgrade * 1;
            leader = people[j].name;
        }
        else if(people[j].upgrade == max){
            leader += ", " + people[j].name;
        }
    }
    return leader;
}
function calcMaxC(people){
    var max = 0;
    var leader = "";

    for(var j=0; j<people.length; j++){
        if(people[j].comms > max){
            max = people[j].comms * 1;
            leader = people[j].name;
        }
        else if(people[j].comms == max){
            leader += ", " + people[j].name;
        }
    }
    return leader;
}
function calcMaxT(people){
    var max = 0;
    var leader = "";

    for(var j=0; j<people.length; j++){
        if(people[j].terms > max){
            max = people[j].terms * 1;
            leader = people[j].name;
        }
        else if(people[j].terms == max){
            leader += ", " + people[j].name;
        }
    }
    return leader;
}
function calcMaxNewB(people){
    var max = 0;
    var leader = "";

    for(var j=0; j<people.length; j++){
        if(people[j].newMigrations > max){
            max = people[j].newMigrations * 1;
            leader = people[j].name;
        }
        else if(people[j].newMigrations == max){
            leader += ", " + people[j].name;
        }
    }
    return leader;
}
function calcMigrations(people){
    var max = 0;
    var leader = "";

    for(var j=0; j<people.length; j++){
        if(people[j].migrations > max){
            max = people[j].migrations * 1;
            leader = people[j].name;
        }
        else if(people[j].migrations == max){
            leader += ", " + people[j].name;
        }
    }
    return leader;
}
