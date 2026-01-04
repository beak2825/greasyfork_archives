// ==UserScript==
// @name         Rave Monitor For MWSP
// @namespace    https://greasyfork.org/en/users/318347
// @version      0.2
// @description  RaveMonitor
// @author       LambertQin
// @match        https://rave.office.net/cases/unassigned
// @connect-src  https://rave.office.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429408/Rave%20Monitor%20For%20MWSP.user.js
// @updateURL https://update.greasyfork.org/scripts/429408/Rave%20Monitor%20For%20MWSP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var supportedTenantCountryCode = ["AU", "BN", "BD", "CN", "FJ", "HK", "ID", "KH", "KP", "LA", "LK", "MM", "MO", "MY", "NP", "NZ", "PH", "PG", "SG", "TH", "TW", "VN", "PK", "JP"]
    var unassignedTabTemplate = `
    <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item active" id="unassigned-apac-tab" role="none">
            <a href="" onclick="RaveMonitor.activeTab('apac')" class="nav-link active ng-scope" id="unassigned-apac-tab" data-toggle="tab" role="tab" aria-controls="unassigned-apac-pane" aria-selected="true" aria-expanded="true">APAC Unassigned</a>
        </li>
        <li class="nav-item ng-scope" id="unassigned-all-tab" role="none">
            <a href="" onclick="RaveMonitor.activeTab('all')" class="nav-link active ng-scope" id="unassigned-all-tab" data-toggle="tab" role="tab" aria-controls="unassigned-all-pane" aria-selected="true" aria-expanded="true">All</a>
        </li>
    </ul>
    <div class="panel panel-default tab-content">
        <div class="tab-pane case-view active" id="unassigned-apac-pane"></div>
        <div class="tab-pane case-view" id="unassigned-all-pane"></div>
    </div>
    `
    var unassignedCritsitTemplate = `
    <div id="unassigned-critsit" class="admin admin-panel scrolling-table-container" ng-controller="CaseController as caseController">
        <table id="casesList" class="table table-hover">
            <thead id="unassigned-sort-headers">
                    <tr>
                        <th class="col-dynamic-1" axis="Create Date" ui-sort="" sort-by="'RequestData.CreateDateTime'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse" scope="col"><span translate="">Cases.CreateDate</span></th>
                        <th class="col-dynamic-1" current-page="Cases">User Phone</th>
                        <th class="col-dynamic-1" ui-sort="" sort-by="'RequestData.ParatureTicketNumber'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse" scope="col"><span translate="">Cases.CaseNumber</span></th>
                        <th class="col-dynamic-1" ui-sort="" sort-by="'RequestData.SupportAreaName'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse" scope="col"><span translate="">Cases.SupportArea</span></th>
                        <th class="col-dynamic-2" ui-sort="" sort-by="'CompanyName'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse" scope="col"><span translate="">Cases.UnackCompanyName</span></th>
                        <th class="col-dynamic-1" ui-sort="" sort-by="'RequestData.ExtensionAttributes.TenantCountryCode'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse" scope="col"><span translate="">Cases.Country</span></th>
                        <th class="col-dynamic-1" ui-sort="" sort-by="'RequestData.UserLcid'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse" scope="col"><span translate="">Cases.Language</span></th>
                        <th ng-if="casesController.ShowMultiSelectFilters  &amp;&amp; columnName === 'SeverityDisplay'" class="col-dynamic-1" scope="col" ui-sort="" sort-by="'SeverityDisplay'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse"><span translate="">Case.Severity.Severity</span></th>
                        <th class="col-dynamic-1" scope="col" ui-sort="" sort-by="'Theme'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse"><span translate="">Cases.ScenarioName</span></th>
                        <th class="col-dynamic-3" scope="col" ui-sort="" sort-by="'RequestData.UserDescription'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse"><span translate="">Cases.Description</span></th>
                        <th class="col-dynamic-1" scope="col" ui-sort="" sort-by="'RequestData.CreateDateTime'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse"><span translate="">Cases.TimeUnassigned</span></th>
                        <th class="col-dynamic-1" id="accept-column" scope="col"><span translate="">Cases.Action</span></th>
                        <th class="col-dynamic-1" ng-if="!casesController.IsDefaultUnassignedColumn(columnName)">
                            <dynamic-column column-name="columnName" parent-controller="casesController" type="'1'" header="true">
                        </dynamic-column></th>
                    </tr>
            </thead>
            <tbody>
                    <tr ng-repeat="request in casesController.UnacceptedRequests track by request.RequestData.RequestId" ng-if="request.IsCritSit == true" class="{{casesController.GetRowCss(request)}}" title="{{casesController.GetRowTooltips(request)}}">
                        <td class="col-dynamic-1">{{request.RequestData.CreateDateTime | date : 'MMM d, y h:mm a'}}</td>
                        <td class="col-dynamic-1">{{request.RequestData.UserPhone}}</td>
                        <td class="col-dynamic-1" scope="row">
                                <a ng-click="casesController.OpenRequest(request, $event)" ng-href="/cases/{{request.RequestData.RequestId}}" click-tracking="" tracking-name="OpenRequestLinkClicked" tracking-tag-id="433065">{{request.RequestData | caseNumber}}</a><br>
                            <span class="ptsolve ms-Icon-FullMDL ms-Icon-FullMDL--Diamond" ng-if="request.IsPremierEscalation" translate-attr="{ title: 'Cases.Cases.PTSolveEscalation' }"></span>
                            <span ng-if="request.IsCritSit" class="modality-critsit" translate="">Case.Severity.Critsit</span>
                            <span ng-if="request.RequestData.NudgeState &amp;&amp; request.RequestData.NudgeState == 'Nudge'" class="nudged-breadcrumb" ng-cloak="" translate="">Case.Nudge.Badge</span>
                            <span ng-if="request.IsMissonCritical" class="modality-smc" ng-cloak="" translate-attr="{ title: 'Case.MissionCritical.Details' }" translate="">Case.MissionCritical.Badge</span>
                            <span ng-if="request.IsTier3" class="modality-tier3" ng-cloak="" translate="">Case.IsTier3</span>
                            <span ng-if="request.IsEnterpriseCloudTenant" class="oed-badge" ng-cloak="" translate="">Case.EngineeringDirect.Badge</span>
                            <span ng-if="request.RequestData.CustomerCallbackDateTime" class="customercb-breadcrumb" translate="">Case.AmbassadorCallback.BadgeCustomerCB</span>
                            <span ng-if="casesController.CheckPerformanceBadge(request)" class="Performance-badge" ng-cloak="" translate="">Case.PerformanceBadge</span>
                            <span ng-if="casesController.CheckStrategicBadge(request)" class="Strategic-badge" ng-cloak="" translate="">Case.IsStrategic</span>
                        </td>
                        <td class="col-dynamic-1">{{request.RequestData.SupportAreaName}}</td>
                        <td class="col-dynamic-2">{{request.CompanyName}}</td>
                        <td class="col-md-1">{{request.RequestData.ExtensionAttributes.TenantCountryCode}}</td>
                        <td class="col-md-1">{{request.RequestData.UserLcid | lcidToLanguageDisplayName}}</td>
                        <td ng-if="casesController.ShowMultiSelectFilters &amp;&amp; columnName === 'SeverityDisplay'" class="col-md-1">
                            {{request.SeverityDisplay}}
                            <span ng-if="request.Is24X7OptedIn" translate="">Case.24x7</span>
                        </td>
                        <td class="col-dynamic-1">{{request.Theme}}</td>
                        <td class="col-dynamic-3">
                            <div class="break-sentence" readmore="" readmore-text="request.RequestData.UserDescription" readmore-caption="…" readmore-less-caption="{{'Common.ShowLess' | translate}}" readmore-length="100"></div>
                            <div class="case-tranferjustification" ng-if="!request.RequestData.PartnerComment &amp;&amp; request.SameProgramTransferJustification">{{request.SameProgramTransferJustification}}</div>
                            <div class="case-tranferjustification" ng-if="request.RequestData.PartnerComment">{{request.RequestData.PartnerComment}}</div>
                        </td>
                        <td class="col-dynamic-2">{{casesController.GetTimeUnassingned(request.RequestData.CreateDateTime)}}</td>
                        <td class="col-dynamic-1" scope="row">
                            <button type="submit" class="btn btn-success btn-md" ng-click="casesController.Accept(request)" ng-if="casesController.IsAcceptAllowed(request)" click-tracking="" tracking-name="AcceptCaseButtonClicked" tracking-tag-id="433064"><span translate="">Cases.Accept</span></button>
                        </td>
                        <td class="col-dynamic-1" ng-if="!casesController.IsDefaultUnassignedColumn(columnName)">
                            <dynamic-column column-name="columnName" request="request" type="'1'" parent-controller="casesController" header="false">
                        </dynamic-column></td>
                    </tr>
            </tbody>
        </table>
        <ui-pagination ng-if="casesController.TotalUnackRequestsCount" total-items="casesController.TotalUnackRequestsCount" items-per-page="casesController.ItemsPerPage" max-paging-buttons="casesController.MaxPagingButtons" current-page="casesController.CurrentUnackPage" on-page-change="casesController.GetUnacceptedRequests(true, newPage)" aria-disabled="true"></ui-pagination>
    </div>
    `

    var unassignedRequestTemplate = `
    <div id="unassigned-critsit" class="admin admin-panel scrolling-table-container" ng-controller="CaseController as caseController">
        <table id="casesList" class="table table-hover">
            <thead id="unassigned-sort-headers">
                    <tr>
                        <th class="col-dynamic-1" axis="Create Date" ui-sort="" sort-by="'RequestData.CreateDateTime'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse" scope="col"><span translate="">Cases.CreateDate</span></th>
                        <th class="col-dynamic-1" ui-sort="" sort-by="'RequestData.SupportAreaName'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse" scope="col"><span translate="">Cases.SupportArea</span> / <span translate="">Cases.ScenarioName</span></th>
                        <th class="col-dynamic-1" ui-sort="" sort-by="'RequestData.ExtensionAttributes.TenantCountryCode'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse" scope="col"><span translate="">Cases.Country</span> / User Phone</th>
                        <th class="col-dynamic-1" ui-sort="" sort-by="'RequestData.ParatureTicketNumber'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse" scope="col"><span translate="">Cases.CaseNumber</span></th>
                        <th class="col-dynamic-2" ui-sort="" sort-by="'CompanyName'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse" scope="col"><span translate="">Cases.UnackCompanyName</span></th>
                        <th class="col-dynamic-1" ui-sort="" sort-by="'RequestData.UserLcid'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse" scope="col"><span translate="">Cases.Language</span></th>
                        <th ng-if="casesController.ShowMultiSelectFilters  &amp;&amp; columnName === 'SeverityDisplay'" class="col-dynamic-1" scope="col" ui-sort="" sort-by="'SeverityDisplay'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse"><span translate="">Case.Severity.Severity</span></th>
                        <th class="col-dynamic-3" scope="col" ui-sort="" sort-by="'RequestData.UserDescription'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse"><span translate="">Cases.Description</span></th>
                        <th class="col-dynamic-1" scope="col" ui-sort="" sort-by="'RequestData.CreateDateTime'" sort-function="casesController.OnUnassignedCasesSort(by, reverse)" current-page="Cases" sort-list="casesController.UnacceptedRequests" current-sort-by="casesController.SortBy" sort-reverse="casesController.SortReverse"><span translate="">Cases.TimeUnassigned</span></th>
                    </tr>
            </thead>
            <tbody>
                    <tr ng-repeat="request in casesController.UnacceptedRequests track by request.RequestData.RequestId" ng-if="request.IsCritSit == false && 'AU,BN,BD,CN,FJ,HK,ID,KH,KP,LA,LK,MM,MO,MY,NP,NZ,PH,PG,SG,TH,TW,VN,PK'.includes(request.RequestData.ExtensionAttributes.TenantCountryCode)" class="{{casesController.GetRowCss(request)}}" title="{{casesController.GetRowTooltips(request)}}">
                        <td class="col-dynamic-1">{{request.RequestData.CreateDateTime | date : 'MMM d, y h:mm a'}}</td>
                        <td class="col-dynamic-1">
                            <span>{{request.RequestData.SupportAreaName}}</span><br>
                            <span>{{request.Theme}}</span>
                        </td>
                        <td class="col-md-1">
                            <span>{{request.RequestData.ExtensionAttributes.TenantCountryCode}}</span><br>
                            <span>{{request.RequestData.UserPhone}}</span>
                        </td>
                        <td class="col-dynamic-1" scope="row">
                                <a ng-click="casesController.OpenRequest(request, $event)" ng-href="/cases/{{request.RequestData.RequestId}}" click-tracking="" tracking-name="OpenRequestLinkClicked" tracking-tag-id="433065">{{request.RequestData | caseNumber}}</a><br>
                            <span class="ptsolve ms-Icon-FullMDL ms-Icon-FullMDL--Diamond" ng-if="request.IsPremierEscalation" translate-attr="{ title: 'Cases.Cases.PTSolveEscalation' }"></span>
                            <span ng-if="request.IsCritSit" class="modality-critsit" translate="">Case.Severity.Critsit</span>
                            <span ng-if="request.RequestData.NudgeState &amp;&amp; request.RequestData.NudgeState == 'Nudge'" class="nudged-breadcrumb" ng-cloak="" translate="">Case.Nudge.Badge</span>
                            <span ng-if="request.IsMissonCritical" class="modality-smc" ng-cloak="" translate-attr="{ title: 'Case.MissionCritical.Details' }" translate="">Case.MissionCritical.Badge</span>
                            <span ng-if="request.IsTier3" class="modality-tier3" ng-cloak="" translate="">Case.IsTier3</span>
                            <span ng-if="request.IsEnterpriseCloudTenant" class="oed-badge" ng-cloak="" translate="">Case.EngineeringDirect.Badge</span>
                            <span ng-if="request.RequestData.CustomerCallbackDateTime" class="customercb-breadcrumb" translate="">Case.AmbassadorCallback.BadgeCustomerCB</span>
                            <span ng-if="casesController.CheckPerformanceBadge(request)" class="Performance-badge" ng-cloak="" translate="">Case.PerformanceBadge</span>
                            <span ng-if="casesController.CheckStrategicBadge(request)" class="Strategic-badge" ng-cloak="" translate="">Case.IsStrategic</span>
                        </td>

                        <td class="col-dynamic-2">{{request.CompanyName}}</td>
                        <td class="col-md-1">{{request.RequestData.UserLcid | lcidToLanguageDisplayName}}</td>
                        <td ng-if="casesController.ShowMultiSelectFilters &amp;&amp; columnName === 'SeverityDisplay'" class="col-md-1">
                            {{request.SeverityDisplay}}
                            <span ng-if="request.Is24X7OptedIn" translate="">Case.24x7</span>
                        </td>
                        <td class="col-dynamic-3">
                            <div class="break-sentence" readmore="" readmore-text="request.RequestData.UserDescription" readmore-caption="…" readmore-less-caption="{{'Common.ShowLess' | translate}}" readmore-length="100"></div>
                            <div class="case-tranferjustification" ng-if="!request.RequestData.PartnerComment &amp;&amp; request.SameProgramTransferJustification">{{request.SameProgramTransferJustification}}</div>
                            <div class="case-tranferjustification" ng-if="request.RequestData.PartnerComment">{{request.RequestData.PartnerComment}}</div>
                        </td>
                        <td class="col-dynamic-2">{{casesController.GetTimeUnassingned(request.RequestData.CreateDateTime)}}</td>
                    </tr>
            </tbody>
        </table>
   </div>
    `
    var executeOrDelayUntilConditionMeet = function (condition, callback, count=1) {
        var timeout = 25;
        setTimeout(function(){
            if (condition()) {
                callback();
            } else {
                executeOrDelayUntilConditionMeet(condition, callback, count++);
            }
        }, timeout*count);
    }

    var AddUnassignedCritsit = function () {
        var init = function () {
            executeOrDelayUntilConditionMeet(
                function () {
                    return $('#casesList').length && $('div[class="admin admin-queue ng-scope"]').length
                },
                function(){
                    AddUnassignedCritsit().exec()
                }
            )
        }
        var exec = function () {
            //credit: https://www.coder.work/article/6861724
            angular.element($('div[class="view-container ng-scope"]')).injector().invoke(function($compile) {
                var scope = angular.element($(".cases-list")).scope()
                var compiledCritsitContent = $compile(unassignedCritsitTemplate)(scope)
                var compiledRequestContent = $compile(unassignedRequestTemplate)(scope)
                $('#unassigned-apac-pane').append(compiledCritsitContent)
                $('#unassigned-apac-pane').append(compiledRequestContent)
            });
        }
        return {
            'init': init,
            'exec': exec
        }
    }

    var MonitorUnassigned = function () {
        var init = function () {
            executeOrDelayUntilConditionMeet(
                function () {
                    return $('#casesList').length && $('#refresh-cases-btn').length
                },
                function(){
                    $(".cases-list").append(unassignedTabTemplate)
                    $(".cases-list div").first().detach().appendTo($('#unassigned-all-pane'))
                    //$('div[class="admin admin-queue ng-scope"]').prepend(unassignedTabTemplate)
                    //$('#unassigned-all-pane').prepend(compiledCritsitContent)
                    MonitorUnassigned().exec()
                    //$('#refresh-cases-btn').before('<a href="" class="sync-container rave-container pull-right padding-top-0" id="auto-refresh-cases-btn" onclick="RaveMonitor.start()"><i class="ms-Icon-FullMDL ms-Icon-FullMDL--LEDLight"></i><span translate-cloak="" translate="" class="ng-scope">Case Monitor</span></a>')
                }
            )
        }
        var exec = function () {
            var homeController = angular.element($('#raveMainApp')).data().$scope.homeController
            homeController.Refresh()
            var casesController = angular.element($(".cases-list")).scope().casesController
            // ["All", "DeveloperSharepoint", "enterprise", "EnterpriseOneDrive", "EnterpriseSharePoint", "EnterpriseSharePointOnPrem", "MicrosoftGraph", "OnPremS500", "S500"]
            casesController.SelectedUnackSupportAreas = ["MicrosoftGraph", "EnterpriseOneDrive"]
            // casesController.RefreshSupplierFilterState(casesController.SelectedUnackSupportAreas, null
            casesController.ItemsPerPage = 500
            setTimeout(function(){
                homeController.Refresh()
            }, 30000);
        }
        var activeTab = function (area) {
            switch (area) {
                case 'apac':
                    document.getElementById('unassigned-apac-tab').classList.add('active')
                    document.getElementById("unassigned-apac-pane").classList.add('active')
                    document.getElementById("unassigned-all-tab").classList.remove('active')
                    document.getElementById("unassigned-all-pane").classList.remove('active')
                    break;
                case 'all':
                    document.getElementById('unassigned-apac-tab').classList.remove('active')
                    document.getElementById("unassigned-apac-pane").classList.remove('active')
                    document.getElementById("unassigned-all-tab").classList.add('active')
                    document.getElementById("unassigned-all-pane").classList.add('active')
                    break;
                default:
            }
        }
        return {
            'init': init,
            'exec': exec,
            'activeTab': activeTab
        }
    }
    var appInit = function () {
        switch (top.location.hostname) {
            case 'rave.office.net':
                if (true === top.location.pathname.startsWith('/cases/unassigned')) {
                    MonitorUnassigned().init()
                    AddUnassignedCritsit().init()
                }
                break;
            default:
        }
    }

    window.RaveMonitor = {
        "start": MonitorUnassigned().exec,
        "activeTab": MonitorUnassigned().activeTab
    };

    appInit()
    //setInterval(appInit, 100);
})();