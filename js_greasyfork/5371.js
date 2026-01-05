// ==UserScript==
// @name       Hacker Experience Helper
// @namespace  helper.hackerexperience
// @version    0.24
// @description  Misc Quality of Life tweaks for www.hackerexperience.com web game
// @match      https://hackerexperience.com/processes*
// @match      https://hackerexperience.com/finances*
// @match      https://hackerexperience.com/list*
// @match      https://hackerexperience.com/log*
// @match      https://hackerexperience.com/internet?bAction=show
// @match      https://hackerexperience.com/internet?view=logs
// @match      https://hackerexperience.com/missions
// @match      https://hackerexperience.com/mail
// @downloadURL https://update.greasyfork.org/scripts/5371/Hacker%20Experience%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/5371/Hacker%20Experience%20Helper.meta.js
// ==/UserScript==

// Automatically changes the Complete buttons so they can be opened with a middle click
if (document.location.pathname === "/processes")
{
    window.setInterval(function()
    {
        $("input:submit[value='Complete']").each(
            function()
            {
                var processId = $(this).siblings().attr('value');
                $(this).replaceWith("<a href='/processes?pid=" + processId + "'><span class='label label-info'>Complete</span></a>");
            }
        );
    }, 500);
}

// Automatically change the mail delete buttons so they can be clicked without a modal popup
if (document.location.pathname === "/mail")
{
    $("span.mail-delete").each(
        function()
        {
            var id = $(this).attr('value');
            $(this).replaceWith("<form method='POST'><input type='hidden' name='act' value='delete' /><input type='hidden' name='id' value='" + id + "' /><input type='submit' class='btn btn-primary' value='Delete' />");
        }
    );
}

// Put the current bank's IP address and your local account (if you have one) in the destination transfer textboxes automatically
if (document.location.href.indexOf("internet?bAction=show") > -1)
{
    var currentIP = $("input.browser-bar").val();
    $("input[name='ip']").val(currentIP)
    $("input[name='acc']").val(getAccountForBankIP(currentIP));
}

// Add "Delete all uninfected" button to clear out the hacked DB of IPs that aren't infected
if (document.location.pathname === "/list" || document.location.pathname === "/list.php") {
    $("div.widget-title ul.nav").append("<a href='#' id='deleteAll'><span class='label label-info'>Delete all uninfected</span></a>");
    $("#deleteAll").click(function() {
        var deleteCount = 0;
        var page = 1;
        var idList = { };
        
        while (true) {
        	var newIdsSeen = false;
            
            $.ajax({
                type: "GET",
                url: "/list?page=" + page++,
                async: false,
                success: function(data, status, xhr) {
                    $("ul.list li", data).each(function(index, element) {
                        var id = $("span.delete-ip", element).attr("id");
                        if (idList[id] === undefined) {
							idList[id] = $(element).text().indexOf("No running virus") > -1;
                            newIdsSeen = true;
                        }
                    });
            	}
            });

            if (!newIdsSeen) {
                break;
            }
        }
        
        for (var id in idList) {
            if (idList[id] === true) {
                $.post("/list", { "act": "deleteip", "id": id });
                deleteCount++;
            }
        }
        
        $("#deleteAll span").html("Deleted " + deleteCount + " non-infected IP addresses");
    });
}

// Add auto-hack bank button to Check Bank Status missions
if (document.location.pathname === "/missions")
{
    (function()
    {
        function log(message)
        {
            var logText = getCurrentDateTime() + " - " + message;
            $("#script_log").append("<br/>" + logText);
            console.log(logText);
        }

        $("span.mission-abort").after("<span class='btn' id='hack_bank'>Hack Bank</span>");
        $("#hack_bank").after("<p id='script_log'>");
        $("#hack_bank").click(function()
        {
            if ($(".span4 .widget-box td").length === 8)
            {
                var missionInfo = $(".span4 .widget-box td").text();
                var sourceIP = getFirstMatch(/Victim(\d+\.\d+\.\d+\.\d+)/g, missionInfo);
                var sourceAccount = getFirstMatch(/Account#(\d{9})/g, missionInfo);
                var destinationIP = sourceIP;
                var destinationAccount = getAccountForBankIP(sourceIP);

                hackAccount(sourceIP, sourceAccount, destinationIP, destinationAccount, function()
                {
                    log("Hacking completed!");
                });
            }
            else if ($(".span4 .widget-box td").length === 10)
            {
                var sourceAccount = getFirstMatch(/#(\d+)/g, $($($(".span4 .widget-box td").get(3)).contents()[0]).text());
                var sourceIP = $($(".span4 .widget-box td").get(3)).find("a").text();
                var destinationAccount = getFirstMatch(/#(\d+)/g, $($($(".span4 .widget-box td").get(5)).contents()[0]).text());
                var destinationIP = $($(".span4 .widget-box td").get(5)).find("a").text();
                var playerAccount = getAccountForBankIP(destinationIP);

                hackAccount(
                    sourceIP,
                    sourceAccount,
                    destinationIP,
                    destinationAccount,
                    function()
                    {
                        hackAccount(destinationIP, destinationAccount, destinationIP, playerAccount, function()
                        {
                            log("Hacking completed!");
                        });
                    });
            }
        });

        function hackAccount(sourceIP, sourceAccount, destinationIP, destinationAccount, onComplete)
        {
            $.get("/internet?ip=" + sourceIP)
                .done(function()
                {
                    log("Fetched bank home page for " + sourceIP);
                    $.get(
                        "/internet?action=hack&acc=" + sourceAccount,
                        function(data, status, xhr)
                        {
                            var processId = getFirstMatch(/pid=(\d+)/g, data);
                            log("Bank account hacking process " + processId + " started.");
                            monitorProcessForCompletion(processId, function()
                            {
                                log("Bank account hacking process " + processId + " completed.");
                                $.get(
                                    "/internet?action=login&type=bank",
                                    function(data2, status2, xhr2)
                                    {
                                        var pass = $("input[name=pass]", data2).val();
                                        log("Password " + pass + " retrieved for account " + sourceAccount);
                                        $.get(
                                            "/internet?action=login&type=bank&acc=" + sourceAccount + "&pass=" + pass,
                                            function(data3, status3, xhr3)
                                            {
                                                var balance = $("ul.finance-box li div.right", data3).text().trim()
                                                log("Logged in and retrieved balance of " + balance);
                                                $.post(
                                                        "/internet?bAction=show",
                                                        {
                                                            "int-act": "transfer",
                                                            acc: destinationAccount,
                                                            money: balance,
                                                            ip: destinationIP
                                                        }
                                                    )
                                                    .done(function()
                                                    {
                                                        log("Transferred " + balance + " to account " + destinationAccount);
                                                        $.get("/internet?bAction=logout")
                                                            .done(function()
                                                            {
                                                                log("Logged out of account " + sourceAccount);
                                                                onComplete();
                                                            });
                                                    });
                                            }
                                        );
                                    }
                                );
                            });
                        }
                    );
                });
        }
    }());
}

// Local log watcher/archiver
if (document.location.pathname === "/log" || document.location.pathname === "/log.php")
{
    (function()
    {
        var lastRetrievedLog = '';

        function initializeLogPage()
        {
            $(".widget-title ul.nav a").first().append("<li id='last_refresh'></li>");
            $(".container-fluid .row-fluid div.span2").remove();
            $(".container-fluid .row-fluid div.span8").removeClass("span8").addClass("span12");

            var logContainer = $(".container-fluid .row-fluid div.span12").first();
            logContainer.removeClass("span12").addClass("span6");

            logContainer.after(
                "<div class='span6 center'>" +
                "<div class='widget-box'>" +
                "<div class='widget-title'>" +
                "<ul class='nav nav-tabs'>" +
                "<li class='link active'><a href='/log'><span class='he16-cog heicon'></span>Automation</a></li>" +
                "</ul>" +
                "</div>" +
                "<div class='widget-content padding noborder'>" +
                "<div class='row-fluid'>" +
                "<h4>Archived Log</h4>" +
                "<textarea id='archived_logarea' style='width: 95%; height: 300px; overflow-y: scroll; overflow-x: scroll; word-wrap: normal; white-space: pre; text-align: left;' />" +
                "<br />" +
                "<input id='clearArchivedLog' type='submit' class='btn btn-inverse' value='Clear archived log'>" +
                "</div>" +
                "</div>" +
                "</div>" +
                "<div style='clear: both;'' class='nav nav-tabs'>&nbsp;</div>" +
                "</div>"
            );

            $("#archived_logarea").val(localStorage.getItem("archived_log"));

            $("form.log input[type=submit]").after("<input id='clearLog' class='btn btn-inverse' type='submit' value='Clear log file'>");

            $("#clearLog").click(function()
            {
                $("textarea.logarea").val('');
            });

            $("#clearArchivedLog").click(function()
            {
                $("#archived_logarea").val('');
                localStorage.removeItem("archived_log");
            });

            $('form.log').submit(function(event)
            {
                var form = $(this);

                $.ajax(
                {
                    type: form.attr('method'),
                    url: form.attr('action'),
                    data: form.serialize(),
                    success: function(data, status, xhr)
                    {
                        var processId = getFirstMatch(/pid=(\d+)/g, xhr.getResponseHeader("TM-finalURL"));
                        console.log(getCurrentDateTime() + " - Log edit process " + processId + " started.");
                        monitorProcessForCompletion(processId, function()
                        {
                            console.log(getCurrentDateTime() + " - Log edit process " + processId + " completed.");
                        });
                    },
                }).fail(function()
                {
                    console.log("Failed to submit log edit form.");
                });

                event.preventDefault();
            });
        }

        function refreshLog()
        {
            $.get(
                    "/log",
                    function(data, status, xhr)
                    {
                        var newLogContainer = $("textarea.logarea", data);
                        if (newLogContainer.length > 0)
                        {
                            var newLogLines = newLogContainer.val().split("\n");
                            var oldLogLines = lastRetrievedLog.split("\n");
                            var linesToArchive = [];

                            for (var i = 0; i < newLogLines.length; i++)
                            {
                                var inOldLog = false;

                                for (var j = 0; j < oldLogLines.length; j++)
                                {
                                    if (newLogLines[i] === oldLogLines[j])
                                    {
                                        inOldLog = true;
                                        break;
                                    }
                                }

                                if (!inOldLog && newLogLines[i] !== "")
                                {
                                    linesToArchive.push(newLogLines[i]);
                                }
                            }

                            if (linesToArchive.length > 0)
                            {
                                var newArchivedLog = [linesToArchive.join("\n"), $("#archived_logarea").val()].join("\n");
                                $("#archived_logarea").val(newArchivedLog);
                                localStorage.setItem("archived_log", newArchivedLog);
                            }

                            $("textarea.logarea").val(newLogContainer.val());
                            lastRetrievedLog = newLogContainer.val();
                            $("#last_refresh").html("<span style='color: green'>Last refresh: " + getCurrentDateTime() + "</span>");
                        }
                        else
                        {
                            $("#last_refresh").html("<span style='color: red'>Error refreshing log at " + getCurrentDateTime() + "</span>");
                        }

                        window.setTimeout(refreshLog, 2500);
                    }
                )
                .fail(function()
                {
                    $("#last_refresh").html("<span style='color: red'>Error refreshing log at " + getCurrentDateTime() + "</span>");
                    window.setTimeout(refreshLog, 2500);
                });
        }

        initializeLogPage();
        refreshLog();
    }());
}


if (document.location.pathname === "/finances")
{
    var areTransfersRunning = false;

    function initializeFinancePage()
    {
        var financeContainer = $(".container-fluid .row-fluid div.span12").first();
        financeContainer.removeClass("span12").addClass("span7");

        financeContainer.after(
            "<div class='span5 center'>" +
            "<div class='widget-box'>" +
            "<div class='widget-title'>" +
            "<ul class='nav nav-tabs'>" +
            "<li class='link active'><a href='/finances'><span class='he16-cog heicon'></span>Automation</a></li>" +
            "</ul>" +
            "</div>" +
            "<div class='widget-content padding noborder'>" +
            "<div class='row-fluid'>" +
            "<div>" +
            "<label for='destination_account'>Consolidate all cash into account:</label>" +
            "<select id='destination_account' />" +
            "</div>" +
            "<div>" +
            "<input type='button' id='start_stop_transfers' value='Start automatic transfers' />" +
            "</div>" +
            "<div>" +
            "<label for='auto_start_transfers'>" +
            "<input type='checkbox' id='auto_start_transfers' />Start auto-transfers on Finances page load?</label>" +
            "</div>" +
            "</div>" +
            "<div class='row-fluid'>" +
            "<h4>Script Log</h4>" +
            "<div id='log_container' style='max-height: 300px; overflow-y: scroll; font-family: monospace; text-align: left;' />" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<div style='clear: both;'' class='nav nav-tabs'>&nbsp;</div>" +
            "</div>"
        );

        $("#destination_account").change(function()
        {
            var newValue = $("#destination_account").val();
            log("Destination account changed to " + newValue);
            localStorage.setItem("destination_account", newValue);
        });

        $("#start_stop_transfers").click(function()
        {
            areTransfersRunning = !areTransfersRunning;

            if (areTransfersRunning)
            {
                log("Transfers automation started");
                $("#start_stop_transfers").val("Stop automatic transfers");
            }
            else
            {
                log("Transfer automation stopped");
                $("#start_stop_transfers").val("Start automatic transfers");
            }
        });

        var autoStartTransfers = localStorage.getItem("auto_start_transfers") || "false";

        if (autoStartTransfers === "true")
        {
            $("#auto_start_transfers").prop("checked", autoStartTransfers);
            $("#start_stop_transfers").click();
        }

        $("#auto_start_transfers").change(function()
        {
            var newValue = $("#auto_start_transfers").prop("checked");
            log("Auto-start transfers changed to " + newValue);
            localStorage.setItem("auto_start_transfers", newValue);
        });
    }


    function refreshFinancePage()
    {
        $.get(
                "/finances",
                function(data, status, xhr)
                {
                    var newFinanceData = $(".container-fluid .row-fluid div.span12", data).first();

                    if (newFinanceData.length > 0)
                    {
                        $(".widget-title ul.nav a", newFinanceData).first().append("<li>Last refresh: " + getCurrentDateTime() + "</li>");
                        $(".container-fluid .row-fluid .widget-box").first().replaceWith(newFinanceData.html());

                        var accountBoxes = $(".row-fluid .widget-box .widget-content .row-fluid .widget-box");
                        var accounts = [];

                        accountBoxes.each(
                            function(index, element)
                            {
                                var elementText = $(element).text();
                                var elementHtml = $(element).html();
                                var bankName = getBankName(elementText);
                                var bankIP = getBankIP(elementHtml);
                                var balance = parseFloat(getBalance(elementText).split(",").join(""));
                                var accountNumber = getAccountNumber(elementText);
                                var isBitcoinAccount = bankName === "BTC Wallet";

                                accounts.push(
                                {
                                    bankName: bankName,
                                    bankIP: bankIP,
                                    balance: balance,
                                    accountNumber: accountNumber,
                                    isBitcoinAccount: isBitcoinAccount
                                });
                            }
                        );

                        localStorage.setItem("bank_accounts", JSON.stringify(accounts));

                        populateAccountDropdown(accounts);

                        if (areTransfersRunning)
                        {
                            executeTransfers(accounts);
                        }
                    }
                    else
                    {
                        log("Error refreshing finance page data.");
                    }

                    window.setTimeout(refreshFinancePage, 3000);
                }
            )
            .fail(function()
            {
                log("Error refreshing finance page data.");
                window.setTimeout(refreshFinancePage, 3000);
            });

    }

    function log(message)
    {
        $("#log_container").prepend("<br/>[" + getCurrentDateTime() + "] " + message);
    }

    function getBalance(elementText)
    {
        return getFirstMatch(/\$([\d,]+)/g, elementText) || getFirstMatch(/(\d+\.\d+) BTC/g, elementText);
    }

    function getAccountNumber(elementText)
    {
        return getFirstMatch(/\#(\d\d+)/g, elementText) || getFirstMatch(/Public Address([A-Za-z0-9]+)/g, elementText);
    }

    function getBankName(elementText)
    {
        return getFirstMatch(/(.+)[\s\S]Account Balance/g, elementText) || "BTC Wallet";
    }

    function getBankIP(elementHtml)
    {
        return getFirstMatch(/ip=(\d+\.\d+\.\d+\.\d+)/g, elementHtml) || "";
    }

    function populateAccountDropdown(accounts)
    {
        var accountDropdown = $("#destination_account");
        accountDropdown.find('option').remove();

        for (var i = 0; i < accounts.length; i++)
        {
            var account = accounts[i];
            accountDropdown.append("<option value='" + account.accountNumber + "'>" + account.bankName + " (" + account.accountNumber + ")</option>");
        }

        accountDropdown.val(localStorage.getItem("destination_account"));
    }

    function getBitcoinPrice()
    {
        var price;
        
        $.ajax({
			url: "https://blockchain.info/q/24hrprice",
    		success: function(data) {
				price = parseFloat(data).toFixed(0);
    		},
    		async:false
  		});

        return price;
    }

    function buyBitcoinsInDollars(accountNumber, amountInDollars)
    {
        var amount = (amountInDollars / getBitcoinPrice()).toFixed(7);
        log("Buying " + amount + " BTC for $" + amountInDollars + " from account #" + accountNumber);
        $.post(
            "https://hackerexperience.com/bitcoin.php",
            {
                func: "btcBuy",
                amount: amount,
                acc: accountNumber
            }
        );
    }

    function sellBitcoinsInDollars(accountNumber, amountInDollars)
    {
        var amount = (amountInDollars / getBitcoinPrice()).toFixed(7);
        sellBitcoins(accountNumber, amount);
    }

    function sellBitcoins(accountNumber, amount)
    {
        var amountInDollars = parseInt(amount * getBitcoinPrice());
        log("Selling " + amount + " BTC for $" + amountInDollars + " to account #" + accountNumber);
        $.post(
            "https://hackerexperience.com/bitcoin.php",
            {
                func: "btcSell",
                amount: amount,
                acc: accountNumber
            }
        );
    }

    function executeTransfers(accounts)
    {
        var destinationAccount = null;
        var bitcoinAccount = null;

        for (var i = 0; i < accounts.length; i++)
        {
            if (accounts[i].accountNumber === $("#destination_account").val())
            {
                destinationAccount = accounts[i];
            }

            if (accounts[i].isBitcoinAccount)
            {
                bitcoinAccount = accounts[i];
            }
        }

        var anyAccountsHaveBalance = false;

        if (destinationAccount !== null && bitcoinAccount != null)
        {
            for (var i = 0; i < accounts.length; i++)
            {
                var sourceAccount = accounts[i];
                if (sourceAccount !== destinationAccount && sourceAccount !== bitcoinAccount && sourceAccount.balance > 0)
                {
                    anyAccountsHaveBalance = true;
                    executeTransfer(sourceAccount, bitcoinAccount);
                }
            }
        }

        if (!anyAccountsHaveBalance && destinationAccount !== bitcoinAccount && bitcoinAccount.balance >= 1)
        {
            executeTransfer(bitcoinAccount, destinationAccount);
        }
    }

    function executeTransfer(source, destination)
    {
        if (!source.isBitcoinAccount)
        {
            buyBitcoinsInDollars(source.accountNumber, source.balance);
        }

        if (!destination.isBitcoinAccount)
        {
            if (source.isBitcoinAccount)
            {
                sellBitcoins(destination.accountNumber, source.balance);
            }
            else
            {
                sellBitcoinsInDollars(destination.accountNumber, source.balance);
            }
        }
    }

    initializeFinancePage();
    refreshFinancePage();
}

function getFirstMatch(regex, text)
{
    var match = regex.exec(text);

    if (match !== null)
    {
        return match[1];
    }
    else
    {
        return null;
    }
}

function getCurrentDateTime()
{
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();

    if (month.toString().length == 1)
    {
        var month = '0' + month;
    }

    if (day.toString().length == 1)
    {
        var day = '0' + day;
    }

    if (hour.toString().length == 1)
    {
        var hour = '0' + hour;
    }

    if (minute.toString().length == 1)
    {
        var minute = '0' + minute;
    }

    if (second.toString().length == 1)
    {
        var second = '0' + second;
    }

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

function getAccountForBankIP(bankIP)
{
    var accountsJSON = localStorage.getItem("bank_accounts");
    var accounts = $.parseJSON(accountsJSON);

    if (accounts)
    {
        for (var i = 0; i < accounts.length; i++)
        {
            if (accounts[i].bankIP === bankIP)
            {
                return accounts[i].accountNumber;
            }
        }
    }

    return "";
}

function monitorProcessForCompletion(processId, onComplete)
{
    $.ajax(
        {
            type: "POST",
            url: "ajax.php",
            data:
            {
                func: 'completeProcess',
                id: processId
            },
            success: function(data)
            {
                if (data.status === 'OK')
                {
                    onComplete();
                }
                else
                {
                    window.setTimeout(function()
                    {
                        monitorProcessForCompletion(processId, onComplete);
                    }, 2000);
                }
            }
        })
        .fail(function()
        {
            console.log(getCurrentDateTime() + " - Error retrieving process " + processId + " status.");
            window.setTimeout(function()
            {
                monitorProcessForCompletion(processId, onComplete);
            }, 2000);
        });
}