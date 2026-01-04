// ==UserScript==
// @name         HDP Comment Fixer
// @namespace    https://dtpli.sharepoint.com/SITES/MMRA
// @version      1.5.2
// @description  Properly loads all comments and improves Request filtering in HelpDeskPlus.
// @require      http://code.jquery.com/jquery-1.10.2.min.js
// @author       Sean Cain
// @match        https://dtpli-30abf908a5e3e6.sharepoint.com/sites/MMRA-HelpDesk/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/398191/HDP%20Comment%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/398191/HDP%20Comment%20Fixer.meta.js
// ==/UserScript==

'use strict';
var $ = window.$; // suppress jquery syntax errors

$(document).ready(function() {

    // Using a combination of "@run-at document-start" and "$(document).ready()", we can run our script after all other scripts are loaded, but before they are run.

    if (window.ReportsRequests && window.ReportsRequests.getRequests) { // Only overwrite if exists

        var filterByMultiSelect = function(selected, fieldName) {
            var odataQuery = "";
            if (selected != null) {
                for (var i = 0; i < selected.length; i++) {
                    odataQuery += fieldName + " eq '" + selected[i] + "' ";
                    if (i < selected.length - 1) {
                        odataQuery += " or "
                    }
                }
            }
            return odataQuery
        }

        var filterByListMode = function(currentMode, fieldName) {
            var odataQuery = "";
            if (currentMode != null) {
                for (var i = 0; i < currentMode.length; i++) {
                    odataQuery += fieldName + " eq '" + currentMode[i].Id + "' ";
                    if (i < currentMode.length - 1) {
                        odataQuery += " or "
                    }
                }
            }
            return odataQuery
        }

        window.ReportsRequests.getRequests = function(v, t, u, C)
        {

            var s = window.reqLimiterFilter;
            if ($.trim($("#txtID").val()).length > 0 && $.isNumeric($("#txtID").val())) {
                s = "Id eq " + $("#txtID").val() + " and "
            }
            var z = $("#txtStartDate").val().StripTags();
            var p = $("#txtEndDate").val().StripTags();
            if (window.moment(z).isValid() == false || window.moment(p).isValid() == false) {
                window.addMessage("Incorrect date format in date filter", "error");
                return false
            }
            var o = "(Created ge datetime'" + z + "T00%3a00%3a00') and (Created le datetime'" + p + "T23%3a59%3a00') ";
            var x = "";
            if ($.trim($("#txtRequesterName").val()).length > 0) {
                x = " and substringof('" + $("#txtRequesterName").val().StripTags() + "',RequesterName) "
            }
            var B = "";
            if ($.trim($("#txtTitle").val()).length > 0) {
                B = " and substringof('" + $("#txtTitle").val().StripTags() + "',Title) "
            }
            var A = "";
            if ($("#chblStatus").val() != null) {
                A = " and (" + filterByMultiSelect($("#chblStatus").val(), "Status") + ") "
            }

            var y;
            var D = "";
            if (u == "My") {
                D = " and (" + (C.length > 0 ? filterByListMode(C, "RequestTemplateId") : "RequestTemplateId eq '0'") + ") "
            }
            var n = "";
            if ($("#chblAssignee").val() != null) {
                n = " and (" + filterByMultiSelect($("#chblAssignee").val(), "AssigneeName") + ") "
            }
            var m = "";
            if ($.trim($("#txtAnyField").val()).length > 0) {
                var l = "substringof('" + $("#txtAnyField").val().StripTags() + "',Title) or ";
                for (var r = 1; r < 21; r++) {
                    l += " substringof('" + $("#txtAnyField").val().StripTags() + "',CustomField" + r + ")" + (r < 20 ? " or " : "")
                }
                m = " and (" + l + ") "
            }

            var q = s + o + x + B + A + D + n + m;

            var w = window.appweburl + "/_vti_bin/ListData.svc/Requests/?$filter=" + q + "&$inlinecount=allpages&$select=Id,Created,RequesterName,AssigneeName,Type,Title,Status,RequestTemplateId,ResolutionDate," +
                "ClosedDate,ResolutionDuration,ResolutionTime,CustomField1&$orderby=" + t.jtSorting.replace(" DESC", " desc").replace(" ASC", " asc") + "&$skip=" + t.jtStartIndex + "&$top=" + t.jtPageSize;

            return $.Deferred(function(E) {
                $.ajax({
                    url: w,
                    type: "GET",
                    headers: {
                        accept: "application/json;odata=verbose"
                    },
                    dataType: "json",
                    data: v,
                    cache: false,
                    success: function(F) {
                        y = {
                            Result: "OK",
                            Records: F.d.results,
                            TotalRecordCount: F.d.__count
                        };
                        E.resolve(y)
                    },
                    error: function() {
                        E.reject()
                    }
                })
            })
        }
    }

    if (window.Comments && window.Comments.readAll) { // Only overwrite if exists
        window.Comments.readAll = function(reqId) {
            var results;
            return $.Deferred(function(response) {
                $.ajax({
                    // url: appweburl + "/_api/Web/lists/getbytitle('Comments')/items?$select=ID,Created,Author/Id,Author/Title,CommentText,RequestID&$expand=Author/Title,Author/Id&$filter=" + comLimiterFilter + "RequestID eq '" + reqId + "'",
                    url: window.appweburl + "/_api/Web/lists/getbytitle('Comments')/items?$select=ID,Created,Author/Id,Author/Title,CommentText,RequestID&$expand=Author/Title,Author/Id&$filter=RequestID eq '" + reqId + "'",
                    type: "GET",
                    headers: {
                        accept: "application/json;odata=verbose"
                    },
                    dataType: "json",
                    cache: false,
                    success: function(data) {
                        results = {
                            Result: "OK",
                            Records: data.d.results
                        };
                        response.resolve(results)
                    },
                    error: function() {
                        response.reject()
                    }
                })
            })
        }
    }
});