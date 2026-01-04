// ==UserScript==
// @name         AWBW Adjusted Income
// @namespace    https://awbw.amarriner.com/
// @version      1.09
// @description  Calculates adjusted income for the next turn
// @author       twiggy_
// @match        https://awbw.amarriner.com/*?games_id=*
// @match        https://awbw.amarriner.com/*?replays_id=*
// @icon         https://awbw.amarriner.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459489/AWBW%20Adjusted%20Income.user.js
// @updateURL https://update.greasyfork.org/scripts/459489/AWBW%20Adjusted%20Income.meta.js
// ==/UserScript==

// tool variables
var gameMenu = document.querySelector('.menu-follow');

var neutralImgLink = 'https://i.imgur.com/vhdXVov.png'
var clickedImgLink = 'https://i.imgur.com/hM2JsyY.png'

var btnState = false;

var p1ID = 1;
var p2ID = 2;

var p1CO = document.getElementsByClassName('player-co')[0].href.split('#')[1];
var p2CO = document.getElementsByClassName('player-co')[1].href.split('#')[1];

var p1NormalIncome = Number(document.getElementsByClassName('player-income')[0].innerText);
var p2NormalIncome = Number(document.getElementsByClassName('player-income')[1].innerText);

var p1AdjustedIncome = 0;
var p2AdjustedIncome = 0;

var gameUnits;

var p1Units = [];
var p2Units = [];

var p1Props = [];
var p2Props = [];

var p1RepairCosts = 0;
var p2RepairCosts = 0;

var repairHP = 2;
var unitCostScalar = 1;

let validRepairLocations = 
{ 
    1: [38, 39, 42, 43, 44, 47, 48, 49, 52, 53, 54, 57, 81, 82, 85, 86, 87, 90, 91, 92, 95, 96, 97, 100, 118, 119, 120, 123, 124, 125, 150, 151, 153, 157, 158, 160, 164, 165, 167, 171, 172, 174, 182, 183, 185, 189, 190, 192],
    2: [38, 39, 42, 43, 44, 47, 48, 49, 52, 53, 54, 57, 81, 82, 85, 86, 87, 90, 91, 92, 95, 96, 97, 100, 118, 119, 120, 123, 124, 125, 150, 151, 153, 157, 158, 160, 164, 165, 167, 171, 172, 174, 182, 183, 185, 189, 190, 192],
    3: [38, 39, 42, 43, 44, 47, 48, 49, 52, 53, 54, 57, 81, 82, 85, 86, 87, 90, 91, 92, 95, 96, 97, 100, 118, 119, 120, 123, 124, 125, 150, 151, 153, 157, 158, 160, 164, 165, 167, 171, 172, 174, 182, 183, 185, 189, 190, 192],
    4: [38, 39, 42, 43, 44, 47, 48, 49, 52, 53, 54, 57, 81, 82, 85, 86, 87, 90, 91, 92, 95, 96, 97, 100, 118, 119, 120, 123, 124, 125, 150, 151, 153, 157, 158, 160, 164, 165, 167, 171, 172, 174, 182, 183, 185, 189, 190, 192],
    5: [38, 39, 42, 43, 44, 47, 48, 49, 52, 53, 54, 57, 81, 82, 85, 86, 87, 90, 91, 92, 95, 96, 97, 100, 118, 119, 120, 123, 124, 125, 150, 151, 153, 157, 158, 160, 164, 165, 167, 171, 172, 174, 182, 183, 185, 189, 190, 192],
    6: [38, 39, 42, 43, 44, 47, 48, 49, 52, 53, 54, 57, 81, 82, 85, 86, 87, 90, 91, 92, 95, 96, 97, 100, 118, 119, 120, 123, 124, 125, 150, 151, 153, 157, 158, 160, 164, 165, 167, 171, 172, 174, 182, 183, 185, 189, 190, 192],
    7: [38, 39, 42, 43, 44, 47, 48, 49, 52, 53, 54, 57, 81, 82, 85, 86, 87, 90, 91, 92, 95, 96, 97, 100, 118, 119, 120, 123, 124, 125, 150, 151, 153, 157, 158, 160, 164, 165, 167, 171, 172, 174, 182, 183, 185, 189, 190, 192],
    8: [38, 39, 42, 43, 44, 47, 48, 49, 52, 53, 54, 57, 81, 82, 85, 86, 87, 90, 91, 92, 95, 96, 97, 100, 118, 119, 120, 123, 124, 125, 150, 151, 153, 157, 158, 160, 164, 165, 167, 171, 172, 174, 182, 183, 185, 189, 190, 192],
    9: [38, 39, 42, 43, 44, 47, 48, 49, 52, 53, 54, 57, 81, 82, 85, 86, 87, 90, 91, 92, 95, 96, 97, 100, 118, 119, 120, 123, 124, 125, 150, 151, 153, 157, 158, 160, 164, 165, 167, 171, 172, 174, 182, 183, 185, 189, 190, 192],
    10: [38, 39, 42, 43, 44, 47, 48, 49, 52, 53, 54, 57, 81, 82, 85, 86, 87, 90, 91, 92, 95, 96, 97, 100, 118, 119, 120, 123, 124, 125, 150, 151, 153, 157, 158, 160, 164, 165, 167, 171, 172, 174, 182, 183, 185, 189, 190, 192],
    11: [40, 45, 50, 55, 83, 88, 93, 98, 117, 122, 149, 156, 163, 170, 181, 188],
    12: [40, 45, 50, 55, 83, 88, 93, 98, 117, 122, 149, 156, 163, 170, 181, 188],
    13: [40, 45, 50, 55, 83, 88, 93, 98, 117, 122, 149, 156, 163, 170, 181, 188],
    14: [40, 45, 50, 55, 83, 88, 93, 98, 117, 122, 149, 156, 163, 170, 181, 188],
    15: [41, 46, 51, 56, 84, 89, 94, 99, 121, 126, 155, 162, 169, 176, 187, 194],
    16: [41, 46, 51, 56, 84, 89, 94, 99, 121, 126, 155, 162, 169, 176, 187, 194],
    17: [41, 46, 51, 56, 84, 89, 94, 99, 121, 126, 155, 162, 169, 176, 187, 194],
    18: [41, 46, 51, 56, 84, 89, 94, 99, 121, 126, 155, 162, 169, 176, 187, 194],
    28: [41, 46, 51, 56, 84, 89, 94, 99, 121, 126, 155, 162, 169, 176, 187, 194],
    29: [41, 46, 51, 56, 84, 89, 94, 99, 121, 126, 155, 162, 169, 176, 187, 194],
    30: [40, 45, 50, 55, 83, 88, 93, 98, 117, 122, 149, 156, 163, 170, 181, 188],
    46: [38, 39, 42, 43, 44, 47, 48, 49, 52, 53, 54, 57, 81, 82, 85, 86, 87, 90, 91, 92, 95, 96, 97, 100, 118, 119, 120, 123, 124, 125, 150, 151, 153, 157, 158, 160, 164, 165, 167, 171, 172, 174, 182, 183, 185, 189, 190, 192],
    960900: [38, 39, 42, 43, 44, 47, 48, 49, 52, 53, 54, 57, 81, 82, 85, 86, 87, 90, 91, 92, 95, 96, 97, 100, 118, 119, 120, 123, 124, 125, 150, 151, 153, 157, 158, 160, 164, 165, 167, 171, 172, 174, 182, 183, 185, 189, 190, 192],
    968731: [40, 45, 50, 55, 83, 88, 93, 98, 117, 122, 149, 156, 163, 170, 181, 188],
    1141438: [38, 39, 42, 43, 44, 47, 48, 49, 52, 53, 54, 57, 81, 82, 85, 86, 87, 90, 91, 92, 95, 96, 97, 100, 118, 119, 120, 123, 124, 125, 150, 151, 153, 157, 158, 160, 164, 165, 167, 171, 172, 174, 182, 183, 185, 189, 190, 192]
};

// build and append button to game menu
var adjustedIncomeGameToolDiv = document.createElement('div');
adjustedIncomeGameToolDiv.id = 'adji-parent';
adjustedIncomeGameToolDiv.classList.add('game-tools-btn');
adjustedIncomeGameToolDiv.style.width = '32px';
adjustedIncomeGameToolDiv.style.height = '30px';
adjustedIncomeGameToolDiv.style.marginLeft = '5px';

var adjustedIncomeGameToolDivHoverSpan = document.createElement('span');
adjustedIncomeGameToolDivHoverSpan.id = 'adji-hover-span';
adjustedIncomeGameToolDivHoverSpan.classList.add('game-tools-btn-text');
adjustedIncomeGameToolDivHoverSpan.classList.add('small_text');
adjustedIncomeGameToolDivHoverSpan.innerText = "Adjust Income";

var adjustedIncomeGameToolDivBackground = document.createElement('div');
adjustedIncomeGameToolDivBackground.id = 'adji-background';
adjustedIncomeGameToolDivBackground.classList.add('game-tools-bg');

var adjustedIncomeGameToolDivBackgroundSpan = document.createElement('span');
adjustedIncomeGameToolDivBackgroundSpan.id = 'adji-background-span';
adjustedIncomeGameToolDivBackgroundSpan.classList.add('norm2');

var adjustedIncomeGameToolDivBackgroundLink = document.createElement('a');
adjustedIncomeGameToolDivBackgroundLink.id = 'adji-background-link';
adjustedIncomeGameToolDivBackgroundLink.classList.add('norm2');

var adjustedIncomeGameToolDivBackgroundImg = document.createElement('img');
adjustedIncomeGameToolDivBackgroundImg.id = 'adji-background-link';
adjustedIncomeGameToolDivBackgroundImg.src = neutralImgLink;
adjustedIncomeGameToolDivBackgroundImg.style.verticalAlign = "middle";
adjustedIncomeGameToolDivBackgroundImg.style.width = '20px';
adjustedIncomeGameToolDivBackgroundImg.style.height = '20px';

adjustedIncomeGameToolDiv.appendChild(adjustedIncomeGameToolDivBackground);
adjustedIncomeGameToolDiv.appendChild(adjustedIncomeGameToolDivHoverSpan);
adjustedIncomeGameToolDivBackground.appendChild(adjustedIncomeGameToolDivBackgroundSpan);
adjustedIncomeGameToolDivBackgroundSpan.appendChild(adjustedIncomeGameToolDivBackgroundLink);
adjustedIncomeGameToolDivBackgroundLink.appendChild(adjustedIncomeGameToolDivBackgroundImg);
gameMenu.appendChild(adjustedIncomeGameToolDiv);

adjustedIncomeGameToolDivBackgroundLink.onclick = toggleIncome;
// adjustedIncomeGameToolDiv.onmouseenter = recalculate;

function resetValues()
{
    p1AdjustedIncome = 0;
    p2AdjustedIncome = 0;
    
    p1RepairCosts = 0;
    p2RepairCosts = 0;
    
    gameUnits = undefined;

    p1Units = [];
    p2Units = [];
    
    p1Props = [];
    p2Props = [];
}

function calc() 
{
    resetValues();
    loadData();
    calculateAdjustedIncomes();
}

function toggleIncome() 
{
  if (btnState == false) 
  {
      btnState = true;
      calc();
      adjustedIncomeGameToolDivBackgroundImg.src = clickedImgLink;
      adjustedIncomeGameToolDivBackground.style.backgroundColor = "#e1e1e1";
      document.getElementsByClassName('player-income')[0].innerText = p1AdjustedIncome;
      document.getElementsByClassName('player-income')[1].innerText = p2AdjustedIncome;
  }
  else 
  {
      btnState = false;
      adjustedIncomeGameToolDivBackgroundImg.src = neutralImgLink;
      adjustedIncomeGameToolDivBackground.style.backgroundColor = "#ffffff";
      document.getElementsByClassName('player-income')[0].innerText = p1NormalIncome;
      document.getElementsByClassName('player-income')[1].innerText = p2NormalIncome;
  }
}

function loadData() {
    p1ID = String(document.getElementsByClassName('player-overview-container')[0].id.substring(6));
    p2ID = String(document.getElementsByClassName('player-overview-container')[1].id.substring(6));
    
    gameUnits = document.getElementsByClassName('game-unit');
    
    for (let i = 0; i < gameUnits.length; i++) 
    {
        var unitID = gameUnits[i].getAttribute('data-unit-id');
        var unitPlayerID = String(unitsInfo[unitID]["units_players_id"]);
        var unitHP = unitsInfo[unitID]["units_hit_points"];
        
        if (unitPlayerID == p1ID && unitHP < 10) 
        {
            p1Units.push(unitsInfo[unitID]);
        }
        else if  (unitPlayerID == p2ID && unitHP < 10) 
        {
            p2Units.push(unitsInfo[unitID]);
        }
    }
    
    // DEBUG console.log(p1Units);
    // DEBUG console.log(p2Units);
    
    for (let x in buildingsInfo) 
    {
      for (let y in buildingsInfo[x]) 
      {
        if (buildingsInfo[x][y]["buildings_players_id"] == p1ID) 
        {
            p1Props.push(buildingsInfo[x][y]);
        }
        else if (buildingsInfo[x][y]["buildings_players_id"] == p2ID)
        {
            p2Props.push(buildingsInfo[x][y]);
        }
      }
    }
    
    // DEBUG console.log(p1Props);
    // DEBUG console.log(p2Props);
}

function calculateRepairCosts(unitcost, currenthp, player)
{
    // up repairHP amount to 3 if either co is rachel
    if (player == "p1" && p1CO == "rachel") { repairHP = 3; }
    else if (player == "p2" && p2CO == "rachel") { repairHP = 3; }
    else { repairHP = 2; }
    
    // adjust unitCostScalar based on co
    if (player == "p1" && p1CO == "hachi") { unitCostScalar = 0.9; }
    else if (player == "p1" && p1CO == "colin") { unitCostScalar = 0.8; }
    else if (player == "p1" && p1CO == "kanbei") { unitCostScalar = 1.2; }
    else if (player == "p2" && p2CO == "hachi") { unitCostScalar = 0.9; }
    else if (player == "p2" && p2CO == "colin") { unitCostScalar = 0.8; }
    else if (player == "p2" && p2CO == "kanbei") { unitCostScalar = 1.2; }
    else { unitCostScalar = 1; }
    
    var repairHP = Math.min(10 - currenthp, repairHP);
    var repairCost = 0.1 * (unitcost * unitCostScalar)
    
    if (player == "p1") 
    {
        p1RepairCosts = p1RepairCosts + (repairHP * repairCost);
    }
    
    if (player == "p2") 
    {
        p2RepairCosts = p2RepairCosts + (repairHP * repairCost);
    }
}

function calculateAdjustedIncomes()
{
    for (let i = 0; i < p1Units.length; i++) 
    {
      for (let j = 0; j < p1Props.length; j++) 
      {
            if (p1Units[i]["units_x"] == p1Props[j]["buildings_x"] && 
                p1Units[i]["units_y"] == p1Props[j]["buildings_y"] &&
                validRepairLocations[p1Units[i]["generic_id"]].includes(p1Props[j]["terrain_id"]))
            {
                calculateRepairCosts(p1Units[i]["units_cost"], p1Units[i]["units_hit_points"], "p1");
            }
      }
    }
    
    for (let i = 0; i < p2Units.length; i++) 
    {
      for (let j = 0; j < p2Props.length; j++) 
      {
            if (p2Units[i]["units_x"] == p2Props[j]["buildings_x"] && 
                p2Units[i]["units_y"] == p2Props[j]["buildings_y"] &&
                validRepairLocations[p2Units[i]["generic_id"]].includes(p2Props[j]["terrain_id"]))
            {
                calculateRepairCosts(p2Units[i]["units_cost"], p2Units[i]["units_hit_points"], "p2");
            }
      }
    }
    
    p1AdjustedIncome = p1NormalIncome - p1RepairCosts;
    p2AdjustedIncome = p2NormalIncome - p2RepairCosts;
    
    // DEBUG console.log("Adjusted Income");
    // DEBUG console.log(p1AdjustedIncome);
    // DEBUG console.log(p2AdjustedIncome);
}

// DEBUG
// if (!loadData()) window.addEventListener('loadData', loadData);
// if (!calculateAdjustedIncomes()) window.addEventListener('calculateAdjustedIncomes', calculateAdjustedIncomes);