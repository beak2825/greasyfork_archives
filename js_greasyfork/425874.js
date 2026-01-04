// ==UserScript==
// @name         CloudFormation Console Links
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Add links to things not provided by CloudFormation
// @author       You
// @match        https://*.console.aws.amazon.com/cloudformation/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        GM_log
// @sandbox      DOM
// @downloadURL https://update.greasyfork.org/scripts/425874/CloudFormation%20Console%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/425874/CloudFormation%20Console%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const wrapCreateServiceLink = processIfNotProcessed(createServiceLink);
    const wrapCreateTargetGroupLink = processIfNotProcessed(createTargetGroupLink);
    const wrapCreateLoadBalancerLink = processIfNotProcessed(createLoadBalancerLink);

    var count = 0;
    function processPage() {
        var tBody = document.querySelector('div[class*="cfn-details-table"]');
        if (tBody) {
            var el = tBody.querySelectorAll('td > span[title*=":service/"]')
            if (el) {
                el.forEach(wrapCreateServiceLink);
            }

            el = tBody.querySelectorAll('td > span[title*=":targetgroup/"]')
            if (el) {
                el.forEach(wrapCreateTargetGroupLink);
            }

            el = tBody.querySelectorAll('td > span[title*=":loadbalancer/"]')
            if (el) {
                el.forEach(wrapCreateLoadBalancerLink);
            }
        } else {
            if ( count < 10 ) {
                count += 1;
                GM_log(count + ": processPage: could not find the body");
            }
        }
    }

    function processIfNotProcessed( fn ) {
        return function( span ) {
            if ("1" == span.dataset.processed) {
                return;
            }

            fn(span);
            span.dataset.processed = "1";
        }
    }

    function createServiceLink( span ) {

        var items = span.innerHTML.split('/')
        if ( items.length > 1 ) {
            // https://console.aws.amazon.com/ecs/home?region=us-east-1#/clusters/dev-ecs-infrastructure/services/infrasso-mkt-auth-gateway-Service-gMrv0JZNCP2O/tasks
            var region = getParameterByName('region')
            var origText = span.innerHTML

            var cluster= items[items.length-2]
            var service = items[items.length-1]

            span.innerHTML = "<a href=\"/ecs/home?region=" + region + "#/clusters/" + cluster+ "/services/" + service + "/details\" target=\"_blank\">" + origText + "</a>"
            // GM_log("Service: " + span.innerHTML)
            return true;
        }
        return false;
    }

    function createTargetGroupLink( span ) {
        // https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#TargetGroup:targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:952478859445:targetgroup/infra-Inter-1OR5CYK2106CN/6d0705f35757a8fe
        // arn:aws:elasticloadbalancing:us-east-1:952478859445:targetgroup/infra-Inter-1OR5CYK2106CN/6d0705f35757a8fe
        var items = span.innerHTML.split(':')
        if ( items.length > 1 ) {
            var region = getParameterByName('region')
            var origText = span.innerHTML

            span.innerHTML = "<a href=\"/ec2/v2/home?region=" + region + "#TargetGroup:targetGroupArn=" + origText + "\" target=\"_blank\">" + origText + "</a>"
        }
    }

    function createLoadBalancerLink( span ) {
        // https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#LoadBalancers:search=infrass-ALB-RVVFFTI6U93O;sort=loadBalancerName
        // arn:aws:elasticloadbalancing:us-east-1:952478859445:loadbalancer/app/infrass-ALB-RVVFFTI6U93O/541f259053bdc548
        var items = span.innerHTML.split('/')
        var loadBalancer = items[items.length-2]
        if ( items.length > 1 ) {
            var region = getParameterByName('region')
            var origText = span.innerHTML

            span.innerHTML = "<a href=\"/ec2/v2/home?region=" + region + "#LoadBalancers:search=" + loadBalancer + ";sort=loadBalancerName\" target=\"_blank\">" + origText + "</a>"
            return true;
        }
        return false;
    }

    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    setInterval(processPage, 1000)
})();