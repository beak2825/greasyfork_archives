// ==UserScript==
// @name         TornCompanies
// @namespace    http://tampermonkey.net/
// @version      0.34
// @description  Shows company description while travelling/hospitalised
// @author       Zero[2669774]
// @match        https://www.torn.com/joblist.php
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434721/TornCompanies.user.js
// @updateURL https://update.greasyfork.org/scripts/434721/TornCompanies.meta.js
// ==/UserScript==




var api = "USER_API_KEY";// ENTER THE API HERE





var url = window.location.href;
var x = url.indexOf('ID=');
var companyId = url.substring(x+3,url.length);



var companies ={"1": "Hair Salon", "2": "Law Firm", "3": "Flower Shop", "4": "Car Dealership", "5": "Clothing Store", "6": "Gun Shop", "7": "Game Shop", "8": "Candle Shop", "9": "Toy Shop", "10": "Adult Novelties", "11": "Cyber Cafe", "12": "Grocery Store", "13": "Theater", "14": "Sweet Shop", "15": "Cruise Line", "16": "Television Network", "18": "Zoo", "19": "Firework Stand", "20": "Property Broker", "21": "Furniture Store", "22": "Gas Station", "23": "Music Store", "24": "Nightclub", "25": "Pub", "26": "Gents Strip Club", "27": "Restaurant", "28": "Oil Rig", "29": "Fitness Center", "30": "Mechanic Shop", "31": "Amusement Park", "32": "Lingerie Store", "33": "Meat Warehouse", "34": "Farm", "35": "Software Corporation", "36": "Ladies Strip Club", "37": "Private Security Firm", "38": "Mining Corporation", "39": "Detective Agency", "40": "Logistics Management"};

async function show()
{
    if ( url.includes("userID"))
    {
    var l = `https://api.torn.com/user/${companyId}?selections=&key=${api}`;
    const res = await fetch(l);
    const dat = await res.json();
    companyId = dat.job.company_id;
    }
    var link = `https://api.torn.com/company/${companyId}?selections=&key=`;
    link = link + api;

    const response = await fetch(link);
    const data = await response.json();

    const stars= data.company.rating;
    const director =data.company.employees[data.company.director].name;
    const noEmployees = data.company.employees_hired;
    const totalEmployees = data.company.employees_capacity;
    const dailyIncome = parseInt(data.company.daily_income).toLocaleString();
    const dailyCustomers = parseInt(data.company.daily_customers).toLocaleString();
    const weeklyIncome = parseInt(data.company.weekly_income).toLocaleString();
    const weeklyCustomers = parseInt(data.company.weekly_customers).toLocaleString();
    const daysOld = data.company.days_old;
    const companyName = data.company.name;
    const companyType = companies[data.company.company_type];
    let html = `<div style="background-color: #333333; color: #ccc; text-align: center;display: inline-block;min-width: 750px; margin:10px;">
        <div>
            <div style="background-color: #333333; min-height: 50px; font-size: 24px;">${companyName}</div>
            <div style="display: flex;">
                <div style="width:100%">
                    <p>Rating: ${stars}/10</p>
                    <p>Type: ${companyType}</p>
                    <p>Director: <a href="https://www.torn.com/profiles.php?XID=${data.company.director}" target="_blank" style="text-decoration:none;color: #ffffff">${director}</a></p>
                    <p>Age: ${daysOld} days old</p>
                </div>
                <div style="padding: 10px;width: 100%;">
                    <p>Daily Income: $${dailyIncome}</p>
                    <p>Daily Customers: ${dailyCustomers}</p>
                    <p>Weekly Income: $${weeklyIncome}</p>
                    <p>Weekly Customers: ${weeklyCustomers}</p>
                </div>
            </div>
        </div>
        <div>
            <table border="1px" width="100%" style="font-size: 24px;">
                <tr>
                    <td style="color:#ccc; border:2px #ccc solid;">${noEmployees}/${totalEmployees} Company Employees</td>
                    <td style="color:#ccc; border:2px #ccc solid;">Job Title</td>
                    <td style="color:#ccc; border:2px #ccc solid;">Days in the company</td>
                </tr>`;
    for (let i in data.company.employees)
    {
        let eName = data.company.employees[i].name;
        let ePosition = data.company.employees[i].position;
        let eDays = data.company.employees[i].days_in_company;
        let nD = `<tr height=50px>
        <td style="color:#ccc; border:2px #ccc solid;"><a href="https://www.torn.com/profiles.php?XID=${i}" target="_blank" style="text-decoration:none;color: #ffffff">${eName}</a></td>
                    <td style="color:#ccc; border:2px #ccc solid;">${ePosition}</td>
                    <td style="color:#ccc; border:2px #ccc solid;">${eDays} days</td>
    </tr>`;
        html = html + nD;
    }
    let eD= `</table>
        </div>
    </div>`;
    html = html + eD;
    $("div.content-wrapper").append(html);
}


(function() {
    'use strict';
    show();
})();