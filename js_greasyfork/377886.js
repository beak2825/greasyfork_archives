// ==UserScript==
// @name findChipTickets
// @description  findChipAvia
// @author Vovk Igor
// @license MIT
// @version 0.42
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @include https://www.ryanair.com/*
// @namespace https://greasyfork.org/uk/scripts/377886-findchiptickets
// @downloadURL https://update.greasyfork.org/scripts/377886/findChipTickets.user.js
// @updateURL https://update.greasyfork.org/scripts/377886/findChipTickets.meta.js
// ==/UserScript==

//https://www.ryanair.com/*  http://u.ua/*


var $ = window.jQuery;

var scope=[];

var plane=[];

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}



var init=function(){
    scope.ammount={};
    scope.dates=[];

    //     $(".container23").append( '<button id="find" >finddd</button>');
    //     $(".container23").append( '<button id="find2" >getChipest</button>');
    //scope.startDay="";
    scope.AvailabilitiesDates={};
    scope.airportsArray=[];
    scope.countriesArray=[];
    scope.currentRouteByCurrentAirpot=[];
    scope.arrayCitiesByCurrentAirpot={};
    scope.count=0;
    scope.name="";
    scope.AvailabilitiesDatesCount=0;


}


var clearScope=function(){
    scope.ammount={};
    scope.dates=[];
    scope.name=""
    scope.AvailabilitiesDates={};
    scope.airportName="";
    scope.airportsArray=[];
    scope.countriesArray=[];
    scope.currentRouteByCurrentAirpot=[];

    scope.arrayCitiesByCurrentAirpot={};
    scope.count=0;
    scope.AvailabilitiesDatesCount=0;
}

var getCountries=function(f){

    var callback=f || function(){};

    $(".context").append("<p>waiting....</p>");

    var url="https://www.ryanair.com/content/ryanair.markets.json";

    $.get( url, function( data ) {
        //console.log(data);
        var arr = {};
        for (var i = 0; i < data.length; i++) {

            var name =data[i]["code"];
            var val = data[i];
            arr[name] = val;
        }
        console.log(arr);

        scope.countriesArray=arr;

        callback();// call getAirports
    });

}


var getAirports=function(f){

    // var deferred = $.Deffered();
    var callback=f || function(){};

    var url="https://desktopapps.ryanair.com/v4/en-ie/res/stations";

    $.get( url, function( data ) {
        //console.log(data);
        scope.airportsArray=data;

        callback();// call getRoutes
    });

}


// get airports,countries,cities,regions by airportName(origin) Lviv(LWO)
var getRoutes=function(origin, f){

    $(".context").append("<p>waiting get Routes.......");

    // var deferred = $.Deffered();
    var callback=f || function(){};

    var url=" https://api.ryanair.com/aggregate/4/common?embedded=airports,countries,cities,regions,nearbyAirports,defaultAirport&market=en-gb";

    scope.sendData = {"airportName": origin };



    $.get( url, function( data ) {
        //console.log(sendData);
        var airportIataCode="";
        for (var i = 0; i < data.airports.length; i++) {
            if (data.airports[i].name == scope.sendData["airportName"]){
                airportIataCode=data.airports[i]["iataCode"];
                //console.log(data.airports[i].routes);
                scope.currentRouteByCurrentAirpot=data.airports[i].routes;
            }

        }
        var arrayCitiesByCurrentAirpot=[];
        for (var j = 0; j < scope.currentRouteByCurrentAirpot.length; j++) {
            var a=scope.currentRouteByCurrentAirpot[j].split(":");
            if (a[0] == "airport"){
                var minNameCountry=scope.airportsArray[a[1]]["country"];
                var city=scope.airportsArray[a[1]]["name"];
                var NameCountry=scope.countriesArray[minNameCountry.toLowerCase()].name;
                arrayCitiesByCurrentAirpot.push({'airport':a[1], "city":city , "NameCountry":NameCountry });

            }
        }
        scope.arrayCitiesByCurrentAirpot[airportIataCode]=arrayCitiesByCurrentAirpot;


        //console.log(scope.arrayCitiesByCurrentAirpot);
        $(".context").append("<p>getRoutes done</p>");
        callback();

    });

}



var getAvailabilities=function( f){

    //var deferred = new $.Deferred();
    $(".context").append("<p>waiting get Availabilities Dates..............</p>");

    var callback=f || function(){};

    var origin=Object.keys(scope.arrayCitiesByCurrentAirpot)[0];

    scope.ammount[origin]={};
    scope.ammount[origin]["origin"]=scope.sendData["airportName"];


    scope.AvailabilitiesDates[origin]={};

    scope.sendData=[];

    for (var i = 0; i <  scope.arrayCitiesByCurrentAirpot[origin].length; i++) {

        var destination=scope.arrayCitiesByCurrentAirpot[origin][i]["airport"];

        scope.ammount[origin][destination]={};

        var url="https://services-api.ryanair.com/farfnd/3/oneWayFares/"+origin+"/"+destination+"/availabilities";

        var a = {"origin": origin, "destination": destination };

        scope.sendData.push(a);

        $.get( url, function( data ) {

            var t=scope.sendData[0];
            scope.sendData = scope.sendData.splice(1,scope.sendData.length-1);

            // console.log(scope.sendData);
            //console.log(scope.sendData.length);
            //scope.days= dates[0];
            var day = new Date(data[0]);
            day = new Date(day.setTime(new Date(day).getTime() + 6 * 86400000));
            var temp_day = day.getUTCFullYear() +"-"+ (day.getUTCMonth()+1) +"-"+day.getUTCDate();

            var AvailabilitiesDates=[];
            AvailabilitiesDates.push(data[0]);

            for (var i = 0; i < data.length; i++) {
                var temp_dates=data[i];
                if (Date.parse(temp_day)<=Date.parse(temp_dates)){
                    AvailabilitiesDates.push(temp_dates);
                    temp_day = new Date();
                    //                     var d = date.getDate();
                    //                     var m = date.getMonth();
                    //                     var y = date.getFullYear();

                    temp_day = new Date(temp_day.setTime(new Date(temp_dates).getTime() + 6 * 86400000));
                }
            }
            scope.AvailabilitiesDates[t["origin"]][t["destination"]]={};
            scope.AvailabilitiesDates[t["origin"]][t["destination"]]=AvailabilitiesDates;

            //console.log(scope.AvailabilitiesDates);

            if (scope.sendData.length == 0){
                console.log(scope.AvailabilitiesDates);

                var res=JSON.stringify(scope.AvailabilitiesDates);
                $(".context").append(res);

                //console.log(JSON.stringify(scope.AvailabilitiesDates));
                // $(".context").append("<p>get Availabilities Dates done</p>");
            }


            callback();// call getChipAmmount

        }).done();

    }

}



var getChipAmmount= function( f ){

    var callback=f || function(){};

    var sleepTime=500;

    scope.AvailabilitiesDatesCount =3; //scope.AvailabilitiesDates.length-1;

    var seepWaitTime=sleepTime*scope.AvailabilitiesDatesCount;

    //console.log("waiting "+ seepWaitTime/1000+" seconds");

    // $(".context").append("<p>waiting "+ seepWaitTime/1000+" seconds</p>");

    // startTimer(seepWaitTime/1000);



    var key1=Object.keys(scope.AvailabilitiesDates)[0]; // LWO


    var length1=Object.keys(scope.AvailabilitiesDates[key1]).length;

    var dates=scope.AvailabilitiesDates[key1];

    scope.AvailabilitiesDates[key1]={};

    var key2=Object.keys(dates)[0]; // STN

    var length2=Object.keys(dates[key2]).length;

    var origin=key1;
    var destination=key2;


    // for one origin town, one  destination airports
    for (var i = 0; i < 2; i++) { //length2

        //console.log(new Date().toLocaleString());

        var url="https://desktopapps.ryanair.com/v4/en-ie/availability?ADT=1&CHD=0&DateOut="+dates[key2][i]+
            "&Destination="+
            destination+
            "&FlexDaysOut=6&INF=0&IncludeConnectingFlights=true&Origin="+
            origin+
            "&RoundTrip=false&TEEN=0&ToUs=AGREED&exists=false";
        $.get( url, function( data ) {

            //console.log(new Date().toLocaleString());
            var dates=data.trips[0].dates;

            var origin=data.trips[0]["origin"];

            var destinationName=data.trips[0]["destinationName"];

            var destination=data.trips[0]["destination"];

            var arr=[];

            for (var i = 0; i < dates.length; i++) {
                if (dates[i].flights.length>0){
                    var date = new Date(dates[i]["dateOut"]);
                    date =   (date.getUTCDate()+1)+"-"+(date.getUTCMonth()+1) +"-"+date.getUTCFullYear();

                    console.log("from "+origin+" to "+ destinationName +" "+date+"  amount="+dates[i].flights["0"].regularFare.fares["0"].amount);

                    arr.push({"date":date, "ammount": dates[i].flights["0"].regularFare.fares["0"].amount});
                }
            }
            scope.ammount[origin][destination]["destinationName"]=destinationName;
            scope.ammount[origin][destination]["dates"]=arr;

            console.log(scope.ammount);

            scope.count+=1;

            //console.log(scope.count);
            //var k=0;
            callback(origin, destination);// call function sort
        });
        //console.log(new Date());
        sleep(sleepTime);

        //console.log(new Date());
        //console.log($scope.ammount.length);
    }




    return true;
}

var sort=function(f, origin, destination){


    var callback=f || function(){};
    if (scope.count >= scope.AvailabilitiesDatesCount) ///scope.AvailabilitiesDates.length-1
    {
        //console.log(scope.ammount);
        scope.ammount[origin][destination]["dates"].sort(function(a,b){
            //Turn your strings into dates, and then subtract them
            //to get a value that is either negative, positive, or zero.
            return new Date(a.date) - new Date(b.date);
        });
        //console.log(scope.ammount);
        scope.ammount[origin][destination]["dates"].sort(function(a, b) {
            return ((a.ammount < b.ammount) ? -1 : ((a.ammount == b.ammount) ? 0 : 1));

        });

        console.log(scope.ammount);
        callback(); // show
    }




};

function startTimer(duration) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        //display.textContent = minutes + ":" + seconds;

        console.log(seconds+" seconds");

        if (--timer <= 0) {
            timer = duration;
        }
    }, 1000);
}



var initGui=function(){
    $("body").empty();
    $(".at-element-marker").hide();
    $(".FR").hide();
    $("body").after("<div class='plane'>   <button id='find' >finddd</button><button id='find2' >getChipest</button> <button id='toggle' >toggle</button></div>");

    $(".plane").append("<div class='context'> fewfwfewf</div>");
    $(".context").html("<p>1</p>");
    $(".context").append("<p>2</p>");

}

var showGui=function(){

    for (var i = 0; i < scope.ammount.length-1; i++) {
        var t="date:<b>"+scope.ammount[i]["date"]+"</b>  ammount<b>: "+scope.ammount[i]["ammount"]+"</b>";
        $(".context").append("<p>"+t+"</p>");
    }

}


var main = function(){

    $( "#find" ).click(function() {
        console.clear();
        //$(".FR").hide();
        clearScope();

        var destination="SOF"
        var origin="KBP"

        scope.name="plane from "+origin+" to "+ destination;

        var day = new Date("2019-03-29");

        scope.airportName="Lviv";

        getCountries(getAirports.bind(null, getRoutes.bind(null,scope.airportName, getAvailabilities.bind(null,  getChipAmmount.bind(null, sort.bind(null, showGui))))));

    });
};




var toggle = function(){

    $( "#toogle" ).click(function() {
        $(".at-element-marker").show();
        $(".FR").show();
    });
};





initGui();
$(document).ready(function()
                  {
    //alert("1");
    init();
    toggle();
    //initGui();

    main();
    sort();

    //func();
    //setInterval(func,2000);
});