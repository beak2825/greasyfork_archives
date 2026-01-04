// ==UserScript==
// @license      GNU GPLv3
// @name         Autocomplete
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  func acomp
// @author       Алексей Иващенко
// @include    /^https?:\/\/.*\.tcsbank.ru.*/
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/462246/Autocomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/462246/Autocomplete.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function addStyle(styleString) {
		const style = document.createElement('style');
		style.textContent = styleString;
		document.head.append(style);
	}

	addStyle(`
		.autocomplete-items {
			margin: -.5rem 0;
		}

		.autocomplete-items .autocomplete-button-wrapper {
			position: relative;
			padding: 0.5rem 0.75rem;
		    margin: 0.5rem 0.9rem 0.5rem 0.5rem;
		    border-radius: 0.5rem;
		    cursor: pointer;
		}

		.autocomplete-items .autocomplete-button-wrapper div.autocomplete-button:nth-last-child(2) {
		    padding-bottom: 30px;
		}

		.autocomplete-items .autocomplete-button-wrapper:hover {
			background-color: var(--tui-base-02);
		}

		.autocomplete-items .autocomplete-button span {
		    margin-right: 0.4rem;
		    line-height: .5rem;
		    vertical-align: top;
		    border-right: 1px solid var(--tui-text-03);
		    padding-right: 0.4rem;
		    height: 0.75rem;
		    display: inline-block;
		    margin-top: 0.4rem;
		}

		.autocomplete-items .autocomplete-template {
			display: table;
		    color: var(--tui-link);
		    cursor: pointer;
			margin-left: 1.4rem;
			margin-top: -30px;
		}

		.autocomplete-items .autocomplete-template:hover {
			color: var(--tui-link-hover);
		}

		.autocomplete-items .autocomplete-button-wrapper a {
            position: absolute;
		    right: .5rem;
		    top: 0.6rem;
		    display: block;
		    width: 20px;
		    line-height: 20px;
		    text-align: center;
		    border-radius: 15px;
		    font-weight: bold;
		    background-color: var(--tui-text-03);
		    color: var(--tui-base-01)
		}

		.autocomplete-items .autocomplete-button-wrapper a:hover {
			background-color: var(--tui-link-hover);
		}

		.autocomplete-items .autocomplete-button-wrapper strong {
			color: var(--tui-text-01);
		}

	`);

	/*JSON containing all the functions:*/
	var functionsJSON = [{
	"function": "ADD",
	"argument": [
		"LIST_OF",
		"OBJECT",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#ADD(java.util.List,java.lang.Object,java.lang.Integer...)"
}, {
	"function": "BASE64_DECODE",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#BASE64_DECODE(java.lang.String)"
}, {
	"function": "BASE64_ENCODE",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#BASE64_ENCODE(java.lang.String)"
}, {
	"function": "CAPITALIZE_ALL",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#CAPITALIZE_ALL(java.lang.String)"
}, {
	"function": "CEIL",
	"argument": [
		"DECIMAL"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#CEIL(java.math.BigDecimal)"
}, {
	"function": "COALESCE",
	"argument": [
		"OBJECT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#COALESCE(java.lang.Object,java.lang.Object)"
}, {
	"function": "CONCAT",
	"argument": [
		"TEXT",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#CONCAT(java.lang.String,java.lang.String)"
}, {
	"function": "CONTAINS",
	"argument": [
		"OBJECT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#CONTAINS(java.lang.Object,java.lang.Object)"
}, {
	"function": "DELETE",
	"argument": [
		"LIEXT_OF",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#DELETE(java.util.List,java.lang.Integer)"
}, {
	"function": "DIVIDE",
	"argument": [
		"NUMBER",
		"NUMBER",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#DIVIDE(java.lang.Number,java.lang.Number,int)"
}, {
	"function": "DURATION_DAYS",
	"argument": [
		"OBJECT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#DURATION_DAYS(java.lang.Object,java.lang.Object)"
}, {
	"function": "DURATION_HOURS",
	"argument": [
		"OBJECT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#DURATION_HOURS(java.lang.Object,java.lang.Object)"
}, {
	"function": "DURATION_MINUTES",
	"argument": [
		"OBJECT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#DURATION_MINUTES(java.lang.Object,java.lang.Object)"
}, {
	"function": "DURATION_MONTHS",
	"argument": [
		"OBJECT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#DURATION_MONTHS(java.lang.Object,java.lang.Object)"
}, {
	"function": "DURATION_SECONDS",
	"argument": [
		"OBJECT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#DURATION_SECONDS(java.lang.Object,java.lang.Object)"
}, {
	"function": "EMPTY_LIST",
	"argument": [
		""
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#EMPTY_LIST()"
}, {
	"function": "ENDS_WITH",
	"argument": [
		"TEXT",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#ENDS_WITH(java.lang.String,java.lang.String)"
}, {
	"function": "FLOOR",
	"argument": [
		"DECIMAL"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#FLOOR(java.math.BigDecimal)"
}, {
	"function": "FORMAT_DATE",
	"argument": [
		"DATE",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#FORMAT_DATE(java.lang.Object,java.lang.String)"
}, {
	"function": "FORMAT_PHONE_NUMBER",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#FORMAT_PHONE_NUMBER(java.lang.String)"
}, {
	"function": "GENERATE_ID",
	"argument": [
		""
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#GENERATE_ID()"
}, {
	"function": "GET",
	"argument": [
		"LIST_OF",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#GET(java.util.List,java.lang.Integer)"
}, {
	"function": "IF",
	"argument": [
		"BOOL",
		"OBJECT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#IF(java.lang.Boolean,java.lang.Object,java.lang.Object)"
}, {
	"function": "IN_ARRAY",
	"argument": [
		"OBJECT",
		"LIST_OF"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#IN_ARRAY(java.lang.Object,java.util.List)"
}, {
	"function": "INTEGER_RANDOM",
	"argument": [
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#INTEGER_RANDOM(java.lang.Object...)"
}, {
	"function": "IS_AFTER",
	"argument": [
		"OBJECT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#IS_AFTER(java.lang.Object,java.lang.Object)"
}, {
	"function": "IS_BEFORE",
	"argument": [
		"OBJECT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#IS_BEFORE(java.lang.Object,java.lang.Object)"
}, {
	"function": "IS_JSON_NULL_OR_EMPTY",
	"argument": [
		"JSON"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#IS_JSON_NULL_OR_EMPTY(com.fasterxml.jackson.databind.JsonNode)"
}, {
	"function": "IS_JSON_NULL",
	"argument": [
		"JSON"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#IS_JSON_NULL(com.fasterxml.jackson.databind.JsonNode)"
}, {
	"function": "IS_PHONE_NUMBER",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#IS_PHONE_NUMBER(java.lang.String)"
}, {
	"function": "JAT_AND",
	"argument": [
		"BOOL",
		"BOOL"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JAT_AND(boolean,boolean)"
}, {
	"function": "JAT_EQ",
	"argument": [
		"OBJECT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JAT_EQ(java.lang.Object,java.lang.Object)"
}, {
	"function": "JAT_GE",
	"argument": [
		"OBJECT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JAT_GE(java.lang.Object,java.lang.Object)"
}, {
	"function": "JAT_GT",
	"argument": [
		"OBJECT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JAT_GT(java.lang.Object,java.lang.Object)"
}, {
	"function": "JAT_LE",
	"argument": [
		"OBJECT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JAT_LE(java.lang.Object,java.lang.Object)"
}, {
	"function": "JAT_LT",
	"argument": [
		"OBJECT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JAT_LT(java.lang.Object,java.lang.Object)"
}, {
	"function": "JAT_NOT",
	"argument": [
		"BOOL"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JAT_NOT(boolean)"
}, {
	"function": "JAT_OR",
	"argument": [
		"BOOL",
		"BOOL"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JAT_OR(boolean,boolean)"
}, {
	"function": "JSON_ARRAY_ADD",
	"argument": [
		"OBJECT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_ARRAY_ADD(java.lang.Object,java.lang.Object)"
}, {
	"function": "JSON_ARRAY_APPEND_ALL",
	"argument": [
		"JSON_ARRAY",
		"JSON_ARRAY"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_ARRAY_APPEND_ALL(com.fasterxml.jackson.databind.JsonNode,com.fasterxml.jackson.databind.JsonNode)"
}, {
	"function": "JSON_ARRAY_APPLY_ELEMENT_FILTER",
	"argument": [
		"JSON",
		"BOOL",
		"FILTER"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_ARRAY_APPLY_ELEMENT_FILTER(com.fasterxml.jackson.databind.JsonNode,java.lang.Boolean,java.util.List)"
}, {
	"function": "JSON_ARRAY_APPLY_ELEMENT_FINDER",
	"argument": [
		"JSON",
		"BOOL",
		"FINDER"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_ARRAY_APPLY_ELEMENT_FINDER(com.fasterxml.jackson.databind.JsonNode,java.lang.Boolean,java.util.List)"
}, {
	"function": "JSON_ARRAY_APPLY_ELEMENT_TRANSFORMATIONS",
	"argument": [
		"JSON",
		"BOOL",
		"PATH",
		"TRANSFORMATIONS"
	],
	"template": "JSON , false , \"\" ,\n  { 0 , FUNC , {0:0} , VAR },\n  { 1 , FUNC , {0:1} , VAR },\n  { 2 , FUNC , {0:2} , VAR }\n}",
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_ARRAY_APPLY_ELEMENT_TRANSFORMATIONS(com.fasterxml.jackson.databind.JsonNode,java.lang.Boolean,java.lang.String,java.util.List)"
}, {
	"function": "JSON_ARRAY_DELETE",
	"argument": [
		"JSON",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_ARRAY_DELETE(com.fasterxml.jackson.databind.JsonNode,java.lang.Integer)"
}, {
	"function": "JSON_ARRAY_FILTER_DUPLICATES_BY_KEY",
	"argument": [
		"JSON",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_ARRAY_FILTER_DUPLICATES_BY_KEY(com.fasterxml.jackson.databind.JsonNode,java.lang.String)"
}, {
	"function": "JSON_ARRAY_FILTER",
	"argument": [
		"JSON",
		"FILTER"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_ARRAY_FILTER(java.lang.Object,java.lang.String)"
}, {
	"function": "JSON_ARRAY_FIND",
	"argument": [
		"JSON",
		"FILTER"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_ARRAY_FIND(java.lang.Object,java.lang.String)"
}, {
	"function": "JSON_ARRAY_INSERT",
	"argument": [
		"JSON",
		"INT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_ARRAY_INSERT(com.fasterxml.jackson.databind.JsonNode,int,java.lang.Object)"
}, {
	"function": "JSON_ARRAY_SET",
	"argument": [
		"JSON",
		"INT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_ARRAY_SET(com.fasterxml.jackson.databind.JsonNode,java.lang.Integer,java.lang.Object)"
}, {
	"function": "JSON_ARRAY_SLICE",
	"argument": [
		"JSON",
		"INT",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_ARRAY_SLICE(com.fasterxml.jackson.databind.JsonNode,int,int...)"
}, {
	"function": "JSON_ARRAY_SORT_NATURAL_ORDER",
	"argument": [
		"JSON",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_ARRAY_SORT_NATURAL_ORDER(com.fasterxml.jackson.databind.JsonNode,java.lang.String...)"
}, {
	"function": "JSON_ARRAY_SORT_REVERSE_ORDER",
	"argument": [
		"JSON",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_ARRAY_SORT_REVERSE_ORDER(com.fasterxml.jackson.databind.JsonNode,java.lang.String...)"
}, {
	"function": "JSON_DELETE_BY_PATH",
	"argument": [
		"OBJECT",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_EMPTY_ARRAY()"
}, {
	"function": "JSON_EMPTY_ARRAY",
	"argument": [
		""
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_EMPTY_ARRAY()"
}, {
	"function": "JSON_EMPTY_OBJECT",
	"argument": [
		""
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_EMPTY_OBJECT()"
}, {
	"function": "JSON_FILLED_ARRAY",
	"argument": [
		"INT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_FILLED_ARRAY(int,java.lang.Object)"
}, {
	"function": "JSON_GET_BOOL",
	"argument": [
		"JSON",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_GET_BOOL(com.fasterxml.jackson.databind.JsonNode,java.lang.String)"
}, {
	"function": "JSON_GET_DATE_PATTERN",
	"argument": [
		"JSON",
		"TEXT",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_GET_DATE_PATTERN(com.fasterxml.jackson.databind.JsonNode,java.lang.String,java.lang.String)"
}, {
	"function": "JSON_GET_DATE_TIME_PATTERN",
	"argument": [
		"JSON",
		"TEXT",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_GET_DATE_TIME_PATTERN(com.fasterxml.jackson.databind.JsonNode,java.lang.String,java.lang.String)"
}, {
	"function": "JSON_GET_DATE_TIME",
	"argument": [
		"JSON",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_GET_DATE_TIME(com.fasterxml.jackson.databind.JsonNode,java.lang.String)"
}, {
	"function": "JSON_GET_DATE",
	"argument": [
		"JSON",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_GET_DATE(com.fasterxml.jackson.databind.JsonNode,java.lang.String)"
}, {
	"function": "JSON_GET_DECIMAL",
	"argument": [
		"JSON",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_GET_DECIMAL(com.fasterxml.jackson.databind.JsonNode,java.lang.String)"
}, {
	"function": "JSON_GET_INTEGER",
	"argument": [
		"JSON",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_GET_INTEGER(com.fasterxml.jackson.databind.JsonNode,java.lang.String)"
}, {
	"function": "JSON_GET_JSON",
	"argument": [
		"JSON",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_GET_JSON(com.fasterxml.jackson.databind.JsonNode,java.lang.String)"
}, {
	"function": "JSON_GET_LIST_OF_BOOL",
	"argument": [
		"JSON",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_GET_LIST_OF_BOOL(com.fasterxml.jackson.databind.JsonNode,java.lang.String)"
}, {
	"function": "JSON_GET_LIST_OF_DATE_PATTERN",
	"argument": [
		"JSON",
		"TEXT",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_GET_LIST_OF_DATE_PATTERN(com.fasterxml.jackson.databind.JsonNode,java.lang.String,java.lang.String)"
}, {
	"function": "JSON_GET_LIST_OF_DATE_TIME_PATTERN",
	"argument": [
		"JSON",
		"TEXT",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_GET_LIST_OF_DATE_TIME_PATTERN(com.fasterxml.jackson.databind.JsonNode,java.lang.String,java.lang.String)"
}, {
	"function": "JSON_GET_LIST_OF_DATE_TIME",
	"argument": [
		"JSON",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_GET_LIST_OF_DATE_PATTERN(com.fasterxml.jackson.databind.JsonNode,java.lang.String,java.lang.String)"
}, {
	"function": "JSON_GET_LIST_OF_DATE",
	"argument": [
		"JSON",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_GET_LIST_OF_DATE(com.fasterxml.jackson.databind.JsonNode,java.lang.String)"
}, {
	"function": "JSON_GET_LIST_OF_DECIMAL",
	"argument": [
		"JSON",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_GET_LIST_OF_DECIMAL(com.fasterxml.jackson.databind.JsonNode,java.lang.String)"
}, {
	"function": "JSON_GET_LIST_OF_INTEGER",
	"argument": [
		"JSON",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_GET_LIST_OF_INTEGER(com.fasterxml.jackson.databind.JsonNode,java.lang.String)"
}, {
	"function": "JSON_GET_LIST_OF_TEXT",
	"argument": [
		"JSON",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_GET_LIST_OF_TEXT(com.fasterxml.jackson.databind.JsonNode,java.lang.String)"
}, {
	"function": "JSON_GET_TEXT",
	"argument": [
		"JSON",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_GET_TEXT(com.fasterxml.jackson.databind.JsonNode,java.lang.String)"
}, {
	"function": "JSON_KEYS",
	"argument": [
		"JSON"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_KEYS(com.fasterxml.jackson.databind.JsonNode)"
}, {
	"function": "JSON_OBJECT_APPLY_ELEMENT_MAPPINGS",
	"argument": [
		"JSON",
		"JSON"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_OBJECT_APPLY_ELEMENT_MAPPINGS(com.fasterxml.jackson.databind.JsonNode,com.fasterxml.jackson.databind.JsonNode)"
}, {
	"function": "JSON_OBJECT_DELETE",
	"argument": [
		"JSON",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_OBJECT_DELETE(com.fasterxml.jackson.databind.JsonNode,java.lang.String)"
}, {
	"function": "JSON_OBJECT_MERGE",
	"argument": [
		"JSON",
		"JSON",
		"boolean... overwriteFlag"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_OBJECT_MERGE(com.fasterxml.jackson.databind.JsonNode,com.fasterxml.jackson.databind.JsonNode,boolean...)"
}, {
	"function": "JSON_OBJECT_SET",
	"argument": [
		"JSON",
		"TEXT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_OBJECT_SET(com.fasterxml.jackson.databind.JsonNode,java.lang.String,java.lang.Object)"
}, {
	"function": "JSON_SET",
	"argument": [
		"JSON",
		"TEXT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#JSON_SET(com.fasterxml.jackson.databind.JsonNode,java.lang.String,java.lang.Object)"
}, {
	"function": "LENGTH",
	"argument": [
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#LENGTH(java.lang.Object)"
}, {
	"function": "LIST_APPEND_ALL",
	"argument": [
		"LIST_OF",
		"List otherList"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#LIST_APPEND_ALL(java.util.List,java.util.List)"
}, {
	"function": "LIST_APPEND",
	"argument": [
		"LIST_OF",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#LIST_APPEND(java.util.List,java.lang.Object)"
}, {
	"function": "LIST_CONTAINS",
	"argument": [
		"LIST_OF",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#LIST_CONTAINS(java.util.List,java.lang.Object)"
}, {
	"function": "LIST_DELETE",
	"argument": [
		"LIST_OF",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#LIST_DELETE(java.util.List,java.lang.Number)"
}, {
	"function": "LIST_FILTER_DUPLICATES",
	"argument": [
		"LIST_OF"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#LIST_FILTER_DUPLICATES(java.util.List)"
}, {
	"function": "LIST_GET",
	"argument": [
		"LIST_OF",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#LIST_GET(java.util.List,java.lang.Number)"
}, {
	"function": "LIST_INDEX_OF",
	"argument": [
		"LIST_OF",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#LIST_INDEX_OF(java.util.List,java.lang.Object)"
}, {
	"function": "LIST_INSERT",
	"argument": [
		"LIST_OF",
		"INT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#LIST_INSERT(java.util.List,java.lang.Number,java.lang.Object)"
}, {
	"function": "LIST_IS_NULL_OR_EMPTY",
	"argument": [
		"LIST_OF"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#LIST_IS_NULL_OR_EMPTY(java.util.List)"
}, {
	"function": "LIST_REVERSE",
	"argument": [
		"LIST_OF"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#LIST_REVERSE(java.util.List)"
}, {
	"function": "LIST_SET",
	"argument": [
		"LIST_OF",
		"INT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#LIST_SET(java.util.List,java.lang.Number,java.lang.Object)"
}, {
	"function": "LIST_SLICE",
	"argument": [
		"LIST_OF",
		"INT",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#LIST_SLICE(java.util.List,int,int...)"
}, {
	"function": "LIST_SORT_NATURAL_ORDER",
	"argument": [
		"LIST_OF"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#LIST_SORT_NATURAL_ORDER(java.util.List)"
}, {
	"function": "LIST_SORT_REVERSE_ORDER",
	"argument": [
		"LIST_OF"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#LIST_SORT_REVERSE_ORDER(java.util.List)"
}, {
	"function": "LIST_TO_JSON_ARRAY",
	"argument": [
		"LIST_OF"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#LIST_TO_JSON_ARRAY(java.util.List)"
}, {
	"function": "MINUS_DAYS",
	"argument": [
		"DATE",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#MINUS_DAYS(java.lang.Object,java.lang.Number)"
}, {
	"function": "MINUS_HOURS",
	"argument": [
		"DATE",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#MINUS_HOURS(java.time.LocalDateTime,java.lang.Number)"
}, {
	"function": "MINUS_MINUTES",
	"argument": [
		"DATE",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#MINUS_MINUTES(java.time.LocalDateTime,java.lang.Number)"
}, {
	"function": "MINUS_MONTHS",
	"argument": [
		"DATE",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#MINUS_MONTHS(java.lang.Object,java.lang.Number)"
}, {
	"function": "MINUS_SECONDS",
	"argument": [
		"DATE",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#MINUS_SECONDS(java.time.LocalDateTime,java.lang.Number)"
}, {
	"function": "MONEY_FORMAT",
	"argument": [
		"NUMBER"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#MONEY_FORMAT(java.lang.Number)"
}, {
	"function": "NOW_DT",
	"argument": [
		""
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#NOW_DT()"
}, {
	"function": "NOW",
	"argument": [
		""
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#NOW()"
}, {
	"function": "NUMBER_ABS",
	"argument": [
		"NUMBER"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#NUMBER_ABS(java.lang.Number)"
}, {
	"function": "NUMBER_ADD",
	"argument": [
		"NUMBER",
		"NUMBER"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#NUMBER_ADD(java.lang.Number,java.lang.Number)"
}, {
	"function": "NUMBER_MULTIPLY",
	"argument": [
		"NUMBER",
		"NUMBER"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#NUMBER_MULTIPLY(java.lang.Number,java.lang.Number)"
}, {
	"function": "NUMBER_SUBTRACT",
	"argument": [
		"NUMBER",
		"NUMBER"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#NUMBER_SUBTRACT(java.lang.Number,java.lang.Number)"
}, {
	"function": "NUMBER_TO_TEXT",
	"argument": [
		"NUMBER"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#NUMBER_TO_TEXT(java.lang.Number)"
}, {
	"function": "PARSE_DATE_PATTERN",
	"argument": [
		"TEXT",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#PARSE_DATE_PATTERN(java.lang.String,java.lang.String)"
}, {
	"function": "PARSE_DATE_TIME_PATTERN",
	"argument": [
		"TEXT",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#PARSE_DATE_TIME_PATTERN(java.lang.String,java.lang.String)"
}, {
	"function": "PARSE_DATE_TIME",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#PARSE_DATE_TIME(java.lang.String)"
}, {
	"function": "PARSE_DATE",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#PARSE_DATE(java.lang.String)"
}, {
	"function": "PLUS_DAYS",
	"argument": [
		"DATE",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#PLUS_DAYS(java.lang.Object,java.lang.Number)"
}, {
	"function": "PLUS_HOURS",
	"argument": [
		"DATE",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#PLUS_HOURS(java.time.LocalDateTime,java.lang.Number)"
}, {
	"function": "PLUS_MINUTES",
	"argument": [
		"DATE",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#PLUS_MINUTES(java.time.LocalDateTime,java.lang.Number)"
}, {
	"function": "PLUS_MONTHS",
	"argument": [
		"DATE",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#PLUS_MONTHS(java.lang.Object,java.lang.Number)"
}, {
	"function": "PLUS_SECONDS",
	"argument": [
		"DATE",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#PLUS_SECONDS(java.time.LocalDateTime,java.lang.Number)"
}, {
	"function": "REGEX_FIND_ALL",
	"argument": [
		"TEXT",
		"TEXT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#REGEX_FIND_ALL(java.lang.String,java.lang.String,java.lang.Object...)"
}, {
	"function": "REGEX_FIND",
	"argument": [
		"TEXT",
		"TEXT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#REGEX_FIND(java.lang.String,java.lang.String,java.lang.Object...)"
}, {
	"function": "REGEX_MATCHES",
	"argument": [
		"TEXT",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#REGEX_MATCHES(java.lang.String,java.lang.String)"
}, {
	"function": "REGEX_REPLACE",
	"argument": [
		"TEXT",
		"REGEX",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#REGEX_REPLACE(java.lang.String,java.lang.String,java.lang.String)"
}, {
	"function": "REGEX_SPLIT",
	"argument": [
		"TEXT",
		"REGEX"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#REGEX_SPLIT(java.lang.String,java.lang.String)"
}, {
	"function": "ROUND",
	"argument": [
		"NUMBER",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#ROUND(java.lang.Number,int...)"
}, {
	"function": "START_OF_DAY",
	"argument": [
		"DATE"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#START_OF_DAY(java.lang.Object)"
}, {
	"function": "STARTS_WITH",
	"argument": [
		"TEXT",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#STARTS_WITH(java.lang.String,java.lang.String)"
}, {
	"function": "SUBSTRING",
	"argument": [
		"TEXT",
		"INT",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#SUBSTRING(java.lang.String,int,int...)"
}, {
	"function": "TEXT_FORMAT",
	"argument": [
		"TEXT",
		"OBJECT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TEXT_FORMAT(java.lang.String,java.lang.Object...)"
}, {
	"function": "TEXT_GET_SYMBOL",
	"argument": [
		"TEXT",
		"INT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TEXT_GET_SYMBOL(java.lang.String,int)"
}, {
	"function": "TEXT_INDEX_OF",
	"argument": [
		"TEXT",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TEXT_INDEX_OF(java.lang.String,java.lang.String)"
}, {
	"function": "TEXT_IS_NULL_OR_BLANK",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TEXT_IS_NULL_OR_BLANK(java.lang.String)"
}, {
	"function": "TEXT_IS_NULL_OR_EMPTY",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TEXT_IS_NULL_OR_EMPTY(java.lang.String)"
}, {
	"function": "TEXT_JOIN",
	"argument": [
		"LIST_OF_TEXT",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TEXT_JOIN(java.util.List,java.lang.String...)"
}, {
	"function": "TEXT_LAST_INDEX_OF",
	"argument": [
		"TEXT",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TEXT_LAST_INDEX_OF(java.lang.String,java.lang.String)"
}, {
	"function": "TEXT_REPLACE",
	"argument": [
		"TEXT",
		"TEXT",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TEXT_REPLACE(java.lang.String,java.lang.String,java.lang.String)"
}, {
	"function": "TEXT_SPLIT",
	"argument": [
		"TEXT",
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TEXT_SPLIT(java.lang.String,java.lang.String)"
}, {
	"function": "TEXT_TO_DECIMAL",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TEXT_TO_DECIMAL(java.lang.String)"
}, {
	"function": "TEXT_TO_INTEGER",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TEXT_TO_INTEGER(java.lang.String)"
}, {
	"function": "TEXT_TRIM",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TEXT_TRIM(java.lang.String)"
}, {
	"function": "TO_DATE_TIME",
	"argument": [
		"DATE_TIME"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TO_DATE_TIME(java.time.LocalDate)"
}, {
	"function": "TO_DATE",
	"argument": [
		"DATE_TIME"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TO_DATE(java.time.LocalDateTime)"
}, {
	"function": "TO_LOWERCASE",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TO_LOWERCASE(java.lang.String)"
}, {
	"function": "TO_UPPERCASE",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TO_UPPERCASE(java.lang.String)"
}, {
	"function": "TOKEN_GET_CLAIM_JSON",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TOKEN_GET_CLAIM_JSON(java.lang.String)"
}, {
	"function": "TOKEN_GET_CLAIM_TEXT",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TOKEN_GET_CLAIM_TEXT(java.lang.String)"
}, {
	"function": "TOKEN_GET_USER_LOGIN",
	"argument": [
		""
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TOKEN_GET_USER_LOGIN()"
}, {
	"function": "TOMORROW",
	"argument": [
		""
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#TOMORROW()"
}, {
	"function": "UNCAPITALIZE",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#UNCAPITALIZE(java.lang.String)"
}, {
	"function": "URL_DECODE",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#URL_DECODE(java.lang.String)"
}, {
	"function": "URL_ENCODE",
	"argument": [
		"TEXT"
	],
	"link": "https://tcrm-api.tinkoff.ru/procedure/apidocs/ru/tinkoff/tcrm/procedure/expression/function/SpelCustomFunctions.html#URL_ENCODE(java.lang.String)"
}];

	window.autocomplete = function(inp, arr) {

		function acomp(e) {
			var kek = this;

			setTimeout(function() {

			var a, b, i, val = kek.value;
			var dropdown = document.querySelector("tui-dropdown-host tui-dropdown-box tui-data-list");
			if (dropdown != null) {
				var polymorpheus = dropdown.querySelector(".t-empty");
				if (polymorpheus != null) {
					polymorpheus.style.display = "block";
				}
			}
			/*close any already open lists of autocompleted values*/
			closeAllLists();
			if (!val) {
				return false;
			}
			currentFocus = -1;
			/*create a DIV element that will contain the items (values):*/
			a = document.createElement("DIV");
			a.setAttribute("id", kek.id + "autocomplete-list");
			a.setAttribute("class", "autocomplete-items");

			var z = kek.selectionEnd;
			var str = val.substr(0, z);
			var x = "";
			var y = 0;
			var funcMode = false;

			for (var i = str.length - 1; i >= 0; i--) {
				if ((str[i] + str[i + 1]) == "##") {
					x = str.substr(i + 2, str.length);
					y = i + 1;
					funcMode = true;
					break;
				}
			}

			if (funcMode) {
				/*append the DIV element as a child of the autocomplete container:*/
				if (dropdown != null) {
					dropdown.insertBefore(a, dropdown.firstChild);
				}
				/*for each item in the array...*/
				if (x.substr()) {}
				for (i = 0; i < arr.length; i++) {
					/*check if the item starts with the same letters as the text field value:*/
					if (arr[i].function.toUpperCase().includes(x.toUpperCase())) {
						/*create a DIV element for each matching element:*/
						b = document.createElement("DIV");
						b.className = "autocomplete-button-wrapper";
						var funcButton = document.createElement("DIV");
						funcButton.className = "autocomplete-button";
						/*make the matching letters bold:*/
						var funcName = arr[i].function;
						var funcLink = arr[i].link;

						funcButton.innerHTML = "<span>ƒ</span>" + funcName.substr(0, funcName.indexOf(x.toUpperCase())) + "<strong>" + x.toUpperCase() + "</strong>" + funcName.substr((funcName.indexOf(x.toUpperCase()) + x.length));
						b.innerHTML = b.innerHTML + "<a href='" + funcLink + "' target='_blank'>?</a>";

						/*insert a input field that will hold the current array item's value:*/
						funcButton.innerHTML += "<input type='hidden' value='" + arr[i].function+"(" + arr[i].argument.join(', ') + ")'>";
						/*execute a function when someone clicks on the item value (DIV element):*/
						funcButton.addEventListener("click", function(e) {
							/*insert the value for the autocomplete text field:*/
							var gold_string = this.getElementsByTagName("input")[0].value;
							inp.value = [val.slice(0, y), gold_string, val.slice(z)].join("");
							inp.dispatchEvent(new Event('input', {
								bubbles: true
							}));
							inp.focus();
							inp.selectionEnd = y + gold_string.length;
							/*close the list of autocompleted values,
							(or any other open lists of autocompleted values:*/
							closeAllLists();
						});
						a.appendChild(b);
						b.appendChild(funcButton);

						var funcTemplate = arr[i].template;
						var template;

						if (funcTemplate != null) {
							var templateButton = document.createElement("DIV");
							templateButton.className = "autocomplete-template";
							templateButton.innerHTML = "вставить шаблон";
							templateButton.innerHTML += "<input type='hidden' value='" + arr[i].function + "( " + funcTemplate + " )'>";
							templateButton.addEventListener("click", function(e) {
								/*insert the value for the autocomplete text field:*/
								var gold_string = this.getElementsByTagName("input")[0].value;
								inp.value = [val.slice(0, y), gold_string, val.slice(z)].join("");
								inp.dispatchEvent(new Event('input', {
									bubbles: true
								}));
								inp.focus();
								inp.selectionEnd = y + gold_string.length;
								/*close the list of autocompleted values,
								(or any other open lists of autocompleted values:*/
								closeAllLists();
							});
							b.appendChild(templateButton);
						}

						if (polymorpheus != null) {
							polymorpheus.style.display = "none";
						}
					}
				}
			}
			}, 100);
			
		}
		/*the autocomplete function takes two arguments,
		the text field element and an array of possible autocompleted values:*/
		var currentFocus;

		/*execute a function when someone writes in the text field:*/
		["click", "input"].forEach(event => inp.addEventListener(event, acomp));

		function closeAllLists(elmnt) {
			/*close all autocomplete lists in the document,
			except the one passed as an argument:*/
			var x = document.getElementsByClassName("autocomplete-items");
			for (var i = 0; i < x.length; i++) {
				if (elmnt != x[i] && elmnt != inp) {
					x[i].parentNode.removeChild(x[i]);
				}
			}
		}
		/*execute a function when someone clicks in the document:*/
		// document.addEventListener("click", function(e) {
		// 	closeAllLists(e.target);
		// });
	}

	window.text_field_recognizer = function() {
		var focused_element = document.activeElement;
		var list = document.querySelector("tui-dropdown-host tui-dropdown-box tui-data-list");
		if (focused_element.tagName == "TEXTAREA" && focused_element.classList.contains("stvpd_autocompl") == false && list != null) {
			focused_element.classList.add("stvpd_autocompl");
			/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
			autocomplete(focused_element, functionsJSON);
			focused_element.addEventListener("focusout", function(e) {
				//focused_element.classList.remove("stvpd_autocompl");
				focused_element.removeEventListener("input", function(e) {});
				focused_element.removeEventListener("click", function(e) {});
				focused_element.removeEventListener("focusout", function(e) {});
			});
		}

		setTimeout(() => {
			text_field_recognizer()
		}, 100);
	}

	text_field_recognizer();

})();