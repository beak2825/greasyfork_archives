// ==UserScript==
// @name         Company Analyzer - Stat Gain Sorter
// @namespace    Violentmonkey Scripts
// @version      1.2
// @description  Sort and filter companies based on stat gains and requirements
// @author       ingine
// @match        *://www.torn.com/joblist.php
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530452/Company%20Analyzer%20-%20Stat%20Gain%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/530452/Company%20Analyzer%20-%20Stat%20Gain%20Sorter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Company data
  const companyData = {
    companies: {
      1: {
        name: "Hair Salon",
        cost: 750000,
        default_employees: 4,
        positions: {
          Stylist: {
            man_required: 1500,
            int_required: 0,
            end_required: 750,
            man_gain: 34,
            int_gain: 0,
            end_gain: 17,
            special_ability: "None",
            description:
              "This person primarily cuts and styles hair, an integral position in a hair salon.",
          },
          Colorist: {
            man_required: 2000,
            int_required: 0,
            end_required: 1000,
            man_gain: 36,
            int_gain: 0,
            end_gain: 18,
            special_ability: "None",
            description:
              "Specialising in hair colouring techniques, the colorist will boost the productivity of stylists.",
          },
          "Nail Technician": {
            man_required: 750,
            int_required: 0,
            end_required: 1500,
            man_gain: 17,
            int_gain: 0,
            end_gain: 34,
            special_ability: "None",
            description:
              "This person performs manicure services while hair stylists are working. A nice extra for the clients, should they desire it.",
          },
          Apprentice: {
            man_required: 500,
            int_required: 0,
            end_required: 250,
            man_gain: 25,
            int_gain: 0,
            end_gain: 13,
            special_ability: "None",
            description:
              "This person cuts and styles hair at an apprentice level, they may not be as skilled but require less working stats.",
          },
          Shampooist: {
            man_required: 1000,
            int_required: 0,
            end_required: 500,
            man_gain: 30,
            int_gain: 0,
            end_gain: 15,
            special_ability: "Cleaner",
            description:
              "This person helps out with washing clients hair and cleaning the salon.",
          },
          "Senior Stylist": {
            man_required: 3000,
            int_required: 0,
            end_required: 1500,
            man_gain: 39,
            int_gain: 0,
            end_gain: 20,
            special_ability: "Manager",
            description:
              "This position decreases any reduction of employee effectiveness, but can also fulfil the duties of a stylist.",
          },
          Receptionist: {
            man_required: 0,
            int_required: 1250,
            end_required: 2500,
            man_gain: 0,
            int_gain: 19,
            end_gain: 38,
            special_ability: "Secretary",
            description:
              "This person handles the booking of appointments. They also enable detailed employee statistics, showing the estimated profit made by each individual employee.",
          },
          Trainer: {
            man_required: 0,
            int_required: 4500,
            end_required: 2250,
            man_gain: 0,
            int_gain: 42,
            end_gain: 21,
            special_ability: "Trainer",
            description:
              "This position increases the amount of trains a director receives each day and keeps the staff at the top of their game.",
          },
          Aesthetician: {
            man_required: 0,
            int_required: 4500,
            end_required: 2250,
            man_gain: 0,
            int_gain: 42,
            end_gain: 21,
            special_ability: "None",
            description:
              "An expert in the beautician field, they work extensively on the human body and undergo comprehensive studies on a range of cosmetics.",
          },
        },
      },
      2: {
        name: "Law Firm",
        cost: 4000000,
        default_employees: 4,
        positions: {
          Cleaner: {
            man_required: 5500,
            int_required: 0,
            end_required: 2750,
            man_gain: 44,
            int_gain: 0,
            end_gain: 22,
            special_ability: "Cleaner",
            description:
              "This position increases the cleanliness of the workplace.",
          },
          Marketer: {
            man_required: 0,
            int_required: 22000,
            end_required: 11000,
            man_gain: 0,
            int_gain: 55,
            end_gain: 28,
            special_ability: "Marketer",
            description:
              "This position boosts any company advertising campaigns.",
          },
          Consultant: {
            man_required: 0,
            int_required: 33000,
            end_required: 16500,
            man_gain: 0,
            int_gain: 58,
            end_gain: 29,
            special_ability: "Trainer",
            description:
              "This position has sufficient knowledge to train employees on law. Each trainer increases the amount of trains the director receives each day.",
          },
          Secretary: {
            man_required: 0,
            int_required: 8250,
            end_required: 16500,
            man_gain: 0,
            int_gain: 27,
            end_gain: 53,
            special_ability: "Secretary",
            description:
              "This position takes all phone calls and enables detailed employee statistics, showing the estimated profit made by each individual employee.",
          },
          Assistant: {
            man_required: 0,
            int_required: 2750,
            end_required: 5500,
            man_gain: 0,
            int_gain: 22,
            end_gain: 44,
            special_ability: "None",
            description:
              "This position assists the attorneys with less demanding tasks.",
          },
          Attorney: {
            man_required: 0,
            int_required: 11000,
            end_required: 5500,
            man_gain: 0,
            int_gain: 49,
            end_gain: 25,
            special_ability: "None",
            description:
              "This position practices a wide variety of legal skills. An hourly wage is charged to clients.",
          },
        },
      },
      3: {
        name: "Flower Shop",
        cost: 500000,
        default_employees: 4,
        positions: {
          Florist: {
            man_required: 500,
            int_required: 0,
            end_required: 1000,
            man_gain: 15,
            int_gain: 0,
            end_gain: 30,
            special_ability: "None",
            description:
              "This person talks to customers and helps them decide what they're after. They are also responsible for the final sale.",
          },
          Arranger: {
            man_required: 500,
            int_required: 1000,
            end_required: 0,
            man_gain: 15,
            int_gain: 30,
            end_gain: 0,
            special_ability: "None",
            description:
              "This person makes the displays and bouquets look their best.",
          },
          Apprentice: {
            man_required: 250,
            int_required: 0,
            end_required: 500,
            man_gain: 13,
            int_gain: 0,
            end_gain: 25,
            special_ability: "None",
            description:
              "This person is learning the trade to become a full time florist or arranger. They will bring in slightly less revenue, but have much lower requirements.",
          },
          Cleaner: {
            man_required: 500,
            int_required: 0,
            end_required: 250,
            man_gain: 25,
            int_gain: 0,
            end_gain: 13,
            special_ability: "Cleaner",
            description:
              "This person makes sure the store always looks its best at the end of the day.",
          },
          Manager: {
            man_required: 0,
            int_required: 1000,
            end_required: 2000,
            man_gain: 0,
            int_gain: 18,
            end_gain: 36,
            special_ability: "Manager",
            description:
              "This person oversees the day to day running of the flower store.",
          },
          Marketer: {
            man_required: 0,
            int_required: 2000,
            end_required: 1000,
            man_gain: 0,
            int_gain: 36,
            end_gain: 18,
            special_ability: "Marketer",
            description:
              "This person is always looking for creative ways to advertise the flower shop.",
          },
          Accountant: {
            man_required: 0,
            int_required: 750,
            end_required: 1500,
            man_gain: 0,
            int_gain: 17,
            end_gain: 34,
            special_ability: "Secretary",
            description:
              "This person keeps the books in order. They can also provide detailed statistics about employees.",
          },
        },
      },
      4: {
        name: "Car Dealership",
        cost: 6000000,
        default_employees: 4,
        positions: {
          "Sales Executive": {
            man_required: 0,
            int_required: 21000,
            end_required: 10500,
            man_gain: 0,
            int_gain: 55,
            end_gain: 28,
            special_ability: "None",
            description:
              "This position is responsible for giving advice, recommending and selling the dealership's vehicles. They will also partake in test drives with customers.",
          },
          Mechanic: {
            man_required: 26500,
            int_required: 0,
            end_required: 13250,
            man_gain: 56,
            int_gain: 0,
            end_gain: 28,
            special_ability: "None",
            description:
              "This position makes sure that all cars are fully checked before sale.",
          },
          "Sales Apprentice": {
            man_required: 0,
            int_required: 5500,
            end_required: 2750,
            man_gain: 0,
            int_gain: 44,
            end_gain: 22,
            special_ability: "None",
            description:
              "Working alongside the sales executive, the apprentice requires less working stats.",
          },
          Cleaner: {
            man_required: 10500,
            int_required: 0,
            end_required: 5250,
            man_gain: 49,
            int_gain: 0,
            end_gain: 25,
            special_ability: "Cleaner",
            description:
              "This position will clean the showroom, but also the cars that are on sale.",
          },
          Manager: {
            man_required: 0,
            int_required: 21000,
            end_required: 42000,
            man_gain: 0,
            int_gain: 30,
            end_gain: 60,
            special_ability: "Manager",
            description:
              "This position can help with the running of the car dealership. They'll try to keep employees happy, but also working hard.",
          },
          Receptionist: {
            man_required: 0,
            int_required: 15750,
            end_required: 31500,
            man_gain: 0,
            int_gain: 29,
            end_gain: 58,
            special_ability: "Secretary",
            description:
              "This position welcomes people into the showroom and handles all phone calls.",
          },
          Webmaster: {
            man_required: 0,
            int_required: 42000,
            end_required: 21000,
            man_gain: 0,
            int_gain: 60,
            end_gain: 30,
            special_ability: "Marketer",
            description:
              "This position will help the company during advertisement campaigns by listing vehicles on directories.",
          },
          "Training Adviser": {
            man_required: 0,
            int_required: 63000,
            end_required: 31500,
            man_gain: 0,
            int_gain: 63,
            end_gain: 32,
            special_ability: "Trainer",
            description:
              "This position will assist the director with staff training.",
          },
        },
      },
      5: {
        name: "Clothing Store",
        cost: 1000000,
        default_employees: 5,
        positions: {
          Salesperson: {
            man_required: 0,
            int_required: 2000,
            end_required: 1000,
            man_gain: 0,
            int_gain: 36,
            end_gain: 18,
            special_ability: "None",
            description:
              "This person will use the best selling techniques to give customers a deal they can't refuse! Your company won't make much money without good sales people. ",
          },
          Cashier: {
            man_required: 750,
            int_required: 0,
            end_required: 1500,
            man_gain: 17,
            int_gain: 0,
            end_gain: 34,
            special_ability: "None",
            description:
              "The cashier is quicker at handling the final sale with customers, taking some workload off of the sales people.",
          },
          "Sales Trainee": {
            man_required: 0,
            int_required: 500,
            end_required: 250,
            man_gain: 0,
            int_gain: 25,
            end_gain: 13,
            special_ability: "None",
            description:
              "This person is still learning sales techniques and occasionally 'scores', the up-side is that they require less working stats.",
          },
          Cleaner: {
            man_required: 1000,
            int_required: 0,
            end_required: 500,
            man_gain: 30,
            int_gain: 0,
            end_gain: 15,
            special_ability: "Cleaner",
            description:
              "This person keeps the store clean and looking its best. ",
          },
          "Store Manager": {
            man_required: 0,
            int_required: 2000,
            end_required: 4000,
            man_gain: 0,
            int_gain: 21,
            end_gain: 41,
            special_ability: "Manager",
            description: "This person oversees the running of the store. ",
          },
          Accountant: {
            man_required: 0,
            int_required: 1500,
            end_required: 3000,
            man_gain: 0,
            int_gain: 20,
            end_gain: 39,
            special_ability: "Secretary",
            description:
              "This person keeps the books balanced, making sure everything adds up. They can also provide insight in to how employees are individually contributing to the company.",
          },
          "Marketing Manager": {
            man_required: 0,
            int_required: 4000,
            end_required: 2000,
            man_gain: 0,
            int_gain: 41,
            end_gain: 21,
            special_ability: "Marketer",
            description:
              "This person handles the marketing side of the business, and can provide a sizeable boost to any active campaigns.",
          },
          "Line Manager": {
            man_required: 0,
            int_required: 6000,
            end_required: 3000,
            man_gain: 0,
            int_gain: 45,
            end_gain: 23,
            special_ability: "Trainer",
            description:
              "This person makes sure each member of staff knows how to do their job to the best of their ability. They also provide training to employees.",
          },
          "Security Guard": {
            man_required: 3000,
            int_required: 0,
            end_required: 1500,
            man_gain: 39,
            int_gain: 0,
            end_gain: 20,
            special_ability: "None",
            description:
              "To prevent theft, keeping a security guard on duty at the shop entrance can be a large deterrent.",
          },
        },
      },
      6: {
        name: "Gun Shop",
        cost: 2500000,
        default_employees: 4,
        positions: {
          Clerk: {
            man_required: 3750,
            int_required: 0,
            end_required: 7500,
            man_gain: 23,
            int_gain: 0,
            end_gain: 46,
            special_ability: "None",
            description: "This position handles the final sale of weapons.",
          },
          Gunsmith: {
            man_required: 15000,
            int_required: 7500,
            end_required: 0,
            man_gain: 52,
            int_gain: 26,
            end_gain: 0,
            special_ability: "None",
            description:
              "This position repairs or modifies weapons for customers. Offering them a good service means more income!",
          },
          Cleaner: {
            man_required: 4000,
            int_required: 0,
            end_required: 2000,
            man_gain: 41,
            int_gain: 0,
            end_gain: 21,
            special_ability: "Cleaner",
            description:
              "This position increases the cleanliness of the workplace.",
          },
          Manager: {
            man_required: 0,
            int_required: 7500,
            end_required: 15000,
            man_gain: 0,
            int_gain: 26,
            end_gain: 52,
            special_ability: "Manager",
            description:
              "This position decreases any reduction of employee effectiveness.",
          },
          Bookkeeper: {
            man_required: 0,
            int_required: 5750,
            end_required: 11500,
            man_gain: 0,
            int_gain: 25,
            end_gain: 50,
            special_ability: "Secretary",
            description:
              "This position enables detailed employee statistics, showing the estimated profit made by each individual employee.",
          },
          Marketer: {
            man_required: 0,
            int_required: 15000,
            end_required: 7500,
            man_gain: 0,
            int_gain: 52,
            end_gain: 26,
            special_ability: "Marketer",
            description:
              "This position boosts any company advertising campaigns.",
          },
          Instructor: {
            man_required: 0,
            int_required: 22500,
            end_required: 11250,
            man_gain: 0,
            int_gain: 55,
            end_gain: 28,
            special_ability: "Trainer",
            description:
              "This position trains the other workers, but can also instruct customers how to fire weapons safely.",
          },
        },
      },
      7: {
        name: "Game Shop",
        cost: 1250000,
        default_employees: 4,
        positions: {
          Clerk: {
            man_required: 1500,
            int_required: 0,
            end_required: 3000,
            man_gain: 20,
            int_gain: 0,
            end_gain: 39,
            special_ability: "None",
            description:
              "This person completes the sale of the desired games and consoles that have been chosen by customers.",
          },
          "Game Advisor": {
            man_required: 0,
            int_required: 4500,
            end_required: 2250,
            man_gain: 0,
            int_gain: 42,
            end_gain: 21,
            special_ability: "None",
            description:
              "This person advises customers on which platforms or games are perfect for them.",
          },
          Cleaner: {
            man_required: 1500,
            int_required: 0,
            end_required: 750,
            man_gain: 34,
            int_gain: 0,
            end_gain: 17,
            special_ability: "Cleaner",
            description:
              "This position increases the cleanliness of the workplace.",
          },
          "Store Manager": {
            man_required: 0,
            int_required: 3000,
            end_required: 6000,
            man_gain: 0,
            int_gain: 23,
            end_gain: 45,
            special_ability: "Manager",
            description:
              "This position decreases any reduction of employee effectiveness and manages all employees of the game shop.",
          },
          Accountant: {
            man_required: 0,
            int_required: 2250,
            end_required: 4500,
            man_gain: 0,
            int_gain: 21,
            end_gain: 42,
            special_ability: "Secretary",
            description:
              "This position enables detailed employee statistics, showing the estimated profit made by each individual employee.",
          },
          Marketer: {
            man_required: 0,
            int_required: 6000,
            end_required: 3000,
            man_gain: 0,
            int_gain: 45,
            end_gain: 23,
            special_ability: "Marketer",
            description:
              "This position boosts any advertising campaigns that the game shop partakes in.",
          },
        },
      },
      8: {
        name: "Candle Shop",
        cost: 500000,
        default_employees: 4,
        positions: {
          Salesperson: {
            man_required: 0,
            int_required: 750,
            end_required: 1500,
            man_gain: 0,
            int_gain: 17,
            end_gain: 34,
            special_ability: "None",
            description:
              "This person helps to sell candles, but does not have a hand in making them.",
          },
          Chandler: {
            man_required: 4500,
            int_required: 2250,
            end_required: 0,
            man_gain: 42,
            int_gain: 21,
            end_gain: 0,
            special_ability: "None",
            description:
              "This person both makes and sells candles in the store. Having a few chandlers will remove the need to buy in stock.",
          },
          Cleaner: {
            man_required: 1000,
            int_required: 0,
            end_required: 500,
            man_gain: 30,
            int_gain: 0,
            end_gain: 15,
            special_ability: "Cleaner",
            description:
              "This person makes sure the shop is clean and tidy. Customers prefer clean shops. ",
          },
          "Quality Controller": {
            man_required: 0,
            int_required: 1500,
            end_required: 3000,
            man_gain: 0,
            int_gain: 20,
            end_gain: 39,
            special_ability: "Manager",
            description:
              "This person keeps the shop running smoothly and checks the candles are of optimal quality for the customers.",
          },
          Bookkeeper: {
            man_required: 0,
            int_required: 1250,
            end_required: 2500,
            man_gain: 0,
            int_gain: 19,
            end_gain: 38,
            special_ability: "Secretary",
            description:
              "This person enables detailed employee statistics, showing the estimated profit made by each individual employee.",
          },
          Trainer: {
            man_required: 0,
            int_required: 4500,
            end_required: 2250,
            man_gain: 0,
            int_gain: 42,
            end_gain: 21,
            special_ability: "Trainer",
            description:
              "This person will teach people to make and sell candles.",
          },
        },
      },
      9: {
        name: "Toy Shop",
        cost: 2000000,
        default_employees: 5,
        positions: {
          "Sales Assistant": {
            man_required: 2500,
            int_required: 0,
            end_required: 5000,
            man_gain: 22,
            int_gain: 0,
            end_gain: 43,
            special_ability: "None",
            description:
              "This person assists the customers in making their purchases and accepts money over the counter.",
          },
          Cleaner: {
            man_required: 2500,
            int_required: 0,
            end_required: 1250,
            man_gain: 38,
            int_gain: 0,
            end_gain: 19,
            special_ability: "Cleaner",
            description: "This person will keep the shop clean and tidy.",
          },
          "Store Manager": {
            man_required: 0,
            int_required: 5000,
            end_required: 10000,
            man_gain: 0,
            int_gain: 25,
            end_gain: 49,
            special_ability: "Manager",
            description:
              "This person will take overall responsibility for the running of the store. They will keep all the workers at their best. ",
          },
          "Office Clerk": {
            man_required: 0,
            int_required: 3750,
            end_required: 7500,
            man_gain: 0,
            int_gain: 23,
            end_gain: 46,
            special_ability: "Secretary",
            description:
              "This position runs the office behind the scenes, keeping track of all finances. ",
          },
          "Marketing Executive": {
            man_required: 0,
            int_required: 10000,
            end_required: 5000,
            man_gain: 0,
            int_gain: 49,
            end_gain: 25,
            special_ability: "Marketer",
            description:
              "This person will help to market the toys being sold through the store.",
          },
          "Training Advisor": {
            man_required: 0,
            int_required: 15000,
            end_required: 7500,
            man_gain: 0,
            int_gain: 52,
            end_gain: 26,
            special_ability: "Trainer",
            description:
              "This position will make sure each person can do their job to the best of their ability. Well trained staff are always an asset to a company. ",
          },
          "Stock Clerk": {
            man_required: 4000,
            int_required: 0,
            end_required: 2000,
            man_gain: 41,
            int_gain: 0,
            end_gain: 21,
            special_ability: "None",
            description:
              "This person moves stock from the storage on to the shop's shelves for the customers to view and buy.",
          },
        },
      },
      10: {
        name: "Adult Novelties",
        cost: 1750000,
        default_employees: 4,
        positions: {
          "Sales Assistant": {
            man_required: 2000,
            int_required: 0,
            end_required: 4000,
            man_gain: 21,
            int_gain: 0,
            end_gain: 41,
            special_ability: "None",
            description: "This person serves the customers at the register.",
          },
          Sexpert: {
            man_required: 0,
            int_required: 10000,
            end_required: 5000,
            man_gain: 0,
            int_gain: 49,
            end_gain: 25,
            special_ability: "None",
            description:
              "With knowledge about everything erotic, this position will help customers find the right merchandise. ",
          },
          Cleaner: {
            man_required: 2000,
            int_required: 0,
            end_required: 1000,
            man_gain: 36,
            int_gain: 0,
            end_gain: 18,
            special_ability: "Cleaner",
            description: "This person keeps the shop clean and presentable. ",
          },
          "Store Manager": {
            man_required: 0,
            int_required: 4000,
            end_required: 8000,
            man_gain: 0,
            int_gain: 24,
            end_gain: 47,
            special_ability: "Manager",
            description:
              "This person makes sure the day to day running of the shop is flawless. They keep all the workers motivated, and working hard.  ",
          },
          Receptionist: {
            man_required: 0,
            int_required: 3000,
            end_required: 6000,
            man_gain: 0,
            int_gain: 23,
            end_gain: 45,
            special_ability: "Secretary",
            description:
              "This person takes over-the-phone and internet orders. They also keep detailed statistics of all the workers.  ",
          },
          "Marketing Manager": {
            man_required: 0,
            int_required: 8000,
            end_required: 4000,
            man_gain: 0,
            int_gain: 47,
            end_gain: 24,
            special_ability: "Marketer",
            description: "This position will help boost advertising campaigns.",
          },
          "HR Officer": {
            man_required: 0,
            int_required: 12000,
            end_required: 6000,
            man_gain: 0,
            int_gain: 50,
            end_gain: 25,
            special_ability: "Trainer",
            description:
              "This person makes sure the company workers are happy, fully trained and looked after. ",
          },
        },
      },
      11: {
        name: "Cyber Cafe",
        cost: 3000000,
        default_employees: 4,
        positions: {
          Cashier: {
            man_required: 0,
            int_required: 5000,
            end_required: 10000,
            man_gain: 0,
            int_gain: 25,
            end_gain: 49,
            special_ability: "None",
            description:
              "This position is responsible for taking payments from clients in exchange for time on the computers.",
          },
          Cleaner: {
            man_required: 5000,
            int_required: 0,
            end_required: 2500,
            man_gain: 43,
            int_gain: 0,
            end_gain: 22,
            special_ability: "Cleaner",
            description: "This position keeps the cafe clean.",
          },
          Manager: {
            man_required: 0,
            int_required: 10000,
            end_required: 20000,
            man_gain: 0,
            int_gain: 27,
            end_gain: 54,
            special_ability: "Manager",
            description:
              "This position is responsible for the day to day running of the cyber cafe. ",
          },
          Receptionist: {
            man_required: 0,
            int_required: 7500,
            end_required: 15000,
            man_gain: 0,
            int_gain: 26,
            end_gain: 52,
            special_ability: "Secretary",
            description:
              "This position welcomes customers to the cafe, and takes all phone calls.",
          },
          Marketer: {
            man_required: 0,
            int_required: 20000,
            end_required: 10000,
            man_gain: 0,
            int_gain: 54,
            end_gain: 27,
            special_ability: "Marketer",
            description:
              "This position will help to boost advertising campaigns.",
          },
          Teacher: {
            man_required: 0,
            int_required: 30000,
            end_required: 15000,
            man_gain: 0,
            int_gain: 57,
            end_gain: 29,
            special_ability: "Trainer",
            description:
              "This position is on hand and ready to assist with the clients who know nothing about computers. The primary role though, is for staff training.",
          },
          Administrator: {
            man_required: 0,
            int_required: 20000,
            end_required: 10000,
            man_gain: 0,
            int_gain: 54,
            end_gain: 27,
            special_ability: "None",
            description:
              "This position maintains the cafe's software and network. ",
          },
          Technician: {
            man_required: 8750,
            int_required: 17500,
            end_required: 0,
            man_gain: 27,
            int_gain: 53,
            end_gain: 0,
            special_ability: "None",
            description:
              "This position handles the hardware side of the cyber cafe.",
          },
        },
        stock: {
          "Per Hour": {
            cost: "",
            rrp: 25,
          },
          "Venue Hire": {
            cost: "",
            rrp: 1000,
          },
          "Computer Repair": {
            cost: "",
            rrp: 250,
          },
        },
        specials: {
          Ub3rg33k: {
            effect: "50% coding time reduction",
            cost: 0,
            rating_required: 1,
          },
          "Clone Data": {
            effect: "Virus",
            cost: 25,
            rating_required: 3,
          },
          "Proxy Hacking": {
            effect: "Cancel a target's virus programming",
            cost: 25,
            rating_required: 5,
          },
          "IP Tracing": {
            effect: "View lister of anonymous bounties",
            cost: 25,
            rating_required: 7,
          },
          "Financial Phishing": {
            effect: "View details of someone's investment account",
            cost: 25,
            rating_required: 10,
          },
        },
      },
      12: {
        name: "Grocery Store",
        cost: 2000000,
        default_employees: 5,
        positions: {
          Cashier: {
            man_required: 3000,
            int_required: 0,
            end_required: 6000,
            man_gain: 23,
            int_gain: 0,
            end_gain: 45,
            special_ability: "None",
            description:
              "This position is responsible for taking payment for goods purchased in-store. ",
          },
          "Stock Clerk": {
            man_required: 4500,
            int_required: 0,
            end_required: 2250,
            man_gain: 42,
            int_gain: 0,
            end_gain: 21,
            special_ability: "None",
            description:
              "This position keeps the shelves full and looking their best. ",
          },
          Cleaner: {
            man_required: 3000,
            int_required: 0,
            end_required: 1500,
            man_gain: 39,
            int_gain: 0,
            end_gain: 20,
            special_ability: "Cleaner",
            description:
              "This position makes sure the store is always clean and presentable. ",
          },
          Manager: {
            man_required: 0,
            int_required: 6000,
            end_required: 12000,
            man_gain: 0,
            int_gain: 25,
            end_gain: 50,
            special_ability: "Manager",
            description:
              "This position is responsible for the whole store, from staff to stock, the manager is the last port of call for it all. ",
          },
          Accountant: {
            man_required: 0,
            int_required: 4500,
            end_required: 9000,
            man_gain: 0,
            int_gain: 24,
            end_gain: 48,
            special_ability: "Secretary",
            description:
              "This position balances the books, making sure the store turns a profit. They provide the director with detailed statistics of employees.",
          },
          Marketer: {
            man_required: 0,
            int_required: 12000,
            end_required: 6000,
            man_gain: 0,
            int_gain: 50,
            end_gain: 25,
            special_ability: "Marketer",
            description:
              "This position boosts any company advertising campaigns.",
          },
          Trainer: {
            man_required: 0,
            int_required: 18000,
            end_required: 9000,
            man_gain: 0,
            int_gain: 53,
            end_gain: 27,
            special_ability: "Trainer",
            description:
              "This position is fully responsible for training staff. ",
          },
          "Delivery Driver": {
            man_required: 7500,
            int_required: 0,
            end_required: 3750,
            man_gain: 46,
            int_gain: 0,
            end_gain: 23,
            special_ability: "None",
            description:
              "This position can deliver produce directly to customer homes.",
          },
          "Cart Attendant": {
            man_required: 3000,
            int_required: 0,
            end_required: 1500,
            man_gain: 39,
            int_gain: 0,
            end_gain: 20,
            special_ability: "None",
            description:
              "This position can retrieve shopping carts from the parking lot, bringing them back in to the store.",
          },
        },
        stock: {
          Fruit: {
            cost: 1,
            rrp: 4,
          },
          Meat: {
            cost: 4,
            rrp: 12,
          },
          Bread: {
            cost: 1,
            rrp: 3,
          },
          Vegetables: {
            cost: 2,
            rrp: 5,
          },
          Fish: {
            cost: 3,
            rrp: 8,
          },
          Dairy: {
            cost: 1,
            rrp: 3,
          },
        },
        specials: {
          "Bagged Down": {
            effect: "Bag of candy",
            cost: 2,
            rating_required: 1,
          },
          "Fast Metabolism": {
            effect: "10% consumable cooldown reduction",
            cost: 0,
            rating_required: 3,
          },
          "Bottled Up": {
            effect: "Bottle of alcohol",
            cost: 5,
            rating_required: 5,
          },
          Absorption: {
            effect: "10% consumable gain",
            cost: 0,
            rating_required: 7,
          },
          "Canned In": {
            effect: "Can of energy drink",
            cost: 12,
            rating_required: 10,
          },
        },
      },
      13: {
        name: "Theater",
        cost: 50000000,
        default_employees: 6,
        positions: {
          "Ticketing Agent": {
            man_required: 0,
            int_required: 10000,
            end_required: 20000,
            man_gain: 0,
            int_gain: 27,
            end_gain: 54,
            special_ability: "None",
            description:
              "This person sells the tickets to shows that are appearing in the theater. If customers can't buy tickets, your theater won't make any cash!",
          },
          Technician: {
            man_required: 60000,
            int_required: 30000,
            end_required: 0,
            man_gain: 63,
            int_gain: 32,
            end_gain: 0,
            special_ability: "None",
            description:
              "This person performs all technical support, from building the decors to setting up and arranging the lighting and sound effects.",
          },
          Programmer: {
            man_required: 0,
            int_required: 50000,
            end_required: 25000,
            man_gain: 0,
            int_gain: 62,
            end_gain: 31,
            special_ability: "None",
            description:
              "This person is responsible for hiring and scheduling the artists. A vital role.",
          },
          Janitor: {
            man_required: 20000,
            int_required: 0,
            end_required: 10000,
            man_gain: 54,
            int_gain: 0,
            end_gain: 27,
            special_ability: "Cleaner",
            description:
              "This person cleans the theater between each show, and at the end of the day. ",
          },
          Manager: {
            man_required: 0,
            int_required: 40000,
            end_required: 80000,
            man_gain: 0,
            int_gain: 33,
            end_gain: 65,
            special_ability: "Manager",
            description:
              "Manages all staff, show times, concessions, and all day to day needs. ",
          },
          Accountant: {
            man_required: 0,
            int_required: 30000,
            end_required: 60000,
            man_gain: 0,
            int_gain: 32,
            end_gain: 63,
            special_ability: "Secretary",
            description:
              "This person is responsible for the company's accounts. ",
          },
          "Marketing Manager": {
            man_required: 0,
            int_required: 80000,
            end_required: 40000,
            man_gain: 0,
            int_gain: 65,
            end_gain: 33,
            special_ability: "Marketer",
            description:
              "This person will boost any advertising campaigns by managing all of the coordination for press and adversing on the radio, TV  print.",
          },
          Usher: {
            man_required: 10000,
            int_required: 0,
            end_required: 20000,
            man_gain: 27,
            int_gain: 0,
            end_gain: 54,
            special_ability: "None",
            description:
              "This position directs paying customers to their seats. An important role for larger theaters.",
          },
        },
        stock: {
          Ticket: {
            cost: "",
            rrp: 175,
          },
        },
        specials: {
          Stagecraft: {
            effect: "Experience",
            cost: 1,
            rating_required: 1,
          },
          Dramatics: {
            effect: "Maximum stealth",
            cost: 10,
            rating_required: 3,
          },
          Masked: {
            effect: "Cannot be targeted by spies",
            cost: 0,
            rating_required: 5,
          },
          Twinlike: {
            effect: "15% counterfeiting crime exp & skill gain",
            cost: 0,
            rating_required: 7,
          },
          Disguised: {
            effect: "Hidden destination & traveling status",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      14: {
        name: "Sweet Shop",
        cost: 1000000,
        default_employees: 4,
        positions: {
          Confectionist: {
            man_required: 0,
            int_required: 2500,
            end_required: 1250,
            man_gain: 0,
            int_gain: 38,
            end_gain: 19,
            special_ability: "None",
            description:
              "This person helps the customer get the perfect selection of candy based on their own wishes and desires.",
          },
          Packager: {
            man_required: 750,
            int_required: 0,
            end_required: 1500,
            man_gain: 17,
            int_gain: 0,
            end_gain: 34,
            special_ability: "None",
            description:
              "This person carefully packages and gift wraps the customer's candy if they require it.",
          },
          Cleaner: {
            man_required: 1000,
            int_required: 0,
            end_required: 500,
            man_gain: 30,
            int_gain: 0,
            end_gain: 15,
            special_ability: "Cleaner",
            description:
              "This position keeps the store clean, boosting the environment.",
          },
          Manager: {
            man_required: 0,
            int_required: 2000,
            end_required: 4000,
            man_gain: 0,
            int_gain: 21,
            end_gain: 41,
            special_ability: "Manager",
            description:
              "This position decreases any reduction of employee effectiveness.",
          },
          Bookkeeper: {
            man_required: 0,
            int_required: 1500,
            end_required: 3000,
            man_gain: 0,
            int_gain: 20,
            end_gain: 39,
            special_ability: "Secretary",
            description:
              "This position enables detailed employee statistics, showing the estimated profit made by each individual employee.",
          },
          Marketer: {
            man_required: 0,
            int_required: 4000,
            end_required: 2000,
            man_gain: 0,
            int_gain: 41,
            end_gain: 21,
            special_ability: "Marketer",
            description:
              "This position boosts any company advertising campaigns.",
          },
          Clerk: {
            man_required: 1000,
            int_required: 0,
            end_required: 2000,
            man_gain: 18,
            int_gain: 0,
            end_gain: 36,
            special_ability: "None",
            description:
              "This person sells the chosen candies to the customer.",
          },
        },
        stock: {
          "Boiled Sweet Selection": {
            cost: 4,
            rrp: 60,
          },
          "Chocolate Selection": {
            cost: 8,
            rrp: 90,
          },
          "Jelly Selection": {
            cost: 5,
            rrp: 50,
          },
          "Fudge Selection": {
            cost: 14,
            rrp: 120,
          },
          "Caramel Selection": {
            cost: 5,
            rrp: 60,
          },
          "Liquorice Selection": {
            cost: 11,
            rrp: 90,
          },
          "Marshmallow Selection": {
            cost: 3,
            rrp: 50,
          },
        },
        specials: {
          "Sweet Tooth": {
            effect: "50 happiness",
            cost: 1,
            rating_required: 1,
          },
          "Sugar Rush": {
            effect: "Bag of candy",
            cost: 2,
            rating_required: 3,
          },
          Gluttony: {
            effect: "1,000 happiness",
            cost: 10,
            rating_required: 5,
          },
          "Energy Rush": {
            effect: "Can of energy drink",
            cost: 15,
            rating_required: 7,
          },
          Voracious: {
            effect: "4,500 happiness",
            cost: 30,
            rating_required: 10,
          },
        },
      },
      15: {
        name: "Cruise Line",
        cost: 300000000,
        default_employees: 6,
        positions: {
          Captain: {
            man_required: 0,
            int_required: 154500,
            end_required: 77250,
            man_gain: 0,
            int_gain: 71,
            end_gain: 36,
            special_ability: "None",
            description:
              "This position will control the ship. Without a captain the ship will not be able to move, which will certainly disappoint passengers.",
          },
          Doctor: {
            man_required: 0,
            int_required: 103000,
            end_required: 51500,
            man_gain: 0,
            int_gain: 67,
            end_gain: 34,
            special_ability: "None",
            description:
              "This position deals with medical emergencies and routine procedures on passengers and staff.",
          },
          Steward: {
            man_required: 0,
            int_required: 20750,
            end_required: 41500,
            man_gain: 0,
            int_gain: 30,
            end_gain: 60,
            special_ability: "None",
            description:
              "This position is responsible for looking after the passengers on the cruise ship.",
          },
          "First Officer": {
            man_required: 0,
            int_required: 105000,
            end_required: 52500,
            man_gain: 0,
            int_gain: 67,
            end_gain: 34,
            special_ability: "None",
            description:
              "This position is the second in command to the captain.",
          },
          Deckhand: {
            man_required: 26000,
            int_required: 0,
            end_required: 13000,
            man_gain: 56,
            int_gain: 0,
            end_gain: 28,
            special_ability: "Cleaner",
            description:
              "This position is responsible for keeping the deck clean. They'll also take on duties including mooring and cargo handling.",
          },
          Bosun: {
            man_required: 0,
            int_required: 37000,
            end_required: 74000,
            man_gain: 0,
            int_gain: 33,
            end_gain: 65,
            special_ability: "Manager",
            description:
              "This position is the ship's officer, in charge of equipment and crew. They'll help to reduce any efficiency loss of employees.",
          },
          Receptionist: {
            man_required: 0,
            int_required: 21000,
            end_required: 42000,
            man_gain: 0,
            int_gain: 30,
            end_gain: 60,
            special_ability: "Secretary",
            description:
              "This position will answer all phone calls back at the offices. They'll also provide the director with insight into how much each employee is contributing to the business.",
          },
          Marketer: {
            man_required: 0,
            int_required: 72000,
            end_required: 36000,
            man_gain: 0,
            int_gain: 64,
            end_gain: 32,
            special_ability: "Marketer",
            description:
              "This position will help to promote the cruise line while ongoing advertisement campaigns are active.",
          },
          Specialist: {
            man_required: 0,
            int_required: 90000,
            end_required: 45000,
            man_gain: 0,
            int_gain: 66,
            end_gain: 33,
            special_ability: "Trainer",
            description:
              "This position will train other staff working on-board the cruise ship.",
          },
          Engineer: {
            man_required: 54500,
            int_required: 27250,
            end_required: 0,
            man_gain: 62,
            int_gain: 31,
            end_gain: 0,
            special_ability: "None",
            description:
              "This position controls and maintains the ship's engines below deck.",
          },
          Bartender: {
            man_required: 19250,
            int_required: 0,
            end_required: 38500,
            man_gain: 30,
            int_gain: 0,
            end_gain: 59,
            special_ability: "None",
            description:
              "This position will run the bar, serving passengers with drinks included in the price package.",
          },
          "Ticket Agent": {
            man_required: 0,
            int_required: 13000,
            end_required: 26000,
            man_gain: 0,
            int_gain: 28,
            end_gain: 56,
            special_ability: "None",
            description:
              "This position handles all ticket sales for the cruise line back at the offices. Without them, the company will not be able to make money.",
          },
          Chef: {
            man_required: 0,
            int_required: 64500,
            end_required: 32250,
            man_gain: 0,
            int_gain: 64,
            end_gain: 32,
            special_ability: "None",
            description:
              "This position will cook on-board for the passengers, filling the buffets with high quality food. ",
          },
        },
        stock: {
          Ticket: {
            cost: "",
            rrp: 3500,
          },
        },
        specials: {
          Bursar: {
            effect: "25 casino tokens",
            cost: 1,
            rating_required: 1,
          },
          Portage: {
            effect: "2 travel item capacity",
            cost: 0,
            rating_required: 3,
          },
          "R&R": {
            effect: "Drug addiction reduction",
            cost: 1,
            rating_required: 5,
          },
          "Destination Report": {
            effect: "View stock analysis of all items at a selected country",
            cost: 10,
            rating_required: 7,
          },
          Freight: {
            effect: "3 travel item capacity",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      16: {
        name: "Television Network",
        cost: 8000000000,
        default_employees: 8,
        positions: {
          Producer: {
            man_required: 0,
            int_required: 99000,
            end_required: 49500,
            man_gain: 0,
            int_gain: 67,
            end_gain: 34,
            special_ability: "None",
            description:
              "This position is responsible for the entire production process of the television shows.",
          },
          Programmer: {
            man_required: 0,
            int_required: 66000,
            end_required: 33000,
            man_gain: 0,
            int_gain: 64,
            end_gain: 32,
            special_ability: "None",
            description:
              "This position is responsible for the scheduling of shows and advertisements on the network.",
          },
          "Camera Operator": {
            man_required: 24750,
            int_required: 49500,
            end_required: 0,
            man_gain: 31,
            int_gain: 61,
            end_gain: 0,
            special_ability: "None",
            description:
              "This position is responsible for working the network's cameras on a variety of sets and outdoors.",
          },
          "Sales Executive": {
            man_required: 0,
            int_required: 24750,
            end_required: 49500,
            man_gain: 0,
            int_gain: 31,
            end_gain: 61,
            special_ability: "None",
            description:
              "This position is responsible for finalizing contracts regarding commercial slots. Without them, the company will not make a profit.",
          },
          Cleaner: {
            man_required: 33000,
            int_required: 0,
            end_required: 16500,
            man_gain: 58,
            int_gain: 0,
            end_gain: 29,
            special_ability: "Cleaner",
            description: "This position will clean the sets and offices.",
          },
          Attorney: {
            man_required: 0,
            int_required: 132000,
            end_required: 66000,
            man_gain: 0,
            int_gain: 69,
            end_gain: 35,
            special_ability: "None",
            description:
              "This position will be responsible for providing legal services with respect to all aspects of the network.",
          },
          Secretary: {
            man_required: 0,
            int_required: 49500,
            end_required: 99000,
            man_gain: 0,
            int_gain: 34,
            end_gain: 67,
            special_ability: "Secretary",
            description:
              "This position will provide insight in to how much each employee is contributing to the network.",
          },
          Marketer: {
            man_required: 0,
            int_required: 132000,
            end_required: 66000,
            man_gain: 0,
            int_gain: 69,
            end_gain: 35,
            special_ability: "Marketer",
            description:
              "This position will help make the most of advertisement campaigns, focusing on making the network more popular.",
          },
          Writer: {
            man_required: 0,
            int_required: 115500,
            end_required: 57750,
            man_gain: 0,
            int_gain: 68,
            end_gain: 34,
            special_ability: "None",
            description:
              "This position will help to write content for the network, usually television shows.",
          },
          Stagehand: {
            man_required: 33000,
            int_required: 0,
            end_required: 16500,
            man_gain: 58,
            int_gain: 0,
            end_gain: 29,
            special_ability: "None",
            description:
              "This position works with the other staff, providing a huge variety of staging services. From lighting operation to set building.",
          },
          Anchor: {
            man_required: 0,
            int_required: 132000,
            end_required: 66000,
            man_gain: 0,
            int_gain: 69,
            end_gain: 35,
            special_ability: "None",
            description:
              "This position presents the news to viewers. Providing news is an important aspect of a television network.",
          },
          Reporter: {
            man_required: 0,
            int_required: 82500,
            end_required: 41250,
            man_gain: 0,
            int_gain: 66,
            end_gain: 33,
            special_ability: "None",
            description:
              "This position will report news from the scene, usually after being introduced by the anchor.",
          },
        },
        stock: {
          "Commercial Contract": {
            cost: "",
            rrp: 75000,
          },
        },
        specials: {
          "Propaganda ": {
            effect: "1 faction respect",
            cost: 5,
            rating_required: 1,
          },
          Scoop: {
            effect: "50% newspaper advertising cost reduction",
            cost: 0,
            rating_required: 3,
          },
          "Inside Story": {
            effect: "View someone's battle stats & money",
            cost: 15,
            rating_required: 5,
          },
          "Press Pass": {
            effect: "Receive special privileges",
            cost: 25,
            rating_required: 10,
          },
        },
      },
      18: {
        name: "Zoo",
        cost: 300000000,
        default_employees: 6,
        positions: {
          "Zoo Keeper": {
            man_required: 58000,
            int_required: 0,
            end_required: 29000,
            man_gain: 63,
            int_gain: 0,
            end_gain: 32,
            special_ability: "Cleaner",
            description:
              "This position feeds the zoo's animals and cleans exhibits. They'll also report any health problems to the veterinarians.",
          },
          "Animal Trainer": {
            man_required: 36250,
            int_required: 72500,
            end_required: 0,
            man_gain: 33,
            int_gain: 65,
            end_gain: 0,
            special_ability: "None",
            description:
              "This position humanely trains the zoo's animals to participate in special shows for the visitors.",
          },
          Aquarist: {
            man_required: 0,
            int_required: 29000,
            end_required: 58000,
            man_gain: 0,
            int_gain: 32,
            end_gain: 63,
            special_ability: "None",
            description:
              "The position maintains the aquarium and cares for the inhabitants.",
          },
          Intern: {
            man_required: 14500,
            int_required: 0,
            end_required: 7250,
            man_gain: 52,
            int_gain: 0,
            end_gain: 26,
            special_ability: "None",
            description:
              "This position will take on the tasks of the zoo keepers but at a lower level. They require less working stats.",
          },
          Manager: {
            man_required: 0,
            int_required: 58000,
            end_required: 116000,
            man_gain: 0,
            int_gain: 34,
            end_gain: 68,
            special_ability: "Manager",
            description:
              "This position will watch over employees, attempting to keep their efficiency high.",
          },
          Bookkeeper: {
            man_required: 0,
            int_required: 43500,
            end_required: 87000,
            man_gain: 0,
            int_gain: 33,
            end_gain: 66,
            special_ability: "Secretary",
            description:
              "This position will provide detailed information about each employee, hopefully determining how much each employee is contributing to the zoo.",
          },
          Photographer: {
            man_required: 0,
            int_required: 116000,
            end_required: 58000,
            man_gain: 0,
            int_gain: 68,
            end_gain: 34,
            special_ability: "Marketer",
            description:
              "This position will photograph the zoo's animals for use in advertising campaigns.",
          },
          Consultant: {
            man_required: 0,
            int_required: 174000,
            end_required: 87000,
            man_gain: 0,
            int_gain: 72,
            end_gain: 36,
            special_ability: "Trainer",
            description:
              "This position specialises in the inner workings of zoos. They'll train employees to bolster their working stats.",
          },
          Veterinarian: {
            man_required: 58000,
            int_required: 116000,
            end_required: 0,
            man_gain: 34,
            int_gain: 68,
            end_gain: 0,
            special_ability: "None",
            description:
              "This position takes a more specialist role over the zoo keepers. They will treat diseased or injured animals as well as performing routine veterinary tasks.",
          },
          Cashier: {
            man_required: 0,
            int_required: 14500,
            end_required: 29000,
            man_gain: 0,
            int_gain: 29,
            end_gain: 57,
            special_ability: "None",
            description:
              "This position will sell tickets, animal feed and souvenirs to the customers.",
          },
        },
        stock: {
          "Entry Fee": {
            cost: "",
            rrp: 75,
          },
          "Animal Feed": {
            cost: 1,
            rrp: 10,
          },
          Souvenir: {
            cost: 2,
            rrp: 25,
          },
        },
        specials: {
          Fulfillment: {
            effect: "50 happiness",
            cost: 1,
            rating_required: 1,
          },
          "Animal Instinct": {
            effect: "25% hunting income",
            cost: 0,
            rating_required: 3,
          },
          "Special K": {
            effect: "Ketamine drug",
            cost: 5,
            rating_required: 5,
          },
          "Eye of the Tiger": {
            effect: "70% awareness",
            cost: 0,
            rating_required: 7,
          },
          "Seasoned Poacher": {
            effect: "3.0 accuracy",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      19: {
        name: "Firework Stand",
        cost: 500000,
        default_employees: 4,
        positions: {
          Salesperson: {
            man_required: 0,
            int_required: 500,
            end_required: 1000,
            man_gain: 0,
            int_gain: 15,
            end_gain: 30,
            special_ability: "None",
            description:
              "This person is responsible for making all sales of fireworks to customers.",
          },
          Pyrotechnician: {
            man_required: 3000,
            int_required: 1500,
            end_required: 0,
            man_gain: 39,
            int_gain: 20,
            end_gain: 0,
            special_ability: "None",
            description:
              "This person makes the fireworks which can later be sold by your stand.",
          },
          "Picker Packer": {
            man_required: 500,
            int_required: 0,
            end_required: 250,
            man_gain: 25,
            int_gain: 0,
            end_gain: 13,
            special_ability: "None",
            description:
              "This person is responsible for making sure all fireworks are packed correctly for customers. ",
          },
          Manager: {
            man_required: 0,
            int_required: 1000,
            end_required: 2000,
            man_gain: 0,
            int_gain: 18,
            end_gain: 36,
            special_ability: "Manager",
            description:
              "This person oversees the general running of the stand.",
          },
          Bookkeeper: {
            man_required: 0,
            int_required: 750,
            end_required: 1500,
            man_gain: 0,
            int_gain: 17,
            end_gain: 34,
            special_ability: "Secretary",
            description:
              "This person keeps the books in order. They can also provide detailed statistics about employees.",
          },
          "Advertising Manager": {
            man_required: 0,
            int_required: 2000,
            end_required: 1000,
            man_gain: 0,
            int_gain: 36,
            end_gain: 18,
            special_ability: "Marketer",
            description: "This person boosts company advertising.",
          },
          Trainer: {
            man_required: 0,
            int_required: 3000,
            end_required: 1500,
            man_gain: 0,
            int_gain: 39,
            end_gain: 20,
            special_ability: "Trainer",
            description:
              "This person makes sure everyone working on the stand knows how to safely pack, sell and produce fireworks.",
          },
        },
        stock: {
          Firework: {
            cost: "",
            rrp: 140,
          },
        },
        specials: {
          Audaciousness: {
            effect: "2 nerve",
            cost: 1,
            rating_required: 1,
          },
          Illumination: {
            effect: "50% awareness",
            cost: 0,
            rating_required: 3,
          },
          Pyromania: {
            effect: "Flamethrower damage & accuracy",
            cost: 0,
            rating_required: 5,
          },
          Inferno: {
            effect: "Random incendiary ammunition ",
            cost: 25,
            rating_required: 10,
          },
        },
      },
      20: {
        name: "Property Broker",
        cost: 750000,
        default_employees: 4,
        positions: {
          "Property Broker": {
            man_required: 0,
            int_required: 750,
            end_required: 1500,
            man_gain: 0,
            int_gain: 17,
            end_gain: 34,
            special_ability: "None",
            description:
              "This person finds buyers for clients and arranges the transactions between them. Without these transactions there would be no income.",
          },
          "Valuation Specialist": {
            man_required: 0,
            int_required: 3000,
            end_required: 1500,
            man_gain: 0,
            int_gain: 39,
            end_gain: 20,
            special_ability: "None",
            description:
              "This person makes decisions on the marketability of properties for evaluation purposes. This will boost the effectiveness of the brokers. ",
          },
          "Associate Broker": {
            man_required: 0,
            int_required: 250,
            end_required: 500,
            man_gain: 0,
            int_gain: 13,
            end_gain: 25,
            special_ability: "None",
            description:
              "This person supports brokers on large, complex accounts. They won't earn as much for the company, but they don't require as high working stats. ",
          },
          Cleaner: {
            man_required: 1000,
            int_required: 0,
            end_required: 500,
            man_gain: 30,
            int_gain: 0,
            end_gain: 15,
            special_ability: "Cleaner",
            description:
              "This person keeps the properties clean and tidy for viewing. ",
          },
          "Team Manager": {
            man_required: 0,
            int_required: 1500,
            end_required: 3000,
            man_gain: 0,
            int_gain: 20,
            end_gain: 39,
            special_ability: "Manager",
            description:
              "This person oversees the brokers and other mid-level staff. They will help to decrease any effectiveness loss of the employees.  ",
          },
          Receptionist: {
            man_required: 0,
            int_required: 1250,
            end_required: 2500,
            man_gain: 0,
            int_gain: 19,
            end_gain: 38,
            special_ability: "Secretary",
            description:
              "This person is an essential member of the team, arranging the majority of property viewings and exchanging offers between buyers and sellers.",
          },
          "Graphic Designer": {
            man_required: 0,
            int_required: 3000,
            end_required: 1500,
            man_gain: 0,
            int_gain: 39,
            end_gain: 20,
            special_ability: "Marketer",
            description:
              "This position boosts any company advertising campaigns by producing brochures listing the properties for sale.",
          },
          "Broker Support": {
            man_required: 0,
            int_required: 4500,
            end_required: 2250,
            man_gain: 0,
            int_gain: 42,
            end_gain: 21,
            special_ability: "Trainer",
            description:
              "This person collaborates with team members to determine how to best assist across multiple lines of business. They will also offer training to other employees.",
          },
        },
        stock: {
          "Trailer Commission": {
            cost: "",
            rrp: 150,
          },
          "Apartment Commission": {
            cost: "",
            rrp: 750,
          },
          "Semi-Detached Commission": {
            cost: "",
            rrp: 2250,
          },
          "Detached Commission": {
            cost: "",
            rrp: 9000,
          },
          "Beach House Commission": {
            cost: "",
            rrp: 15000,
          },
          "Chalet Commission": {
            cost: "",
            rrp: 22500,
          },
          "Villa Commission": {
            cost: "",
            rrp: 37500,
          },
          "Penthouse Commission": {
            cost: "",
            rrp: 60000,
          },
          "Mansion Commission": {
            cost: "",
            rrp: 90000,
          },
        },
        specials: {
          Commission: {
            effect: "Money",
            cost: 1,
            rating_required: 1,
          },
          "Job Satisfaction": {
            effect: "50 happiness",
            cost: 1,
            rating_required: 3,
          },
          Vendor: {
            effect: "Free anonymous Item Market listings",
            cost: 0,
            rating_required: 5,
          },
          "Insider Trading": {
            effect: "Random property",
            cost: 150,
            rating_required: 7,
          },
          "Interior Connections": {
            effect: "10% property upgrade cost reduction",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      21: {
        name: "Furniture Store",
        cost: 2500000,
        default_employees: 4,
        positions: {
          "Sales Clerk": {
            man_required: 0,
            int_required: 3250,
            end_required: 6500,
            man_gain: 0,
            int_gain: 23,
            end_gain: 45,
            special_ability: "None",
            description:
              "This person helps the customer find the ideal furniture to match their tastes. They also take the final payment.",
          },
          "Delivery Driver": {
            man_required: 8000,
            int_required: 0,
            end_required: 4000,
            man_gain: 47,
            int_gain: 0,
            end_gain: 24,
            special_ability: "None",
            description:
              "This position delivers ordered goods to the customer's home.",
          },
          Apprentice: {
            man_required: 0,
            int_required: 750,
            end_required: 1500,
            man_gain: 0,
            int_gain: 17,
            end_gain: 34,
            special_ability: "None",
            description:
              "This position earns a smaller amount of profit for the company than the Sales Clerk, but requires less working stats.",
          },
          Cleaner: {
            man_required: 3500,
            int_required: 0,
            end_required: 1750,
            man_gain: 40,
            int_gain: 0,
            end_gain: 20,
            special_ability: "Cleaner",
            description:
              "This position increases the cleanliness of the workplace.",
          },
          Manager: {
            man_required: 0,
            int_required: 6500,
            end_required: 13000,
            man_gain: 0,
            int_gain: 26,
            end_gain: 51,
            special_ability: "Manager",
            description:
              "This position runs the store, decreasing any reduction of employee effectiveness.",
          },
          Receptionist: {
            man_required: 0,
            int_required: 5000,
            end_required: 10000,
            man_gain: 0,
            int_gain: 25,
            end_gain: 49,
            special_ability: "Secretary",
            description:
              "This position answers phone calls and enables detailed employee statistics, showing the estimated profit made by each individual employee.",
          },
          Marketer: {
            man_required: 0,
            int_required: 13000,
            end_required: 6500,
            man_gain: 0,
            int_gain: 51,
            end_gain: 26,
            special_ability: "Marketer",
            description:
              "This position boosts any company advertising campaigns.",
          },
          Trainer: {
            man_required: 0,
            int_required: 19500,
            end_required: 9750,
            man_gain: 0,
            int_gain: 54,
            end_gain: 27,
            special_ability: "Trainer",
            description:
              "This position increases the amount of trains a director receives each day.",
          },
        },
        stock: {
          Sofa: {
            cost: 600,
            rrp: 1800,
          },
          "Coffee Table": {
            cost: 200,
            rrp: 600,
          },
          "Entertainment Unit": {
            cost: 250,
            rrp: 800,
          },
          "Dining Chair": {
            cost: 50,
            rrp: 200,
          },
          "Dining Table": {
            cost: 400,
            rrp: 1200,
          },
          "Display Cabinet": {
            cost: 450,
            rrp: 1400,
          },
          "Bedside Table": {
            cost: 100,
            rrp: 400,
          },
          Bed: {
            cost: 450,
            rrp: 1450,
          },
        },
        specials: {
          "Coffee Break": {
            effect: "3 energy",
            cost: 1,
            rating_required: 1,
          },
          "Heavy Lifting": {
            effect: "Strength",
            cost: 1,
            rating_required: 3,
          },
          Removal: {
            effect: "15% theft crime exp & skill gain",
            cost: 0,
            rating_required: 5,
          },
          Beefcake: {
            effect: "25% passive strength",
            cost: 0,
            rating_required: 7,
          },
          "Brute Force": {
            effect: "100% fist & kick damage",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      22: {
        name: "Gas Station",
        cost: 25000000,
        default_employees: 4,
        positions: {
          Attendant: {
            man_required: 0,
            int_required: 13000,
            end_required: 26000,
            man_gain: 0,
            int_gain: 28,
            end_gain: 56,
            special_ability: "None",
            description:
              "This position handles customer payments and offers assistance when needed.",
          },
          Cleaner: {
            man_required: 17500,
            int_required: 0,
            end_required: 8750,
            man_gain: 53,
            int_gain: 0,
            end_gain: 27,
            special_ability: "Cleaner",
            description: "This person will keep the forecourt clean and safe.",
          },
          Manager: {
            man_required: 0,
            int_required: 30000,
            end_required: 60000,
            man_gain: 0,
            int_gain: 32,
            end_gain: 63,
            special_ability: "Manager",
            description:
              "This person oversees the running of the gas station. They work hard to keep all employees at their best.",
          },
          Marketer: {
            man_required: 0,
            int_required: 40000,
            end_required: 20000,
            man_gain: 0,
            int_gain: 60,
            end_gain: 30,
            special_ability: "Marketer",
            description:
              "This position boosts marketing campaigns made by the gas station. ",
          },
          Trainer: {
            man_required: 0,
            int_required: 70500,
            end_required: 35250,
            man_gain: 0,
            int_gain: 64,
            end_gain: 32,
            special_ability: "Trainer",
            description:
              "This position trains the staff to make sure they work safely around the pumps.",
          },
        },
        stock: {
          "Gasoline (Gallon)": {
            cost: 2,
            rrp: 5,
          },
          "Diesel (Gallon)": {
            cost: 3,
            rrp: 6,
          },
        },
        specials: {
          "Molotov Cocktail": {
            effect: "Molotov cocktail",
            cost: 3,
            rating_required: 1,
          },
          Fueled: {
            effect: "25% passive speed",
            cost: 0,
            rating_required: 3,
          },
          Cauterize: {
            effect: "Occasional healing during combat",
            cost: 0,
            rating_required: 5,
          },
          Fireproof: {
            effect: "50% fire damage mitigation",
            cost: 0,
            rating_required: 7,
          },
          "Blaze of Glory": {
            effect: "50% fire damage dealt",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      23: {
        name: "Music Store",
        cost: 1500000,
        default_employees: 4,
        positions: {
          "Sales Assistant": {
            man_required: 0,
            int_required: 1750,
            end_required: 3500,
            man_gain: 0,
            int_gain: 20,
            end_gain: 40,
            special_ability: "None",
            description: "This position handles the final sale of instruments.",
          },
          Musician: {
            man_required: 4500,
            int_required: 9000,
            end_required: 0,
            man_gain: 24,
            int_gain: 48,
            end_gain: 0,
            special_ability: "None",
            description:
              "This position can give expert advice on different instruments to secure sales.",
          },
          "Sales Apprentice": {
            man_required: 0,
            int_required: 500,
            end_required: 1000,
            man_gain: 0,
            int_gain: 15,
            end_gain: 30,
            special_ability: "None",
            description:
              "This position is often slightly less qualified than the fully fledged sales assistant, but requires less working stats.",
          },
          Cleaner: {
            man_required: 2000,
            int_required: 0,
            end_required: 1000,
            man_gain: 36,
            int_gain: 0,
            end_gain: 18,
            special_ability: "Cleaner",
            description:
              "This position increases the cleanliness of the workplace.",
          },
          Supervisor: {
            man_required: 0,
            int_required: 3500,
            end_required: 7000,
            man_gain: 0,
            int_gain: 23,
            end_gain: 46,
            special_ability: "Manager",
            description:
              "This position manages the other employees, making sure they are maximising their capabilities.",
          },
          Bookkeeper: {
            man_required: 0,
            int_required: 2750,
            end_required: 5500,
            man_gain: 0,
            int_gain: 22,
            end_gain: 44,
            special_ability: "Secretary",
            description:
              "This position enables detailed employee statistics, showing the estimated profit made by each individual employee.",
          },
          Trainer: {
            man_required: 0,
            int_required: 10500,
            end_required: 5250,
            man_gain: 0,
            int_gain: 49,
            end_gain: 25,
            special_ability: "Trainer",
            description:
              "This position increases the amount of trains a director receives each day.",
          },
        },
        stock: {
          Piano: {
            cost: 5400,
            rrp: 7000,
          },
          Guitar: {
            cost: 691,
            rrp: 900,
          },
          "Drum Kit": {
            cost: 923,
            rrp: 1200,
          },
          Violin: {
            cost: 389,
            rrp: 500,
          },
          Flute: {
            cost: 499,
            rrp: 650,
          },
          Ukulele: {
            cost: 121,
            rrp: 260,
          },
          Saxophone: {
            cost: 1000,
            rrp: 1360,
          },
          Clarinet: {
            cost: 1692,
            rrp: 2200,
          },
          Trumpet: {
            cost: 1311,
            rrp: 1680,
          },
          Synthesizer: {
            cost: 280,
            rrp: 420,
          },
        },
        specials: {
          Ambience: {
            effect: "50 happiness",
            cost: 1,
            rating_required: 1,
          },
          "Well Tuned": {
            effect: "30% gym experience",
            cost: 0,
            rating_required: 3,
          },
          "High-fidelity": {
            effect: "2.0 opponent stealth reduction",
            cost: 0,
            rating_required: 5,
          },
          Deafened: {
            effect: "Maximum stealth",
            cost: 10,
            rating_required: 7,
          },
          "The Score": {
            effect: "15% passive battle stats",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      24: {
        name: "Nightclub",
        cost: 7500000,
        default_employees: 5,
        positions: {
          Bartender: {
            man_required: 13500,
            int_required: 0,
            end_required: 27000,
            man_gain: 29,
            int_gain: 0,
            end_gain: 57,
            special_ability: "None",
            description:
              "This position serves drinks and snacks to customers from the bar. ",
          },
          Bouncer: {
            man_required: 48000,
            int_required: 0,
            end_required: 24000,
            man_gain: 61,
            int_gain: 0,
            end_gain: 31,
            special_ability: "None",
            description:
              "This position makes sure there is no trouble on the premises. Customers are more likely to enjoy a hassle free night out.",
          },
          Barback: {
            man_required: 10250,
            int_required: 0,
            end_required: 20500,
            man_gain: 27,
            int_gain: 0,
            end_gain: 54,
            special_ability: "None",
            description:
              "This position assists the bartenders. They will stock the bar and wash glasses.",
          },
          Cleaner: {
            man_required: 13500,
            int_required: 0,
            end_required: 6750,
            man_gain: 51,
            int_gain: 0,
            end_gain: 26,
            special_ability: "Cleaner",
            description:
              "This position will clean the floor and surfaces of the nightclub, often while full of customers.",
          },
          Manager: {
            man_required: 0,
            int_required: 27000,
            end_required: 54000,
            man_gain: 0,
            int_gain: 31,
            end_gain: 62,
            special_ability: "Manager",
            description:
              "This position manages all aspects of the nightclub and keeps the staff working hard.",
          },
          "Personal Assistant": {
            man_required: 0,
            int_required: 20250,
            end_required: 40500,
            man_gain: 0,
            int_gain: 30,
            end_gain: 60,
            special_ability: "Secretary",
            description:
              "This position acts as the personal assistant to the manager. They'll work out what each employee is up to, and their worth to the company.",
          },
          Promoter: {
            man_required: 0,
            int_required: 54000,
            end_required: 27000,
            man_gain: 0,
            int_gain: 62,
            end_gain: 31,
            special_ability: "Marketer",
            description:
              "Every good nightclub has a good promoter to advertise and bring in the customers.",
          },
          Trainer: {
            man_required: 0,
            int_required: 81000,
            end_required: 40500,
            man_gain: 0,
            int_gain: 65,
            end_gain: 33,
            special_ability: "Trainer",
            description:
              "This position assists the director with the training of staff members.",
          },
          "Disk-jockey": {
            man_required: 0,
            int_required: 40500,
            end_required: 20250,
            man_gain: 0,
            int_gain: 60,
            end_gain: 30,
            special_ability: "None",
            description:
              "This position keeps the music pumping throughout the night.",
          },
        },
        stock: {
          "Entry Fee": {
            cost: "",
            rrp: 30,
          },
          Beer: {
            cost: "",
            rrp: 15,
          },
          Wine: {
            cost: "",
            rrp: 35,
          },
          Cocktail: {
            cost: "",
            rrp: 45,
          },
          Shot: {
            cost: "",
            rrp: 6,
          },
          "Soft Drink": {
            cost: "",
            rrp: 7,
          },
        },
        specials: {
          "Criminal Connections": {
            effect: "Experience",
            cost: 1,
            rating_required: 1,
          },
          "Target Market": {
            effect: "15% illicit services crime exp & skill gain",
            cost: 0,
            rating_required: 3,
          },
          Suppression: {
            effect: "Drug addiction",
            cost: 1,
            rating_required: 5,
          },
          Tolerance: {
            effect: "50% drug overdose risk reduction",
            cost: 0,
            rating_required: 7,
          },
          Restraint: {
            effect: "Education is unaffected by drug addiction",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      25: {
        name: "Pub",
        cost: 1250000,
        default_employees: 4,
        positions: {
          Bartender: {
            man_required: 1500,
            int_required: 0,
            end_required: 3000,
            man_gain: 20,
            int_gain: 0,
            end_gain: 39,
            special_ability: "None",
            description:
              "Bartenders mix and serve beverages for the customers waiting at the bar.",
          },
          Bouncer: {
            man_required: 6000,
            int_required: 0,
            end_required: 3000,
            man_gain: 45,
            int_gain: 0,
            end_gain: 23,
            special_ability: "None",
            description:
              "The bouncer will expel troublemakers and disorderly people from the bar. They give the customers a sense of security.",
          },
          Waiter: {
            man_required: 1500,
            int_required: 0,
            end_required: 3000,
            man_gain: 20,
            int_gain: 0,
            end_gain: 39,
            special_ability: "None",
            description:
              "The waiter helps the bartender by delivering the beverages to the customer's tables. ",
          },
          Cleaner: {
            man_required: 1500,
            int_required: 0,
            end_required: 750,
            man_gain: 34,
            int_gain: 0,
            end_gain: 17,
            special_ability: "Cleaner",
            description:
              "This position increases the cleanliness of the pub. An especially important role in such an environment.",
          },
          Manager: {
            man_required: 0,
            int_required: 3000,
            end_required: 6000,
            man_gain: 0,
            int_gain: 23,
            end_gain: 45,
            special_ability: "Manager",
            description:
              "This person will correct, manage and motivate the currently hired employees.",
          },
          Bookkeeper: {
            man_required: 0,
            int_required: 2250,
            end_required: 4500,
            man_gain: 0,
            int_gain: 21,
            end_gain: 42,
            special_ability: "Secretary",
            description:
              "This position enables detailed employee statistics, showing the estimated profit made by each individual employee.",
          },
          Trainer: {
            man_required: 0,
            int_required: 9000,
            end_required: 4500,
            man_gain: 0,
            int_gain: 48,
            end_gain: 24,
            special_ability: "Trainer",
            description:
              "This position increases the amount of trains a director receives each day.",
          },
          Promoter: {
            man_required: 0,
            int_required: 6000,
            end_required: 3000,
            man_gain: 0,
            int_gain: 45,
            end_gain: 23,
            special_ability: "Marketer",
            description:
              "This position hands out flyers and speaks directly to pedestrians to attract customers to the bar. Also helps any advertising campaigns.",
          },
        },
        stock: {
          Beer: {
            cost: "",
            rrp: 8,
          },
          Cider: {
            cost: "",
            rrp: 9,
          },
          Wine: {
            cost: "",
            rrp: 25,
          },
          Cocktail: {
            cost: "",
            rrp: 30,
          },
          Shot: {
            cost: "",
            rrp: 4,
          },
          "Soft Drink": {
            cost: "",
            rrp: 5,
          },
          Coffee: {
            cost: "",
            rrp: 8,
          },
        },
        specials: {
          "Pub Lunch": {
            effect: "3 energy",
            cost: 1,
            rating_required: 1,
          },
          "Drunken Master": {
            effect: "10% melee weapon damage",
            cost: 0,
            rating_required: 3,
          },
          "Liquid Courage": {
            effect: "Refill nerve bar",
            cost: 25,
            rating_required: 5,
          },
          Lightweight: {
            effect: "50% nerve gain from alcohol",
            cost: 0,
            rating_required: 7,
          },
          Buzzed: {
            effect: "15 maximum nerve",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      26: {
        name: "Gents Strip Club",
        cost: 5000000,
        default_employees: 4,
        positions: {
          Stripper: {
            man_required: 7250,
            int_required: 0,
            end_required: 14500,
            man_gain: 26,
            int_gain: 0,
            end_gain: 52,
            special_ability: "None",
            description:
              "This position is solely responsible for entertaining the clients by providing dance services. An attractive female will fill this role nicely.",
          },
          "Security Guard": {
            man_required: 29000,
            int_required: 0,
            end_required: 14500,
            man_gain: 57,
            int_gain: 0,
            end_gain: 29,
            special_ability: "None",
            description:
              "This position will protect the girls and clients from any negative attitude. Customers are more willing to come to a safe club.",
          },
          Cleaner: {
            man_required: 7500,
            int_required: 0,
            end_required: 3750,
            man_gain: 46,
            int_gain: 0,
            end_gain: 23,
            special_ability: "Cleaner",
            description: "This position cleans the strip club.",
          },
          Manager: {
            man_required: 0,
            int_required: 14500,
            end_required: 29000,
            man_gain: 0,
            int_gain: 29,
            end_gain: 57,
            special_ability: "Manager",
            description:
              "This position makes business decisions on behalf of the director, they also decrease any reduction of employee effectiveness.",
          },
          Bookkeeper: {
            man_required: 0,
            int_required: 11000,
            end_required: 22000,
            man_gain: 0,
            int_gain: 28,
            end_gain: 55,
            special_ability: "Secretary",
            description:
              "This position enables detailed employee statistics, showing the estimated profit made by each individual employee.",
          },
          Photographer: {
            man_required: 0,
            int_required: 29000,
            end_required: 14500,
            man_gain: 0,
            int_gain: 57,
            end_gain: 29,
            special_ability: "Marketer",
            description:
              "This position boosts any company advertising campaigns by photographing the girls in action and publishing them.",
          },
        },
        stock: {
          Admission: {
            cost: "",
            rrp: 10,
          },
          "Lap Dance": {
            cost: "",
            rrp: 30,
          },
          Tips: {
            cost: "",
            rrp: 1,
          },
          Special: {
            cost: "",
            rrp: 150,
          },
        },
        specials: {
          "Happy Ending": {
            effect: "50 happiness",
            cost: 1,
            rating_required: 1,
          },
          "Dancer's Flair": {
            effect: "25% passive dexterity",
            cost: 0,
            rating_required: 3,
          },
          Supple: {
            effect: "50% Tyrosine effectiveness & duration",
            cost: 0,
            rating_required: 5,
          },
          Pilates: {
            effect: "10% dexterity gym gains",
            cost: 0,
            rating_required: 7,
          },
          "No Touching": {
            effect: "25% chance of dodging incoming melee attacks",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      27: {
        name: "Restaurant",
        cost: 1000000,
        default_employees: 4,
        positions: {
          Waiter: {
            man_required: 1250,
            int_required: 0,
            end_required: 2500,
            man_gain: 19,
            int_gain: 0,
            end_gain: 38,
            special_ability: "None",
            description:
              "This person takes orders and delivers food to customers.",
          },
          "Sous Chef": {
            man_required: 0,
            int_required: 4000,
            end_required: 2000,
            man_gain: 0,
            int_gain: 41,
            end_gain: 21,
            special_ability: "Trainer",
            description:
              "Second in comand in the kitchen and assistant to the head chef, the sous chef is responsible for inventory and constant training of employees. ",
          },
          "Head Chef": {
            man_required: 0,
            int_required: 2500,
            end_required: 5000,
            man_gain: 0,
            int_gain: 22,
            end_gain: 43,
            special_ability: "Manager",
            description:
              "This is the chef in charge of all kitchen activity and management of the kitchen staff as well as menu creation. ",
          },
          "Kitchen Assistant": {
            man_required: 1500,
            int_required: 0,
            end_required: 750,
            man_gain: 34,
            int_gain: 0,
            end_gain: 17,
            special_ability: "Cleaner",
            description:
              "Unskilled work within the kitchen, the kitchen assistant is in charge of the majority of the cleaning and mundane tasks such as potato peeling.",
          },
          "Head Waiter": {
            man_required: 0,
            int_required: 2000,
            end_required: 4000,
            man_gain: 0,
            int_gain: 21,
            end_gain: 41,
            special_ability: "Secretary",
            description:
              "For larger kitchens where the chefs and basic waiters are constantly busy with orders, a head waiter may be appointed in order to take reservations and oversee payment of wages.",
          },
          "Line Cook": {
            man_required: 1250,
            int_required: 2500,
            end_required: 0,
            man_gain: 19,
            int_gain: 38,
            end_gain: 0,
            special_ability: "None",
            description:
              "Third in command, the line cook is responsible for a particular area of production and supervision of the new chefs. ",
          },
          Chef: {
            man_required: 1500,
            int_required: 3000,
            end_required: 0,
            man_gain: 20,
            int_gain: 39,
            end_gain: 0,
            special_ability: "None",
            description:
              "This person is a basic chef, working under the line cook. ",
          },
          "Apprentice Chef": {
            man_required: 750,
            int_required: 1500,
            end_required: 0,
            man_gain: 17,
            int_gain: 34,
            end_gain: 0,
            special_ability: "None",
            description:
              "A trainee chef undergoing formal cullinary training, less skilled than trained chefs, the apprentices are gaining first hand experience in preparing meals in a working environment.",
          },
          Dishwasher: {
            man_required: 1500,
            int_required: 0,
            end_required: 750,
            man_gain: 34,
            int_gain: 0,
            end_gain: 17,
            special_ability: "None",
            description:
              "This person cleans the dishes that have been used by the clients, an important role that takes some of the workload.",
          },
        },
        stock: {
          "Starter Course": {
            cost: "",
            rrp: 20,
          },
          "Main Course": {
            cost: "",
            rrp: 95,
          },
          "Dessert Course": {
            cost: "",
            rrp: 30,
          },
          Beverage: {
            cost: 1,
            rrp: 10,
          },
          "Bottle of Wine": {
            cost: 40,
            rrp: 100,
          },
        },
        specials: {
          "Free Meals": {
            effect: "3 energy",
            cost: 1,
            rating_required: 1,
          },
          Butcher: {
            effect: "10% melee weapon damage",
            cost: 0,
            rating_required: 3,
          },
          Flambayed: {
            effect: "Flame thrower",
            cost: 50,
            rating_required: 5,
          },
          "Healthy Diet": {
            effect: "2.0% life regeneration",
            cost: 0,
            rating_required: 7,
          },
          "Professional Metabolism": {
            effect: "25% consumable cooldown reduction",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      28: {
        name: "Oil Rig",
        cost: 10500000000,
        default_employees: 12,
        positions: {
          Driller: {
            man_required: 150000,
            int_required: 75000,
            end_required: 0,
            man_gain: 70,
            int_gain: 35,
            end_gain: 0,
            special_ability: "None",
            description:
              "This position is required to supervise the crews working on the rig, ensuring they follow the company's policies and safety legislation. Drills will not function without a driller onsite.",
          },
          Roughneck: {
            man_required: 75000,
            int_required: 0,
            end_required: 37500,
            man_gain: 65,
            int_gain: 0,
            end_gain: 33,
            special_ability: "Cleaner",
            description:
              "This position will allow the specialists to do their jobs better, enduring the hardest of conditions and long schedules. Moving and assembling equipment, cleaning and dealing with rust are just a few of the tasks required of them.",
          },
          "Derrick Hand": {
            man_required: 94000,
            int_required: 0,
            end_required: 47000,
            man_gain: 67,
            int_gain: 0,
            end_gain: 34,
            special_ability: "None",
            description:
              "This position works high above on the drilling platform, helping to steady pipes being inserted into the well. They work in conjunction with the drillers to ensure the process goes smoothly from start to finish.",
          },
          Secretary: {
            man_required: 0,
            int_required: 56250,
            end_required: 112500,
            man_gain: 0,
            int_gain: 34,
            end_gain: 68,
            special_ability: "Secretary",
            description:
              "This position will answer phone calls at the company office and work with the sales executives on finalizing potentially billion-dollar deals. They'll also provide insight in to what the sales staff at the office are contributing.",
          },
          Inspector: {
            man_required: 0,
            int_required: 225000,
            end_required: 112500,
            man_gain: 0,
            int_gain: 74,
            end_gain: 37,
            special_ability: "Trainer",
            description:
              "This position will train employees and ensure health and safety standards are met.",
          },
          "Sales Executive": {
            man_required: 0,
            int_required: 131500,
            end_required: 65750,
            man_gain: 0,
            int_gain: 69,
            end_gain: 35,
            special_ability: "None",
            description:
              "This position works back at the office, handling the sale of crude oil to refineries. They're needed to clear the company's oil barrel stock in return for millions of dollars.",
          },
          "Motor Hand": {
            man_required: 112500,
            int_required: 56250,
            end_required: 0,
            man_gain: 68,
            int_gain: 34,
            end_gain: 0,
            special_ability: "None",
            description:
              "This position maintains and repairs the engines of drilling machines and other equipment on the rig.",
          },
        },
        stock: {
          "Oil (Barrel)": {
            cost: "",
            rrp: 100,
          },
        },
        specials: {
          "Danger Money": {
            effect: "Money",
            cost: 1,
            rating_required: 1,
          },
          Embargo: {
            effect: "Halve a target's happiness",
            cost: 50,
            rating_required: 3,
          },
          "Oil Mogul": {
            effect: "Reduce bank investment time by 1 hour",
            cost: 3,
            rating_required: 5,
          },
          "Tax Haven": {
            effect: "10% offshore bank interest",
            cost: 0,
            rating_required: 7,
          },
          "Fat Cat": {
            effect: "50% investment banking limit",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      29: {
        name: "Fitness Center",
        cost: 17000000,
        default_employees: 8,
        positions: {
          "Personal Trainer": {
            man_required: 31000,
            int_required: 0,
            end_required: 15500,
            man_gain: 58,
            int_gain: 0,
            end_gain: 29,
            special_ability: "None",
            description:
              "This position will work closely with clients inside the gym. This one-to-one contact increases the number of repeat customers.",
          },
          "Swimming Instructor": {
            man_required: 23250,
            int_required: 0,
            end_required: 46500,
            man_gain: 31,
            int_gain: 0,
            end_gain: 61,
            special_ability: "None",
            description:
              "This position will teach swimming lessons, from basic children's classes to advanced adult classes.",
          },
          Lifeguard: {
            man_required: 19500,
            int_required: 0,
            end_required: 39000,
            man_gain: 30,
            int_gain: 0,
            end_gain: 60,
            special_ability: "None",
            description:
              "This position will ensure the safety of clients in and around the pool. Lifeguards must always be on duty while the pool is open.",
          },
          Cleaner: {
            man_required: 15500,
            int_required: 0,
            end_required: 7750,
            man_gain: 52,
            int_gain: 0,
            end_gain: 26,
            special_ability: "Cleaner",
            description:
              "This position increases the cleanliness of the fitness center.",
          },
          Manager: {
            man_required: 0,
            int_required: 31000,
            end_required: 62000,
            man_gain: 0,
            int_gain: 32,
            end_gain: 63,
            special_ability: "Manager",
            description:
              "This position monitors the performance of the entire fitness center and employees. They'll crack down hard on staff who are under-performing.",
          },
          Receptionist: {
            man_required: 0,
            int_required: 5000,
            end_required: 10000,
            man_gain: 0,
            int_gain: 25,
            end_gain: 49,
            special_ability: "None",
            description:
              "This position will work at the front desk, answering all phone calls and handling queries about membership.",
          },
          Marketer: {
            man_required: 0,
            int_required: 62000,
            end_required: 31000,
            man_gain: 0,
            int_gain: 63,
            end_gain: 32,
            special_ability: "Marketer",
            description:
              "This position will help to boost advertising campaigns involving the fitness center. ",
          },
          "HR Officer": {
            man_required: 0,
            int_required: 23250,
            end_required: 46500,
            man_gain: 0,
            int_gain: 31,
            end_gain: 61,
            special_ability: "Secretary",
            description:
              "This position will provide the director with information about each employee and their worth to the company.",
          },
          Nutritionist: {
            man_required: 27250,
            int_required: 54500,
            end_required: 0,
            man_gain: 31,
            int_gain: 62,
            end_gain: 0,
            special_ability: "None",
            description:
              "This position will advise customers on all products relating to lifestyle, injuries or general health.",
          },
          "Fitness Instructor": {
            man_required: 46500,
            int_required: 0,
            end_required: 23250,
            man_gain: 61,
            int_gain: 0,
            end_gain: 31,
            special_ability: "None",
            description:
              "This position will host a variety of group exercise classes for clients.",
          },
        },
        stock: {
          "Membership Fee": {
            cost: "",
            rrp: 500,
          },
        },
        specials: {
          "Healthy Mind": {
            effect: "30 minute education time reduction",
            cost: 1,
            rating_required: 1,
          },
          "Goal Oriented": {
            effect: "50% happy loss reduction in gym",
            cost: 0,
            rating_required: 3,
          },
          "Roid Rage": {
            effect: "Strength",
            cost: 1,
            rating_required: 5,
          },
          Athlete: {
            effect: "3% life regeneration per tick",
            cost: 0,
            rating_required: 7,
          },
          "Training Regime": {
            effect: "3% gym gains",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      30: {
        name: "Mechanic Shop",
        cost: 3000000,
        default_employees: 4,
        positions: {
          Technician: {
            man_required: 8500,
            int_required: 0,
            end_required: 4250,
            man_gain: 47,
            int_gain: 0,
            end_gain: 24,
            special_ability: "None",
            description:
              "This position fixes and services vehicles that come into the shop.",
          },
          "Apprentice Technician": {
            man_required: 2000,
            int_required: 0,
            end_required: 1000,
            man_gain: 36,
            int_gain: 0,
            end_gain: 18,
            special_ability: "None",
            description:
              "Working alongside the technicians, this position is learning the trade and requires less working stats.",
          },
          Cleaner: {
            man_required: 4500,
            int_required: 0,
            end_required: 2250,
            man_gain: 42,
            int_gain: 0,
            end_gain: 21,
            special_ability: "Cleaner",
            description:
              "This position increases the cleanliness of the workplace.",
          },
          Manager: {
            man_required: 0,
            int_required: 8500,
            end_required: 17000,
            man_gain: 0,
            int_gain: 27,
            end_gain: 53,
            special_ability: "Manager",
            description:
              "This position runs the garage, decreasing any reduction of employee effectiveness.",
          },
          Receptionist: {
            man_required: 0,
            int_required: 6500,
            end_required: 13000,
            man_gain: 0,
            int_gain: 26,
            end_gain: 51,
            special_ability: "Secretary",
            description:
              "This position handles the bookings but can also supply detailed statistics on individual employees.",
          },
          Trainer: {
            man_required: 0,
            int_required: 25500,
            end_required: 12750,
            man_gain: 0,
            int_gain: 56,
            end_gain: 28,
            special_ability: "Trainer",
            description:
              "This position increases the amount of trains a director receives each day.",
          },
        },
        stock: {
          Inspection: {
            cost: "",
            rrp: 200,
          },
          Service: {
            cost: "",
            rrp: 250,
          },
          "Oil Change": {
            cost: "",
            rrp: 70,
          },
          "Minor Repair": {
            cost: "",
            rrp: 300,
          },
          "Moderate Repair": {
            cost: "",
            rrp: 710,
          },
          "Major Repair": {
            cost: "",
            rrp: 1750,
          },
          Tyre: {
            cost: 30,
            rrp: 50,
          },
        },
        specials: {
          Machinist: {
            effect: "Racing point",
            cost: 5,
            rating_required: 1,
          },
          "Discount Parts": {
            effect: "75% car parts cost reduction",
            cost: 0,
            rating_required: 3,
          },
          "Junkyard Dog": {
            effect: "Random car",
            cost: 10,
            rating_required: 5,
          },
          Refurbish: {
            effect: "Lose no car parts after crashing",
            cost: 0,
            rating_required: 7,
          },
          Driver: {
            effect: "50% racing skill gain",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      31: {
        name: "Amusement Park",
        cost: 100000000,
        default_employees: 8,
        positions: {
          "Ticket Agent": {
            man_required: 0,
            int_required: 11250,
            end_required: 22500,
            man_gain: 0,
            int_gain: 28,
            end_gain: 55,
            special_ability: "None",
            description:
              "This position will sell park passes to customers, without them income cannot be made.",
          },
          Mechanic: {
            man_required: 67500,
            int_required: 33750,
            end_required: 0,
            man_gain: 64,
            int_gain: 32,
            end_gain: 0,
            special_ability: "None",
            description:
              "This position is responsible for all technical maintenance of the park's rides, keeping them safe.",
          },
          Entertainer: {
            man_required: 34000,
            int_required: 0,
            end_required: 17000,
            man_gain: 58,
            int_gain: 0,
            end_gain: 29,
            special_ability: "None",
            description:
              "This position usually dresses up in costume, entertaining the younger customers.",
          },
          "Ride Attendant": {
            man_required: 0,
            int_required: 22500,
            end_required: 45000,
            man_gain: 0,
            int_gain: 31,
            end_gain: 61,
            special_ability: "None",
            description:
              "This position will manage the individual rides featured in the park. Without them, your main attractions will be closed.",
          },
          Janitor: {
            man_required: 22500,
            int_required: 0,
            end_required: 11250,
            man_gain: 55,
            int_gain: 0,
            end_gain: 28,
            special_ability: "Cleaner",
            description:
              "This position will clean the park, as well as taking on general grounds-keeping tasks.",
          },
          Manager: {
            man_required: 0,
            int_required: 45000,
            end_required: 90000,
            man_gain: 0,
            int_gain: 33,
            end_gain: 66,
            special_ability: "Manager",
            description:
              "This position will manage employees to make sure they're all working their hardest. Any lack of efficiency demands action.",
          },
          Accountant: {
            man_required: 0,
            int_required: 33750,
            end_required: 67500,
            man_gain: 0,
            int_gain: 32,
            end_gain: 64,
            special_ability: "Secretary",
            description:
              "This position enables detailed employee statistics, showing the estimated profit made by each individual person working in the park.",
          },
          Marketer: {
            man_required: 0,
            int_required: 90000,
            end_required: 45000,
            man_gain: 0,
            int_gain: 66,
            end_gain: 33,
            special_ability: "Marketer",
            description:
              "This position boosts any company advertising campaigns that the director finances.",
          },
          "Security Guard": {
            man_required: 79000,
            int_required: 0,
            end_required: 39500,
            man_gain: 65,
            int_gain: 0,
            end_gain: 33,
            special_ability: "None",
            description:
              "This position ensures safety in the park, they'll not hesitate to kick out customers who do not respect the rules.",
          },
          Inspector: {
            man_required: 0,
            int_required: 135000,
            end_required: 67500,
            man_gain: 0,
            int_gain: 70,
            end_gain: 35,
            special_ability: "Trainer",
            description:
              "This position will watch over the employees to ensure health and safety. They will also train staff to improve their skills.",
          },
        },
        stock: {
          "Day Pass": {
            cost: "",
            rrp: 100,
          },
        },
        specials: {
          Dauntless: {
            effect: "2 nerve",
            cost: 1,
            rating_required: 1,
          },
          "Free Ride": {
            effect: "250 happiness for target",
            cost: 10,
            rating_required: 3,
          },
          Unflinching: {
            effect: "10 maximum nerve",
            cost: 0,
            rating_required: 5,
          },
          "Adrenaline Rush": {
            effect: "25% Epinephrine effectiveness & duration",
            cost: 0,
            rating_required: 7,
          },
          "Thrill Seeker": {
            effect: "10% crime exp & skill gain",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      32: {
        name: "Lingerie Store",
        cost: 1750000,
        default_employees: 4,
        positions: {
          Salesperson: {
            man_required: 0,
            int_required: 2250,
            end_required: 4500,
            man_gain: 0,
            int_gain: 21,
            end_gain: 42,
            special_ability: "None",
            description:
              "This person is the front of house sales person and is always made available for advice.",
          },
          Cleaner: {
            man_required: 2500,
            int_required: 0,
            end_required: 1250,
            man_gain: 38,
            int_gain: 0,
            end_gain: 19,
            special_ability: "Cleaner",
            description:
              "This person cleans and tidies after a hard day's work in the shop. ",
          },
          "Store Manager": {
            man_required: 0,
            int_required: 4500,
            end_required: 9000,
            man_gain: 0,
            int_gain: 24,
            end_gain: 48,
            special_ability: "Manager",
            description:
              "This person leads the other employees, but can also help out on the register and offer advice to customers. They keep the staff working effectively.  ",
          },
          "Lingerie Model": {
            man_required: 0,
            int_required: 9000,
            end_required: 4500,
            man_gain: 0,
            int_gain: 48,
            end_gain: 24,
            special_ability: "Marketer",
            description:
              "This position is the face and body of any marketing campaigns the company partakes in.",
          },
          "HR Officer": {
            man_required: 0,
            int_required: 13500,
            end_required: 6750,
            man_gain: 0,
            int_gain: 51,
            end_gain: 26,
            special_ability: "Trainer",
            description:
              "This person trains employees to make the most out of their position.",
          },
          Trainee: {
            man_required: 0,
            int_required: 500,
            end_required: 1000,
            man_gain: 0,
            int_gain: 15,
            end_gain: 30,
            special_ability: "None",
            description:
              "This position will also work in sales and provide advice to customers. They'll be less successful but require far less working stats.",
          },
        },
        stock: {
          Bra: {
            cost: 21,
            rrp: 64,
          },
          Corset: {
            cost: 40,
            rrp: 125,
          },
          Thong: {
            cost: 10,
            rrp: 48,
          },
          Stockings: {
            cost: 8,
            rrp: 32,
          },
          Suspenders: {
            cost: 30,
            rrp: 72,
          },
          Knickers: {
            cost: 4,
            rrp: 20,
          },
        },
        specials: {
          "Nine to Five": {
            effect: "100 endurance",
            cost: 10,
            rating_required: 1,
          },
          Concealment: {
            effect: "2 travel item capacity",
            cost: 0,
            rating_required: 3,
          },
          "Born Free": {
            effect: "50% passive speed & dexterity when not wearing armor",
            cost: 0,
            rating_required: 5,
          },
          Simp: {
            effect: "No property upkeep or staff costs",
            cost: 0,
            rating_required: 7,
          },
          "Sex Appeal": {
            effect: "Free business class upgrades",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      33: {
        name: "Meat Warehouse",
        cost: 4000000,
        default_employees: 5,
        positions: {
          "Quality Controller": {
            man_required: 12500,
            int_required: 25000,
            end_required: 0,
            man_gain: 28,
            int_gain: 56,
            end_gain: 0,
            special_ability: "None",
            description:
              "All cuts of meat must past stringent tests before being sent out. The final, and important step in the process of meat warehouse operation.",
          },
          Packer: {
            man_required: 9500,
            int_required: 0,
            end_required: 4750,
            man_gain: 48,
            int_gain: 0,
            end_gain: 24,
            special_ability: "None",
            description:
              "This position packs and labels all meat, preparing it for shipping to the retailers once sales have been confirmed.",
          },
          "Apprentice Butcher": {
            man_required: 3000,
            int_required: 0,
            end_required: 1500,
            man_gain: 39,
            int_gain: 0,
            end_gain: 20,
            special_ability: "None",
            description:
              "This position is learning the trade, to one day be able to do the job on their own. They require less working stats than a fully qualified butcher.",
          },
          Cleaner: {
            man_required: 6500,
            int_required: 0,
            end_required: 3250,
            man_gain: 45,
            int_gain: 0,
            end_gain: 23,
            special_ability: "Cleaner",
            description:
              "Cleaning for a meat company is not a nice job. Everything must be sanitized regularly. ",
          },
          Manager: {
            man_required: 0,
            int_required: 12500,
            end_required: 25000,
            man_gain: 0,
            int_gain: 28,
            end_gain: 56,
            special_ability: "Manager",
            description:
              "This person is in charge of the whole warehouse, making sure things run smoothly. ",
          },
          Assistant: {
            man_required: 0,
            int_required: 9500,
            end_required: 19000,
            man_gain: 0,
            int_gain: 27,
            end_gain: 54,
            special_ability: "Secretary",
            description:
              "This position works directly for the manager and director, making sure their wishes are catered for. They provide details of individual employee productivity.",
          },
          Supervisor: {
            man_required: 0,
            int_required: 37500,
            end_required: 18750,
            man_gain: 0,
            int_gain: 59,
            end_gain: 30,
            special_ability: "Trainer",
            description:
              "This position supervises and trains all staff on the warehouse floor.",
          },
          Butcher: {
            man_required: 12500,
            int_required: 0,
            end_required: 6250,
            man_gain: 50,
            int_gain: 0,
            end_gain: 25,
            special_ability: "None",
            description:
              "This position handles and cuts the meat, the first process in the chain. They will fill your stock with meat, ready to be packed, checked and shipped.",
          },
          Retailer: {
            man_required: 0,
            int_required: 12500,
            end_required: 6250,
            man_gain: 0,
            int_gain: 50,
            end_gain: 25,
            special_ability: "None",
            description:
              "This position orchestrates the sale of meat to supermarkets and other shops.",
          },
        },
        stock: {
          Meat: {
            cost: "",
            rrp: 15,
          },
        },
        specials: {
          "Blood Thirst": {
            effect: "2 nerve",
            cost: 1,
            rating_required: 1,
          },
          "Blood Splatter": {
            effect: "50% crime penalty reduction",
            cost: 0,
            rating_required: 3,
          },
          Carnage: {
            effect: "10 maximum nerve",
            cost: 0,
            rating_required: 5,
          },
          Huntsman: {
            effect: "25% hunting skill gain",
            cost: 0,
            rating_required: 7,
          },
          Vampiric: {
            effect: "3.0% life regeneration",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      34: {
        name: "Farm",
        cost: 5250000,
        default_employees: 5,
        positions: {
          Harvester: {
            man_required: 14000,
            int_required: 0,
            end_required: 7000,
            man_gain: 51,
            int_gain: 0,
            end_gain: 26,
            special_ability: "None",
            description:
              "This position handles the harvesting of crops. Assigning people to this job will allow your stock of crops to grow.",
          },
          "Delivery Driver": {
            man_required: 23000,
            int_required: 0,
            end_required: 11500,
            man_gain: 55,
            int_gain: 0,
            end_gain: 28,
            special_ability: "None",
            description:
              "This position will deliver crops, livestock and other goods to the buyers location.",
          },
          Herdsperson: {
            man_required: 18500,
            int_required: 0,
            end_required: 9250,
            man_gain: 54,
            int_gain: 0,
            end_gain: 27,
            special_ability: "None",
            description:
              "This position tends to the farm's sheep. Assigning people to this job will allow your stock to slowly grow with sheep.",
          },
          "Farm Manager": {
            man_required: 0,
            int_required: 18500,
            end_required: 37000,
            man_gain: 0,
            int_gain: 30,
            end_gain: 59,
            special_ability: "Manager",
            description: "This position is responsible for the whole farm.",
          },
          Bookkeeper: {
            man_required: 0,
            int_required: 14000,
            end_required: 28000,
            man_gain: 0,
            int_gain: 29,
            end_gain: 57,
            special_ability: "Secretary",
            description:
              "This position will attempt to calculate what each farmer and employee is worth to the farm.",
          },
          Consultant: {
            man_required: 0,
            int_required: 55500,
            end_required: 27750,
            man_gain: 0,
            int_gain: 62,
            end_gain: 31,
            special_ability: "Trainer",
            description:
              "This position assists the farmers and staff by keeping them well trained.",
          },
          Retailer: {
            man_required: 0,
            int_required: 18500,
            end_required: 9250,
            man_gain: 0,
            int_gain: 54,
            end_gain: 27,
            special_ability: "None",
            description:
              "This position organises the sale of stock to other businesses and shops. This is the primary role for turning your stock into cash.",
          },
          "Dairy Farmer": {
            man_required: 23000,
            int_required: 0,
            end_required: 11500,
            man_gain: 55,
            int_gain: 0,
            end_gain: 28,
            special_ability: "None",
            description:
              "This position tends to the livelihood and milking of cows. Assigning people to this job will allow your stock to slowly grow with cows and milk.",
          },
          "Poultry Farmer": {
            man_required: 18500,
            int_required: 0,
            end_required: 9250,
            man_gain: 54,
            int_gain: 0,
            end_gain: 27,
            special_ability: "None",
            description:
              "This position tends to the livelihood and egg collection of chickens. Assigning people to this job will allow your stock to slowly grow with chickens and eggs.",
          },
        },
        stock: {
          "Bushel of Crops": {
            cost: "",
            rrp: 8,
          },
          Sheep: {
            cost: "",
            rrp: 200,
          },
          Cow: {
            cost: "",
            rrp: 900,
          },
          "Gallon of Milk": {
            cost: "",
            rrp: 3,
          },
          Chicken: {
            cost: "",
            rrp: 50,
          },
          "Box of Eggs": {
            cost: "",
            rrp: 5,
          },
        },
        specials: {
          Fulfillment: {
            effect: "50 happiness",
            cost: 1,
            rating_required: 1,
          },
          "Animal Instinct": {
            effect: "25% hunting income",
            cost: 0,
            rating_required: 3,
          },
          "Special K": {
            effect: "Ketamine drug",
            cost: 5,
            rating_required: 5,
          },
          Fertilizer: {
            effect: "Small explosive device",
            cost: 100,
            rating_required: 7,
          },
          "Early Riser": {
            effect: "7 energy",
            cost: 1,
            rating_required: 10,
          },
        },
      },
      35: {
        name: "Software Corporation",
        cost: 6000000,
        default_employees: 5,
        positions: {
          Developer: {
            man_required: 0,
            int_required: 24000,
            end_required: 12000,
            man_gain: 0,
            int_gain: 56,
            end_gain: 28,
            special_ability: "None",
            description:
              "This position is responsible for developing and maintaining software that clients request. They'll be writing the code.",
          },
          Tester: {
            man_required: 0,
            int_required: 12000,
            end_required: 6000,
            man_gain: 0,
            int_gain: 50,
            end_gain: 25,
            special_ability: "None",
            description:
              "This position will test software and report back to the developers with any issues they find.",
          },
          "Graphic Designer": {
            man_required: 0,
            int_required: 18000,
            end_required: 9000,
            man_gain: 0,
            int_gain: 53,
            end_gain: 27,
            special_ability: "None",
            description:
              "This position will assist the developers by creating the  software artwork and visual experience.",
          },
          Apprentice: {
            man_required: 0,
            int_required: 6000,
            end_required: 3000,
            man_gain: 0,
            int_gain: 45,
            end_gain: 23,
            special_ability: "None",
            description:
              "This position, like the developer, will write code for the company. They are less skilled, but require less working stats.",
          },
          Cleaner: {
            man_required: 12000,
            int_required: 0,
            end_required: 6000,
            man_gain: 50,
            int_gain: 0,
            end_gain: 25,
            special_ability: "Cleaner",
            description:
              "This position will clean the workspace for the developers and other staff.",
          },
          "Lead Developer": {
            man_required: 0,
            int_required: 24000,
            end_required: 48000,
            man_gain: 0,
            int_gain: 31,
            end_gain: 61,
            special_ability: "Manager",
            description:
              "This position will write code, but also oversee the other developers and staff. Keeping them at their best.",
          },
          Analyst: {
            man_required: 0,
            int_required: 18000,
            end_required: 36000,
            man_gain: 0,
            int_gain: 30,
            end_gain: 59,
            special_ability: "Secretary",
            description:
              "This position can provide statistics of each employees worth to the company.",
          },
          Marketer: {
            man_required: 0,
            int_required: 48000,
            end_required: 24000,
            man_gain: 0,
            int_gain: 61,
            end_gain: 31,
            special_ability: "Marketer",
            description:
              "This position is responsible for the for the strategic direction in which the company takes with advertising campaigns.",
          },
          Consultant: {
            man_required: 0,
            int_required: 72000,
            end_required: 36000,
            man_gain: 0,
            int_gain: 64,
            end_gain: 32,
            special_ability: "Trainer",
            description:
              "This position is an expert professional, and will help the director train staff.",
          },
        },
        stock: {
          Website: {
            cost: "",
            rrp: 9500,
          },
          Application: {
            cost: "",
            rrp: 40000,
          },
          Game: {
            cost: "",
            rrp: 67500,
          },
        },
        specials: {
          Ub3rg33k: {
            effect: "50% coding time reduction",
            cost: 0,
            rating_required: 1,
          },
          "Proxy Hacking": {
            effect: "Cancel a target's virus programming",
            cost: 25,
            rating_required: 3,
          },
          "Intricate Hack": {
            effect: "Hack a company's bank account",
            cost: 250,
            rating_required: 5,
          },
          "Hack the Planet": {
            effect: "15% cybercrime success & skill gain",
            cost: 0,
            rating_required: 7,
          },
          "Corporate Espionage": {
            effect: "View financial details of a company",
            cost: 50,
            rating_required: 10,
          },
        },
      },
      36: {
        name: "Ladies Strip Club",
        cost: 5000000,
        default_employees: 4,
        positions: {
          "Male Stripper": {
            man_required: 7250,
            int_required: 0,
            end_required: 14500,
            man_gain: 26,
            int_gain: 0,
            end_gain: 52,
            special_ability: "None",
            description:
              "This position is solely responsible for entertaining the women by providing dance services. An attractive male will fill this role nicely.",
          },
          "Security Guard": {
            man_required: 29000,
            int_required: 0,
            end_required: 14500,
            man_gain: 57,
            int_gain: 0,
            end_gain: 29,
            special_ability: "None",
            description:
              "This position will protect the male dancers and clients from any negative attitude. Customers are more willing to come to a safe club.",
          },
          Cleaner: {
            man_required: 8500,
            int_required: 0,
            end_required: 4250,
            man_gain: 47,
            int_gain: 0,
            end_gain: 24,
            special_ability: "Cleaner",
            description: "This position cleans the strip club.",
          },
          Manager: {
            man_required: 0,
            int_required: 16500,
            end_required: 33000,
            man_gain: 0,
            int_gain: 29,
            end_gain: 58,
            special_ability: "Manager",
            description:
              "This position makes business decisions on behalf of the director, they also decrease any reduction of employee effectiveness.",
          },
          Bookkeeper: {
            man_required: 0,
            int_required: 12500,
            end_required: 25000,
            man_gain: 0,
            int_gain: 28,
            end_gain: 56,
            special_ability: "Secretary",
            description:
              "This position enables detailed employee statistics, showing the estimated profit made by each individual employee.",
          },
          Photographer: {
            man_required: 0,
            int_required: 33000,
            end_required: 16500,
            man_gain: 0,
            int_gain: 58,
            end_gain: 29,
            special_ability: "Marketer",
            description:
              "This position boosts any company advertising campaigns by photographing the boys in action and publishing them.",
          },
        },
        stock: {
          Admission: {
            cost: "",
            rrp: 10,
          },
          "Lap Dance": {
            cost: "",
            rrp: 30,
          },
          Tips: {
            cost: "",
            rrp: 1,
          },
          Special: {
            cost: "",
            rrp: 150,
          },
        },
        specials: {
          "Hot Flush": {
            effect: "50 happiness",
            cost: 1,
            rating_required: 1,
          },
          Hench: {
            effect: "25% passive defense",
            cost: 0,
            rating_required: 3,
          },
          Hormonal: {
            effect: "50% Serotonin effectiveness & duration",
            cost: 0,
            rating_required: 5,
          },
          Boxercise: {
            effect: "10% defense gym gains",
            cost: 0,
            rating_required: 7,
          },
          Hardbody: {
            effect: "30% incoming melee attacks damage reduction",
            cost: 0,
            rating_required: 10,
          },
        },
      },
      37: {
        name: "Private Security Firm",
        cost: 950000000,
        default_employees: 6,
        positions: {
          "Security Contractor": {
            man_required: 70000,
            int_required: 0,
            end_required: 35000,
            man_gain: 64,
            int_gain: 0,
            end_gain: 32,
            special_ability: "None",
            description:
              "This position involves providing an armed presence wherever the company is paid to do so. Without mercenary grunts like this, a Private Security Firm cannot do its job.",
          },
          "Team Leader": {
            man_required: 110000,
            int_required: 0,
            end_required: 55000,
            man_gain: 68,
            int_gain: 0,
            end_gain: 34,
            special_ability: "Manager",
            description:
              "This position directs the security personnel in a more efficient manner than if they were left to their own devices, ensuring that the firm's contracts are fulfilled on time and to the letter.",
          },
          "Defense Consultant": {
            man_required: 0,
            int_required: 135000,
            end_required: 67500,
            man_gain: 0,
            int_gain: 70,
            end_gain: 35,
            special_ability: "Trainer",
            description:
              "This position provides advice, techniques and training courses to both employees and external clients. This person will increase your firm's productivity while also bringing in extra income.",
          },
          Spokesperson: {
            man_required: 0,
            int_required: 80000,
            end_required: 40000,
            man_gain: 0,
            int_gain: 65,
            end_gain: 33,
            special_ability: "Marketer",
            description:
              "This position is used to improve the reputation of your company, which is negative by default due to public opinion. An adept spokesperson will help you secure higher level contracts.",
          },
          "Company Liaison": {
            man_required: 0,
            int_required: 57500,
            end_required: 115000,
            man_gain: 0,
            int_gain: 34,
            end_gain: 68,
            special_ability: "Secretary",
            description:
              "This position assists the Director in the acquisition of new contracts. With a secretary on board, higher paying jobs can be negotiated with the military and national security forces.",
          },
          "Chief Strategist": {
            man_required: 0,
            int_required: 165000,
            end_required: 82500,
            man_gain: 0,
            int_gain: 71,
            end_gain: 36,
            special_ability: "None",
            description:
              "This position helps to form a company-wide strategy which details the kind of services you should be looking to provide. They will also assist in the identification of new clients, as well as the disposal of old ones.",
          },
          Reconnaissance: {
            man_required: 80000,
            int_required: 40000,
            end_required: 0,
            man_gain: 65,
            int_gain: 33,
            end_gain: 0,
            special_ability: "None",
            description:
              "This position works to acquire information about a location or hostile force ahead of potential engagement. Security contractors are more effective when their actions are backed by reconnaissance intel.",
          },
          "Disposal Engineer": {
            man_required: 0,
            int_required: 85000,
            end_required: 42500,
            man_gain: 0,
            int_gain: 66,
            end_gain: 33,
            special_ability: "None",
            description:
              "This position is necessary to acquiring engagement and military contracts. Explosive IEDs are commonplace in the field, and without someone to deal with them your contractors will be left exposed.",
          },
          Armorer: {
            man_required: 40000,
            int_required: 0,
            end_required: 80000,
            man_gain: 33,
            int_gain: 0,
            end_gain: 65,
            special_ability: "None",
            description:
              "This position will supply your security personnel with the equipment they need to do the job. Your operations will be far less efficient without someone taking care of the armoury.",
          },
          Medic: {
            man_required: 0,
            int_required: 90000,
            end_required: 45000,
            man_gain: 0,
            int_gain: 66,
            end_gain: 33,
            special_ability: "Cleaner",
            description:
              "This position ensures your security personnel return home healthy and fit for work. The fewer contractors you have available due to injury, the fewer contracts you're able to take.",
          },
          "Comms Engineer": {
            man_required: 0,
            int_required: 85000,
            end_required: 42500,
            man_gain: 0,
            int_gain: 66,
            end_gain: 33,
            special_ability: "None",
            description:
              "This position facilitates real-time communications between your team on the ground and back at base. They also provide aerial shots and eavesdrop on enemy comms to further assist with protection efforts.",
          },
        },
        stock: {
          "Training Contract": {
            cost: "",
            rrp: 500000,
          },
          "Protection Contract": {
            cost: "",
            rrp: 3000000,
          },
          "Engagement Contract": {
            cost: "",
            rrp: 10000000,
          },
          "Military Contract": {
            cost: "",
            rrp: 25000000,
          },
        },
        specials: {
          "Off the Grid": {
            effect: "72 hour bounty protection",
            cost: 20,
            rating_required: 1,
          },
          "Tactical Breach": {
            effect: "50% Flash Grenade intensity",
            cost: 0,
            rating_required: 3,
          },
          "Open Arsenal": {
            effect: "Primary or Secondary weapon",
            cost: 75,
            rating_required: 5,
          },
          Regulation: {
            effect: "25% full set armor mitigation bonus",
            cost: 0,
            rating_required: 7,
          },
          Mercenary: {
            effect: "3 mission credits",
            cost: 1,
            rating_required: 10,
          },
        },
      },
      38: {
        name: "Mining Corporation",
        cost: 4500000000,
        default_employees: 8,
        positions: {
          "Sales Executive": {
            man_required: 0,
            int_required: 83000,
            end_required: 41500,
            man_gain: 0,
            int_gain: 66,
            end_gain: 33,
            special_ability: "None",
            description:
              "This position is responsible for securing deals to supply the salt extracted from the mine.",
          },
          "Mill Operator": {
            man_required: 75000,
            int_required: 0,
            end_required: 37500,
            man_gain: 65,
            int_gain: 0,
            end_gain: 33,
            special_ability: "None",
            description:
              "This position is involved in moving and operating the milling equipment used to extract materials from the mining location. Their responsibilities are split between above and below ground operations.",
          },
          "Production Foreman": {
            man_required: 39500,
            int_required: 0,
            end_required: 79000,
            man_gain: 33,
            int_gain: 0,
            end_gain: 65,
            special_ability: "None",
            description:
              "This position plans and supervises underground extraction processes, coordinates above ground processing activities and ensures the general well being of the team throughout the day.",
          },
          "Mine Engineer": {
            man_required: 0,
            int_required: 81000,
            end_required: 40500,
            man_gain: 0,
            int_gain: 65,
            end_gain: 33,
            special_ability: "None",
            description:
              "This position ensures both the stability and effectiveness of mining structures, contributing significantly to the design of technical systems and processes which take place below ground.",
          },
          Electrician: {
            man_required: 39000,
            int_required: 0,
            end_required: 78000,
            man_gain: 33,
            int_gain: 0,
            end_gain: 65,
            special_ability: "None",
            description:
              "This position is needed so that the Engineer's plans can be actioned. They will fit electrical systems throughout the mine and subsequently monitor them for signs of failure.",
          },
          "Safety Inspector": {
            man_required: 47500,
            int_required: 95000,
            end_required: 0,
            man_gain: 34,
            int_gain: 67,
            end_gain: 0,
            special_ability: "Cleaner",
            description:
              "This position is required to ensure that the mine and its workers are kept safe. Their responsibilities involved evaluating mine integrity, measuring oxygen content and testing for the presence of noxious gases.",
          },
          "Site Manager": {
            man_required: 0,
            int_required: 97500,
            end_required: 48750,
            man_gain: 0,
            int_gain: 67,
            end_gain: 34,
            special_ability: "Manager",
            description:
              "This position will troubleshoot mechanical problems while also conducting routine maintenance and repairs on mining machinery. ",
          },
          Secretary: {
            man_required: 0,
            int_required: 39000,
            end_required: 78000,
            man_gain: 0,
            int_gain: 33,
            end_gain: 65,
            special_ability: "Secretary",
            description:
              "This position assists the Sales Executive, Site Manager and to a lesser extent the Production Foreman to ensure the administrative side of the mine is kept running smoothly. ",
          },
        },
        stock: {
          "Salt (ton)": {
            cost: "",
            rrp: 7500,
          },
        },
        specials: {
          "Mining Boom": {
            effect: "Random excavation equipment",
            cost: 10,
            rating_required: 1,
          },
          "Thirsty Work": {
            effect: "30% alcohol cooldown reduction",
            cost: 0,
            rating_required: 3,
          },
          "Rock Salt": {
            effect: "Defense",
            cost: 1,
            rating_required: 5,
          },
          "Essential Salts": {
            effect: "10% maximum life",
            cost: 0,
            rating_required: 7,
          },
          "Preserved Meat": {
            effect: "Boosts current life to 150% of maximum",
            cost: 25,
            rating_required: 10,
          },
        },
      },
      39: {
        name: "Detective Agency",
        cost: 12000000,
        default_employees: 4,
        positions: {
          "Private Investigator": {
            man_required: 22500,
            int_required: 45000,
            end_required: 0,
            man_gain: 31,
            int_gain: 61,
            end_gain: 0,
            special_ability: "None",
            description:
              "This position works out in the field to track individuals, obtain evidence and deploy surveillance equipment with the goal of building a case.",
          },
          "Trainee Investigator": {
            man_required: 14000,
            int_required: 28000,
            end_required: 0,
            man_gain: 29,
            int_gain: 57,
            end_gain: 0,
            special_ability: "Cleaner",
            description:
              "This position assists the Private Investigator on low-level jobs to build their experience of the industry. They contribute by doing manual and administrative tasks on the PI's behalf.",
          },
          Secretary: {
            man_required: 12500,
            int_required: 0,
            end_required: 25000,
            man_gain: 28,
            int_gain: 0,
            end_gain: 56,
            special_ability: "Secretary",
            description:
              "This position fields inquiries from the public and hands cases over to the Private Investigators. They also conduct small amounts of admin work, boosting the effectiveness of the other positions.",
          },
          "Intelligence Analyst": {
            man_required: 0,
            int_required: 58000,
            end_required: 29000,
            man_gain: 0,
            int_gain: 63,
            end_gain: 32,
            special_ability: "None",
            description:
              "This position is based in the office and its responsibilities concern the analysis of data provided by the field team. This data is mined for information and either sent back to the PI or presented to the client.",
          },
          "Surveillance Technician": {
            man_required: 26000,
            int_required: 52000,
            end_required: 0,
            man_gain: 31,
            int_gain: 62,
            end_gain: 0,
            special_ability: "None",
            description:
              "This position assists field agents by providing them with the electronic equipment needed for surveillance. They also provide clients with surveillance countermeasures to protect firms and individuals from espionage attempts.",
          },
          "Chief Investigator": {
            man_required: 40000,
            int_required: 80000,
            end_required: 0,
            man_gain: 33,
            int_gain: 65,
            end_gain: 0,
            special_ability: "Manager",
            description:
              "This position manages the field teams, facilitates cooperation with law enforcement and oversees the general direction of the agency's activities.",
          },
          "Client Liaison": {
            man_required: 0,
            int_required: 62000,
            end_required: 31000,
            man_gain: 0,
            int_gain: 63,
            end_gain: 32,
            special_ability: "Marketer",
            description:
              "This position is responsible for presenting the agency's findings to the client. Their interpersonal skills must be highly developed to deal with emotionally stressful situations.",
          },
        },
        stock: {
          "Private Surveillance Contract": {
            cost: "",
            rrp: 8500,
          },
          "Insurance Fraud Contract": {
            cost: "",
            rrp: 12000,
          },
          "Corporate Surveillance Contract": {
            cost: "",
            rrp: 40000,
          },
        },
        specials: {
          References: {
            effect: "View someone's employment & faction history",
            cost: 2,
            rating_required: 1,
          },
          Deputized: {
            effect: "Arrest ability",
            cost: 0,
            rating_required: 3,
          },
          "Friend or Foe": {
            effect: "See who's added someone to their friend / enemy list",
            cost: 100,
            rating_required: 5,
          },
          Watchlist: {
            effect: "Anonymously extend a target's flight time",
            cost: 50,
            rating_required: 7,
          },
          "Most Wanted": {
            effect: "View a list of highest wanted rewards",
            cost: 25,
            rating_required: 10,
          },
        },
      },
      40: {
        name: "Logistics Management",
        cost: 1800000000,
        default_employees: 6,
        positions: {
          Lumper: {
            man_required: 45000,
            int_required: 0,
            end_required: 22500,
            man_gain: 61,
            int_gain: 0,
            end_gain: 31,
            special_ability: "None",
            description:
              "This position involves the unloading of items by hand from trucks, cargo ships, planes and freight trains.",
          },
          Driver: {
            man_required: 28750,
            int_required: 0,
            end_required: 57500,
            man_gain: 32,
            int_gain: 0,
            end_gain: 63,
            special_ability: "None",
            description:
              "This position consists of driving haulage vehicles over long and short distances between suppliers, manufacturers and transport hubs.",
          },
          "Forklift Operator": {
            man_required: 30000,
            int_required: 0,
            end_required: 60000,
            man_gain: 32,
            int_gain: 0,
            end_gain: 63,
            special_ability: "None",
            description:
              "This position helps load and unload heavy items from supply vehicles using a forklift truck. They are also responsible for assisting in the organisation of the warehouse.",
          },
          "Transport Coordinator": {
            man_required: 0,
            int_required: 85000,
            end_required: 42500,
            man_gain: 0,
            int_gain: 66,
            end_gain: 33,
            special_ability: "None",
            description:
              "This position manages the transport of goods to and from suppliers, manufacturers and storage facilities by air, sea or land.",
          },
          "Warehouse Manager": {
            man_required: 0,
            int_required: 115000,
            end_required: 57500,
            man_gain: 0,
            int_gain: 68,
            end_gain: 34,
            special_ability: "Cleaner",
            description:
              "This position takes responsibility for the management of warehouses so that they may receive and deliver items in a swift and safe manner.",
          },
          "Shift Manager": {
            man_required: 0,
            int_required: 90000,
            end_required: 45000,
            man_gain: 0,
            int_gain: 66,
            end_gain: 33,
            special_ability: "Secretary",
            description:
              "This position coordinates the activities of low-level employees to ensure that all projects have the manpower required to be executed efficiently.",
          },
          "Supply Chain Manager": {
            man_required: 0,
            int_required: 125000,
            end_required: 62500,
            man_gain: 0,
            int_gain: 69,
            end_gain: 35,
            special_ability: "Manager",
            description:
              "This position interacts with every level of the business to create a streamlined supply chain between customers, suppliers and intermediaries.",
          },
          "Procurement Manager": {
            man_required: 0,
            int_required: 140000,
            end_required: 70000,
            man_gain: 0,
            int_gain: 70,
            end_gain: 35,
            special_ability: "Marketer",
            description:
              "This position is tasked with researching and acquiring new methods of transport, alternative suppliers and various other elements of the business so as to decrease costs and increase efficiency.",
          },
        },
        stock: {
          "Local Logistics Contract": {
            cost: "",
            rrp: 1400000,
          },
          "National Logistics Contract": {
            cost: "",
            rrp: 8000000,
          },
          "Global Logistics Contract": {
            cost: "",
            rrp: 50000000,
          },
        },
        specials: {
          Efficiency: {
            effect: "Speed",
            cost: 1,
            rating_required: 1,
          },
          Organized: {
            effect: "2 additional open mission contracts",
            cost: 0,
            rating_required: 3,
          },
          Repatriated: {
            effect: "Return from abroad while in hospital",
            cost: 0,
            rating_required: 5,
          },
          Contraband: {
            effect: "Shipment of foreign goods",
            cost: 50,
            rating_required: 7,
          },
          "Logistics Report": {
            effect: "Company productivity boost",
            cost: 250,
            rating_required: 10,
          },
        },
      },
    },
  };

  // CSS Styles
  const styles = `
      .company-analyzer-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        font-family: Arial, sans-serif;
      }

      .company-analyzer-container {
        background-color: #333333;
        margin-top: 64px;
        width: 100%;
        max-width: 976px;
        box-sizing: border-box;
        max-height: 90dvh;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        overflow-y: auto;
      }

      .company-analyzer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 0;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
        margin-bottom: 15px;
      }

      .company-analyzer-header h2 {
        margin: 0 !important;
        color: #ddd;
        font-size: 14px;
      }

      .company-analyzer-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #777;
      }

      .company-analyzer-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        box-sizing: border-box;
      }

      .company-analyzer-filter-group {
        flex: 1;
        min-width: 200px;
        box-sizing: border-box;
      }

      .company-analyzer-filter-group h3 {
        margin: 0 !important;
        margin-bottom: 10px !important;
        font-size: 14px !important;
      }

      .company-analyzer-filter-group label {
        display: block;
        margin-bottom: 5px;
      }

      .company-analyzer-filter-group input[type="number"] {
        width: 100%;
        max-width: 100%;
        padding: 8px 24px 8px 11px;
        background-color: #111;
        border: 1px solid #444;
        color: #ddd;
        border-radius: 5px;
        margin-bottom: 10px;
        box-sizing: border-box;
      }

      .company-analyzer-filter-group select {
        width: 100%;
        padding: 5px 24px 5px 11px;
        background-color: #111;
        border: 1px solid #444;
        color: #ddd;
        border-radius: 5px;
        margin-bottom: 10px;
        height: 34px;
      }

      .company-analyzer-actions {
        margin-bottom: 20px;
        text-align: center;
      }

      .company-analyzer-button {
        height: 34px;
        font-family: "Fjalla One", Arial, serif;
        font-size: 14px;
        font-weight: normal;
        text-align: center;
        text-transform: uppercase;
        border-radius: 5px;
        padding: 0px 10px;
        cursor: pointer;
        color: #eee;
        text-shadow: 0 0 5px #000;
        background: linear-gradient(180deg, #111111 0%, #555555 25%, #333333 60%, #333333 78%, #111111 100%);
        border: 1px solid #111;
        cursor: pointer;
        margin-right: 10px;
      }

      .company-analyzer-toggle {
        height: 34px;
        font-family: "Fjalla One", Arial, serif;
        font-size: 14px;
        font-weight: normal;
        text-align: center;
        text-transform: uppercase;
        border-radius: 5px;
        padding: 0px 10px;
        cursor: pointer;
        color: #eee;
        text-shadow: 0 0 5px #000;
        background: linear-gradient(180deg, #111111 0%, #555555 25%, #333333 60%, #333333 78%, #111111 100%);
        border: 1px solid #111;
        cursor: pointer;
        position: fixed;
        top: 5px;
        right: 20px;
        z-index: 9998;
      }

      .company-analyzer-toggle:hover, .company-analyzer-button:hover {
         background: linear-gradient(180deg, #333333 0%, #777777 25%, #333333 59%, #666666 78%, #333333 100%);
      }

      .company-analyzer-table {
        width: 100%;
        border-collapse: separate;
      }

      .company-analyzer-table th,
      .company-analyzer-table td {
        padding: 6px 6px 6px 8px !important;
        text-align: left;
        white-space: nowrap;
        color: white !important;
      }

      .company-analyzer-table td {
        box-sizing: border-box !important;
        border-top: 1px solid #fff !important;
        border-top-color: #474747 !important;
        border-bottom: 1px solid #dcdcdc !important;
        border-bottom-color: #222 !important;
        box-shadow: 0 1px 0 #ffffff1a !important;
        display: table-cell !important;
        border-right: 1px solid #dcdcdc !important;
        border-right-color: #222 !important;
      }

      .company-analyzer-table th {
        background-color: rgb(44, 44, 44);
        cursor: pointer;
        user-select: none;
      }

      .company-analyzer-table tr:hover {
        background-color: rgb(49, 49, 49);
      }

      .company-analyzer-sorted-asc::after {
        content: " ↑";
      }

      .company-analyzer-sorted-desc::after {
        content: " ↓";
      }

      .company-analyzer-company-row {
        cursor: pointer;
        padding: 8px 8px;
      }

      .company-analyzer-hidden {
        display: none;
      }

      .company-analyzer-highlight {
        padding: 0px 8px;
      }
  `;

  // Add styles to the page
  GM_addStyle(styles);

  // Create toggle button
  function createToggleButton() {
    const button = document.createElement("button");
    button.textContent = "Company Analyzer";
    button.className = "company-analyzer-toggle";
    button.addEventListener("click", openCompanyAnalyzer);
    document.body.appendChild(button);
  }

  // Create and show the company analyzer modal
  function openCompanyAnalyzer() {
    // Create modal container
    const modal = document.createElement("div");
    modal.className = "company-analyzer-modal";

    // Create modal content
    modal.innerHTML = `
          <div class="company-analyzer-container">
              <div class="company-analyzer-header">
                  <h2>Company and Position Analyzer</h2>
                  <button class="company-analyzer-close">&times;</button>
              </div>

              <div class="company-analyzer-filters">
                  <div class="company-analyzer-filter-group">
                      <h3>Character Stats</h3>
                      <label for="company-analyzer-man-stat">Manipulation:</label>
                      <input type="number" id="company-analyzer-man-stat" min="0" value="0">

                      <label for="company-analyzer-int-stat">Intelligence:</label>
                      <input type="number" id="company-analyzer-int-stat" min="0" value="0">

                      <label for="company-analyzer-end-stat">Endurance:</label>
                      <input type="number" id="company-analyzer-end-stat" min="0" value="0">
                  </div>

                  <div class="company-analyzer-filter-group">
                      <h3>Sort By</h3>
                      <label for="company-analyzer-sort-attribute">Primary Attribute:</label>
                      <select id="company-analyzer-sort-attribute">
                          <option value="man_gain">Manual Labor Gain</option>
                          <option value="int_gain">Intelligence Gain</option>
                          <option value="end_gain">Endurance Gain</option>
                          <option value="total_gain">Total Stat Gain</option>
                      </select>

                      <label for="company-analyzer-view-mode">View Mode:</label>
                      <select id="company-analyzer-view-mode">
                          <option value="companies">Companies</option>
                          <option value="positions">Positions</option>
                      </select>
                  </div>

                  <div class="company-analyzer-filter-group">
                      <h3>Filtering Options</h3>
                      <label>
                          <input type="checkbox" id="company-analyzer-hide-unqualified" checked>
                          Hide positions I don't qualify for
                      </label>
                      <br>
                     <!-- <label for="company-analyzer-special-ability">Filter by Special Ability:</label>
                      <select id="company-analyzer-special-ability">
                          <option value="all">All Abilities</option>
                          <option value="None">None</option>
                          <option value="Manager">Manager</option>
                          <option value="Secretary">Secretary</option>
                          <option value="Trainer">Trainer</option>
                          <option value="Cleaner">Cleaner</option>
                      </select>
                      -->
                  </div>
              </div>

              <div class="company-analyzer-actions">
                  <button id="company-analyzer-apply-filters" class="company-analyzer-button">Apply Filters</button>
                  <button id="company-analyzer-reset-filters" class="company-analyzer-button">Reset Filters</button>
              </div>

              <div id="company-analyzer-results">
                  <table id="company-analyzer-results-table" class="company-analyzer-table">
                      <thead id="company-analyzer-table-header">
                          <!-- Headers will be dynamically generated -->
                      </thead>
                      <tbody id="company-analyzer-table-body">
                          <!-- Results will be dynamically generated -->
                      </tbody>
                  </table>
              </div>
          </div>
      `;

    // Add modal to the page
    document.body.appendChild(modal);

    // Set up event listeners
    modal
      .querySelector(".company-analyzer-close")
      .addEventListener("click", () => {
        document.body.removeChild(modal);
      });

    // Get DOM elements
    const manStatInput = document.getElementById("company-analyzer-man-stat");
    const intStatInput = document.getElementById("company-analyzer-int-stat");
    const endStatInput = document.getElementById("company-analyzer-end-stat");
    const sortAttributeSelect = document.getElementById(
      "company-analyzer-sort-attribute"
    );
    const viewModeSelect = document.getElementById(
      "company-analyzer-view-mode"
    );
    const hideUnqualifiedCheckbox = document.getElementById(
      "company-analyzer-hide-unqualified"
    );
    // const specialAbilitySelect = document.getElementById(
    //   "company-analyzer-special-ability"
    // );
    const applyFiltersButton = document.getElementById(
      "company-analyzer-apply-filters"
    );
    const resetFiltersButton = document.getElementById(
      "company-analyzer-reset-filters"
    );
    const tableHeader = document.getElementById(
      "company-analyzer-table-header"
    );
    const tableBody = document.getElementById("company-analyzer-table-body");

    // Apply filters function
    function applyFilters() {
      const manStat = parseInt(manStatInput.value) || 0;
      const intStat = parseInt(intStatInput.value) || 0;
      const endStat = parseInt(endStatInput.value) || 0;
      const sortAttribute = sortAttributeSelect.value;
      const viewMode = viewModeSelect.value;
      const hideUnqualified = hideUnqualifiedCheckbox.checked;
      // const specialAbility = specialAbilitySelect.value;

      // Generate table headers based on view mode
      generateTableHeaders(viewMode);

      // Process and display data
      if (viewMode === "companies") {
        displayCompanies(
          manStat,
          intStat,
          endStat,
          sortAttribute,
          hideUnqualified
          // specialAbility
        );
      } else {
        displayPositions(
          manStat,
          intStat,
          endStat,
          sortAttribute,
          hideUnqualified
          // specialAbility
        );
      }
    }

    // Reset filters function
    function resetFilters() {
      manStatInput.value = 0;
      intStatInput.value = 0;
      endStatInput.value = 0;
      sortAttributeSelect.value = "man_gain";
      viewModeSelect.value = "companies";
      hideUnqualifiedCheckbox.checked = true;
      // specialAbilitySelect.value = "all";
      applyFilters();
    }

    // Generate table headers
    function generateTableHeaders(viewMode) {
      let headerHTML = "<tr>";

      if (viewMode === "companies") {
        headerHTML += `
                  <th>Company</th>
                  <th data-sort-key="employees">Employees</th>
                  <th data-sort-key="man_gain" class="company-analyzer-sorted-desc">MAN Gain</th>
                  <th data-sort-key="int_gain">INT Gain</th>
                  <th data-sort-key="end_gain">END Gain</th>
                  <th data-sort-key="total_gain">Total Gain</th>
                  <th>Qualified Positions</th>
              `;
      } else {
        headerHTML += `
                  <th>Company</th>
                  <th>Position</th>
                  <th data-sort-key="man_required">MAN Required</th>
                  <th data-sort-key="int_required">INT Required</th>
                  <th data-sort-key="end_required">END Required</th>
                  <th data-sort-key="man_gain" class="company-analyzer-sorted-desc">MAN Gain</th>
                  <th data-sort-key="int_gain">INT Gain</th>
                  <th data-sort-key="end_gain">END Gain</th>
                  <th data-sort-key="total_gain">Total Gain</th>
                  <th>Special</th>
              `;
      }

      headerHTML += "</tr>";
      tableHeader.innerHTML = headerHTML;
    }

    // Display companies
    function displayCompanies(
      manStat,
      intStat,
      endStat,
      sortAttribute,
      hideUnqualified
      // specialAbility
    ) {
      let companies = [];

      // Process each company
      for (const companyId in companyData.companies) {
        const company = companyData.companies[companyId];
        let modifiedcompanyData = {
          id: companyId,
          name: company.name,
          cost: company.cost,
          default_employees: company.default_employees,
          man_gain: 0,
          int_gain: 0,
          end_gain: 0,
          total_gain: 0,
          qualified_positions: 0,
          total_positions: 0,
          positions: [],
        };

        // Process positions in this company
        for (const positionName in company.positions) {
          const position = company.positions[positionName];

          // Check qualification based on stats
          const isQualified =
            manStat >= position.man_required &&
            intStat >= position.int_required &&
            endStat >= position.end_required;

          // Check special ability filter
          // const matchesSpecialAbility =
          //   specialAbility === "all" ||
          //   position.special_ability === specialAbility;

          // If qualified and matches filters
          if (
            isQualified ||
            !hideUnqualified
            //  && matchesSpecialAbility
          ) {
            // Add position data to company
            modifiedcompanyData.positions.push({
              name: positionName,
              ...position,
              isQualified,
            });

            // Update company stats
            if (isQualified) {
              modifiedcompanyData.qualified_positions++;

              // We'll calculate the best stats from qualified positions
              if (position.man_gain > modifiedcompanyData.man_gain)
                modifiedcompanyData.man_gain = position.man_gain;
              if (position.int_gain > modifiedcompanyData.int_gain)
                modifiedcompanyData.int_gain = position.int_gain;
              if (position.end_gain > modifiedcompanyData.end_gain)
                modifiedcompanyData.end_gain = position.end_gain;
            }
          }

          modifiedcompanyData.total_positions++;
        }

        // Calculate total gain
        modifiedcompanyData.total_gain =
          modifiedcompanyData.man_gain +
          modifiedcompanyData.int_gain +
          modifiedcompanyData.end_gain;

        // Add company to list if it has positions that match the filters
        if (modifiedcompanyData.positions.length > 0) {
          companies.push(modifiedcompanyData);
        }
      }

      // Sort companies based on selected attribute
      companies.sort((a, b) => b[sortAttribute] - a[sortAttribute]);

      // Generate HTML for the table
      let tableHTML = "";

      companies.forEach((company) => {
        tableHTML += `
                  <tr class="company-analyzer-company-row" data-company-id="${company.id}">
                      <td>${company.name}</td>
                      <td>${company.default_employees}</td>
                      <td>${company.man_gain}</td>
                      <td>${company.int_gain}</td>
                      <td>${company.end_gain}</td>
                      <td>${company.total_gain}</td>
                      <td>${company.qualified_positions}/${company.total_positions}</td>
                  </tr>
              `;

        // Add hidden rows for positions
        company.positions.forEach((position) => {
          const qualifiedClass = position.isQualified
            ? "company-analyzer-highlight"
            : "";

          tableHTML += `
                      <tr class="company-analyzer-position-row company-analyzer-hidden ${qualifiedClass}" data-company-id="${
            company.id
          }">
                          <td></td>
                          <td>${position.name}</td>
                          <td>${position.man_required}</td>
                          <td>${position.int_required}</td>
                          <td>${position.end_required}</td>
                          <td>${position.man_gain}</td>
                          <td>${position.int_gain}</td>
                          <td>${position.end_gain}</td>
                          <td>${
                            position.man_gain +
                            position.int_gain +
                            position.end_gain
                          }</td>
                          <td>${position.special_ability}</td>
                      </tr>
                  `;
        });
      });

      // Update table
      tableBody.innerHTML = tableHTML;

      // Add click event to expand/collapse position details
      document
        .querySelectorAll(".company-analyzer-company-row")
        .forEach((row) => {
          row.addEventListener("click", function () {
            const companyId = this.dataset.companyId;
            const positionRows = document.querySelectorAll(
              `.company-analyzer-position-row[data-company-id="${companyId}"]`
            );

            positionRows.forEach((posRow) => {
              posRow.classList.toggle("company-analyzer-hidden");
            });
          });
        });
    }

    // Display individual positions
    function displayPositions(
      manStat,
      intStat,
      endStat,
      sortAttribute,
      hideUnqualified
      // specialAbility
    ) {
      let positions = [];

      // Process each position in each company
      for (const companyId in companyData.companies) {
        const company = companyData.companies[companyId];

        for (const positionName in company.positions) {
          const position = company.positions[positionName];

          // Check qualification based on stats
          const isQualified =
            manStat >= position.man_required &&
            intStat >= position.int_required &&
            endStat >= position.end_required;

          // Check special ability filter
          // const matchesSpecialAbility =
          //   specialAbility === "all" ||
          //   position.special_ability === specialAbility;

          // If passes filters
          if (
            isQualified ||
            !hideUnqualified
            //  && matchesSpecialAbility
          ) {
            positions.push({
              companyId,
              companyName: company.name,
              positionName,
              ...position,
              total_gain:
                position.man_gain + position.int_gain + position.end_gain,
              isQualified,
            });
          }
        }
      }

      // Sort positions based on selected attribute
      positions.sort((a, b) => b[sortAttribute] - a[sortAttribute]);

      // Generate HTML for the table
      let tableHTML = "";

      positions.forEach((position) => {
        const qualifiedClass = position.isQualified
          ? "company-analyzer-highlight"
          : "";

        tableHTML += `
                  <tr class="${qualifiedClass}">
                      <td>${position.companyName}</td>
                      <td>${position.positionName}</td>
                      <td>${position.man_required}</td>
                      <td>${position.int_required}</td>
                      <td>${position.end_required}</td>
                      <td>${position.man_gain}</td>
                      <td>${position.int_gain}</td>
                      <td>${position.end_gain}</td>
                      <td>${position.total_gain}</td>
                      <td>${position.special_ability}</td>
                  </tr>
              `;
      });

      tableBody.innerHTML = tableHTML;
    }

    // Sort table based on a column
    function sortTable(sortKey) {
      const headers = tableHeader.querySelectorAll("th");
      let isDescending = true;

      // Update header classes and determine sort direction
      headers.forEach((header) => {
        if (header.dataset.sortKey === sortKey) {
          if (header.classList.contains("company-analyzer-sorted-desc")) {
            header.classList.remove("company-analyzer-sorted-desc");
            header.classList.add("company-analyzer-sorted-asc");
            isDescending = false;
          } else {
            header.classList.remove("company-analyzer-sorted-asc");
            header.classList.add("company-analyzer-sorted-desc");
            isDescending = true;
          }
        } else {
          header.classList.remove(
            "company-analyzer-sorted-asc",
            "company-analyzer-sorted-desc"
          );
        }
      });

      // Update sort in select
      if (
        ["man_gain", "int_gain", "end_gain", "total_gain"].includes(sortKey)
      ) {
        sortAttributeSelect.value = sortKey;
      }

      // Re-apply filters with new sort
      applyFilters();
    }

    // Add event listeners
    applyFiltersButton.addEventListener("click", applyFilters);
    resetFiltersButton.addEventListener("click", resetFilters);

    // Add event listeners for sorting when clicking on table headers
    tableHeader.addEventListener("click", function (e) {
      if (e.target.tagName === "TH" && e.target.dataset.sortKey) {
        const sortKey = e.target.dataset.sortKey;
        sortTable(sortKey);
      }
    });

    // Apply filters initially
    applyFilters();
  }

  // Initialize script by creating the toggle button
  createToggleButton();
})();
