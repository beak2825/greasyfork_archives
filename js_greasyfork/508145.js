/* ==UserStyle==
@name         WSB Merito Extranet/Moodle Dark Theme
@author       griffi-gh
@version      11.2.1
@license      MIT
@namespace    griffi-gh-wsb
@var color    moodleSheetBg "Moodle Sheet Background" #131213
@var color    moodleSheetFg "Moodle Sheet Foreground" #201e20
@var color    moodleSheetFgNested "Moodle Nested Sheet Foreground" #2b2b2b
@var color    moodleDarkActive "Moodle Dark Active" #333
@var color    moodleBorder "Moodle Border Color" #444
@var color    moodleText "Moodle Primary Text" #ffffff
@var color    moodleTextLL "Moodle Light Text (LL)" #eeeeee
@var color    moodleTextL "Moodle Light Text (L)" #dddddd
@var color    moodleIcon "Moodle Icon Color" #ffffff
@var color    moodleAccentActive "Moodle Accent Color" #0f6cbf
@var color    moodleAccentDarker "Moodle Darker Accent (Hover)" #0c589c
@description Dark theme on moodle2.e-wsb.pl
@downloadURL https://update.greasyfork.org/scripts/481730/WSB%20Merito%20ExtranetMoodle%20Dark%20Theme.user.css
@updateURL https://update.greasyfork.org/scripts/481730/WSB%20Merito%20ExtranetMoodle%20Dark%20Theme.meta.css
==/UserStyle== */

@-moz-document domain("portal.wsb.pl") {
    @layer {
        @media screen {
            html, body, #content-wrapper, #navi {
                background: #222 !important;
                color: white !important;
            }

            :is(body[onload="window.print();"], html:has(body[onload="window.print();"])) {
                background: white !important;
                color: black !important;
            }

            #content-background {
                background: #222 !important; 
                background-color: #222 !important;
                background-image: none !important;
            }

            input[type="text"],
            input[type="date"],
            input[type="datetime"],
            input,
            textarea,
            input[type="password"],
            input[type="file"],
            input[type="submit"],
            input[type="button"],
            input[type="reset"],
            select,
            textarea,
            .textarea,
            button,
            .aui-field-input-text {
                color: white !important;
                background-color: #444 !important;
            }

            .portlet-content,
            .portlet-content-container, 
            .portlet-body, 
            .top-bar,
            .mwContent {
                background: #333 !important;
            }

            .portlet-teba-microservice .portlet-content {
                background: none !important;
            }

    /*         .mwContent * {
                background: unset !important;
                color: white !important;
            } */

            .top-bar * {
                background: unset !important;
            }

            .top-bar a {
                color: white !important;
                text-shadow: unset !important;
            }

            .top-bar #sitechanger select {
                color: white !important;
            }

            #copyright {
                color: white;
            }

            .breadcrumb :is(li, a) {
                color: white !important;
            }

            #experia img {
                filter: invert(100%);
            }

            /* pulpit calendar/news fixes */
            .wiadomosci_pulpit .pulpit-news,
            table.calendar th {
                background: none !important;
            }

            table.calendar_week td.row-cell, table.calendar_week td.hour-first, div.calendar_week-legend {
    /*             background: transparent  url('data:image/gif;base64,R0lGODlhBQAHAHAAACwAAAAABQAHAIIbGxsVFRUODg4JCQkFBQUDAwMAAAAAAAADDQiq0S0QjjmJtSXrnQAAOw==') repeat-x top !important; */
                background: transparent !important;
            }

    /*         .day-calendar-plan_zajec-container .plan-tyg-table-txt th {
                background: #444 !important;
            } */

            div.calendar-days-container {
                /* XXX: used to be #222 */
                background: #333 !important;
            }

            /* my plan */
            .tab-chooser-container {
                background: #444 !important;
            }

            .tab-chooser, .calendar-navigator {
                background: #333 !important;
            }

            .plan-tyg-table-txt, .plan-tyg-table-txt tr,
            .calendar_month-month > table {
                background: none !important;
            }

            .calendar_month-month > table td.day-today {
                background: rgba(255, 255, 255, 0.1) !important;
            }

            /* my plan: tweaks */

            /* odwolane lub przeniesione */
            :is(.event-status-a, .event-status-b) > :not(:first-child) {
                text-decoration: line-through;
                background: rgba(255, 0, 0, 0.05) !important;
            }

            /* przeniesione lub przeniesione z innego terminu */
            :is(.event-status-f, .event-status-b) > :not(:first-child) {
                background: rgba(128, 128, 255, 0.1) !important;
            }

    /*         .event-status-a > :first-child {
                background: rgba(255, 0, 0, 0.25) !important;
            } */

    /*         .same-day-as-before.event-status-default > :first-child { */
            .same-day-as-before > :first-child {
                visibility: hidden;
            }

            /* gen.*/

            .label, .consent-label {
                color: #ccc !important;
            }


            /* dark icons and corners */
            #navi ul.navigationgroup {
                background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAATCAYAAACdkl3yAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEeSURBVDhPY1RSUvrPQAXABKXJBjw8PF84ODjSKTKIk4vru7q6hum1a9dmUWQQKwtrxerVq26A2GQbxM3N0/3p08f1UC55BgkKCs7++vXL5Hv37j2GCpFukLCwyPL37983IxsCAiQZJCoqtvrt2zfl6IaAANEGCQsLL3r9+lUxNkNAgCiDhISE5r59+7YGlyEgQNAgERGRVe/evWvEZwgI4DVITExs45s3b0oIGQICOA0SFxff9erVq1xiDAEBrAYBDTkDjOJUYg0BAQyDgFF8E2hI8I0bNx5BhYgCKAYBA/bhv39/PUg1BATgBgkJCT/7+fOn/enTpx9AhUgCYIOAeecVIyOD9cWLFx+CRckATGrq6jeUlJTJdgkEMDAAAEFRdUqvDBUZAAAAAElFTkSuQmCC') !important;
            }

            .href.nastepny {
                background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAiBAMAAACZ/SWSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAkUExURQCI8huV8ztFTDMzMxBxvjM6QTU3OC9HWStHXDA7QxiT8zpFTYOW0fUAAAAJcEhZcwAACxMAAAsTAQCanBgAAABESURBVBjTY2BUNgYCBgZXCMWSDKYYiiFUM5mUJ4RimQymQFwGCJcBwmWAcJEpT2QlnsjaPUm1vRjZKxCPcW02NjY2BgAhSSESySTEpQAAAABJRU5ErkJggg==') !important;
            }

            html:not(:has(body[onload="window.print();"])) .results-grid {
                background: #333 !important;
            }

            html:not(:has(body[onload="window.print();"])) .results-grid tr:nth-child(2n) {
                background: #444 !important;
            }

            .ui-widget-content {
                background: #222 !important;
                color: white !important;
                border: 1px solid #555 !important;
    /*             border-radius: 4px !important; */
            }

            table.calendar_week td {
                background: #333 !important;    
            }

            .pulpit-news-container,
            .columns-1-2 #column-3 section.portlet .portlet-content-container,
            div.portlet-boundary_Microservice_:not(.portlet-barebone) div.portlet-content-container {
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5) !important;    
            }

            .dodajdomoichskrotow-portlet button {
                color: white !important;
            }

            .alert-info {
                background: #444 !important;
                border: 1px solid #555 !important;
                color: white !important;
            }

            #footer, .breadcrumb {
                background: #333 !important;
            }

            #footer, #server-name {
                color: white !important;
            }

            .beta.nav-item {
                border: none !important;
                border-left: #505050 1px solid !important;
                border-right: #555 1px solid !important;
                background: #444 !important;
                /* HACK */
                padding-bottom: 2px;
            }


            #top-bar {
                border-bottom-color: #555 !important;
                /* MAKE TOP BAR STICKY */
    /*             position: sticky;
                inset: 0;
                bottom: unset;
                z-index: 999; */
            }

            /* payments screen */
            .portlet-teba-microservice.platnosciiwplaty-portlet table,
            .portlet-teba-microservice.platnosciiwplaty-portlet #konta_bankowe_div,
            .portlet-teba-microservice.platnosciiwplaty-portlet #tabelki {
                background: none !important;
            }

            .portlet-teba-microservice.platnosciiwplaty-portlet #suma tr:nth-child(2n) td,
            .portlet-teba-microservice.platnosciiwplaty-portlet #konta_tabelka tr:nth-child(2n) td,
            .portlet-teba-microservice.platnosciiwplaty-portlet #borderki tr:nth-child(2n) td{
                background-color: #1115 !important;
            }

            .portlet-teba-microservice.platnosciiwplaty-portlet th.theader,
            .portlet-teba-microservice.platnosciiwplaty-portlet #borderki th {
                background: #444 !important;
                box-shadow: 0px 6px 8px -4px #3332 !important;
            }
                
            /* zglos blad */
            .ddm-label {
                color: white !important;
            }
            
            .lfr-ddm__default-page-header-title {
                color: #0088f2 !important;
            }
            
            /* fix unstyle btn */
            .btn-unstyled, .menubar-toggler {
                background-color: rgba(0,0,0,0.001) !important;
            }
            
            /* fix search icn */
            #searchbox .input-group .input-group-inset-item {
                background: #555 !important;
            }
            
            /* inverted icons :3 */
            /* can't just throw a filter at it due to nested elements and stuff */
            /* this is less hacky anyway :3 */
            #user-messages {
                background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAfCAYAAACGVs+MAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANSSURBVFhH7ZZdaM9RGMc3LzMaI6/ZldeUkFxQFIkLUaOkhGyFK0V5S9uVlUgUFxIRMTdzgURRQrngQsKNNu7kLS+bl83LNp/P+f3Or99mLsi42bc+nXOe3/M/z3POec7ZCnrUo/+twps3rh+mLU6GQYVp211qT1vVYgJ5wz+XCbyjHZwMg67AcSiDgWCC7kpM1H4k2qJPtLVBVC9ogmdQAUsgqtEEmul8hTcwBl7Cxrnz5p+j/Un4p73f1nI4CKPhCQyHongEH2AE1MBWULehgkQa8HFl/aDzSkV1ttl3Ue7EeDgJs0Htgyp4CyVuj3KrvxJsG205mJA/qCf4euzt0MJY/86BREWbPvoafB3Ug3N9hGXMs522FUogOEe5JQU4XKQZBxcco6MkUQelfPO4vifmDjKwMqg+g6AOjoFyLnfifBilsVQ+gVA4BOpPoNewlOFmbcjze8y3RbTfwBX2hrh6W21+Wwyu2t+oTeBc1la87lmR5hOIq2g3CTskYdFMhXswEi6DZ6g+Q9x2g6u9cAmsp/swDQ6BMngWI207JBBXo9pIolhI4iHMwHYg+RSK1Mkng4G/wJTU5vmq/TAdHoCB48rzMYLyCUSZnY6B3G5soZkDz8GVPYK1UAkG0vYK9Ik36VcvbNbvKoHsI0GbhSTKoZq+V3MSnA0OyfU6kXSDbSLoUw3eJndInDMeVwd1VQMhAQPbEngHjdVbQ/80ra/aKtgAUV43bY1wCnxP/E08kjBXTl3WQJTvQQvByuAq4z2JOaxwF/QBf+cVmwUzwadbmzfD4LWgLMpr4LPuTvx0hfMJOLErbyXwSroNsBAsstXYV4HXqy8Uged7B+6CdaJN/N1qWAO+hgtSm3P6AKkQS2UJMPkL23SbXa0BzH4C32qx94YBjPNnaWCJNnHsTpwBHx/ncC7n9HiyWCr+LfDsVoB33HuvqnDcbQcfJ7A2sgcExWKNyaisgJF2d0/thDAXegjWlQkNNgGLyq3zj426BZUEf5oMOwr/tPfbGgvugNdUmdw3E3hPpzSYkvd7A8HfYx9F3yPKr/BPFK+g78cQOALutmqKRxDl/wQmkxXJX5a3wAUPCyPkCs3sU8pQ6K7gyrkNHuNlxdijHv0nFRT8AOJzJ6xJ3yU9AAAAAElFTkSuQmCC') !important;
            }
            
            #user-notes {
                background-image:  url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAfCAYAAACPvW/2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARVSURBVFhHzZhbiFVVGMe32QVJxLtBkjSGBiJGDkFaqamVIhqEihpGEIoKCl1oyJBeEg18sBdLX7T0IUciUkfRHDXvZoFGRN4qCOxCTmZFCqW/395rDefM7H3mnGke+sNvvrW/vc9a3/rWZa89yf9N3XY17QjFmtUPxsOjMArugwFwB6hf4Tv4Ag7BnilTp/2ErahaA7oNFsF0mKijRm2DdQTWnF22Vy0BrYIZcH96lSR/wD44AKfhPPxCY39jE+rtjxkCo+EJmAYxe+/DgvhsqaoJaA68DA+mV0myH9bBx1R4LfVUIdq5C2N2X4Se8DnMoY5z2FZ1FNBGeC4rJifgJSo4kl12TrTnXNsCD8H3MIE6v8WmuiXYtjLdu8Bg/oIlMOa/BqOow6F9DJrAId0ArcrLkKvHyecKMvKnqeQMtktFu3diXIHD4HXaeFN/XoZMp8F8DWaly4NR1PsnZll2lcwOtl1Am+BJuAgT+dGPOivp4IHmSaGYK+67ynJF/bsxh2EkGZunrzSguTAfjNxhuqSzkmjsVcxe7MzMU65w/93sqlCOiHKDTW5Ni5lcjuoVgvkylAsVem6DjePGP96YOvNVx7N9QllZbuE3LdllcizYh/0TM7QCbOAkvKOjkkJGtmZXSYOZCAF6b1W4NjMLwAAuB/bCBTgFUS595YprDSjOA2f7jVDOlY1hDKYOFtJT55u/j0HZc3d1g4lZ+AQaSmwjz8asXQ/2dv84ZL6THD9XlT/IVajAXsdJOqtkqPR5vw5fPc+6CxuMPoNfjb+o7t7B/uYfMzTOAtraQXbstZkwI5NjMCHQ2NvU2jgYlEoDzYq5GhHsV/4xQ+nsRgeDLVMYBuW8sRFTrj8Oc7xvRlrwO6RRvwdrJ4rknqc8oqQZKoswRzbgJLSnBmHZyRkxc8r7Bmfg+qQ79C0aLvaebphZ2VV6akgDiumOE7CtVkPbCr0W78Xem7l0woL+ydBEMEX1qqfAl+0hpsunOnyXXcH2gt44LdekMERmo4HGDaQq0a7J8ARRD8tpe6V+nbGH9wZbq2IG4iSuVovBYD6LwSgD8l2iOnMkVbFDceg7FNnxDP5WdpWsCTaVAXkMVc8GW6tihqoKiGDckT3z9ICNZOcD/VEG9BH4PnmAh3NfkpUU9pv10GFA1D8U42oaDNsJ5nn9pYoHtKWwFvxMqefBH3R2pWhnAsZdO55GZ9POVWyZzJB6Gz6EQdDEj7VdIurqAa4+9yyDcVt4Ji8YVXqE9Z2yHR4BP/D8IjiO7ZSo17eAZ3JPEvfoQ+upc2Eo56rtmdovT0+NU+BfeA9WUknZp0olUd/dGBfIC+Cmp8zOG9RzNLssVt4hX3kmij3xhevWsBM8L30DP4N+PwjEg7oHrDEwFuJUcAJvIhA/p6pSUUDK3r0G7VZCFXIpbyaQwsqLVCmgKHs7FTwV+HE3HAaC8hToPxXOgluHQ+K32z9QlQg6lFSS3AQszGftUhjQnwAAAABJRU5ErkJggg==') !important;
            }
            
            #user-calendar {
                background-image:  url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAfCAYAAAAfrhY5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPISURBVFhHtZdbiFZVGIb/ybFSJEHNCE1IDfQiQaKLIFK6SQUJIoQQURAENa80IqUo0KiICBQhKEVBtIugIBK8iLoRgghRxBMKHaCkPJ/GcRx7nvXvT9e/Zu9/ZMAXHr611t57vetbp/mn5+effuxttVoPwR1Qt6vYU8VoD9letoXqnkWbUZ/od1DzRyiMnjf/5auU280jFH1UpWbhMZrwMNzS3MIgHw5QXkv5xerhIIRiZvKsIpvIRMXzfCaN1q/DD/jsrTx7NB9Fw23ilzSshAet9fh9hl9vGjWFmYRTlmt0DLbBEphnwzD6Fly/t2GKDYX6YCIDuO50qKlVrNMXsB0+TrXhtYGOtxK/aVeHSM/HoqBuVrFOG2AL3K/5DmZyM3FpuzpEZp5OVJh3k7OyEZ5NteH1EmyCianWRbHmLxAOwi/wLsTZV7Gb853eTXXv3wLre2ACPMnS/Fua74M3bBuJ6LAq1QufM4SnYXKd+fewGMx8FEQWKs/Edom2iLXvY5T2FD5/ElzGZN5tzcPAy8ZNYgeBddtjAPZzkw77gupZUKvSvMxOg354Brz9PoS3YDY4CJ/LDTCzJbACXNfyb4TK+2/c7X7gixq8CSfBi+Yd+ASOwgLwuVflq/ArfA07YS7Zu8lUmdBdleZ1ozQL5aXxKbhpfG83KI+Ut9pzqdaWsxHqyDZXtzVXZvU5zILXwSmP+/9xGA9/wAH4Cq6Ays0b1WQeo3XHX4YT4D09F9aBOg5uLPUKrIFxqXZvBsusO+rdMo91V6vhL/gNXgNNF4FrPgbUU9Cxpsh62XZXpXk+svyji3AO3PnKe2BFu9gaqGJTIvdtHvKDGIi/dPbCEzAJ3PGavwcLIXZ1k5oSGmJejtK6U6s8t26oj+C8DSj/+56bNJU71G3Nlcau8SqIzbQM3OXqcBVV0/Q2tTeaO9q4Qj3f/qD4G86C59tTEJdK9OEPw9CjVSyz7qiX5vlD11U+gN/BzCeDm84BzAeXwrtAeST/gwtVVI1Zq6bM/chMNH8fvNvnwPMwDZbDNfCYOWA35T/gb8EZcIj7PQbVqDCPEeaZR9mO3dFHwKl26h2UU+s7fiu93OeXwMxdFsn7U1FPfuV6xbExuuYSuz2XZzue5yQxgH64AenPbNWswi/FNAKmaDrhNHiEvDwuQUxbx2gzRdal6t43AX/B7Eq1Vmusg8v/afDnsdfog9Za/Lbj1xv/q92hoZ+yZ9hdHOsZKDOJbMr2iE3vq6vwHT778Un9a56OFI19lH1pxKKPqtQsPFxvlrQ18D+XMjsnQBcXCwAAAABJRU5ErkJggg==') !important;
            }
            
            /* fix weird bg of user box (login/nr albumu) */
            #user-wrapper :is(.portlet-content-container, .portlet-body, .mwContent) {
                background: none !important;
            }
            
            /* top thingy/header coloring (dirty fix) */
            .container-fluid.container-fluid-max-xl.pb-0.pl-4.pr-4.pt-4 {
                background: #333 !important;
                /* box-shadow: 0 8px 2px -2px black;*/
            }
            
            /* use dark-opt trans logo */
            /* VERY dirty hack to "replace" the image with css */
            a.logo.custom-logo {
                 background-image: url('data:image/png;base64,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') !important;
                background-size: cover !important;
                /*height: 4rem !important;*/
                display: inline-block !important;
            }
            
            a.logo.custom-logo img {
                opacity: 0.001 !important;
            }
            
            /* user info panel - invert the (i) icon */
            .user-info {
                filter: invert(100%);
            }
            
            /* fix white border around shit */
            
            .teba .portlet-decorate .portlet-content,
            .portlet-teba-microservice .portlet-content-container {
                border-color: #444 !important;
            }
            
            /* fuck the notices */
            .news-what-info :is([style*="color:black"], [style*="color: black"]) {
                color: white !important;
            }
            
            /* fuck the notices, AGAIN */
            .news-what-info :is([style*="background:white"], [style*="background: white"]) {
                background-color: unset !important;
            }
					
						/* fix last crumb */
						.breadcrumb > li .active, 
						.breadcrumb-item .active {
							  /*color: #0087f1 !important;*/
								color: #eee !important;
						}
					
					/* fix file explorer uis */
					#main-content[style="background-color: rgb(255, 255, 255); padding: 2em;"],
					.management-bar-light,
					.management-bar-light .navbar-overlay {
						background-color: #333 !important;
					}
					.lfr-search-container-list :is(
						.list-group-header, 
						.list-group-item
					) {
						background-color: #222 !important;
					}
					.lfr-tooltip-scope svg.lexicon-icon.lexicon-icon-search {
						fill: black !important;
					}
						
					/* search box border */
					#searchbox {
						background: unset !important;
					}
					#searchbox .lexicon-icon-search {
						color: white !important;
						fill: white !important;
					}
					
					/* default is #333, bweh */
					label {
						color: #ddd !important;
					}
						
					/* wykladowca kalendarz */
					.calednar-container [style="background-color: white; width: 100%;"] {
						background-color: #333 !important;
					}
					.portlet-teba-microservice .month-calendar-today,
					.portlet-teba-microservice .calendar_week-monthplan,
					.portlet-teba-microservice .calendar_month .go_btn,
					.portlet-teba-microservice .month-calendar {
						background-color: #333 !important;
					}
					.portlet-teba-microservice .calendar_month tr.current-week {
						background-color: #444 !important;
					}
        }
    }
}

@-moz-document domain("login.wsb.pl") {
    @layer { 
        @media screen {
            html, body {
                background: #222 !important;
                color: white !important;
            }

            #main {
                background: #333 !important;
            }

            h1 {
                color: white !important;
            }

            #login-page .form .row label {
                color: unset !important;
            }

            .copyright {
                color: #eee !important;
            }

            .copyright a {
                color: #bff !important;
            }
            
            /*fix label colors*/
            :is(#passwordSection, #usernameSection) label {
                color: white !important;
            }
            
            /* aaaaa */
            .message-box {
                color: black !important;
            }
            
            a {
                color: #6666ee !important;
            }
            
            [for="rememberMe"] {
                color: white !important;
            }
        }
    }
}

@-moz-document domain("okd.wsb.pl") {
    @layer { 
        @media screen {
            body {
                background: #222 !important;
                color: #eee !important;
            }

            /* too lazy to actually style the table :3 */
            /* so just make them light again in order to ensure readability */
            table {
                background: white !important;
                color: black !important;
            }

            .page-footer {
                background: #333 !important;
            }

            .question:nth-child(2n+1) {
                background: #333 !important;
            }

            .level1, .level2, .level1 *, .level2 *, #glowne_zalozenia {
                color: #ddd !important;
            }
        }
    }
}

@-moz-document domain("moodle2.e-wsb.pl") {
	/* Custom colors: */
	/*:root {
		--sheet-bg: #131213; 
		--sheet-fg: #201e20; 
		--sheet-fg-nested: #2b2b2b; 
		--dark-active: #333;
		--borderr: #444;
		--text: white; 
		--text-ll: #eee;
		--text-l: #ddd;
		--icon: white;
        --accent-active: #0f6cbf; 
        --accent-darker: #0c589c; 
	}*/
    
    /* For Stylus/Stylish */
    :root {
        --sheet-bg: var(--moodleSheetBg, #131213);
        --sheet-fg: var(--moodleSheetFg, #201e20);
        --sheet-fg-nested: var(--moodleSheetFgNested, #2b2b2b);
        --dark-active: var(--moodleDarkActive, #333);
        --borderr: var(--moodleBorder, #444);
        --text: var(--moodleText, white);
        --text-ll: var(--moodleTextLL, #eee);
        --text-l: var(--moodleTextL, #ddd);
        --icon: var(--moodleIcon, white);
        --accent-active: var(--moodleAccentActive, #0f6cbf); /* default accent */ 
        --accent-darker: var(--moodleAccentDarker, #0c589c); /* e.g. hover colors */
    }
	
	/* =========== WARNING IF THEME IS NOT SET TO "BOOST" ================= */
	.branding::after {
		content: "WARNING: THE \"DEFAULT\" THEME IS NOT SUPPORTED YET! \A SET THE PREFERRED THEME TO \"BOOST\" IN PREFERENCES TO ENSURE DARK THEME WORKS PROPERLY! \A DO NOT REPORT ANY ISSUES IF YOU SEE THIS MESSAGE!";
		font-family: monospace;
		white-space: pre;
		color: red;
		font-weight: bolder;
		background: black;
		font-size: 1rem;
		position: fixed;
		top: 0;
		left: 50vw;
		transform: translate(-50%);
		z-index: 999999;
		pointer-events: none;
		text-align: center;
	}
	
	/* ============= IMAGE HACKS */
	img[src*="theme/image.php/boost/core/1725975808/i/arrow-left"],
	img[src*="theme/image.php/boost/mod_forum/1727946888/monologo"],
    img[src*="theme/image.php/boost/mod_page/1738162837/monologo"],
    img[src*="theme/image.php/boost/quiz/1738162837/monologo"],
    img[src*="theme/image.php/boost/forum/1738162837/monologo"],
    img[src*="theme/image.php/boost/assign/1738162837/monologo"]
    {
		filter: invert(100%);
	}
	/* main logo */
  /* img[src*="pluginfile.php/1/core_admin/logocompact/300x300/1727209188/logowsp_m2.png"],
	img[src*="pluginfile.php/1/core_admin/logocompact/300x300/1727946888/logowsp_m2.png"] {
		filter: brightness(150%) invert(100%) hue-rotate(180deg);
	} */
	.navbar-toggler-icon {
		filter: invert(100%);
	}
	
	/* ============= GENERIC STYLES ============= */
	/* Broad styles, may break shit but have the most effect */
	body {
		background: var(--sheet-bg) !important; 
		color: var(--text) !important;
	}
	
	/* seems to only appear on the error screen */
	body > #page {
		background-color: background: var(--sheet-fg-nested) !important;
	}
	
	:not(:is(.text-success, .text-danger)) i:is(.icon,.fa):not(:is(.text-danger, .text-success)) {
		color: var(--icon) !important;
	}
	.bg-white { /* Generic "white" background, e.g. the navbar */
		background-color: var(--sheet-fg) !important;
	}
	.card { /* Generic Nested cards */
		background-color: var(--sheet-fg-nested) !important;
	}
	.list-group-item { /* Generic list-group item */
		background-color: var(--sheet-fg-nested) !important;
	}
	.btn:not(.btn-link) { /* Generic button */
		color: var(--text) !important;
	}
	.btn.btn-icon:hover { /* Generic icon button (hover) */
		background-color: var(--dark-active) !important;
	}
	.btn-secondary {
		background-color: var(--sheet-fg-nested) !important;
		border-color: var(--borderr) !important;
	}
    .border-bottom {
        border-bottom-color: var(--borderr) !important;
    }
    .border-top {
        border-top-color: var(--borderr) !important;
    }
	/* General table styles */
	.generaltable { 
		color: var(--text-l) !important;
	}
	.generaltable tbody tr:hover {
		color: var(--text) !important;
	}
	.generaltable th, .generaltable td {
		border-top-color: var(--borderr) !important;
	}
    :root .generaltable thead .sticky-column, 
    :root .generaltable tbody tr:nth-of-type(2n) {
        /* background-color: var(--sheet-fg-nested); */
         background-color: var(--sheet-fg); 
    }
	.table {
		color: var(--text) !important;
	}
	/* General modals */
	.modal-content { 
		background: var(--sheet-fg-nested);
	}
	.modal-title {
		/* TODO actually make the modal titlebar darker */
		color: black !important;
	}
	
	@layer whatever {
		.border {
			border-color: var(--borderr) !important;
		}
	}
	
	/* badges */
	.badge {
		mix-blend-mode: unset !important; /* wtf */
		color: var(--text) !important;
	}
	@layer fuck-this-shit {
		/* TODO: separate style for these */
		.badge, .badge-light {
			color: var(--text-l) !important;
			background-color: #444 !important;
		}
	}

	/* SPECIFIC MODALS: */
/* 	.calendar_event_site .modal-title { color: white !important; }
	.calendar_event_site */
	
	/* Dropdown menu */
	.dropdown-menu {
		background-color: var(--sheet-fg-nested) !important;
		color: var(--text-l) !important;
	}
	.dropdown-item {
		color: var(--text) !important;
	}
    .dropdown-divider {
        border-top-color: var(--borderr) !important;
    }
	
	/* Popovers (eg notifs) */
	.popover-region-container {
		background-color: var(--sheet-fg) !important;
		border-color: var(--borderr) !important;
	}
	.popover-region-header-container {
		border-bottom-color: var(--borderr) !important;
	}
	.popover-region-footer-container {
		border-top-color: var(--borderr) !important;
		background-color: var(--sheet-fg-nested) !important;
	}
	
	/* NAVBAR: Links */
	.primary-navigation .navigation .nav-link {
		color: var(--text-ll) !important;
	}
	
	/* NAVBAR: Links, HOVER */
	.moremenu .nav-link:hover, .moremenu .nav-link:focus {
		color: var(--text) !important;
		background-color: var(--dark-active) !important;
	}
	
	/* NAVBAR: Border */
	.navbar.fixed-top {
		border-bottom-color: var(--sheet-fg-nested);
	}

	/* NAVBAR: Notification bell */
	#yui_3_17_2_1_1725994383149_381 {
		color: var(--icon) !important; fill: var(--icon) !important;
	}

	/* SECONDARY NAVBAR/SECONDARY TABS */
	.nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link {
		color: var(--text) !important;
	}
	.moremenu .nav-tabs,
	.secondary-navigation .navigation {
		background: var(--sheet-fg) !important;
	}
	.secondary-navigation .navigation {
		border-color: var(--borderr) !important
	}
	
	/* TARTIARY TABS/NAVIGATION */
/* 	.tertiary-navigation.full-width-bottom-border */
	.full-width-bottom-border {
		border-bottom-color: var(--borderr) !important;
	}
	.tertiary-navigation .navitem-divider {
		background-color: var(--borderr) !important;
	}
	
	/* DRAWER: Side-drawer(s) */
	.drawer {
		background-color: var(--sheet-fg) !important;
	}

	/* MAINTILE: inner */
	#page.drawers .main-inner {
		background: var(--sheet-fg);
	}

	/* MAINTILE: main region inside inner */
	#region-main {
		background-color: unset !important;
	}
	
	/* MAIN-COURSELIST */
	.block .block-cards span.categoryname, .block .block-cards .btn-link {
		color: var(--text-l) !important;
	}
	.block .block-cards .course-summaryitem {
		border-color: var(--borderr) !important;
	}
    /*.card.block_myoverview {
        background-color: unset !important;
    }*/
	
	/* COURSE: Description items */
	.description .course-description-item {
		background-color: var(--sheet-bg-nested) !important;
	}
	
	/* COURSE-FLOATER */
	:is(
		#yui_3_17_2_1_1725994383149_385, 
		#yui_3_17_2_1_1725994383149_388,
		#yui_3_17_2_1_1725995299769_217,
		.drawer-toggler
	) button {
		background-color: var(--sheet-fg-nested) !important;
	}
	
	/* COURSE-SIDEBAR */
	.courseindex .courseindex-item .courseindex-link, 
	.courseindex .courseindex-item .courseindex-chevron {
		color: var(--text-l) !important;
	}
	
	/* COURSE ACT. ITEM border color fix */
	.activity-item:not(.activityinline) {
		border-color: var(--borderr) !important;
	}
	.section .activity.indented + .indented .activity-item {
		border-top-color: var(--borderr) !important;
	}
	

	/* ACTIVITY */
	
	/* ACTIVITY-HEADER (due etc) */
	.path-mod .activity-header:not(:empty) {
		background-color: var(--sheet-fg-nested) !important;
	}
	
	/* ACTIVITY-TABLE */
	/* fix non-graded color */
	.path-mod-assign td.submissionnotgraded, 
	.path-mod-assign div.submissionnotgraded {
		color: var(--text) !important;
	}
	
	/* ACTIVITY-ICON color fix */
	.activityiconcontainer i.icon.fa {
		color: rgb(32,32,32) !important;
	}
	
	/* NOTIFICATIONS */
	.notification-area {
		border-color: var(--borderr) !important;
	}
	.notification-area .control-area {
		border-right-color: var(--borderr) !important;
	}
		
	.content-item-container {
		border-bottom-color: var(--borderr) !important;
	}
	.content-item-container.unread:not(:hover) {
		background: var(--dark-active) !important;
	}
	
	/* FORUM */
	.forumpost {
		border-color: var(--borderr) !important;
	}
	
	/* 
		"FANCY"/REMUI-STYLE COURSES 
		this is dumb as fuck...
		i hope the devs of this crap <insert bad thing here> :3
		like seriously, *fuck them*
	*/
	/* This is not final */
	body#page-course-view-remuiformat .section-title,
	body#page-course-view-remuiformat .activitieshead {
		color: var(--text) !important;
	}
	body#page-course-view-remuiformat .coursesummary {
		color: var(--text-l) !important;
	}
	/* remui activity (square) */
	body#page-course-view-remuiformat .activity:not(.modtype_label) {
		background: unset !important;
		border-color: var(--borderr) !important;
	}
	body#page-course-view-remuiformat .activity .activitytitle .media-body .activityname a {
		color: var(--text-l) !important;
	}
	/* itm group header */
	body#page-course-view-remuiformat .remui-format-list .sections .section .content .panel-title, 
	body#page-course-view-remuiformat .remui-format-list .sections .section .content h3 a {
		/* title */
		color: var(--text) !important;
	}
	body#page-course-view-remuiformat .section-summary-activities, 
	body#page-course-view-remuiformat .summary .no-overflow p {
		/* description*/
		color: var(--text-l) !important;
	}
	body#page-course-view-remuiformat .remui-format-list .sections .section .content .course-section-summary-wrapper .no-overflow {
		/* summary/misc (like email) */
		color: var(--text) !important;
	}
	/* subact/items */
	body#page-course-view-remuiformat .section:not(#section-0), /* Outer */
	body#page-course-view-remuiformat .activity .activity-item:not(.activityinline) /*Inner*/ {
		background: unset !important;
		border-color: var(--borderr) !important;
	}
		
    /*  ==================== APPLY ACCENTS ========================*/
    
    /* DEBUGGING,
    :root {
        --accent-active: red;   
        --accent-darker: green;
    }
    */
    :root a,
    :root .btn-link {
        color: var(--accent-active);
    }
    :root a:hover {
        color: var(--accent-darker);
    }
    :root .moremenu .nav-link.active {
        border-bottom-color: var(--accent-active);
    }
    :root .btn-primary {
        background-color: var(--accent-active);
        border-color: var(--accent-active);
    }
    :root .btn-primary:hover {
        background-color: var(--accent-darker);
    }
    :root .courseindex .courseindex-item.pageitem {
        background-color: var(--accent-active);
    }
    :root .courseindex .courseindex-section.current {
        border-left-color: var(--accent-active);
    }
    :root .courseindex .courseindex-item.pageitem:hover, 
    :root .courseindex .courseindex-item.pageitem:focus {
        background-color: var(--accent-darker);
    }
    :root .dropdown-item.active,
    :root .dropdown-item:active, 
    :root .dropdown-item:hover, 
    :root .dropdown-item:focus, 
    :root .dropdown-item:focus-within {
        background-color: var(--accent-active);
    }
    
    
	/* =================== AT THIS POINT I JUST GAVE UP AT MAKING IT NEAT TBH =========================== */
	/* these things fix tests tho :p */
	.moodle-dialogue-base .moodle-dialogue-wrap {
		background-color: var(--sheet-fg-nested) !important;
	}
	.moodle-dialogue-base .moodle-dialogue-wrap .moodle-dialogue-hd.yui3-widget-hd {
		color: var(--text);
	}
	
	.que .info,
	#quiz-timer-wrapper #quiz-timer {
		background-color: var(--sheet-fg-nested) !important;
	}
	
	.path-mod-quiz #mod_quiz_navblock .qnbutton {
		background-color: var(--sheet-fg-nested) !important;
	}
	
	.pagelayout-maintenance .page-header-headings, .pagelayout-secure .page-header-headings {
		background-color: #000 !important;
	}
		
	/* questionnaire fix */
	.qn-info, .qn-question,
	#page-mod-questionnaire-complete .raterow:hover, #page-mod-questionnaire-preview .raterow:hover {
		background: var(--sheet-fg-nested) !important;
	}
	
	/* fix grades */
	.path-grade-report-user .user-report-container, .grade-report-user .user-report-container {
		background-color: var(--sheet-fg) !important;
	}
	.path-grade-report-user .user-grade thead th, .grade-report-user .user-grade thead th {
		background-color: var(--sheet-fg) !important;
	}
	.path-grade-report-user .user-grade th.category, .grade-report-user .user-grade th.category {
		background-color: var(--sheet-fg-nested) !important;
		border-color: var(--borderr) !important;
	}
	.path-grade-report-user .user-grade td, .grade-report-user .user-grade td {
  	background-color: var(--sheet-fg) !important;
	}
	.path-grade-report-user .user-grade th.column-itemname:not(.header, .category, .baggt, .baggb), 
	.grade-report-user .user-grade th.column-itemname:not(.header, .category, .baggt, .baggb) {
		background-color: var(--sheet-fg) !important;
		border-top-color: var(--borderr) !important;
		border-bottom-color: var(--borderr) !important;
	}
	.path-grade-report-user .user-grade .baggt, .path-grade-report-user .user-grade .baggb, 
	.grade-report-user .user-grade .baggt, .grade-report-user .user-grade .baggb {
		background-color: var(--sheet-fg) !important;
	}
	.path-grade-report-user .user-grade td.item, .grade-report-user .user-grade td.item {
		border-top-color: var(--borderr) !important;
		border-bottom-color: var(--borderr) !important;
	}
    
    /* fix best grade */
    #page-mod-quiz-view table.quizattemptsummary tr.bestrow td {
        background: var(--sheet-fg-nested) !important;
    }
    
    /* main calendar hover color */
    .maincalendar .calendarmonth .clickable:hover {
        background: var(--dark-active) !important;
    }
    
    /* quiz result border color */
    .path-mod .activity-information .completion-info,
    .path-mod .activity-information .activity-dates {
        border-bottom-color: var(--borderr) !important;
    }
    
    /* ??? */
    [style="height:2px;border-width:0;color:gray;background-color:black"] {
        background-color: var(--text) !important;
    }
    
    /* course borders */
    .course-section {
        border-bottom-color: var(--borderr) !important;
    }
    
    /* workaround for editor icons */
    :is(.editor_atto, .editor_atto *) {
        color: black;
    }
    @layer fuck_atto {

        .editor_atto .icon {
            color: black !important;
        }
    }
    
    table.quizreviewsummary td.cell {
        background-color: var(--sheet-fg-nested) !important;
    }
    
    /* check: bib activity */
    .activity-item {
        background-color: var(--sheet-fg) !important;
    }
    
    /* fix buttons with white bg*/
    .activity-item .activity-completion button.btn:not(.btn-success), 
    .activity-item .activity-completion a[role="button"].btn:not(.btn-success) {
        background-color: var(--sheet-fg) !important;
    }
    .activity-item .activity-completion button.btn.btn-success, 
    .activity-item .activity-completion a[role="button"].btn.btn-success {
        background-color: rgba(0, 100, 0, 0.5) !important;
    }
    
    /* course avail. warning */
    .course-section .availabilityinfo {
        background-color: var(--sheet-fg-nested) !important;
    }
    
    /* expand button */
    .btn.btn-icon.icons-collapse-expand {
        background-color: var(--sheet-fg-nested) !important;
    }
    
    /* course section name */
    .course-section .sectionname > a {
        color: var(--text) !important;
    }
    .course-section .section-item {
        border-color: var(--borderr) !important;
    }
    .activity {
        border-top-color: var(--borderr) !important;
    }
    
    .course-section.hidden .section-item {
      background-color: var(--sheet-fg-nested) !important;
    }
}

@-moz-document url-prefix("https://moodle2.e-wsb.pl/pluginfile.php") {
	/* === fix userfiles === */
	@layer fuck { 
		body { 
			background: white!important; 
		} 
	}
}

