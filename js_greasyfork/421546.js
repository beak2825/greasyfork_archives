// ==UserScript==
// @name        Ethermine Days Till Payout
// @namespace   Violentmonkey Scripts
// @match       https://ethermine.org/miners/*/dashboard
// @match       https://ethermine.org/miners/*/payouts
// @grant       GM.getValue
// @grant       GM.setValue
// @version     0.402
// @author      xzuyn
// @description payouts based on current payout policy; https://ethpool.freshdesk.com/support/solutions/articles/8000060967-ethermine-org-payout-policy
// @downloadURL https://update.greasyfork.org/scripts/421546/Ethermine%20Days%20Till%20Payout.user.js
// @updateURL https://update.greasyfork.org/scripts/421546/Ethermine%20Days%20Till%20Payout.meta.js
// ==/UserScript==

//So i've never used JavaScript before, so if this is hard to comprehend, sorry.

//Waits till page fully loads
window.addEventListener("load", function()
{
  
  //Waits one second to let the current balance and estimated earnings numbers to fully load (they start from 0 then go up to correct value)
  setTimeout(function(){
    
    //Checks if on the payout page & saves last payment date into the variable "LastPaidOn", & local storage variable "LSLastPaidOn" for usage on dashboard page.
    breakme: if (document.querySelector(".payout-table") !== null) {
      var LastPaidOn = document.querySelectorAll(".payout-table")[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1].textContent
      localStorage.setItem("LSLastPaidOn", LastPaidOn)
    } else {
      break breakme
    }
    
    //Saves current balance into the variable "CB".
    breakme: if (document.querySelector(".current-balance") !== null) {
      var CB = document.querySelectorAll(".current-balance")[0].textContent
    } else {
      break breakme
    }
    
    //Saves current estimated earnings into the variable "EE".
    breakme: if (document.querySelector(".current-earnings") !== null) {
      var EE = document.querySelectorAll(".current-earnings")[0].textContent
    } else {
      break breakme
    }
    
    //Checks if on dashboard & saves place where later text will go into the variable "txtloc".
    breakme: if (document.querySelector(".dashboard-overview") !== null) {
      var txtloc = document.querySelectorAll(".dashboard-overview")[0]
    } else {
      break breakme
    }
    
    //Checks if variables CB & EE exist to remove errors on payout page.
    breakme: if (CB && EE !== null) {
      
      //Checks if local storage variable still exists
      if (localStorage.getItem("LSLastPaidOn") !== null) {
        var LastPaidOn = localStorage.getItem("LSLastPaidOn")
        var LastPaidOnMonth = (LastPaidOn.substring(4, 8))
        var LastPaidOnDay = parseFloat(LastPaidOn.substring(0, 2))
        var LastPaidOnHour = (LastPaidOn.substring((LastPaidOn.length) - 5, (LastPaidOn.length) - 3))
        var LastPaidOnMinute = (LastPaidOn.substring((LastPaidOn.length) - 2, (LastPaidOn.length)))
      } else {
        var NewVarLastPaidOn =  ("Last Payout: [Please visit your payouts page, refresh, wait a few seconds, come back to your dashboard, & refresh again. You need to do this each payout or if your local storage gets cleared for whatever reason.]")
      }
      
      //Calculates days to earn 0.01 & 0.05 ETH based on estimated earnings & current balance
      var D2E001 = ((0.01 - CB) / EE)
      var D2E005 = ((0.05 - CB) / EE)
      var today = new Date()
      var month
      var day = String(today.getDate())
      var hour = String(today.getHours())
      var minute = String(today.getMinutes())
      
      
      if (LastPaidOnMonth == "Jan.") {
        LastPaidOnMonth = 00
      } else if (LastPaidOnMonth == "Feb.") {
        LastPaidOnMonth = 01
      } else if (LastPaidOnMonth == "Mar.") {
        LastPaidOnMonth = 02
      } else if (LastPaidOnMonth == "Apr.") {
        LastPaidOnMonth = 03
      } else if (LastPaidOnMonth == "May.") {
        LastPaidOnMonth = 04
      } else if (LastPaidOnMonth == "Jun.") {
        LastPaidOnMonth = 05
      } else if (LastPaidOnMonth == "Jul.") {
        LastPaidOnMonth = 06
      } else if (LastPaidOnMonth == "Aug.") {
        LastPaidOnMonth = 07
      } else if (LastPaidOnMonth == "Sep.") {
        LastPaidOnMonth = 08
      } else if (LastPaidOnMonth == "Oct.") {
        LastPaidOnMonth = 09
      } else if (LastPaidOnMonth == "Nov.") {
        LastPaidOnMonth = 10
      } else if (LastPaidOnMonth == "Dec.") {
        LastPaidOnMonth = 11
      }
      
      
      var payday14 = new Date(2021, LastPaidOnMonth, (LastPaidOnDay + 14), LastPaidOnHour, LastPaidOnMinute)
      var payday7 = new Date(2021, LastPaidOnMonth, (LastPaidOnDay + 7), LastPaidOnHour, LastPaidOnMinute)
      var paidday = new Date(2021, LastPaidOnMonth, LastPaidOnDay, LastPaidOnHour, LastPaidOnMinute)
      
      var diffintime14 = (payday14.getTime() - today.getTime()) / (1000 * 3600 * 24)
      var diffintime7 = (payday7.getTime() - today.getTime()) / (1000 * 3600 * 24)
      

      
      
      if (D2E001 >= 14) {
        var EarnTime14D = (D2E001)
      } else {
        var EarnTime14D = diffintime14
      }
      
      if (D2E005 >= 7) {
        var EarnTime7D = (D2E005)
      } else {
        var EarnTime7D = diffintime7
      }
      
      
      
      if (EarnTime14D > EarnTime7D) {
        var diffintimelowest = EarnTime7D
        var paydaylowest = payday7
      } else if (EarnTime14D < EarnTime7D) {
        var diffintimelowest = EarnTime14D
        var paydaylowest = payday14
      }
      
      if (paidday == "Invalid Date") {
        var paidday = ("Last Payout: [Please visit your payouts page, refresh, wait a few seconds, come back to your dashboard, & refresh again. You need to do this each payout or if your local storage gets cleared for whatever reason.]")
      }
      
      //Displays calculated info on a page element that I found to look alright (might change later)
      txtloc.innerHTML += ("Last Payout: " + paidday)
      txtloc.innerHTML += ("<br />")
      txtloc.innerHTML += ("Next Payout: " + paydaylowest)
      txtloc.innerHTML += ("<br />")
      txtloc.innerHTML += ("<br />")
      
      //Needs if statement to compare to custom threshold to show whatever comes first.
      txtloc.innerHTML += ("Estimated ETH During Next Payout: " + (parseFloat(CB) + ((parseFloat(EE) * diffintimelowest))).toFixed(7) + " ETH")
      txtloc.innerHTML += ("<br />")
      txtloc.innerHTML += ("<br />")
      txtloc.innerHTML += ("Payout @ 0.01: " + EarnTime14D.toFixed(4) + " Days.")
      txtloc.innerHTML += ("<br />")
      txtloc.innerHTML += ("Days to Earn 0.01: " + D2E001.toFixed(4) + " Days.")
      txtloc.innerHTML += ("<br />")
      txtloc.innerHTML += ("<br />")
      txtloc.innerHTML += ("Payout @ 0.05: " + EarnTime7D.toFixed(4) + " Days.")
      txtloc.innerHTML += ("<br />")
      txtloc.innerHTML += ("Days to Earn 0.05: " + D2E005.toFixed(4) + " Days.")
      txtloc.innerHTML += ("<br />")
      txtloc.innerHTML += ("<br />")
      //txtloc.innerHTML += ("Payout @ Min Thres. (" + MinThres + "): " + EarnTimeMinThres)
      //txtloc.innerHTML += ("<br />")
      //txtloc.innerHTML += ("Days to Earn Min Thres. (" + MinThres + "): " + D2EMT)
    } else {
      break breakme
    }
  }, 1000)
})