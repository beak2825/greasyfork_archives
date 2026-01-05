// ==UserScript==
// @name         Top Tankers Improvements
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://worldoftanks.eu/en/top_tankers/*
// @grant        none
// @namespace https://greasyfork.org/users/63466
// @downloadURL https://update.greasyfork.org/scripts/24567/Top%20Tankers%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/24567/Top%20Tankers%20Improvements.meta.js
// ==/UserScript==

    jQuery(window).load(function()
    {
        var userID = $.cookie("cm.options.user_id");

        if (userID)
        {
            var vehicleDataUrl = "http://worldoftanks.eu/aow/vehicles/by_filters/?filter%5Bnation%5D=&filter%5Blanguage%5D=en&filter%5Bpremium%5D=0%2C1&filter%5Baccount_id%5D=" + userID;

            var globalStore = {};
            var globalRank = {};

            $.when(
                $.getJSON(vehicleDataUrl, function(data)
                {
                    if (data['status'] == 'ok')
                    {
                        var allVehicles = data['data']['data'];

                        globalStore.data = new Array();

                        for (var i = 0; i < allVehicles.length; i++)
                        {
                            var vehicle = {};
                            vehicle.name = allVehicles[i][4];
                            vehicle.tier = allVehicles[i][2];
                            vehicle.id = allVehicles[i][5];
                            vehicle.rank = 0;
                            vehicle.delta = 0;

                            var singleVehicleUrl = "http://worldoftanks.eu/aow/ratings/accounts/by_vehicle/?vehicle_cd=" + vehicle.id + "&vehicle_tier=" + vehicle.tier + "&lang=en&page=1&page_size=1&extra_accounts=" + userID;
                            
                            $.getJSON(singleVehicleUrl, function(data2)
                                {
                                    if (data2['status'] == 'ok')
                                    {
                                        var rank = {};

                                        rank.rank = data2.data.extra_account[0]['rank'];
                                        rank.delta = data2.data.extra_account[0]['rank_delta'];
                                        rank.id = data2.data.extra_account[0]['vehicle_cd'];

                                        $.each(globalStore.data, function()
                                        {
                                            if (this.id == rank.id)
                                            {
                                               
                                                this.rank = rank.rank;
                                                this.delta = rank.delta;
                                                this.id = rank.id;
                                                
                                                var string = "<div style='display:block;margin-left:auto;margin-right:auto;top:0;position:absolute;padding-top:20px;'>Rank: " + this.rank + " \nDelta " + this.delta + "</div>";
                                                $('a[href$="/' + this.name + '/"]').append(string);
                                            }
                                        });
                                    }

                                });

                            globalStore.data.push(vehicle);
                        }
                    }
                })
                .fail(function()
                {
                    console.log("Cannot get vehicles for user " + userID);
                })

            ).then(function()
            {
               console.log("Data Collected");
            });
        };
    });
