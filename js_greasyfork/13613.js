// ==UserScript==
// @name           Work Units Calculator
// @description    Show all works units on the dashboard
// @author         Alexander Douglas
// @include        http*://commercehub.my.salesforce.com*
// @version        0.5
// @namespace https://greasyfork.org/users/7909
// @downloadURL https://update.greasyfork.org/scripts/13613/Work%20Units%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/13613/Work%20Units%20Calculator.meta.js
// ==/UserScript==



window.addEventListener("load", function(e) {
                var nameLookup = [];
    var people = [];
    
    function Person(name){
                this.name = name;
        this.total = 0;
    }
    
    if(document.getElementById("dashboard_0_1")){   
                var tableRows = document.getElementById("dashboard_0_1").childNodes[0].childNodes[0].childNodes[0].childNodes[0].getElementsByTagName('tr');
        for(var i = 1; i < tableRows.length; i++){
            var tableCols = tableRows[i].getElementsByTagName('td');
            var name = tableCols[0].innerHTML.replace(/^<span[^>]*>|<\/span>$/g, '');
            var type = tableCols[1].innerHTML.replace(/^<span[^>]*>|<\/span>$/g, '');
            var amount = tableCols[2].innerHTML.replace(/^<span[^>]*>|<\/span>$/g, '');
                
            if(nameLookup.indexOf(name) < 0){
                nameLookup.push(name);
                people.push(new Person(name));
            }
            if(type == "Browser")
                people[nameLookup.indexOf(name)].total += amount*1.75;
            if(type == "Integrated")
                people[nameLookup.indexOf(name)].total += amount*7;
            if(type == "Upgrade")
                people[nameLookup.indexOf(name)].total += amount*6;
            if(type == "Comms")
                people[nameLookup.indexOf(name)].total += amount*4;
        }
                                
        //sort the list of people by total work units
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
        
        var text = "<table class='list'><tr><th>Rank</th><th>Name</th><th>Total Work Units</th></tr>";
        var c = 1;
        for(var i = 0; i < people.length; i++){
            text = text + "<tr><td>" + c + "</td><td>" + people[i].name + "</td><td>" + people[i].total + "</td>";
            c++;
        }
        text = text + "</table>";
        document.getElementById("dashboard_0_1").innerHTML = document.getElementById("dashboard_0_1").innerHTML + text;
    }
    
        if(document.getElementById("dashboard_0_3")){   
                var tableRows = document.getElementById("dashboard_0_3").childNodes[0].childNodes[0].childNodes[0].childNodes[0].getElementsByTagName('tr');
        for(var i = 1; i < tableRows.length; i++){
            var tableCols = tableRows[i].getElementsByTagName('td');
            var name = tableCols[0].innerHTML.replace(/^<span[^>]*>|<\/span>$/g, '');
            var type = tableCols[1].innerHTML.replace(/^<span[^>]*>|<\/span>$/g, '');
            var amount = tableCols[2].innerHTML.replace(/^<span[^>]*>|<\/span>$/g, '');
                
            if(nameLookup.indexOf(name) < 0){
                nameLookup.push(name);
                people.push(new Person(name));
            }
            if(type == "Browser")
                people[nameLookup.indexOf(name)].total += amount*1.75;
            if(type == "Integrated"){
                people[nameLookup.indexOf(name)].total += amount*7;
                if(name == "Jay Saunders")
                    people[nameLookup.indexOf(name)].total += 54;
                else if(name == "Alex Douglas")
                    people[nameLookup.indexOf(name)].total += 18;
            }
            if(type == "Upgrade")
                people[nameLookup.indexOf(name)].total += amount*6;
            if(type == "Comms")
                people[nameLookup.indexOf(name)].total += amount*4;
        }
                                
        //sort the list of people by total work units
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
        
        var text = "<table class='list'><tr><th>Rank</th><th>Name</th><th>Total Work Units</th></tr>";
        var c = 1;
        for(var i = 0; i < people.length; i++){
            text = text + "<tr><td>" + c + "</td><td>" + people[i].name + "</td><td>" + people[i].total + "</td>";
            c++;
        }
        text = text + "</table>";
        document.getElementById("dashboard_0_3").innerHTML = document.getElementById("dashboard_0_3").innerHTML + text;
    }
                                
}, false);
