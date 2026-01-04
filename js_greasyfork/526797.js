// ==UserScript==
// @name         SC prototype for 150+ columns
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Intercept metadata/api/v1/columns and ca/metricdata/api/v1/metricdata API calls and modify responses
// @author       custom-analytics
// @match        https://*.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526797/SC%20prototype%20for%20150%2B%20columns.user.js
// @updateURL https://update.greasyfork.org/scripts/526797/SC%20prototype%20for%20150%2B%20columns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Additional columns to be added
    const additionalColumns = [
  {
    "columnId": "ListingStatus",
    "description": "The status of the listing ASIN such as Active ect.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Listing Status",
      "sourceTable": "N/A",
      "label": "Listing Status"
    },
    "enhancedColumn": {
      "metricId": "ListingStatus",
      "parentMetricId": null,
      "metricName": "Listing Status",
      "metricAlias": null,
      "businessDefinition": "The status of the listing ASIN such as Active ect.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Listing Status",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Listing",
    "description": "Listing title. Listing title. This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Listing",
      "sourceTable": "N/A",
      "label": "Listing"
    },
    "enhancedColumn": {
      "metricId": "Listing",
      "parentMetricId": null,
      "metricName": "Listing",
      "metricAlias": null,
      "businessDefinition": "Listing title. Listing title. This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Listing",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "ASIN",
    "description": "This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "ASIN",
      "sourceTable": "N/A",
      "label": "ASIN"
    },
    "enhancedColumn": {
      "metricId": "ASIN",
      "parentMetricId": null,
      "metricName": "ASIN",
      "metricAlias": null,
      "businessDefinition": "This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "ASIN",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "ParentASIN",
    "description": "This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Parent ASIN",
      "sourceTable": "N/A",
      "label": "Parent ASIN"
    },
    "enhancedColumn": {
      "metricId": "ParentASIN",
      "parentMetricId": null,
      "metricName": "Parent ASIN",
      "metricAlias": null,
      "businessDefinition": "This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Parent ASIN",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "SKU",
    "description": "This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "SKU",
      "sourceTable": "N/A",
      "label": "SKU"
    },
    "enhancedColumn": {
      "metricId": "SKU",
      "parentMetricId": null,
      "metricName": "SKU",
      "metricAlias": null,
      "businessDefinition": "This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "SKU",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "ParentSKU",
    "description": "This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Parent SKU",
      "sourceTable": "N/A",
      "label": "Parent SKU"
    },
    "enhancedColumn": {
      "metricId": "ParentSKU",
      "parentMetricId": null,
      "metricName": "Parent SKU",
      "metricAlias": null,
      "businessDefinition": "This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Parent SKU",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Sales",
    "description": "Last 30 days GMS considering returns This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Sales",
      "sourceTable": "N/A",
      "label": "Sales"
    },
    "enhancedColumn": {
      "metricId": "Sales",
      "parentMetricId": null,
      "metricName": "Sales",
      "metricAlias": null,
      "businessDefinition": "Last 30 days GMS considering returns This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Sales",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "UnitsSold",
    "description": "Last 30 days units sold Last 30 days units sold This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Units Sold",
      "sourceTable": "N/A",
      "label": "Units Sold"
    },
    "enhancedColumn": {
      "metricId": "UnitsSold",
      "parentMetricId": null,
      "metricName": "Units Sold",
      "metricAlias": null,
      "businessDefinition": "Last 30 days units sold Last 30 days units sold This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Units Sold",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "PageViews",
    "description": "Last 30 days Glance views Last 30 days Glance views This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Page Views",
      "sourceTable": "N/A",
      "label": "Page Views"
    },
    "enhancedColumn": {
      "metricId": "PageViews",
      "parentMetricId": null,
      "metricName": "Page Views",
      "metricAlias": null,
      "businessDefinition": "Last 30 days Glance views Last 30 days Glance views This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Page Views",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "SalesRank",
    "description": "Sales rank is calculated based on all-time sales of an ASIN/Product where recent sales are weighted more than older sales. Sales rank is calculated based on all-time sales of an ASIN/Product where recent sales are weighted more than older sales. This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Sales Rank",
      "sourceTable": "N/A",
      "label": "Sales Rank"
    },
    "enhancedColumn": {
      "metricId": "SalesRank",
      "parentMetricId": null,
      "metricName": "Sales Rank",
      "metricAlias": null,
      "businessDefinition": "Sales rank is calculated based on all-time sales of an ASIN/Product where recent sales are weighted more than older sales. Sales rank is calculated based on all-time sales of an ASIN/Product where recent sales are weighted more than older sales. This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Sales Rank",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "AvailableUnits",
    "description": "Available units is an important metric as it tells you how many of your products are actually selling. A high sellable units value means a lot of your products are being purchased This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Available Units",
      "sourceTable": "N/A",
      "label": "Available Units"
    },
    "enhancedColumn": {
      "metricId": "AvailableUnits",
      "parentMetricId": null,
      "metricName": "Available Units",
      "metricAlias": null,
      "businessDefinition": "Available units is an important metric as it tells you how many of your products are actually selling. A high sellable units value means a lot of your products are being purchased This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Available Units",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "InboundUnits",
    "description": "Inbound units refers to the total number of units for a product that are in or on their way to fulfillment centers at the end of a week. Inbound units refers to the total number of units for a product that are in or on their way to fulfillment centers at the end of a week. This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Inbound Units",
      "sourceTable": "N/A",
      "label": "Inbound Units"
    },
    "enhancedColumn": {
      "metricId": "InboundUnits",
      "parentMetricId": null,
      "metricName": "Inbound Units",
      "metricAlias": null,
      "businessDefinition": "Inbound units refers to the total number of units for a product that are in or on their way to fulfillment centers at the end of a week. Inbound units refers to the total number of units for a product that are in or on their way to fulfillment centers at the end of a week. This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Inbound Units",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "UnfulfillableUnits",
    "description": "The number of units in stock that are not in a condition to sell or fulfill. They may be defective This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Unfulfillable Units",
      "sourceTable": "N/A",
      "label": "Unfulfillable Units"
    },
    "enhancedColumn": {
      "metricId": "UnfulfillableUnits",
      "parentMetricId": null,
      "metricName": "Unfulfillable Units",
      "metricAlias": null,
      "businessDefinition": "The number of units in stock that are not in a condition to sell or fulfill. They may be defective This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Unfulfillable Units",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "ReservedUnits",
    "description": "Inventory in reserved status might be tied to a customer order or set aside at a fulfillment center for additional processing. Inventory in reserved status might be tied to a customer order or set aside at a fulfillment center for additional processing. This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Reserved Units",
      "sourceTable": "N/A",
      "label": "Reserved Units"
    },
    "enhancedColumn": {
      "metricId": "ReservedUnits",
      "parentMetricId": null,
      "metricName": "Reserved Units",
      "metricAlias": null,
      "businessDefinition": "Inventory in reserved status might be tied to a customer order or set aside at a fulfillment center for additional processing. Inventory in reserved status might be tied to a customer order or set aside at a fulfillment center for additional processing. This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Reserved Units",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Price",
    "description": "Current listing price Current listing price This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Price",
      "sourceTable": "N/A",
      "label": "Price"
    },
    "enhancedColumn": {
      "metricId": "Price",
      "parentMetricId": null,
      "metricName": "Price",
      "metricAlias": null,
      "businessDefinition": "Current listing price Current listing price This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Price",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "TotalFeesperUnit",
    "description": "Referral fee + closing fee + service fee + FBA fee Referral fee + closing fee + service fee + FBA fee This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Total Fees per Unit",
      "sourceTable": "N/A",
      "label": "Total Fees per Unit"
    },
    "enhancedColumn": {
      "metricId": "TotalFeesperUnit",
      "parentMetricId": null,
      "metricName": "Total Fees per Unit",
      "metricAlias": null,
      "businessDefinition": "Referral fee + closing fee + service fee + FBA fee Referral fee + closing fee + service fee + FBA fee This metrics is surfaced on the Manage Your Inventory (MYI) of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Total Fees per Unit",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "FNSKU",
    "description": "A unique identifier assigned to products stored in Amazon fulfillment centers. i.e X00000E5TX A unique identifier assigned to products stored in Amazon fulfillment centers. i.e X00000E5TX This metrics is surfaced on the FBA Inventory of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "FNSKU",
      "sourceTable": "N/A",
      "label": "FNSKU"
    },
    "enhancedColumn": {
      "metricId": "FNSKU",
      "parentMetricId": null,
      "metricName": "FNSKU",
      "metricAlias": null,
      "businessDefinition": "A unique identifier assigned to products stored in Amazon fulfillment centers. i.e X00000E5TX A unique identifier assigned to products stored in Amazon fulfillment centers. i.e X00000E5TX This metrics is surfaced on the FBA Inventory of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "FNSKU",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "SKU",
    "description": "The SKU is the merchant-assigned string to identify a particular product. A custom product identifier. i.e.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "SKU",
      "sourceTable": "N/A",
      "label": "SKU"
    },
    "enhancedColumn": {
      "metricId": "SKU",
      "parentMetricId": null,
      "metricName": "SKU",
      "metricAlias": null,
      "businessDefinition": "The SKU is the merchant-assigned string to identify a particular product. A custom product identifier. i.e.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "SKU",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "UPC",
    "description": "A UPC is a standard product identifier to help you sell your product. A UPC is a standard product identifier to help you sell your product. This metrics is surfaced on the FBA Inventory of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "UPC",
      "sourceTable": "N/A",
      "label": "UPC"
    },
    "enhancedColumn": {
      "metricId": "UPC",
      "parentMetricId": null,
      "metricName": "UPC",
      "metricAlias": null,
      "businessDefinition": "A UPC is a standard product identifier to help you sell your product. A UPC is a standard product identifier to help you sell your product. This metrics is surfaced on the FBA Inventory of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "UPC",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "EAN",
    "description": "An EAN is a type of product identifier used specifically for products for the European marketplace. This product identifier is also referred to as an international article number. An EAN is a type of product identifier used specifically for products for the European marketplace. This product identifier is also referred to as an international article number. This metrics is surfaced on the FBA Inventory of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "EAN",
      "sourceTable": "N/A",
      "label": "EAN"
    },
    "enhancedColumn": {
      "metricId": "EAN",
      "parentMetricId": null,
      "metricName": "EAN",
      "metricAlias": null,
      "businessDefinition": "An EAN is a type of product identifier used specifically for products for the European marketplace. This product identifier is also referred to as an international article number. An EAN is a type of product identifier used specifically for products for the European marketplace. This product identifier is also referred to as an international article number. This metrics is surfaced on the FBA Inventory of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "EAN",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "UnitsSoldLast90days",
    "description": "Units Sold Last 90 days Units Sold Last 90 days This metrics is surfaced on the FBA Inventory of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Units Sold Last 90 days",
      "sourceTable": "N/A",
      "label": "Units Sold Last 90 days"
    },
    "enhancedColumn": {
      "metricId": "UnitsSoldLast90days",
      "parentMetricId": null,
      "metricName": "Units Sold Last 90 days",
      "metricAlias": null,
      "businessDefinition": "Units Sold Last 90 days Units Sold Last 90 days This metrics is surfaced on the FBA Inventory of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Units Sold Last 90 days",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "SalesLast90days",
    "description": "Sales Last 90 days Sales Last 90 days This metrics is surfaced on the FBA Inventory of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Sales Last 90 days",
      "sourceTable": "N/A",
      "label": "Sales Last 90 days"
    },
    "enhancedColumn": {
      "metricId": "SalesLast90days",
      "parentMetricId": null,
      "metricName": "Sales Last 90 days",
      "metricAlias": null,
      "businessDefinition": "Sales Last 90 days Sales Last 90 days This metrics is surfaced on the FBA Inventory of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Sales Last 90 days",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Low-inventory-levelfee",
    "description": "Identify products with consistently low inventory relative to sales over a 90-day period. Low-inventory-level fee is applied on standard-size products with historical days of supply less than 28 days. Identify products with consistently low inventory relative to sales over a 90-day period. Low-inventory-level fee is applied on standard-size products with historical days of supply less than 28 days. This metrics is surfaced on the FBA Inventory of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Low-inventory-level fee",
      "sourceTable": "N/A",
      "label": "Low-inventory-level fee"
    },
    "enhancedColumn": {
      "metricId": "Low-inventory-levelfee",
      "parentMetricId": null,
      "metricName": "Low-inventory-level fee",
      "metricAlias": null,
      "businessDefinition": "Identify products with consistently low inventory relative to sales over a 90-day period. Low-inventory-level fee is applied on standard-size products with historical days of supply less than 28 days. Identify products with consistently low inventory relative to sales over a 90-day period. Low-inventory-level fee is applied on standard-size products with historical days of supply less than 28 days. This metrics is surfaced on the FBA Inventory of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Low-inventory-level fee",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "AvailableUnits",
    "description": "Available units is an important metric as it tells you how many of your products are actually selling. A high sellable units value means a lot of your products are being purchased This metrics is surfaced on the FBA Inventory of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Available Units",
      "sourceTable": "N/A",
      "label": "Available Units"
    },
    "enhancedColumn": {
      "metricId": "AvailableUnits",
      "parentMetricId": null,
      "metricName": "Available Units",
      "metricAlias": null,
      "businessDefinition": "Available units is an important metric as it tells you how many of your products are actually selling. A high sellable units value means a lot of your products are being purchased This metrics is surfaced on the FBA Inventory of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Available Units",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "InboundUnits",
    "description": "Inbound units refers to the total number of units for a product that are in or on their way to fulfillment centers at the end of a week. Inbound units refers to the total number of units for a product that are in or on their way to fulfillment centers at the end of a week. This metrics is surfaced on the FBA Inventory of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Inbound Units",
      "sourceTable": "N/A",
      "label": "Inbound Units"
    },
    "enhancedColumn": {
      "metricId": "InboundUnits",
      "parentMetricId": null,
      "metricName": "Inbound Units",
      "metricAlias": null,
      "businessDefinition": "Inbound units refers to the total number of units for a product that are in or on their way to fulfillment centers at the end of a week. Inbound units refers to the total number of units for a product that are in or on their way to fulfillment centers at the end of a week. This metrics is surfaced on the FBA Inventory of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Inbound Units",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "UnfulfillableUnits",
    "description": "The number of units in stock that are not in a condition to sell or fulfill. They may be defective This metrics is surfaced on the FBA Inventory of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Unfulfillable Units",
      "sourceTable": "N/A",
      "label": "Unfulfillable Units"
    },
    "enhancedColumn": {
      "metricId": "UnfulfillableUnits",
      "parentMetricId": null,
      "metricName": "Unfulfillable Units",
      "metricAlias": null,
      "businessDefinition": "The number of units in stock that are not in a condition to sell or fulfill. They may be defective This metrics is surfaced on the FBA Inventory of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Unfulfillable Units",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "ReservedUnits",
    "description": "Inventory in reserved status might be tied to a customer order or set aside at a fulfillment center for additional processing. Inventory in reserved status might be tied to a customer order or set aside at a fulfillment center for additional processing. This metrics is surfaced on the FBA Inventory of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Reserved Units",
      "sourceTable": "N/A",
      "label": "Reserved Units"
    },
    "enhancedColumn": {
      "metricId": "ReservedUnits",
      "parentMetricId": null,
      "metricName": "Reserved Units",
      "metricAlias": null,
      "businessDefinition": "Inventory in reserved status might be tied to a customer order or set aside at a fulfillment center for additional processing. Inventory in reserved status might be tied to a customer order or set aside at a fulfillment center for additional processing. This metrics is surfaced on the FBA Inventory of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Reserved Units",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "InventoryHealthStatus",
    "description": "The inventory health status based on evaluating the sellable on-hand quantity versus the recommended minimum level and estimated excess units. Healthy: Your available on-hand inventory is at the optimal level This metrics is surfaced on the FBA Inventory of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Inventory Health Status",
      "sourceTable": "N/A",
      "label": "Inventory Health Status"
    },
    "enhancedColumn": {
      "metricId": "InventoryHealthStatus",
      "parentMetricId": null,
      "metricName": "Inventory Health Status",
      "metricAlias": null,
      "businessDefinition": "The inventory health status based on evaluating the sellable on-hand quantity versus the recommended minimum level and estimated excess units. Healthy: Your available on-hand inventory is at the optimal level This metrics is surfaced on the FBA Inventory of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Inventory Health Status",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "FBAOn-handUnits",
    "description": "The number of sellable units available in-stock or in-transit within Amazon Fulfillment Network. On-hand = Available + FC-transfer The number of sellable units available in-stock or in-transit within Amazon Fulfillment Network. On-hand = Available + FC-transfer This metrics is surfaced on the FBA Inventory of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "FBA On-hand Units",
      "sourceTable": "N/A",
      "label": "FBA On-hand Units"
    },
    "enhancedColumn": {
      "metricId": "FBAOn-handUnits",
      "parentMetricId": null,
      "metricName": "FBA On-hand Units",
      "metricAlias": null,
      "businessDefinition": "The number of sellable units available in-stock or in-transit within Amazon Fulfillment Network. On-hand = Available + FC-transfer The number of sellable units available in-stock or in-transit within Amazon Fulfillment Network. On-hand = Available + FC-transfer This metrics is surfaced on the FBA Inventory of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "FBA On-hand Units",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "FBARecommendedmin.level(units)",
    "description": "To help us keep your inventory closer to customers yet it does not guarantee fee avoidance.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "FBA Recommended min. level (units)",
      "sourceTable": "N/A",
      "label": "FBA Recommended min. level (units)"
    },
    "enhancedColumn": {
      "metricId": "FBARecommendedmin.level(units)",
      "parentMetricId": null,
      "metricName": "FBA Recommended min. level (units)",
      "metricAlias": null,
      "businessDefinition": "To help us keep your inventory closer to customers yet it does not guarantee fee avoidance.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "FBA Recommended min. level (units)",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Estimatedexcessunits",
    "description": "Estimated excess are units for which we forecast that it will likely cost you more to keep in stock and pay storage costs than to reduce by advertising or removing.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Estimated excess units",
      "sourceTable": "N/A",
      "label": "Estimated excess units"
    },
    "enhancedColumn": {
      "metricId": "Estimatedexcessunits",
      "parentMetricId": null,
      "metricName": "Estimated excess units",
      "metricAlias": null,
      "businessDefinition": "Estimated excess are units for which we forecast that it will likely cost you more to keep in stock and pay storage costs than to reduce by advertising or removing.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Estimated excess units",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Inventoryage",
    "description": "Inventory age shows the age of your in-stock units. Inventory age units = available + reserved - pending removal units. Note: Inventory Age is captured daily whereas Available units are captured in real time. Hence 61-90",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Inventory age",
      "sourceTable": "N/A",
      "label": "Inventory age"
    },
    "enhancedColumn": {
      "metricId": "Inventoryage",
      "parentMetricId": null,
      "metricName": "Inventory age",
      "metricAlias": null,
      "businessDefinition": "Inventory age shows the age of your in-stock units. Inventory age units = available + reserved - pending removal units. Note: Inventory Age is captured daily whereas Available units are captured in real time. Hence 61-90",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Inventory age",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Estimatedagedinventorysurcharge",
    "description": "The estimated number of units that will be subject to aged inventory surcharge (if applicable) on your next charge date go to aged inventory surcharge help document.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Estimated aged inventory surcharge",
      "sourceTable": "N/A",
      "label": "Estimated aged inventory surcharge"
    },
    "enhancedColumn": {
      "metricId": "Estimatedagedinventorysurcharge",
      "parentMetricId": null,
      "metricName": "Estimated aged inventory surcharge",
      "metricAlias": null,
      "businessDefinition": "The estimated number of units that will be subject to aged inventory surcharge (if applicable) on your next charge date go to aged inventory surcharge help document.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Estimated aged inventory surcharge",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Estimatedfeeperunitsold",
    "description": "Estimate FBA fee per unit sold Estimate FBA fee per unit sold This metrics is surfaced on the FBA Inventory of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Estimated fee per unit sold",
      "sourceTable": "N/A",
      "label": "Estimated fee per unit sold"
    },
    "enhancedColumn": {
      "metricId": "Estimatedfeeperunitsold",
      "parentMetricId": null,
      "metricName": "Estimated fee per unit sold",
      "metricAlias": null,
      "businessDefinition": "Estimate FBA fee per unit sold Estimate FBA fee per unit sold This metrics is surfaced on the FBA Inventory of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Estimated fee per unit sold",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Recommendedaction",
    "description": "FBA recommend actions:  X Estimated excess units; X Recommended ship-in days; X Recommended ship-in quantity FBA recommend actions:  X Estimated excess units; X Recommended ship-in days; X Recommended ship-in quantity This metrics is surfaced on the FBA Inventory of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Recommended action",
      "sourceTable": "N/A",
      "label": "Recommended action"
    },
    "enhancedColumn": {
      "metricId": "Recommendedaction",
      "parentMetricId": null,
      "metricName": "Recommended action",
      "metricAlias": null,
      "businessDefinition": "FBA recommend actions:  X Estimated excess units; X Recommended ship-in days; X Recommended ship-in quantity FBA recommend actions:  X Estimated excess units; X Recommended ship-in days; X Recommended ship-in quantity This metrics is surfaced on the FBA Inventory of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Recommended action",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Orders",
    "description": "This is your number of orders This is your number of orders This metrics is surfaced on the FBA Dashboard of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Orders",
      "sourceTable": "N/A",
      "label": "Orders"
    },
    "enhancedColumn": {
      "metricId": "Orders",
      "parentMetricId": null,
      "metricName": "Orders",
      "metricAlias": null,
      "businessDefinition": "This is your number of orders This is your number of orders This metrics is surfaced on the FBA Dashboard of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Orders",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "InventoryPerformanceIndex",
    "description": "The Inventory Performance Index is a metric to gauge your inventory performance over time. IPI score measures how efficient and productive you are in managing your FBA inventory. Multiple factors could influence your IPI score",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Inventory Performance Index",
      "sourceTable": "N/A",
      "label": "Inventory Performance Index"
    },
    "enhancedColumn": {
      "metricId": "InventoryPerformanceIndex",
      "parentMetricId": null,
      "metricName": "Inventory Performance Index",
      "metricAlias": null,
      "businessDefinition": "The Inventory Performance Index is a metric to gauge your inventory performance over time. IPI score measures how efficient and productive you are in managing your FBA inventory. Multiple factors could influence your IPI score",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Inventory Performance Index",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Excessinventorypercentage",
    "description": "i.e. Excess inventory: 33.04%; 1 SKU | 37 units",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Excess inventory percentage",
      "sourceTable": "N/A",
      "label": "Excess inventory percentage"
    },
    "enhancedColumn": {
      "metricId": "Excessinventorypercentage",
      "parentMetricId": null,
      "metricName": "Excess inventory percentage",
      "metricAlias": null,
      "businessDefinition": "i.e. Excess inventory: 33.04%; 1 SKU | 37 units",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Excess inventory percentage",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Strandedinventoryrate",
    "description": "i.e. Stranded inventory: 0%",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Stranded inventory rate",
      "sourceTable": "N/A",
      "label": "Stranded inventory rate"
    },
    "enhancedColumn": {
      "metricId": "Strandedinventoryrate",
      "parentMetricId": null,
      "metricName": "Stranded inventory rate",
      "metricAlias": null,
      "businessDefinition": "i.e. Stranded inventory: 0%",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Stranded inventory rate",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Opprtunities",
    "description": "Displays opportunities for FBA enrollment and international expansion. i.e. enroll in FBA or list in other marketplace",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Opprtunities",
      "sourceTable": "N/A",
      "label": "Opprtunities"
    },
    "enhancedColumn": {
      "metricId": "Opprtunities",
      "parentMetricId": null,
      "metricName": "Opprtunities",
      "metricAlias": null,
      "businessDefinition": "Displays opportunities for FBA enrollment and international expansion. i.e. enroll in FBA or list in other marketplace",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Opprtunities",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Outstandingshipmentproblems",
    "description": "Number of Outstanding shipment problems",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Outstanding shipment problems",
      "sourceTable": "N/A",
      "label": "Outstanding shipment problems"
    },
    "enhancedColumn": {
      "metricId": "Outstandingshipmentproblems",
      "parentMetricId": null,
      "metricName": "Outstanding shipment problems",
      "metricAlias": null,
      "businessDefinition": "Number of Outstanding shipment problems",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Outstanding shipment problems",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "ShipmentswithmissingtrackingIDs",
    "description": "Number of Shipments with missing tracking IDs",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Shipments with missing tracking IDs",
      "sourceTable": "N/A",
      "label": "Shipments with missing tracking IDs"
    },
    "enhancedColumn": {
      "metricId": "ShipmentswithmissingtrackingIDs",
      "parentMetricId": null,
      "metricName": "Shipments with missing tracking IDs",
      "metricAlias": null,
      "businessDefinition": "Number of Shipments with missing tracking IDs",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Shipments with missing tracking IDs",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Worki­ngshipm­ents",
    "description": "Number of Worki­ng shipm­ents",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Worki­ng shipm­ents",
      "sourceTable": "N/A",
      "label": "Worki­ng shipm­ents"
    },
    "enhancedColumn": {
      "metricId": "Worki­ngshipm­ents",
      "parentMetricId": null,
      "metricName": "Worki­ng shipm­ents",
      "metricAlias": null,
      "businessDefinition": "Number of Worki­ng shipm­ents",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Worki­ng shipm­ents",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "In-trans­itshipm­ents",
    "description": "Number of In-trans­it shipm­ents",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "In-trans­it shipm­ents",
      "sourceTable": "N/A",
      "label": "In-trans­it shipm­ents"
    },
    "enhancedColumn": {
      "metricId": "In-trans­itshipm­ents",
      "parentMetricId": null,
      "metricName": "In-trans­it shipm­ents",
      "metricAlias": null,
      "businessDefinition": "Number of In-trans­it shipm­ents",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "In-trans­it shipm­ents",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Atfulfi­llmentcente­r",
    "description": "Number of shipments at fulfillment center",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "At fulfi­llment cente­r",
      "sourceTable": "N/A",
      "label": "At fulfi­llment cente­r"
    },
    "enhancedColumn": {
      "metricId": "Atfulfi­llmentcente­r",
      "parentMetricId": null,
      "metricName": "At fulfi­llment cente­r",
      "metricAlias": null,
      "businessDefinition": "Number of shipments at fulfillment center",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "At fulfi­llment cente­r",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Close­dshipm­ents",
    "description": "Number of closed shipments",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Close­d shipm­ents",
      "sourceTable": "N/A",
      "label": "Close­d shipm­ents"
    },
    "enhancedColumn": {
      "metricId": "Close­dshipm­ents",
      "parentMetricId": null,
      "metricName": "Close­d shipm­ents",
      "metricAlias": null,
      "businessDefinition": "Number of closed shipments",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Close­d shipm­ents",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "AgedInventoryindays",
    "description": "Aged inventory in days by buckets in 0-180 271-365 and 365+",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Aged Inventory in days",
      "sourceTable": "N/A",
      "label": "Aged Inventory in days"
    },
    "enhancedColumn": {
      "metricId": "AgedInventoryindays",
      "parentMetricId": null,
      "metricName": "Aged Inventory in days",
      "metricAlias": null,
      "businessDefinition": "Aged inventory in days by buckets in 0-180 271-365 and 365+",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Aged Inventory in days",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Agedinventoryunitsbyageddays",
    "description": "Aged units by aged days ( 0-180 271-365 and 365+)",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Aged inventory units by aged days",
      "sourceTable": "N/A",
      "label": "Aged inventory units by aged days"
    },
    "enhancedColumn": {
      "metricId": "Agedinventoryunitsbyageddays",
      "parentMetricId": null,
      "metricName": "Aged inventory units by aged days",
      "metricAlias": null,
      "businessDefinition": "Aged units by aged days ( 0-180 271-365 and 365+)",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Aged inventory units by aged days",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Agedinventorypercentagebyageddays",
    "description": "Aged units share of total by aged days ( 0-180 271-365 and 365+)",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Aged inventory percentage by aged days",
      "sourceTable": "N/A",
      "label": "Aged inventory percentage by aged days"
    },
    "enhancedColumn": {
      "metricId": "Agedinventorypercentagebyageddays",
      "parentMetricId": null,
      "metricName": "Aged inventory percentage by aged days",
      "metricAlias": null,
      "businessDefinition": "Aged units share of total by aged days ( 0-180 271-365 and 365+)",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Aged inventory percentage by aged days",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Storageutilizationratio",
    "description": "The storage utilization ratio is the ratio of your average daily inventory volume stored divided by the average daily shipped volume over the past 13 weeks This metrics is surfaced on the FBA Dashboard of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Storage utilization ratio",
      "sourceTable": "N/A",
      "label": "Storage utilization ratio"
    },
    "enhancedColumn": {
      "metricId": "Storageutilizationratio",
      "parentMetricId": null,
      "metricName": "Storage utilization ratio",
      "metricAlias": null,
      "businessDefinition": "The storage utilization ratio is the ratio of your average daily inventory volume stored divided by the average daily shipped volume over the past 13 weeks This metrics is surfaced on the FBA Dashboard of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Storage utilization ratio",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Averagedailyinventoryvolume",
    "description": "",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Average daily inventory volume",
      "sourceTable": "N/A",
      "label": "Average daily inventory volume"
    },
    "enhancedColumn": {
      "metricId": "Averagedailyinventoryvolume",
      "parentMetricId": null,
      "metricName": "Average daily inventory volume",
      "metricAlias": null,
      "businessDefinition": "",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Average daily inventory volume",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Averagedailyshippedvolume",
    "description": "Displays the average daily shipped volume for the past 13 weeks",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Average daily shipped volume",
      "sourceTable": "N/A",
      "label": "Average daily shipped volume"
    },
    "enhancedColumn": {
      "metricId": "Averagedailyshippedvolume",
      "parentMetricId": null,
      "metricName": "Average daily shipped volume",
      "metricAlias": null,
      "businessDefinition": "Displays the average daily shipped volume for the past 13 weeks",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Average daily shipped volume",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Averagereturnrate",
    "description": "The total number of units refunded divided by the total number of units ordered across all ASINs in your catalog.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Average return rate",
      "sourceTable": "N/A",
      "label": "Average return rate"
    },
    "enhancedColumn": {
      "metricId": "Averagereturnrate",
      "parentMetricId": null,
      "metricName": "Average return rate",
      "metricAlias": null,
      "businessDefinition": "The total number of units refunded divided by the total number of units ordered across all ASINs in your catalog.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Average return rate",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Totalreturnunits",
    "description": "The total number of units for which the customer has initiated a return",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Total return units",
      "sourceTable": "N/A",
      "label": "Total return units"
    },
    "enhancedColumn": {
      "metricId": "Totalreturnunits",
      "parentMetricId": null,
      "metricName": "Total return units",
      "metricAlias": null,
      "businessDefinition": "The total number of units for which the customer has initiated a return",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Total return units",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Breakdownoftopreturnreasons",
    "description": "The top return reasons across all of your returned units as a percentage of all returned units",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Breakdown of top return reasons",
      "sourceTable": "N/A",
      "label": "Breakdown of top return reasons"
    },
    "enhancedColumn": {
      "metricId": "Breakdownoftopreturnreasons",
      "parentMetricId": null,
      "metricName": "Breakdown of top return reasons",
      "metricAlias": null,
      "businessDefinition": "The top return reasons across all of your returned units as a percentage of all returned units",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Breakdown of top return reasons",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Returnratebyreturnreasons",
    "description": "",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Return rate by return reasons",
      "sourceTable": "N/A",
      "label": "Return rate by return reasons"
    },
    "enhancedColumn": {
      "metricId": "Returnratebyreturnreasons",
      "parentMetricId": null,
      "metricName": "Return rate by return reasons",
      "metricAlias": null,
      "businessDefinition": "",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Return rate by return reasons",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "InventoryPerformanceIndex",
    "description": "The Inventory Performance Index is a metric to gauge your inventory performance over time. IPI score measures how efficient and productive you are in managing your FBA inventory. Multiple factors could influence your IPI score",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Inventory Performance Index",
      "sourceTable": "N/A",
      "label": "Inventory Performance Index"
    },
    "enhancedColumn": {
      "metricId": "InventoryPerformanceIndex",
      "parentMetricId": null,
      "metricName": "Inventory Performance Index",
      "metricAlias": null,
      "businessDefinition": "The Inventory Performance Index is a metric to gauge your inventory performance over time. IPI score measures how efficient and productive you are in managing your FBA inventory. Multiple factors could influence your IPI score",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Inventory Performance Index",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Excessinventorypercentage",
    "description": "We consider an item to be excess if it has over 90 days of supply based on the forecasted demand. Track your Excess inventory percentage This metrics is surfaced on the Inventory Performance of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Excess inventory percentage",
      "sourceTable": "N/A",
      "label": "Excess inventory percentage"
    },
    "enhancedColumn": {
      "metricId": "Excessinventorypercentage",
      "parentMetricId": null,
      "metricName": "Excess inventory percentage",
      "metricAlias": null,
      "businessDefinition": "We consider an item to be excess if it has over 90 days of supply based on the forecasted demand. Track your Excess inventory percentage This metrics is surfaced on the Inventory Performance of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Excess inventory percentage",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Strandedinventoryrate",
    "description": "When inventory is not available for buy due to a listing problem This metrics is surfaced on the Inventory Performance of Seller Central.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Stranded inventory rate",
      "sourceTable": "N/A",
      "label": "Stranded inventory rate"
    },
    "enhancedColumn": {
      "metricId": "Strandedinventoryrate",
      "parentMetricId": null,
      "metricName": "Stranded inventory rate",
      "metricAlias": null,
      "businessDefinition": "When inventory is not available for buy due to a listing problem This metrics is surfaced on the Inventory Performance of Seller Central.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Stranded inventory rate",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Incorrectlabel-productrelated%",
    "description": "We calculate your defect rate by dividing the number of incorrect labelunits by the total number of units we received over the past 120 days.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Incorrect label - product related %",
      "sourceTable": "N/A",
      "label": "Incorrect label - product related %"
    },
    "enhancedColumn": {
      "metricId": "Incorrectlabel-productrelated%",
      "parentMetricId": null,
      "metricName": "Incorrect label - product related %",
      "metricAlias": null,
      "businessDefinition": "We calculate your defect rate by dividing the number of incorrect labelunits by the total number of units we received over the past 120 days.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Incorrect label - product related %",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Labelmissing-productrelated%",
    "description": "We calculate your defect rate by dividing the number of label missing units by the total number of units we received over the past 120 days.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Label missing - product related %",
      "sourceTable": "N/A",
      "label": "Label missing - product related %"
    },
    "enhancedColumn": {
      "metricId": "Labelmissing-productrelated%",
      "parentMetricId": null,
      "metricName": "Label missing - product related %",
      "metricAlias": null,
      "businessDefinition": "We calculate your defect rate by dividing the number of label missing units by the total number of units we received over the past 120 days.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Label missing - product related %",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Inaccurateproductquantitiesinbox%",
    "description": "We calculate your defect rate by dividing the number of inaccurate product units by the total number of units we received over the past 120 days.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Inaccurate product quantities in box %",
      "sourceTable": "N/A",
      "label": "Inaccurate product quantities in box %"
    },
    "enhancedColumn": {
      "metricId": "Inaccurateproductquantitiesinbox%",
      "parentMetricId": null,
      "metricName": "Inaccurate product quantities in box %",
      "metricAlias": null,
      "businessDefinition": "We calculate your defect rate by dividing the number of inaccurate product units by the total number of units we received over the past 120 days.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Inaccurate product quantities in box %",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Unexpectedproductinbox%",
    "description": "We calculate your defect rate by dividing the number of unexpected units by the total number of units we received over the past 120 days.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Unexpected product in box %",
      "sourceTable": "N/A",
      "label": "Unexpected product in box %"
    },
    "enhancedColumn": {
      "metricId": "Unexpectedproductinbox%",
      "parentMetricId": null,
      "metricName": "Unexpected product in box %",
      "metricAlias": null,
      "businessDefinition": "We calculate your defect rate by dividing the number of unexpected units by the total number of units we received over the past 120 days.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Unexpected product in box %",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Yourcurrentdefectrate%",
    "description": "We calculate your defect rate by dividing the number of defect units by the total number of units we received over the past 120 days.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Your current defect rate %",
      "sourceTable": "N/A",
      "label": "Your current defect rate %"
    },
    "enhancedColumn": {
      "metricId": "Yourcurrentdefectrate%",
      "parentMetricId": null,
      "metricName": "Your current defect rate %",
      "metricAlias": null,
      "businessDefinition": "We calculate your defect rate by dividing the number of defect units by the total number of units we received over the past 120 days.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Your current defect rate %",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Otherlabeldefects-productrelated%",
    "description": "We calculate your defect rate by dividing the number of others defect units by the total number of units we received over the past 120 days.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Other label defects - product related %",
      "sourceTable": "N/A",
      "label": "Other label defects - product related %"
    },
    "enhancedColumn": {
      "metricId": "Otherlabeldefects-productrelated%",
      "parentMetricId": null,
      "metricName": "Other label defects - product related %",
      "metricAlias": null,
      "businessDefinition": "We calculate your defect rate by dividing the number of others defect units by the total number of units we received over the past 120 days.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Other label defects - product related %",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Outstandingdefectsunits",
    "description": "Outstanding defects units",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Outstanding defects units",
      "sourceTable": "N/A",
      "label": "Outstanding defects units"
    },
    "enhancedColumn": {
      "metricId": "Outstandingdefectsunits",
      "parentMetricId": null,
      "metricName": "Outstanding defects units",
      "metricAlias": null,
      "businessDefinition": "Outstanding defects units",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Outstanding defects units",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Resolveddefectsunits",
    "description": "Resolved defects units",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Resolved defects units",
      "sourceTable": "N/A",
      "label": "Resolved defects units"
    },
    "enhancedColumn": {
      "metricId": "Resolveddefectsunits",
      "parentMetricId": null,
      "metricName": "Resolved defects units",
      "metricAlias": null,
      "businessDefinition": "Resolved defects units",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Resolved defects units",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "DefectStatus",
    "description": "Defect Status",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Defect Status",
      "sourceTable": "N/A",
      "label": "Defect Status"
    },
    "enhancedColumn": {
      "metricId": "DefectStatus",
      "parentMetricId": null,
      "metricName": "Defect Status",
      "metricAlias": null,
      "businessDefinition": "Defect Status",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Defect Status",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "DefectASIN",
    "description": "Defect ASIN",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Defect ASIN",
      "sourceTable": "N/A",
      "label": "Defect ASIN"
    },
    "enhancedColumn": {
      "metricId": "DefectASIN",
      "parentMetricId": null,
      "metricName": "Defect ASIN",
      "metricAlias": null,
      "businessDefinition": "Defect ASIN",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Defect ASIN",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Defecttype",
    "description": "Shipment defect reasons like Barcode cannot be scanned and Unit mislabeled",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Defect type",
      "sourceTable": "N/A",
      "label": "Defect type"
    },
    "enhancedColumn": {
      "metricId": "Defecttype",
      "parentMetricId": null,
      "metricName": "Defect type",
      "metricAlias": null,
      "businessDefinition": "Shipment defect reasons like Barcode cannot be scanned and Unit mislabeled",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Defect type",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Defectshipmentname",
    "description": "Defect shipment name",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Defect shipment name",
      "sourceTable": "N/A",
      "label": "Defect shipment name"
    },
    "enhancedColumn": {
      "metricId": "Defectshipmentname",
      "parentMetricId": null,
      "metricName": "Defect shipment name",
      "metricAlias": null,
      "businessDefinition": "Defect shipment name",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Defect shipment name",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "StrandedSKU",
    "description": "SKU of the stranded units that are currently not available for purchase on Amazon.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Stranded SKU",
      "sourceTable": "N/A",
      "label": "Stranded SKU"
    },
    "enhancedColumn": {
      "metricId": "StrandedSKU",
      "parentMetricId": null,
      "metricName": "Stranded SKU",
      "metricAlias": null,
      "businessDefinition": "SKU of the stranded units that are currently not available for purchase on Amazon.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Stranded SKU",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "StrandedASIN",
    "description": "SKU of the stranded units that are currently not available for purchase on Amazon.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Stranded ASIN",
      "sourceTable": "N/A",
      "label": "Stranded ASIN"
    },
    "enhancedColumn": {
      "metricId": "StrandedASIN",
      "parentMetricId": null,
      "metricName": "Stranded ASIN",
      "metricAlias": null,
      "businessDefinition": "SKU of the stranded units that are currently not available for purchase on Amazon.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Stranded ASIN",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "AvailableUnits",
    "description": "Units of stranded products",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Available Units",
      "sourceTable": "N/A",
      "label": "Available Units"
    },
    "enhancedColumn": {
      "metricId": "AvailableUnits",
      "parentMetricId": null,
      "metricName": "Available Units",
      "metricAlias": null,
      "businessDefinition": "Units of stranded products",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Available Units",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Autoremovaldate",
    "description": "FBA's auto removal date of the stranded units",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Auto removal date",
      "sourceTable": "N/A",
      "label": "Auto removal date"
    },
    "enhancedColumn": {
      "metricId": "Autoremovaldate",
      "parentMetricId": null,
      "metricName": "Auto removal date",
      "metricAlias": null,
      "businessDefinition": "FBA's auto removal date of the stranded units",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Inventory"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Auto removal date",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "OrderID",
    "description": "Shopper's order id",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Order ID",
      "sourceTable": "N/A",
      "label": "Order ID"
    },
    "enhancedColumn": {
      "metricId": "OrderID",
      "parentMetricId": null,
      "metricName": "Order ID",
      "metricAlias": null,
      "businessDefinition": "Shopper's order id",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Order management"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Order ID",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Fulfillmentchannel",
    "description": "Amazon or seller fulfilled (FBA/MFN)",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Fulfillment channel",
      "sourceTable": "N/A",
      "label": "Fulfillment channel"
    },
    "enhancedColumn": {
      "metricId": "Fulfillmentchannel",
      "parentMetricId": null,
      "metricName": "Fulfillment channel",
      "metricAlias": null,
      "businessDefinition": "Amazon or seller fulfilled (FBA/MFN)",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Order management"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Fulfillment channel",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Saleschannel",
    "description": "i.e. Amazon.com; Amazon.ca",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Sales channel",
      "sourceTable": "N/A",
      "label": "Sales channel"
    },
    "enhancedColumn": {
      "metricId": "Saleschannel",
      "parentMetricId": null,
      "metricName": "Sales channel",
      "metricAlias": null,
      "businessDefinition": "i.e. Amazon.com; Amazon.ca",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Order management"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Sales channel",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "PaymentStatus",
    "description": "Wether this specific order's payment is pending or complete or failed",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Payment Status",
      "sourceTable": "N/A",
      "label": "Payment Status"
    },
    "enhancedColumn": {
      "metricId": "PaymentStatus",
      "parentMetricId": null,
      "metricName": "Payment Status",
      "metricAlias": null,
      "businessDefinition": "Wether this specific order's payment is pending or complete or failed",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Order management"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Payment Status",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Quantity",
    "description": "Ordered units in this order",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Quantity",
      "sourceTable": "N/A",
      "label": "Quantity"
    },
    "enhancedColumn": {
      "metricId": "Quantity",
      "parentMetricId": null,
      "metricName": "Quantity",
      "metricAlias": null,
      "businessDefinition": "Ordered units in this order",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Order management"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Quantity",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "UnitPrice",
    "description": "Ordered unit price in this order",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Unit Price",
      "sourceTable": "N/A",
      "label": "Unit Price"
    },
    "enhancedColumn": {
      "metricId": "UnitPrice",
      "parentMetricId": null,
      "metricName": "Unit Price",
      "metricAlias": null,
      "businessDefinition": "Ordered unit price in this order",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Order management"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Unit Price",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Proceeds",
    "description": "Item subtotal + tax + item toal",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Proceeds",
      "sourceTable": "N/A",
      "label": "Proceeds"
    },
    "enhancedColumn": {
      "metricId": "Proceeds",
      "parentMetricId": null,
      "metricName": "Proceeds",
      "metricAlias": null,
      "businessDefinition": "Item subtotal + tax + item toal",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Order management"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Proceeds",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "NetProceeds/TotalBalance",
    "description": "Net amount from Beginning balance and Sales less Refunds Loan Repayments and amount in account reserve.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Net Proceeds / Total Balance",
      "sourceTable": "N/A",
      "label": "Net Proceeds / Total Balance"
    },
    "enhancedColumn": {
      "metricId": "NetProceeds/TotalBalance",
      "parentMetricId": null,
      "metricName": "Net Proceeds / Total Balance",
      "metricAlias": null,
      "businessDefinition": "Net amount from Beginning balance and Sales less Refunds Loan Repayments and amount in account reserve.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Payments"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Net Proceeds / Total Balance",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "TotalBalancebyStandardOrders",
    "description": "",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Total Balance by Standard Orders",
      "sourceTable": "N/A",
      "label": "Total Balance by Standard Orders"
    },
    "enhancedColumn": {
      "metricId": "TotalBalancebyStandardOrders",
      "parentMetricId": null,
      "metricName": "Total Balance by Standard Orders",
      "metricAlias": null,
      "businessDefinition": "",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Payments"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Total Balance by Standard Orders",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "TotalBalancebyInvoicedOrders",
    "description": "",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Total Balance by Invoiced Orders",
      "sourceTable": "N/A",
      "label": "Total Balance by Invoiced Orders"
    },
    "enhancedColumn": {
      "metricId": "TotalBalancebyInvoicedOrders",
      "parentMetricId": null,
      "metricName": "Total Balance by Invoiced Orders",
      "metricAlias": null,
      "businessDefinition": "",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Payments"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Total Balance by Invoiced Orders",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "TotalBalancebyDeferredTransactions",
    "description": "Funds for these transactions are pending buyer invoice payments.",
    "dataType": "NUMBER",
    "aggType": "avg",
    "renderType": "RATING",
    "expression": null,
    "clientProperties": {
      "metricName": "Total Balance by Deferred Transactions",
      "sourceTable": "N/A",
      "label": "Total Balance by Deferred Transactions"
    },
    "enhancedColumn": {
      "metricId": "TotalBalancebyDeferredTransactions",
      "parentMetricId": null,
      "metricName": "Total Balance by Deferred Transactions",
      "metricAlias": null,
      "businessDefinition": "Funds for these transactions are pending buyer invoice payments.",
      "logicalDefinition": "",
      "metricImportance": "This metric is crucial for understanding customer satisfaction and maintaining a good seller reputation.",
      "metricInterpretation": "A higher rating indicates better customer satisfaction with your service.",
      "dataSource": null,
      "dataType": null,
      "renderType": null,
      "aggregationType": null,
      "isGroupable": null,
      "metricOwner": null,
      "metricGroups": {
        "Domain": [
          "Payments"
        ]
      },
      "accessControlTags": null,
      "metricDocumentationLinks": null
    },
    "name": "Total Balance by Deferred Transactions",
    "sourceTable": "N/A",
    "incompatibilitySet": null,
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Sales",
    "description": "Ordered product sales from customers who made more than one order within the selected reporting time range.",
    "dataType": "NUMBER",
    "aggType": "sum",
    "renderType": "CURRENCY",
    "expression": null,
    "clientProperties": {
      "metricName": "Sales",
      "sourceTable": "N/A",
      "label": "Sales"
    },
    "enhancedColumn": {
      "metricId": "null",
      "parentMetricId": null,
      "metricName": "Repeat Ordered Sales",
      "businessDefinition": "Ordered product sales from customers who made more than one order within the selected reporting time range.",
      "metricGroups": {
        "Domain": ["Sales"]
      }
    },
    "name": "Sales",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "ChangeVsPriorPeriod",
    "description": "Percentage change in repeat ordered product sales compared to the closest period previous to the selected reporting time range.",
    "dataType": "PERCENTAGE",
    "aggType": "none",
    "renderType": "PERCENT",
    "expression": null,
    "clientProperties": {
      "metricName": "Change vs. Prior Period",
      "sourceTable": "N/A",
      "label": "Change vs. Prior Period"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Change in Repeat Ordered Sales",
      "businessDefinition": "Percentage change in repeat ordered product sales compared to the previous period.",
      "metricGroups": {
        "Domain": ["Sales"]
      }
    },
    "name": "Change vs. Prior Period",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "ShareOfTotalSales",
    "description": "Percentage of total sales represented by repeat ordered product sales.",
    "dataType": "PERCENTAGE",
    "aggType": "none",
    "renderType": "PERCENT",
    "expression": null,
    "clientProperties": {
      "metricName": "% Share of Total Sales",
      "sourceTable": "N/A",
      "label": "% Share of Total Sales"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Repeat Sales Share",
      "businessDefinition": "The proportion of total sales that come from repeat ordered product sales.",
      "metricGroups": {
        "Domain": ["Sales"]
      }
    },
    "name": "% Share of Total Sales",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "Units",
    "description": "Number of product units purchased by customers who made more than one order within the selected reporting time range.",
    "dataType": "NUMBER",
    "aggType": "sum",
    "renderType": "INTEGER",
    "expression": null,
    "clientProperties": {
      "metricName": "Units",
      "sourceTable": "N/A",
      "label": "Units"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Repeat Ordered Units",
      "businessDefinition": "The total number of units purchased by customers who placed more than one order within the selected period.",
      "metricGroups": {
        "Domain": ["Sales"]
      }
    },
    "name": "Units",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "RepeatCustomers",
    "description": "Number of unique customers who placed more than one order within the selected reporting time range.",
    "dataType": "NUMBER",
    "aggType": "sum",
    "renderType": "INTEGER",
    "expression": null,
    "clientProperties": {
      "metricName": "Repeat Customers",
      "sourceTable": "N/A",
      "label": "Repeat Customers"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Repeat Customer Count",
      "businessDefinition": "The total number of unique customers who placed more than one order during the selected reporting period.",
      "metricGroups": {
        "Domain": ["Customers"]
      }
    },
    "name": "Repeat Customers",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "ShareOfCustomers",
    "description": "Repeat customers as a percentage of all customers who made an order within the selected reporting time range.",
    "dataType": "PERCENTAGE",
    "aggType": "none",
    "renderType": "PERCENT",
    "expression": null,
    "clientProperties": {
      "metricName": "% Share of Customers",
      "sourceTable": "N/A",
      "label": "% Share of Customers"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Repeat Customer Share",
      "businessDefinition": "Repeat customers as a percentage of all customers who made an order within the selected reporting period.",
      "metricGroups": {
        "Domain": ["Customers"]
      }
    },
    "name": "% Share of Customers",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "CouponTitle",
    "description": "Title that is visible to customers.",
    "dataType": "STRING",
    "aggType": "none",
    "renderType": "TEXT",
    "expression": null,
    "clientProperties": {
      "metricName": "Coupon Title",
      "sourceTable": "N/A",
      "label": "Coupon Title"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Coupon Title",
      "businessDefinition": "Title that is visible to customers.",
      "metricGroups": {
        "Domain": [
          "Promotions"
        ]
      }
    },
    "name": "Coupon Title",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "CouponStatus",
    "description": "Status of your coupon.",
    "dataType": "STRING",
    "aggType": "none",
    "renderType": "TEXT",
    "expression": null,
    "clientProperties": {
      "metricName": "Coupon Status",
      "sourceTable": "N/A",
      "label": "Coupon Status"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Coupon Status",
      "businessDefinition": "Current status of the coupon campaign.",
      "metricGroups": {
        "Domain": [
          "Promotions"
        ]
      }
    },
    "name": "Coupon Status",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "CouponDiscount",
    "description": "The discount you are offering with this coupon.",
    "dataType": "PERCENTAGE",
    "aggType": "none",
    "renderType": "PERCENT",
    "expression": null,
    "clientProperties": {
      "metricName": "Coupon Discount",
      "sourceTable": "N/A",
      "label": "Coupon Discount"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Coupon Discount",
      "businessDefinition": "The percentage discount applied to the coupon.",
      "metricGroups": {
        "Domain": [
          "Promotions"
        ]
      }
    },
    "name": "Coupon Discount",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "CouponAudience",
    "description": "Customers that you selected for this coupon.",
    "dataType": "STRING",
    "aggType": "none",
    "renderType": "TEXT",
    "expression": null,
    "clientProperties": {
      "metricName": "Coupon Audience",
      "sourceTable": "N/A",
      "label": "Coupon Audience"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Coupon Audience",
      "businessDefinition": "The selected audience eligible to redeem the coupon.",
      "metricGroups": {
        "Domain": [
          "Promotions"
        ]
      }
    },
    "name": "Coupon Audience",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "CouponBudget",
    "description": "The budget you set to cover coupons-related costs.",
    "dataType": "CURRENCY",
    "aggType": "none",
    "renderType": "CURRENCY",
    "expression": null,
    "clientProperties": {
      "metricName": "Coupon Budget",
      "sourceTable": "N/A",
      "label": "Coupon Budget"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Coupon Budget",
      "businessDefinition": "The total allocated budget for the coupon campaign.",
      "metricGroups": {
        "Domain": [
          "Promotions"
        ]
      }
    },
    "name": "Coupon Budget",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "CouponBudgetUtilization",
    "description": "Coupon current utilization (USD equivalent of your discount offering and redemption fees).",
    "dataType": "CURRENCY",
    "aggType": "sum",
    "renderType": "CURRENCY",
    "expression": null,
    "clientProperties": {
      "metricName": "Coupon Budget Utilization",
      "sourceTable": "N/A",
      "label": "Coupon Budget Utilization"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Coupon Budget Utilization",
      "businessDefinition": "Total amount spent from the coupon budget so far.",
      "metricGroups": {
        "Domain": [
          "Promotions"
        ]
      }
    },
    "name": "Coupon Budget Utilization",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "CouponClips",
    "description": "Number of coupons collected (clips).",
    "dataType": "NUMBER",
    "aggType": "sum",
    "renderType": "INTEGER",
    "expression": null,
    "clientProperties": {
      "metricName": "Coupon Clips",
      "sourceTable": "N/A",
      "label": "Coupon Clips"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Coupon Clips",
      "businessDefinition": "Total number of times the coupon was clipped by customers.",
      "metricGroups": {
        "Domain": [
          "Promotions"
        ]
      }
    },
    "name": "Coupon Clips",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "CouponRedeemed",
    "description": "Coupons applied to a purchase (redemptions).",
    "dataType": "NUMBER",
    "aggType": "sum",
    "renderType": "INTEGER",
    "expression": null,
    "clientProperties": {
      "metricName": "Coupon Redeemed",
      "sourceTable": "N/A",
      "label": "Coupon Redeemed"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Coupon Redemptions",
      "businessDefinition": "Total number of times the coupon was successfully used.",
      "metricGroups": {
        "Domain": [
          "Promotions"
        ]
      }
    },
    "name": "Coupon Redeemed",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "CouponSales",
    "description": "Revenue generated through this coupon (sales).",
    "dataType": "CURRENCY",
    "aggType": "sum",
    "renderType": "CURRENCY",
    "expression": null,
    "clientProperties": {
      "metricName": "Coupon Sales",
      "sourceTable": "N/A",
      "label": "Coupon Sales"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Coupon Sales",
      "businessDefinition": "Total revenue generated from sales using the coupon.",
      "metricGroups": {
        "Domain": [
          "Promotions"
        ]
      }
    },
    "name": "Coupon Sales",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "DiscountSales",
    "description": "Discount attributed sales.",
    "dataType": "CURRENCY",
    "aggType": "sum",
    "renderType": "CURRENCY",
    "expression": null,
    "clientProperties": {
      "metricName": "Discount Sales",
      "sourceTable": "N/A",
      "label": "Discount Sales"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Discount Sales",
      "businessDefinition": "Total sales generated from discounted products.",
      "metricGroups": {
        "Domain": [
          "Promotions"
        ]
      }
    },
    "name": "Discount Sales",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "DiscountUnitsSold",
    "description": "Discount attributed ordered units.",
    "dataType": "NUMBER",
    "aggType": "sum",
    "renderType": "INTEGER",
    "expression": null,
    "clientProperties": {
      "metricName": "Discount Units Sold",
      "sourceTable": "N/A",
      "label": "Discount Units Sold"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Discount Units Sold",
      "businessDefinition": "Total number of units sold at a discounted price.",
      "metricGroups": {
        "Domain": [
          "Promotions"
        ]
      }
    },
    "name": "Discount Units Sold",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "DiscountSellThroughRate",
    "description": "The number of discounted units sold compared against the number of discounted units committed.",
    "dataType": "PERCENTAGE",
    "aggType": "none",
    "renderType": "PERCENT",
    "expression": null,
    "clientProperties": {
      "metricName": "Discount Sell-through Rate",
      "sourceTable": "N/A",
      "label": "Discount Sell-through Rate"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Discount Sell-through Rate",
      "businessDefinition": "The percentage of discounted inventory that was successfully sold.",
      "metricGroups": {
        "Domain": [
          "Promotions"
        ]
      }
    },
    "name": "Discount Sell-through Rate",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "DiscountType",
    "description": "The type of discount you want to offer.",
    "dataType": "STRING",
    "aggType": "none",
    "renderType": "TEXT",
    "expression": null,
    "clientProperties": {
      "metricName": "Discount Type",
      "sourceTable": "N/A",
      "label": "Discount Type"
    },
    "enhancedColumn": {
      "metricId": "null",
      "metricName": "Discount Type",
      "businessDefinition": "The discount structure, such as fixed price or percentage off.",
      "metricGroups": {
        "Domain": [
          "Promotions"
        ]
      }
    },
    "name": "Discount Type",
    "sourceTable": "N/A",
    "groupable": false,
    "sellerSpecific": true,
    "publicStore": false,
    "externalMetric": false
  },
  {
    "columnId": "ProductDetails",
    "description": "The name of the payment.",
    "dataType": "STRING",
    "aggType": "none",
    "renderType": "TEXT",
    "clientProperties": {
      "metricName": "Product Details",
      "sourceTable": "N/A",
      "label": "Product Details"
    },
    "enhancedColumn": {
      "metricName": "Product Details",
      "businessDefinition": "The name of the payment.",
      "metricGroups": {
        "Domain": ["Payments"]
      }
    }
  },
  {
    "columnId": "TotalProductCharges",
    "description": "The payment amount of this transaction.",
    "dataType": "CURRENCY",
    "aggType": "sum",
    "renderType": "CURRENCY",
    "clientProperties": {
      "metricName": "Total Product Charges",
      "sourceTable": "N/A",
      "label": "Total Product Charges"
    },
    "enhancedColumn": {
      "metricName": "Total Product Charges",
      "businessDefinition": "The payment amount of this transaction.",
      "metricGroups": {
        "Domain": ["Payments"]
      }
    }
  },
  {
    "columnId": "PayoutAmount",
    "description": "The amount transferred to your bank account at the end of the previous settlement period.",
    "dataType": "CURRENCY",
    "aggType": "sum",
    "renderType": "CURRENCY",
    "clientProperties": {
      "metricName": "Payout Amount",
      "sourceTable": "N/A",
      "label": "Payout Amount"
    },
    "enhancedColumn": {
      "metricName": "Payout Amount",
      "businessDefinition": "The amount transferred to the seller's bank account at the end of the previous settlement period.",
      "metricGroups": {
        "Domain": ["Payments"]
      }
    }
  },
  {
    "columnId": "TransactionDate",
    "description": "The date of Amazon's payment to seller.",
    "dataType": "DATE",
    "aggType": "none",
    "renderType": "DATE",
    "clientProperties": {
      "metricName": "Transaction Date",
      "sourceTable": "N/A",
      "label": "Transaction Date"
    },
    "enhancedColumn": {
      "metricName": "Transaction Date",
      "businessDefinition": "The date when Amazon issued a payment to the seller.",
      "metricGroups": {
        "Domain": ["Payments"]
      }
    }
  },
  {
    "columnId": "TransactionStatus",
    "description": "Status of the transaction (i.e., Released, Deferred).",
    "dataType": "STRING",
    "aggType": "none",
    "renderType": "TEXT",
    "clientProperties": {
      "metricName": "Transaction Status",
      "sourceTable": "N/A",
      "label": "Transaction Status"
    },
    "enhancedColumn": {
      "metricName": "Transaction Status",
      "businessDefinition": "Indicates whether the transaction has been released or deferred.",
      "metricGroups": {
        "Domain": ["Payments"]
      }
    }
  },
  {
    "columnId": "TransactionType",
    "description": "Amazon to seller's payment type, including various disbursements and adjustments.",
    "dataType": "STRING",
    "aggType": "none",
    "renderType": "TEXT",
    "clientProperties": {
      "metricName": "Transaction Type",
      "sourceTable": "N/A",
      "label": "Transaction Type"
    },
    "enhancedColumn": {
      "metricName": "Transaction Type",
      "businessDefinition": "Indicates the type of transaction, such as order payments, refunds, liquidations, and adjustments.",
      "metricGroups": {
        "Domain": ["Payments"]
      }
    }
  },
  {
    "columnId": "SettlementPeriod",
    "description": "The period in which payments are settled (e.g., Biweekly).",
    "dataType": "STRING",
    "aggType": "none",
    "renderType": "TEXT",
    "clientProperties": {
      "metricName": "Settlement Period",
      "sourceTable": "N/A",
      "label": "Settlement Period"
    },
    "enhancedColumn": {
      "metricName": "Settlement Period",
      "businessDefinition": "Timeframe for Amazon's payment settlements, typically biweekly.",
      "metricGroups": {
        "Domain": ["Payments"]
      }
    }
  },
  {
    "columnId": "DiscountPrice",
    "description": "The price that customers will pay for your product.",
    "dataType": "CURRENCY",
    "aggType": "none",
    "renderType": "CURRENCY",
    "clientProperties": {
      "metricName": "Discount Price",
      "sourceTable": "N/A",
      "label": "Discount Price"
    },
    "enhancedColumn": {
      "metricName": "Discount Price",
      "businessDefinition": "The price that customers will pay for your product after applying the discount.",
      "metricGroups": {
        "Domain": ["Promotions"]
      }
    }
  },
  {
    "columnId": "DiscountCommittedUnits",
    "description": "The number of committed units across all ASINs participating in the Price Discount.",
    "dataType": "INTEGER",
    "aggType": "sum",
    "renderType": "NUMBER",
    "clientProperties": {
      "metricName": "Discount Committed Units",
      "sourceTable": "N/A",
      "label": "Discount Committed Units"
    },
    "enhancedColumn": {
      "metricName": "Discount Committed Units",
      "businessDefinition": "The number of units committed for the discount across all participating ASINs.",
      "metricGroups": {
        "Domain": ["Promotions"]
      }
    }
  },
  {
    "columnId": "DiscountSellThroughRate",
    "description": "The number of discounted units sold compared against the number of discounted units committed.",
    "dataType": "PERCENTAGE",
    "aggType": "none",
    "renderType": "PERCENTAGE",
    "clientProperties": {
      "metricName": "Discount Sell-through Rate",
      "sourceTable": "N/A",
      "label": "Discount Sell-through Rate"
    },
    "enhancedColumn": {
      "metricName": "Discount Sell-through Rate",
      "businessDefinition": "Percentage of discounted units sold compared to committed units.",
      "metricGroups": {
        "Domain": ["Promotions"]
      }
    }
  },
  {
    "columnId": "DiscountType",
    "description": "Select the type of discount you want to offer. Fixed price allows you to enter a discounted price that is fixed. Percent off allows you to enter a percent off amount with a minimum discounted price threshold.",
    "dataType": "STRING",
    "aggType": "none",
    "renderType": "TEXT",
    "clientProperties": {
      "metricName": "Discount Type",
      "sourceTable": "N/A",
      "label": "Discount Type"
    },
    "enhancedColumn": {
      "metricName": "Discount Type",
      "businessDefinition": "Type of discount, such as fixed price or percent off.",
      "metricGroups": {
        "Domain": ["Promotions"]
      }
    }
  },
  {
    "columnId": "ReturnDate",
    "description": "Return Date",
    "dataType": "DATE",
    "aggType": "none",
    "renderType": "DATE",
    "clientProperties": {
      "metricName": "Return Date",
      "sourceTable": "N/A",
      "label": "Return Date"
    },
    "enhancedColumn": {
      "metricName": "Return Date",
      "businessDefinition": "The date when the item was returned.",
      "metricGroups": {
        "Domain": ["Returns"]
      }
    }
  },
  {
    "columnId": "ReturnOrderID",
    "description": "Return Order ID",
    "dataType": "STRING",
    "aggType": "none",
    "renderType": "TEXT",
    "clientProperties": {
      "metricName": "Return Order ID",
      "sourceTable": "N/A",
      "label": "Return Order ID"
    },
    "enhancedColumn": {
      "metricName": "Return Order ID",
      "businessDefinition": "Unique identifier for the return order.",
      "metricGroups": {
        "Domain": ["Returns"]
      }
    }
  },
  {
    "columnId": "ReturnSKU",
    "description": "Return SKU",
    "dataType": "STRING",
    "aggType": "none",
    "renderType": "TEXT",
    "clientProperties": {
      "metricName": "Return SKU",
      "sourceTable": "N/A",
      "label": "Return SKU"
    },
    "enhancedColumn": {
      "metricName": "Return SKU",
      "businessDefinition": "The SKU of the returned product.",
      "metricGroups": {
        "Domain": ["Returns"]
      }
    }
  },
  {
    "columnId": "ReturnASIN",
    "description": "Return ASIN",
    "dataType": "STRING",
    "aggType": "none",
    "renderType": "TEXT",
    "clientProperties": {
      "metricName": "Return ASIN",
      "sourceTable": "N/A",
      "label": "Return ASIN"
    },
    "enhancedColumn": {
      "metricName": "Return ASIN",
      "businessDefinition": "The ASIN of the returned product.",
      "metricGroups": {
        "Domain": ["Returns"]
      }
    }
  },
  {
    "columnId": "ReturnFNSKU",
    "description": "Return FNSKU",
    "dataType": "STRING",
    "aggType": "none",
    "renderType": "TEXT",
    "clientProperties": {
      "metricName": "Return FNSKU",
      "sourceTable": "N/A",
      "label": "Return FNSKU"
    },
    "enhancedColumn": {
      "metricName": "Return FNSKU",
      "businessDefinition": "The Fulfillment Network SKU of the returned item.",
      "metricGroups": {
        "Domain": ["Returns"]
      }
    }
  },
  {
    "columnId": "ReturnQuantity",
    "description": "Return Quantity",
    "dataType": "INTEGER",
    "aggType": "sum",
    "renderType": "NUMBER",
    "clientProperties": {
      "metricName": "Return Quantity",
      "sourceTable": "N/A",
      "label": "Return Quantity"
    },
    "enhancedColumn": {
      "metricName": "Return Quantity",
      "businessDefinition": "Number of items returned.",
      "metricGroups": {
        "Domain": ["Returns"]
      }
    }
  },
  {
    "columnId": "ReturnFC",
    "description": "Return Fulfillment Center (e.g. LAS2)",
    "dataType": "STRING",
    "aggType": "none",
    "renderType": "TEXT",
    "clientProperties": {
      "metricName": "Return Fulfillment Center",
      "sourceTable": "N/A",
      "label": "Return FC"
    },
    "enhancedColumn": {
      "metricName": "Return Fulfillment Center",
      "businessDefinition": "The fulfillment center to which the return was sent.",
      "metricGroups": {
        "Domain": ["Returns"]
      }
    }
  },
  {
    "columnId": "ReturnDisposition",
    "description": "Return Disposition (e.g. Customer Damaged)",
    "dataType": "STRING",
    "aggType": "none",
    "renderType": "TEXT",
    "clientProperties": {
      "metricName": "Return Disposition",
      "sourceTable": "N/A",
      "label": "Return Disposition"
    },
    "enhancedColumn": {
      "metricName": "Return Disposition",
      "businessDefinition": "Disposition of the returned item (e.g. customer damaged, etc.).",
      "metricGroups": {
        "Domain": ["Returns"]
      }
    }
  },
  {
    "columnId": "CustomerReturnReason",
    "description": "Reason for the return from the customer.",
    "dataType": "STRING",
    "aggType": "none",
    "renderType": "TEXT",
    "clientProperties": {
      "metricName": "Customer Return Reason",
      "sourceTable": "N/A",
      "label": "Customer Return Reason"
    },
    "enhancedColumn": {
      "metricName": "Customer Return Reason",
      "businessDefinition": "Reason given by the customer for returning the item.",
      "metricGroups": {
        "Domain": ["Returns"]
      }
    }
  },
  {
    "columnId": "NumberOfOrders",
    "description": "Total number of orders for a given Brand or ASIN. An order may include multiple quantities of a product and differs from ordered units.",
    "dataType": "INTEGER",
    "aggType": "sum",
    "renderType": "NUMBER",
    "clientProperties": {
      "metricName": "Number of Orders",
      "sourceTable": "N/A",
      "label": "Number of Orders"
    },
    "enhancedColumn": {
      "metricName": "Number of Orders",
      "businessDefinition": "Total number of orders placed for a specific Brand or ASIN, with multiple quantities per order.",
      "metricGroups": {
        "Domain": ["Brand"]
      }
    }
  },
  {
    "columnId": "Sales",
    "description": "Ordered product sales from customers who made more than one order within the selected reporting time range.",
    "dataType": "CURRENCY",
    "aggType": "sum",
    "renderType": "CURRENCY",
    "clientProperties": {
      "metricName": "Sales",
      "sourceTable": "N/A",
      "label": "Sales"
    },
    "enhancedColumn": {
      "metricName": "Sales",
      "businessDefinition": "Sales from customers who ordered the same product more than once within the selected time range.",
      "metricGroups": {
        "Domain": ["Brand"]
      }
    }
  },
  {
    "columnId": "ChangeVsPriorPeriod",
    "description": "Percentage change in repeat ordered product sales compared to the closest period previous to the selected reporting time range.",
    "dataType": "PERCENTAGE",
    "aggType": "none",
    "renderType": "PERCENTAGE",
    "clientProperties": {
      "metricName": "Change vs. Prior Period",
      "sourceTable": "N/A",
      "label": "Change vs. Prior Period"
    },
    "enhancedColumn": {
      "metricName": "Change vs. Prior Period",
      "businessDefinition": "The percentage change in sales from repeat customers compared to the previous reporting period.",
      "metricGroups": {
        "Domain": ["Brand"]
      }
    }
  },
  {
    "columnId": "PercentShareOfTotalSales",
    "description": "Repeat customer sales as a percentage of total sales during the selected reporting period.",
    "dataType": "PERCENTAGE",
    "aggType": "none",
    "renderType": "PERCENTAGE",
    "clientProperties": {
      "metricName": "% Share of Total Sales",
      "sourceTable": "N/A",
      "label": "% Share of Total Sales"
    },
    "enhancedColumn": {
      "metricName": "% Share of Total Sales",
      "businessDefinition": "The percentage of total sales attributed to repeat customers during the reporting period.",
      "metricGroups": {
        "Domain": ["Brand"]
      }
    }
  },
  {
    "columnId": "Units",
    "description": "Number of product units purchased by customers who made more than one order within the selected reporting time range.",
    "dataType": "INTEGER",
    "aggType": "sum",
    "renderType": "NUMBER",
    "clientProperties": {
      "metricName": "Units",
      "sourceTable": "N/A",
      "label": "Units"
    },
    "enhancedColumn": {
      "metricName": "Units",
      "businessDefinition": "The number of units ordered by repeat customers within the selected reporting period.",
      "metricGroups": {
        "Domain": ["Brand"]
      }
    }
  },
  {
    "columnId": "RepeatCustomers",
    "description": "Number of unique customers who placed more than one order within the selected reporting time range.",
    "dataType": "INTEGER",
    "aggType": "sum",
    "renderType": "NUMBER",
    "clientProperties": {
      "metricName": "Repeat Customers",
      "sourceTable": "N/A",
      "label": "Repeat Customers"
    },
    "enhancedColumn": {
      "metricName": "Repeat Customers",
      "businessDefinition": "The number of unique customers who made more than one purchase of the same product within the reporting period.",
      "metricGroups": {
        "Domain": ["Brand"]
      }
    }
  },
  {
    "columnId": "PercentShareOfCustomers",
    "description": "Repeat customers as a percentage of all customers who made an order within the selected reporting time range.",
    "dataType": "PERCENTAGE",
    "aggType": "none",
    "renderType": "PERCENTAGE",
    "clientProperties": {
      "metricName": "% Share of Customers",
      "sourceTable": "N/A",
      "label": "% Share of Customers"
    },
    "enhancedColumn": {
      "metricName": "% Share of Customers",
      "businessDefinition": "Percentage of customers who made more than one purchase during the reporting period.",
      "metricGroups": {
        "Domain": ["Brand"]
      }
    }
  }
]

    // Function to intercept fetch requests
    function interceptFetch() {
        const originalFetch = window.fetch;

        window.fetch = function() {
            const url = arguments[0];
            const options = arguments[1];

            if (typeof url === 'string' && url.includes('metadata/api/v1/columns')) {
                return originalFetch.apply(this, arguments).then(response => {
                    if (response.ok) {
                        return response.json().then(data => {
                            // Add additional columns to the response
                            data.columns.push(...additionalColumns);
                            console.log('Modified metadata/api/v1/columns response:', data);
                            return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
                        });
                    } else {
                        console.warn('metadata/api/v1/columns request failed:', response.statusText);
                        return response;
                    }
                });
            } else if (typeof url === 'string' && url.includes('ca/metricdata/api/v1/metricdata')) {
                return originalFetch.apply(this, arguments).then(response => {
                    if (response.ok) {
                        return response.json().then(data => {
                            // Add additional columns to the schema
                            data.metricsData.schema.columns.push(...additionalColumns);

                            // Add dummy data for the new columns in rowData
                            data.metricsData.data.rowData.forEach(row => {
                                row["NEW_COLUMN_1"] = "Dummy Data 1";
                                row["NEW_COLUMN_2"] = "Dummy Data 2";
                            });

                            // Add dummy data for the new columns in totalsData
                            data.metricsData.data.totalsData["NEW_COLUMN_1"] = "Dummy Total 1";
                            data.metricsData.data.totalsData["NEW_COLUMN_2"] = "Dummy Total 2";

                            console.log('Modified ca/metricdata/api/v1/metricdata response:', data);
                            return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
                        });
                    } else {
                        console.warn('ca/metricdata/api/v1/metricdata request failed:', response.statusText);
                        return response;
                    }
                });
            } else if (typeof url === 'string' && url.includes('metadata/api/v1/fiscalPeriods')) {
                return originalFetch.apply(this, arguments).then(response => {
                    if (response.ok) {
                        return response.json().then(data => {
                            console.log('metadata/api/v1/fiscalPeriods response:', data);
                            return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
                        });
                    } else {
                        console.warn('metadata/api/v1/fiscalPeriods request failed:', response.statusText);
                        return response;
                    }
                });
            }

            return originalFetch.apply(this, arguments);
        };
    }

    // Function to intercept XMLHttpRequests
    function interceptXHR() {
        const originalXHR = window.XMLHttpRequest;

        window.XMLHttpRequest = function() {
            const xhr = new originalXHR();

            const originalOpen = xhr.open;
            xhr.open = function() {
                this._url = arguments[1];
                originalOpen.apply(this, arguments);
            };

            const originalSend = xhr.send;
            xhr.send = function() {
                if (this._url && (this._url.includes('metadata/api/v1/columns') || this._url.includes('ca/metricdata/api/v1/metricdata'))) {
                    const xhrSend = originalSend.bind(this);

                    const handleResponse = () => {
                        if (this.readyState === 4 && this.status === 200) {
                            try {
                                let data = JSON.parse(this.responseText);

                                if (this._url.includes('metadata/api/v1/columns')) {
                                    // Add additional columns to the response
                                    data.columns.push(...additionalColumns);
                                    console.log('Modified metadata/api/v1/columns response:', data);
                                } else if (this._url.includes('ca/metricdata/api/v1/metricdata')) {
                                    // Add additional columns to the schema
                                    data.metricsData.schema.columns.push(...additionalColumns);

                                    // Add dummy data for the new columns in rowData
                                    data.metricsData.data.rowData.forEach(row => {
                                        row["NEW_COLUMN_1"] = "Dummy Data 1";
                                        row["NEW_COLUMN_2"] = "Dummy Data 2";
                                    });

                                    // Add dummy data for the new columns in totalsData
                                    data.metricsData.data.totalsData["NEW_COLUMN_1"] = "Dummy Total 1";
                                    data.metricsData.data.totalsData["NEW_COLUMN_2"] = "Dummy Total 2";

                                    console.log('Modified ca/metricdata/api/v1/metricdata response:', data);
                                }

                                this.responseText = JSON.stringify(data);
                            } catch (e) {
                                console.error('Failed to parse response:', e);
                            }
                        }
                    };

                    this.addEventListener('load', handleResponse);
                    this.addEventListener('error', () => console.warn('Request failed'));

                    xhrSend();
                } else if (this._url && this._url.includes('metadata/api/v1/fiscalPeriods')) {
                    const xhrSend = originalSend.bind(this);

                    const handleResponse = () => {
                        if (this.readyState === 4 && this.status === 200) {
                            try {
                                let data = JSON.parse(this.responseText);
                                console.log('metadata/api/v1/fiscalPeriods response:', data);
                                this.responseText = JSON.stringify(data);
                            } catch (e) {
                                console.error('Failed to parse metadata/api/v1/fiscalPeriods response:', e);
                            }
                        }
                    };

                    this.addEventListener('load', handleResponse);
                    this.addEventListener('error', () => console.warn('metadata/api/v1/fiscalPeriods request failed'));

                    xhrSend();
                } else {
                    originalSend.apply(this, arguments);
                }
            };

            return xhr;
        };
    }

    // Apply the interception functions
    interceptFetch();
    interceptXHR();
})();