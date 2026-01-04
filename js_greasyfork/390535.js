// ==UserScript==
// @name         Ambry Jira Capitalizable Total Hours
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Autogenerate hours spent
// @author       Vlad Krasovsky
// @match        https://jira.ambrygen.com/browse/*
// @require      https://unpkg.com/axios/dist/axios.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390535/Ambry%20Jira%20Capitalizable%20Total%20Hours.user.js
// @updateURL https://update.greasyfork.org/scripts/390535/Ambry%20Jira%20Capitalizable%20Total%20Hours.meta.js
// ==/UserScript==

let capitaliazableId;
let epicName;

const issueIsCapitaliazable = issueData => {
    const capitalizableField = issueData.fields[capitaliazableId];
    return capitalizableField && capitalizableField.value === 'Yes';
}

const getEpicApiData = async (issueName) => {
    const url = `https://jira.ambrygen.com/rest/agile/1.0/epic/${issueName}/issue`;
    return await axios.get(url).then(data => data.data);
}

const getIssueApiData = async (issueName) => {
    const url = `https://jira.ambrygen.com/rest/api/latest/issue/${issueName}`;
    return await axios.get(url).then(data => data.data);
}

const getWorkLogsFromIssueData = issueData => {
    const { fields : {worklog : {worklogs}}} = issueData;
    return worklogs;
}

const getIssueSpentTime = issueData => {
    //get worklogs
    const worklogs = getWorkLogsFromIssueData(issueData);

    const totalSeconds = worklogs.reduce((totalSeconds,workLog)=>{
        const { timeSpentSeconds } = workLog;
        totalSeconds+= (+timeSpentSeconds);

        return totalSeconds;
    },0);

    return convertToHours(totalSeconds);
}

const convertToHours = seconds => {
    return parseFloat((seconds / 60 / 60).toFixed(2));
}

const calculateIssueSpentTime = issueData => {
    const {fields: {timespent}} = issueData;

    //get seconds spent from api
    const secondsSpent = timespent || 0

    //convert seconds to hours
    return convertToHours(secondsSpent);

}

const convertTimestampeToData = timestamp => moment(timestamp).format("YYYY/MM/DD");

const getUniqueTimestampsFromIssues = issuesData => {
    //get unique array of time stamps from worklog
    const timeStamps = _.uniq(_.flatten(issuesData.map(issueData => {
        if(issueIsCapitaliazable(issueData)){
            const {fields:{worklog: {worklogs}}} = issueData;
            return worklogs.map(log => convertTimestampeToData(log.started));
        }
    })));

    //sort dates
    const sortedTimeStamps = timeStamps.sort((date1,date2) => new Date(date1) - new Date(date2));
    return sortedTimeStamps
}

const addGlobalStyle = css => {
    const head = document.getElementsByTagName('head')[0];
    if(head) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
}

const downloadCSV = (data, headers) => {
    const headersStr = headers.join(',');

    const rowsStrArr = data.map(row => row.join(','));

    //headers go first
    rowsStrArr.unshift(headersStr);

    //add new lines
    const csvStr = rowsStrArr.join('\n');

    // Format the CSV string
    const csvData = encodeURI('data:text/csv;charset=utf-8,' + csvStr);

    // Create a virtual Anchor tag
    const link = document.createElement('a');
    link.setAttribute('href', csvData);
    link.setAttribute('download', `export_${epicName}.csv`);

    // Append the Anchor tag in the actual web page or application
    document.body.appendChild(link);

    // Trigger the click event of the Anchor link
    link.click();

    // Remove the Anchor link form the web page or application
    document.body.removeChild(link);
}

(async function() {
    'use strict';

    //apply only for epics
    if($('#issuedetails #type-val').text().trim() !== 'Epic'){
        console.log('Jira Chrome Plugin is only applicable for Epics');
        return false;
    }

    //add styling for new column
    addGlobalStyle('.issue_time_spent {color: red;  line-height: 24px;}');

    //get capitalizable custom field;
    const capLiSelector = $('strong[title=Capitalizable]').closest('li.item');
    const fieldId = capLiSelector.attr('id').replace('rowFor', '');

    //set global capitaliazable field key
    capitaliazableId = fieldId;

    //get name for api call
    const epicIssueName = $('.issue-link').data('issue-key');
    epicName = epicIssueName;

    let totalTimeSpent = 0;
    if(epicIssueName){
        //call api to get all issues in epic
        const { issues } = await getEpicApiData(epicIssueName);

        //loop through issues table and calculate time espent
        $('table.ghx-issuetable tr').each(function(index){
            const issueName = $(this).data('issuekey');

            //find api data
            const issueApiData = issues.find(issueData => issueData.key === issueName);

            //make sure issue is capitalizable
            if(issueIsCapitaliazable(issueApiData)){
                const hoursSpent = calculateIssueSpentTime(issueApiData);

                totalTimeSpent += hoursSpent;
                const newTd = `<td class="nav issue_time_spent">${hoursSpent}h</td>`;

                //add new td
                $(this).append(newTd);
            }
            else{
                $(this).append('<td class="nav">N/A</td>');
            }
        });

        //add time added to epic itself
        const issueData = await getIssueApiData(epicIssueName);
        let additionalHours = 0;
        if(issueData){
            additionalHours = getIssueSpentTime(issueData);
        }

        let displayText = `${totalTimeSpent}h`;
        if(additionalHours > 0){
            displayText =  `${totalTimeSpent}h + ${additionalHours}h (logged in Epic) = ${parseFloat(totalTimeSpent + additionalHours).toFixed(2)}h`
        }

        //append total hours spent
        const capSelector = capLiSelector.find('.wrap').append(`<span class="issue_time_spent">${displayText}</span>`);

        capLiSelector.find('.wrap').append(`<a id='generate-summary-cap-hours' style="margin-left: 5px;" title="Generate Summary"><img style="width:20px" src="/secure/projectavatar?pid=10007&avatarId=10613"></span></button>`);

        $(document).on('click', '#generate-summary-cap-hours', function(event){
            event.preventDefault();
            event.stopPropagation();

            const allIssuesData = issues.concat(issueData);
            //calculate all timestamps
            const allTicketTimestamps = getUniqueTimestampsFromIssues(allIssuesData);

            //set headers for CSV
            const headers = _.flatten(['Ticket Name','Person',allTicketTimestamps, 'Total Hours']);

            const csvData = allIssuesData.reduce((carry, issueData) => {
                //make sure issue is capitalizable
                if(issueIsCapitaliazable(issueData)){
                    //loop through worklog and get times
                    const worklogs = getWorkLogsFromIssueData(issueData);

                    let uniqueNames = [];
                    _.forEach(worklogs, worklog => {
                        let totalHours = 0;
                        const person = worklog.author.displayName;
                        let returnArr = [
                            issueData.key,
                            person
                        ];
                        //loop through all timestamps and add empty string if not in that thatstamp
                        _.forEach(allTicketTimestamps, timeStamp => {
                            //find all worklogs with this timestamp and same person
                            const personLogs = worklogs.filter(log => {
                                const { started } = log;
                                const startedTimeStamp = convertTimestampeToData(started);
                                return log.author.displayName === person && timeStamp === startedTimeStamp
                            });

                            if(personLogs.length > 0){
                                const tHours = _.sumBy(personLogs, log => {
                                    const { timeSpentSeconds } = log;
                                    return convertToHours(timeSpentSeconds);
                                });

                                returnArr.push(tHours);
                                totalHours += parseFloat(tHours);
                            }
                            else{
                                returnArr.push('');
                            }
                        });

                        //add total hours at the end
                        returnArr.push(totalHours);

                        if(! uniqueNames.includes(person)){
                            uniqueNames.push(person);
                            carry.push(returnArr)
                        }
                    });
                }
                return carry;
            },[])

            downloadCSV(csvData, headers);

        });
    }
})();