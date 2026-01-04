
// ==UserScript==
// @name         GoBook Utils
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Inject dev helper stuff on GoBook/Pinsight pages. Form fill partially working
// @author       MT
// @match        https://*.tlgpinsight.com/*
// @match        http://localhost:1830/*
// @grant       GM.getValue
// @grant       GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/396954/GoBook%20Utils.user.js
// @updateURL https://update.greasyfork.org/scripts/396954/GoBook%20Utils.meta.js
// ==/UserScript==

(function() {
  
  let $ = window.$;
  if($ == undefined) return;

  let testData = {
    email: null, //'gobookAgent2020@mailinator.com';
    profile1: null,
    comm: null
  }; 
  
  let loadValue = async function(key, defaultValue) {
    let val = await GM.getValue(key);
    if(val == undefined || val == null) {
      await GM.setValue(key, defaultValue);
      val = defaultValue;
    }
    console.log("loadValue "  + key + " " + defaultValue + " " + val);
    return val;
  };

  let loadTestData = async function() {
    //setting defaults to load into script Values, but they can be modified manually.
    testData.email = await loadValue("email", "gobookAgent2020@mailinator.com");
    testData.profile1 = await loadValue("profile1",{
      firstName: "John",
      middleName: "Middle",
      lastName: "Doe",
      customerLoyalty: "999999",
      agentLoyalty: "888888"
    });
    testData.card1 = await loadValue("card1", {
      fullName: "John Doe",
      cardNumber: "4111111111111111", //visa
      expirationMonth: "February",
      expirationYear: "2025",
      cvv: "123",
      address1: "123 Main St",
      city: "Miami",
      state: "Florida",
      country: "United States",
      zip: "90210"
    });
    testData.comm = await loadValue("communication",  {
      phone: "123-234-3456",
    });
  };
  
  let findInput = function(p, s) {
    let n = null;
      if (p) {
          let d = p.querySelectorAll(s);
          if (d && d.length > 0) {
              return d[0];
          }
          let ns = p.querySelectorAll("*");
          if (ns && ns.length > 0) {
              for (let i = 0; i < ns.length; i++) {
                  let o = ns[i];
                  if (o.shadowRoot) {
                      n = findInput(o.shadowRoot, s);
                  }
                  if (n != null) {
                      break;
                  }
              }
          }
      }
      return n;
  };

  let setValue = function(selector, val) {
      var input = findInput(document.body, selector);
      //console.info(selector);
      //console.info(input);
      if(input) { 
        input.value = val;
        input.inputText = val; //for autosuggests
        if(input.checked == false) input.checked = true;
      }
  };

  let mailinator = function() {
    window.open('https://www.mailinator.com/v3/index.jsp?zone=public&query=gobookagent2020#/#inboxpane', '_blank');
  };

  let profile1 = function() {

    let prefix = "[data-tlg-test='";
    let fpfx = "tlg-flight-";
    let hpfx = "tlg-hotel-";
    let suffix = "']";

   let profile = testData.profile1
    //TODO: flight 
    setValue(`${prefix}${fpfx}passenger:first-name${suffix}`, profile.firstName);
    //TODO: car 
    //
    setValue(`${prefix}${hpfx}passenger:first-name${suffix}`, profile.firstName);
    setValue(`${prefix}${hpfx}passenger:middle-name${suffix}`, profile.middleName);
    setValue(`${prefix}${hpfx}passenger:last-name${suffix}`, profile.lastName);
    setValue(`${prefix}${hpfx}passenger:customer-loyalty${suffix}`, profile.customerLoyalty);
    setValue(`${prefix}${hpfx}passenger:agent-loyalty${suffix}`, profile.agentLoyalty);
    //creditcard
    //tlg-flight-payment-details:name
    let card = testData.card1;
    setValue(`${prefix}${fpfx}payment-details:name${suffix}`, card.fullName);
    setValue(`${prefix}${fpfx}payment-details:card-number${suffix}`, card.cardNumber);
    setValue(`${prefix}${fpfx}payment-details:expiry-month${suffix}`, card.expirationMonth);
    setValue(`${prefix}${fpfx}payment-details:expiry-year${suffix}`, card.expirationYear);
    setValue(`${prefix}${fpfx}payment-details:ccv${suffix}`, card.cvv);
    setValue(`${prefix}${fpfx}billing-address:address-line${suffix}`, card.address1);
    setValue(`${prefix}${fpfx}billing-address:city${suffix}`, card.city);
    setValue(`${prefix}${fpfx}billing-address:state${suffix}`, card.state);
    setValue(`${prefix}${fpfx}billing-address:zip${suffix}`, card.zip);
    setValue(`${prefix}${fpfx}billing-address:country${suffix}`, card.country);
    //communication details
    setValue(`${prefix}tlg-communication-details:phone${suffix}`, testData.commm.phone);
    setValue(`${prefix}tlg-communication-details:email${suffix}`, testData.email);
    setValue(`${prefix}tlg-communication-details:checkbox${suffix}`, true);

  };

  let toggle = async function() {
    //console.log("toggle 1");
    let state = await GM.getValue("utils_hidden", false);
    console.log("toggle 2 state " + state);
    
    if(state == true)  {
      await GM.setValue("utils_hidden", false);
    }
    else {
      await GM.setValue("utils_hidden",true);
    }
    displayUtils();

  }

  let displayUtils = async function() {
    let state = await GM.getValue("utils_hidden", false);
    if(state) {
      $("#gobookUtils").hide();
      $("#gobookUtilsHidden").show();
    }
    else {
      $("#gobookUtils").show();
      $("#gobookUtilsHidden").hide();
    }
  }
  
  loadTestData();

  $(document).ready(function() {

    let sid = $("[id*=APISessionID]").prop("title"); 
    sid = sid == null ? "" : sid.split(":")[1];
    sid = sid == null ? "" : sid.trim();

    let checkoutLink = `<a id="gobookutil_checkout" href='javascript:void(0);' style="text-decoration:underline;">Fill Checkout</a>`;
    if(window.location.href.indexOf("checkout") < 0) checkoutLink = "";

    let mailLink = `<a id="gobookutil_mailinator" href='javascript:void(0)' style="text-decoration:underline;">Mailinator</a>`;

    $("header").before(
      `<div style='z-index:9999;font-size:12px;position:fixed;bottom:6px;right:6px;text-align:left;color:red;background:rgba(255, 255, 255, 1); border:1px solid green;padding:6px 6px 6px 6px;'>
          <div id="gobookUtils" style="display:none;min-width:250px;padding-bottom:8px;">
            <div style='font-size:10px;color:grey;position:absolute;bottom:0;right:6px;'>Dev Tools <a id="gobookUtil_close" href="javascript:void(0)">❌</a></div>
            <strong>SID:</strong> ${sid}<br\>
            ${checkoutLink}
            ${mailLink}
          </div>
          <div id="gobookUtilsHidden" style="display:none;"><a id='gobookUtil_open' href="javascript:void(0)">✔️</a></div>
      </div>`);
    
    $("#gobookUtil_close").click(function() { toggle() });
    $("#gobookUtil_open").click(function() { toggle() });
    $("#gobookutil_mailinator").click(function() { mailinator() });
    $("#gobookutil_checkout").click(function() {profile1()});

    displayUtils();

  });

})();