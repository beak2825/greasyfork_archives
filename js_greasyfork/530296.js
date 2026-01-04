// ==UserScript==
// @name         Gitlab Pipeline Metadata (via cimd)
// @description  Extend gitlab's pipeline list view with a metadata column to show pipeline metadata.
// @version      v0.9.0
// @author       Sebastian Tramp
// @license      apache-2.0
// @homepage     https://github.com/seebi/cimd
// @namespace    https://sebastian.tramp.name/
// @match        https://*/*/-/pipelines*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/530296/Gitlab%20Pipeline%20Metadata%20%28via%20cimd%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530296/Gitlab%20Pipeline%20Metadata%20%28via%20cimd%29.meta.js
// ==/UserScript==
/* eslint-env jquery */

var pipeline_data = {}

function getPipelineIDs() {
    /**
     * Get all pipeline IDs from the page
     *
     * @return {String[]} List of Pipeline IDs
     */
    var ids = new Array()
    $("tr[data-testid='pipeline-table-row']").find("a[data-testid='pipeline-url-link']").each(
        function(index){
            ids.push($(this).text().replace("#", ""))
        }
    );
    return ids
}


function getBasePipelineUrl() {
    /**
     * Get base pipeline URL (extracted from window.location.href)
     *
     * Example location: https://gitlab.com/seebi/gitlab-pipeline-metadata/-/pipelines?page=1&scope=all&ref=main
     * -> returns: https://gitlab.com/seebi/gitlab-pipeline-metadata/-/pipelines
     *
     * Example Output: https://gitlab.com/seebi/gitlab-pipeline-metadata/-/jobs/7445767203/artifacts/raw/__metadata__.json
     *
     * @return {String} Base pipeline URL
     */
    var base_regex = /(.+)\/-\/pipelines.*/g;
    var url = base_regex.exec(window.location.href)[1] + "/-/pipelines";
    return url
}

function getJobIDfromPath(path) {
    /**
     * Extract the Job ID from base relative gitlab path.
     *
     * Example path: /seebi/gitlab-pipeline-metadata/-/jobs/7445767203/artifacts/download?file_type=archive
     *
     * @param {String} path Base relative path string
     *
     * @return None
     */
    var job_regex = /jobs\/(.+)\/artifacts/g;
    return job_regex.exec(path)[1];
}

function getArtifactUrl(job_id) {
    /**
     * Get raw JSON URL of __metadata__.json for a job.
     *
     * Example Output: https://gitlab.com/seebi/gitlab-pipeline-metadata/-/jobs/7445767203/artifacts/raw/__metadata__.json
     *
     * @param {String} job_id Gitlab Job ID
     *
     * @return {String} RAW Artifact URL
     */
    return getBasePipelineUrl().replace("pipelines", "jobs") + "/" + job_id + "/artifacts/raw/__metadata__.json"
}

function getDownloadableArtifactUrl(pipeline_id){
    /**
     * Get API endpoint URL for fetching all downloadable artifacts of a pipeline.
     *
     * Example Output: https://gitlab.com/seebi/gitlab-pipeline-metadata/-/pipelines/1391065437/downloadable_artifacts.json
     *
     * @param {String} pipeline_id Gitlab Pipeline ID
     *
     * @return {String} Artifacts URL
     */
    var url = getBasePipelineUrl() + "/" + pipeline_id + "/downloadable_artifacts.json"
    return url
}

function extendTableIfNeeded() {
    /**
     * Extend the CI Table with an additional Metadata column (if needed)
     *
     * @return None
     */
    if ($("div.meta-data-container").length){
        return
    }
    var table = $("div.ci-table")
    if ( table.length ) {
        $("*[data-testid='stages-th']").before('<th role="columnheader" scope="col" aria-colindex="5" data-testid="data-th" class=""><div>Metadata</div></th>')
        $("*[data-label='Stages']").before('<td aria-colindex="5" data-label="Metadata" role="cell" class="pl-p-5!"><div class="meta-data-container">-</div></td>')
    }
}

function createDataWidget(key, item){
    /**
     * Create a single meta data item html snippet <div>.
     *
     * mandatory keys in item object: value
     * optional keys in item object: label, description, image, link and comment
     *
     * @link https://gitlab.com/seebi/gitlab-pipeline-metadata/-/blob/main/README.md#data-__metadata__json
     *
     * @param {String} key Meta data item identifier.
     * @param {Object} item Meta data item object.
     *
     * @return {String} Widget HTML Snippet
     */
    var label = ((item.label) ? item.label + ": " + item.value : key + ": " + item.value)

    var tooltip = "key: " + key + "\nvalue: " + item.value
    tooltip += ((item.label) ? "\nlabel: " + item.label : "")
    tooltip += ((item.description) ? "\ndescription: " + item.description : "")
    tooltip += ((item.image) ? "\nimage: " + item.image : "")
    tooltip += ((item.link) ? "\nlink: " + item.link : "")
    tooltip += ((item.comment) ? "\ncomment: " + item.comment : "")

    var output = '<div data-testid="metadata-' + key + '" class="meta-data-item" title="' + tooltip + '">'
    output += ((item.link) ? "<a href='" + item.link + "'>" : "")
    output += ((item.image) ? '<img src="' + item.image + '" />' : label)
    output += ((item.link) ? "</a>" : "")
    output += "</div"
    return output
}

function extendRow(pipeline_id){
    /**
     * Uses the global pipeline_data variable to append one widget for each metadata item.
     *
     * @param {String} pipeline_id Pipeline ID (scraped from pipeline-url-link)
     *
     * @return None
     */
    extendTableIfNeeded()
    var pipeline_link = $("a[data-testid='pipeline-url-link']:contains('#" + pipeline_id + "')")
    var pipeline_row = pipeline_link.closest("tr[data-testid='pipeline-table-row']")
    var container = pipeline_row.find("div.meta-data-container")
    const items = pipeline_data[pipeline_id].items
    const keys = Object.keys(items)
    container.text("")
    for (const key in keys) {
        var id = keys[key]
        container.append(createDataWidget(id, items[id]))
    }
}

function getDataForPipeline(pipeline_id){
    /**
     * Fetch available __metadata.json__ and collect it in a global pipeline_data object.
     * Optionally start extendRow for a pipeline if __metadata__ is available.
     *
     * @param {String} pipeline_id Pipeline ID (scraped from pipeline-url-link)
     *
     * @return None
     */
    var url = getDownloadableArtifactUrl(pipeline_id)
    console.log("Fetching data for pipeline: " + pipeline_id + " (" + url + ")")
    if (typeof pipeline_data[pipeline_id] != "undefined") {
        console.log("Metadata for pipeline: " + pipeline_id + " already fetched")
        extendRow(pipeline_id)
        return
    }
    pipeline_data[pipeline_id] = {}
    $.getJSON(url, function(json) {
        pipeline_data[pipeline_id].downloadable_artifacts = json;
        pipeline_data[pipeline_id].items = {};
        json.artifacts.forEach(function(artifact) {
            var job_id = getJobIDfromPath(artifact.path)
            var artifact_url = getArtifactUrl(job_id)
            console.log("Fetching __metadata__ artifact for pipeline: " + pipeline_id + " (Job: " + job_id + " - " + artifact_url + ")")
            $.getJSON(artifact_url, function(metadata) {
                var items = metadata.items
                for (const item in items) {
                    pipeline_data[pipeline_id].items[item] = items[item]
                }
                extendRow(pipeline_id)
            });
        });
    });
}

$(document).ready(function() {
    setTimeout(function () {
        getPipelineIDs().map(getDataForPipeline)
    }, 2000);
});
