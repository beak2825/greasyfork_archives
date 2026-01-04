// ==UserScript==
// @name         Omniplus
// @version      0.5.1
// @description  Enhanced Omnivox Experience
// @author       Jerry
// @match        https://*.omnivox.ca/*
// @icon         https://www.google.com/s2/favicons?domain=omnivox.ca
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/881234
// @downloadURL https://update.greasyfork.org/scripts/440685/Omniplus.user.js
// @updateURL https://update.greasyfork.org/scripts/440685/Omniplus.meta.js
// ==/UserScript==


/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 179:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeaAssignmentOverview = void 0;
// Renders the overview page for assignments.
const assignment_1 = __webpack_require__(159);
const util_1 = __webpack_require__(192);
const renderable_1 = __webpack_require__(972);
const element_builder_1 = __webpack_require__(358);
const page_patcher_1 = __webpack_require__(50);
const assignment_status_1 = __webpack_require__(577);
class LeaAssignmentOverview extends renderable_1.Renderable {
    constructor(assignmentsPromise) {
        super('div', 'omniplus-lea-container', 'omniplus-assignments-overview');
        this.assignments = [];
        this.loading = true;
        assignmentsPromise.then((assignments) => {
            this.loading = false;
            this.assignments.push(...assignments);
            this.rerender();
        });
    }
    static loadAllAssignmentsFromAssignmentsSummaryPage(page) {
        // All the anchors in the page have the style class .RemTrav_Sommaire_NomCours and are inside a table with
        // the class .cvirContenuCVIR.
        // However, sometimes when an instruction has not been read, an anchor with the same class that contains an
        // image is also shown on the rightmost column, despite the fact that the style class obviously suggests
        // that it should only include items that display the name of the course (no, a hovered tooltip does not count).
        // To ensure that only one of each course gets selected, find the td elements that are the first children
        // and then extract their anchor children.
        return new LeaAssignmentOverview(Promise.all(Array.from(page.querySelectorAll('.cvirContenuCVIR td:first-child'))
            .map((td) => td.querySelector('a.RemTrav_Sommaire_NomCours'))
            // Not all first child tds have anchor children, filter off the nulls.
            .filter((anchor) => anchor != null)
            .map((anchor) => anchor.href)
            .map((assignmentListURL) => (0, util_1.fetchDocumentFrom)(assignmentListURL)
            .then((assignmentList) => assignment_1.Assignment.loadAllAssignmentsFromCourseAssignmentsList(assignmentList))))
            .then((assignments) => assignments.reduce((flat, toFlatten) => flat.concat(toFlatten), [])));
    }
    // Builds a section with the specified name, only showing assignments that have the specified status.
    buildSection(sectionName, sectionType) {
        return new element_builder_1.ElementBuilder({
            tag: 'div',
            styleClasses: ['assignment-section'],
            children: [
                new element_builder_1.ElementBuilder({
                    tag: 'div',
                    styleClasses: ['title'],
                    text: sectionName
                }).build(),
                new element_builder_1.ElementBuilder({
                    tag: 'div',
                    styleClasses: ['content'],
                    children: this.assignments.filter((assignment) => assignment.status == sectionType)
                        // Latest-due assignments show up first.
                        .sort((a, b) => b.effectiveDueTime.valueOf() - a.effectiveDueTime.valueOf())
                        .map((assignment) => assignment.render())
                }).build()
            ]
        }).build();
    }
    updateDomElement() {
        if (this.loading) {
            // While the container is loading, insert the loading element.
            this.domElement.appendChild(new element_builder_1.ElementBuilder({
                tag: 'div',
                styleClasses: ['loading'],
                children: [
                    new element_builder_1.ElementBuilder({
                        tag: 'div',
                        styleClasses: ['loading-spinner']
                    }).build(),
                    new element_builder_1.ElementBuilder({
                        tag: 'div',
                        styleClasses: ['explanation'],
                        text: 'Assignments take significantly longer to load because they require two layers of link' +
                            ' redirects and opening a popup for each assignment.'
                    }).build()
                ]
            }).build());
        }
        else {
            this.domElement.append(
            // Assigned section
            this.buildSection('Assigned', assignment_status_1.AssignmentStatus.Assigned), 
            // Corrected section
            // Show the corrected section before the completed section instead of using a regular kanban
            // task flow because students would rarely be interacting with assignments that have been submitted
            // but not corrected.
            this.buildSection('Corrected', assignment_status_1.AssignmentStatus.Corrected), 
            // Completed section
            this.buildSection('Completed', assignment_status_1.AssignmentStatus.Submitted));
        }
    }
    // Injects the container into the document overview page.
    injectToAssignmentsOverviewPage() {
        // The printer friendly version button blocks the view, not sure why it's there, why it exists, or what's
        // the purpose of printing out an overview like that.
        (0, page_patcher_1.removePrinterFriendlyButton)();
        // Fetch the original container of the overview table.
        const overviewContainer = document.querySelector('.cvirContenuCVIR');
        // Get rid of the centre align.
        overviewContainer.removeAttribute('align');
        // Clear everything off.
        while (overviewContainer.hasChildNodes()) {
            overviewContainer.removeChild(overviewContainer.firstChild);
        }
        overviewContainer.appendChild(this.domElement);
    }
}
exports.LeaAssignmentOverview = LeaAssignmentOverview;


/***/ }),

/***/ 577:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AssignmentStatus = void 0;
// Represents the current progress of an assignment.
var AssignmentStatus;
(function (AssignmentStatus) {
    AssignmentStatus[AssignmentStatus["Assigned"] = 0] = "Assigned";
    AssignmentStatus[AssignmentStatus["Submitted"] = 1] = "Submitted";
    AssignmentStatus[AssignmentStatus["Corrected"] = 2] = "Corrected";
})(AssignmentStatus = exports.AssignmentStatus || (exports.AssignmentStatus = {}));


/***/ }),

/***/ 159:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Assignment = void 0;
const util_1 = __webpack_require__(192);
const assignment_status_1 = __webpack_require__(577);
const badged_card_1 = __webpack_require__(143);
const badge_1 = __webpack_require__(147);
const element_builder_1 = __webpack_require__(358);
const formatted_text_1 = __webpack_require__(641);
// Represents an assignment on Lea.
// The design of a card can be seen in assignments-overview.html.
class Assignment extends badged_card_1.BadgedCard {
    constructor(name, courseName, dueTime, dueTimeSpecified, popupLink, leaSubmission, description, instructionLink, submissionLink, correctionLink) {
        super({
            styleClasses: ['assignment']
        });
        this.name = name;
        this.courseName = courseName;
        this.leaSubmission = leaSubmission;
        this.description = description;
        this.dueTime = dueTime;
        this.dueTimeSpecified = dueTimeSpecified;
        this.popupLink = popupLink;
        this.instructionLink = instructionLink;
        this.submissionLink = submissionLink;
        this.correctionLink = correctionLink;
    }
    static loadFromAssignmentPopup(popupLink, page, dueTimeFromList) {
        // Really have to give credit to Omnivox for having IDs for each component of the page, makes searching much
        // much much easier.
        // The course name is placed in the element with the style class .TitrePageLigne2.
        const [_courseCode, courseName] = (0, util_1.extractCourseCodeAndNameFromCourseTitle)(page.querySelector('.TitrePageLigne2').innerText);
        // The assignment name is placed in the element with the id #lblTitre.
        const name = page.querySelector('#lblTitre').innerText;
        // The description is in the element with the id #lblEnonce.
        const descriptionElement = page.querySelector('#lblEnonce');
        // It doesn't always exist, so use its existence as a marker for whether a description is being provided.
        const description = descriptionElement ? formatted_text_1.FormattedText.fromContentNode(descriptionElement) : null;
        // The instructions are linked to the element with the id #AlienFichierLie2.
        const instructionElementHref = page.querySelector('#ALienFichierLie2').href;
        // If no instruction is attached, the href will be empty.
        const instructionLink = instructionElementHref.length > 0 ? instructionElementHref : null;
        // The due date of the assignment is stored in the element with the id #lblDateRemise.
        // If the assignment is due in class, the element that displays the due date will not be present.
        // Checking the presence of this element is surprisingly more persistent than checking the presence of the
        // submit button since the submit button disappears once Lea stops accepting submissions.
        const leaSubmission = page.querySelector('#lblDateRemise') != null;
        const { dueTime, timeSpecified } = dueTimeFromList;
        // The anchor element that links to the latest submission shares neighbouring parents with an element with
        // the id #lblEnteteRemise.
        // The label may not be present when there is no submission or when the assignment is supposed to be
        // submitted in-person.
        const submissionLabel = page.querySelector('#lblEnteteRemise');
        // However, even if the label does exist, the anchor may not.
        // The anchor will be null if it doesn't exist, use this to check if something has been submitted.
        // I refuse to use a proper if/else for this and I'm sticking with this ugly ternary just because I'm very
        // upset.
        const submissionLink = submissionLabel != null ? (submissionLabel.parentElement.nextElementSibling.querySelector('a') != null ?
            submissionLabel.parentElement.nextElementSibling.querySelector('a').href : null) : null;
        // The anchor that links to the corrected copy shares a parent with an element with the id
        // #lblEnteteCopieCorrigee. The label is only present if the anchor is also present.
        const correctionLabel = page.querySelector('#lblEnteteCopieCorrigee');
        // The label will be an indicator of whether the assignment has been corrected, it will be null if it
        // doesn't exist.
        const correctionLink = correctionLabel ? correctionLabel.parentElement.querySelector('a').href : null;
        return new Assignment(name, courseName, dueTime, timeSpecified, popupLink, leaSubmission, description, instructionLink, submissionLink, correctionLink);
    }
    static loadAllAssignmentsFromCourseAssignmentsList(page) {
        // The assignment list uses a table, which has columns with the classes .LigneListTrav1, .LigneListTrav2, or
        // .LigneListTrav1Last. Sometimes they have multiple anchor children, which can include the submitted copy.
        // Exclude that by excluding elements with the class .lienTruncate.
        // They also include a list of due dates in each corresponding assignment, which are spans without the class
        // .RemTrav_Sommaire_ProchainsTravauxDesc.
        const dates = Array.from(page.querySelectorAll('.LigneListTrav1 span:not(.RemTrav_Sommaire_ProchainsTravauxDesc), ' +
            '.LigneListTrav2 span:not(.RemTrav_Sommaire_ProchainsTravauxDesc), ' +
            '.LigneListTrav1Last span:not(.RemTrav_Sommaire_ProchainsTravauxDesc)'))
            .map((span) => span.innerText);
        return Promise.all(Array.from(page.querySelectorAll('.LigneListTrav1 a:not(.lienTruncate), .LigneListTrav2 a:not(.lienTruncate), .LigneListTrav1Last a:not(.lienTruncate)'))
            // Excluding the .lienTruncate class doesn't eliminate the additional "download corrected copy" buttons.
            // Since they have no easily identifiable style or structure, I will just manually filter off anything
            // that doesn't have an onclick attribute.
            .filter((anchor) => anchor.getAttribute('onclick') != null)
            .map((anchor) => anchor.getAttribute('onclick'))
            // The onclick attribute of the anchor has the following formatting:
            // OpenCentre('DepotTravail.aspx?...', 'DepotTravailPopup', 'toolbar=no...', 700, 780, true)
            // Match for the quotation marks to get the tail of the target link and remove the quotation marks.
            .map((onClickCode) => onClickCode.match(util_1.quotationMarksRegex)[0].replaceAll("'", ''))
            // Add the end of the url to the current root to obtain the actual link to the popup.
            // Add the slash because it's been trimmed when the location was split.
            .map((urlEnd) => `${(0, util_1.getCurrentLeaRoot)()}/${urlEnd}`)
            .map((url, index) => (0, util_1.fetchDocumentFrom)(url).then((popupPage) => this.loadFromAssignmentPopup(url, popupPage, this.extractDueDateFromAssignmentListDateString(dates[index])))));
    }
    static extractDueDateFromAssignmentListDateString(dueDateString) {
        // Due times on the assignment list have the following format:
        // <Month Shortened>-<Date>, <Year> [at] [hh:mm]
        // Where the time of the day can be entirely optional.
        const splits = dueDateString.split('at').map((part) => part.trim());
        // If the time is specified, the "at" will be present and the split will have 2 pieces.
        const timeSpecified = splits.length > 1;
        const [dateString, timeString] = splits;
        const [datePart, yearString] = dateString.split(',').map((part) => part.trim());
        const [monthShortened, dayString] = datePart.split('-');
        const monthIndex = (0, util_1.getMonthIndexFromShortenedName)(monthShortened);
        const day = parseInt(dayString);
        const year = parseInt(yearString);
        // Also decompose the time if it exists.
        if (timeSpecified) {
            // Split with the colon and then parse them to obtain the numbers.
            const [hours, minutes] = timeString.split(':').map((str) => parseInt(str.trim()));
            return {
                dueTime: new Date(year, monthIndex, day, hours, minutes),
                timeSpecified: true
            };
        }
        else {
            return {
                dueTime: new Date(year, monthIndex, day),
                timeSpecified: false
            };
        }
    }
    get hasDescription() {
        return this.description != undefined;
    }
    get hasInstructions() {
        return this.instructionLink != undefined;
    }
    get submitted() {
        return this.submissionLink != undefined;
    }
    get corrected() {
        return this.correctionLink != undefined;
    }
    // Completion status of the assignment, used to filter the assignments into their corresponding sections.
    get status() {
        if (this.corrected) {
            return assignment_status_1.AssignmentStatus.Corrected;
        }
        else if (this.submitted) {
            return assignment_status_1.AssignmentStatus.Submitted;
        }
        else {
            return assignment_status_1.AssignmentStatus.Assigned;
        }
    }
    // The instruction badge is the first badge on the right.
    buildInstructionBadge() {
        // Return a clickable badge that leads to the instructions if instructions are available.
        // If no instruction is given, the button will not be interactive, and a tooltip will indicate that no
        // instructions are attached.
        return new badge_1.Badge({
            clickable: this.hasInstructions,
            newTab: true,
            icon: 'info',
            styleClasses: this.hasInstructions ? ['clickable'] : ['clickable-disabled'],
            href: this.hasInstructions ? this.instructionLink : '#',
            title: this.hasInstructions ? '' : 'No Instructions Attached'
        });
    }
    // The action badge represents what can be done with the assignment. While multiple actions are available,
    // namely submitting the assignment, uploading additional versions, downloading your submission, or checking
    // corrections, usually only one of these is used at each stage of the assignment.
    // This means that there will only be *one* secondary action available on the card despite the possibilities.
    buildActionBadge() {
        switch (this.status) {
            case assignment_status_1.AssignmentStatus.Assigned: {
                // In the assignment stage, the secondary action will be to upload the assignment.
                return new badge_1.Badge({
                    // Only allow the upload to be clicked if the assignment is going to be submitted on Lea.
                    clickable: this.leaSubmission,
                    icon: this.leaSubmission ? 'file_upload' : 'class',
                    styleClasses: this.leaSubmission ? ['clickable-secondary'] : ['clickable-secondary-disabled'],
                    title: this.leaSubmission ? '' : 'In-class Submission',
                    onclick: this.leaSubmission ? () => {
                        (0, util_1.openCenteredPopup)(this.popupLink);
                    } : () => { }
                });
            }
            case assignment_status_1.AssignmentStatus.Submitted: {
                // After the assignment has been submitted, students may still want to submit newer versions with
                // corrections or take a last time extension, etc. This means that the secondary action is still to
                // open the popup, but the icon will be adjusted to indicate that the assignment is already in.
                return new badge_1.Badge({
                    // Only allow the upload to be clicked if the assignment is going to be submitted on Lea.
                    clickable: this.leaSubmission,
                    icon: this.leaSubmission ? 'assignment_turned_in' : 'class',
                    styleClasses: this.leaSubmission ? ['clickable-secondary'] : ['clickable-secondary-disabled'],
                    title: this.leaSubmission ? '' : 'In-class Submission',
                    onclick: this.leaSubmission ? () => {
                        (0, util_1.openCenteredPopup)(this.popupLink);
                    } : () => { }
                });
            }
            case assignment_status_1.AssignmentStatus.Corrected: {
                // After the assignment has been corrected, the secondary action will be to download the corrected copy.
                return new badge_1.Badge({
                    icon: 'assignment_returned',
                    styleClasses: ['clickable-secondary'],
                    href: this.correctionLink,
                    newTab: true
                });
            }
        }
    }
    // An assignment is effectively due at the end of the day if the time of the day is not specified.
    get effectiveDueTime() {
        if (this.dueTimeSpecified) {
            return this.dueTime;
        }
        else {
            // Just making a new date and set the time to the last second of the day to avoid all the contingencies.
            return new Date(this.dueTime.getFullYear(), this.dueTime.getMonth(), this.dueTime.getDate(), 23, 59, 59);
        }
    }
    get overdue() {
        // An assignment is only overdue if it hasn't been submitted.
        return this.status == assignment_status_1.AssignmentStatus.Assigned && Date.now() > this.effectiveDueTime.valueOf();
    }
    // Returns the day that the assignment is due without the specified time.
    get dueDate() {
        return new Date(this.dueTime.getFullYear(), this.dueTime.getMonth(), this.dueTime.getDate());
    }
    // Displays the due time in a string, showing the date (and omitting the time if ot specified).
    get dueTimeDisplayed() {
        // Difference in milliseconds between the due date and now.
        const difference = this.dueDate.valueOf() - Date.now();
        let dateString;
        // If it was due a day ago, say yesterday.
        if (difference >= -util_1.millisecondsInADay && difference < 0) {
            dateString = 'Yesterday';
        } // If it's due in a day, say today.
        else if (difference >= 0 && difference < util_1.millisecondsInADay) {
            dateString = 'Today';
        } // If it's due in two days, say tomorrow.
        else if (difference >= util_1.millisecondsInADay && difference < 2 * util_1.millisecondsInADay) {
            dateString = 'Tomorrow';
        } // Otherwise, just format the date.
        // TODO: Stating in relative time should provide a better sense of urgency than just formatting the dates.
        //  Come up with a comprehensive system that formats due time within 2 weeks in the most urgent way possible.
        else {
            // Since a school year crosses over winter, we'll include the year always just to be clear.
            dateString = `${this.dueTime.getDate()} ${util_1.monthsShortened[this.dueTime.getMonth()]}, ${this.dueTime.getFullYear()}`;
        }
        // Append the time if specified.
        if (this.dueTimeSpecified) {
            let dueTimeMinutes = this.dueTime.getMinutes().toString();
            // Make sure that the minutes part always has 2 characters.
            if (dueTimeMinutes.length == 1) {
                dueTimeMinutes = '0' + dueTimeMinutes;
            }
            return `${dateString} at ${this.dueTime.getHours()}:${dueTimeMinutes}`;
        }
        else {
            return dateString;
        }
    }
    buildBadges() {
        return [this.buildInstructionBadge(), this.buildActionBadge()];
    }
    buildContent() {
        return [
            new element_builder_1.ElementBuilder({
                tag: 'div',
                children: [
                    new element_builder_1.ElementBuilder({
                        tag: 'div',
                        styleClasses: ['name'],
                        text: this.name
                    }).build(),
                    new element_builder_1.ElementBuilder({
                        tag: 'div',
                        styleClasses: ['course-name'],
                        text: this.courseName
                    }).build(),
                    new element_builder_1.ElementBuilder({
                        tag: 'div',
                        // If an assignment is overdue, add an error colour to highlight it.
                        styleClasses: ['date', ...this.overdue ? ['overdue'] : []],
                        text: this.dueTimeDisplayed
                    }).build(),
                    // Only add the description if it exists.
                    ...this.hasDescription ? [
                        new element_builder_1.ElementBuilder({
                            tag: 'div',
                            styleClasses: ['description'],
                            children: [this.description.render()]
                        }).build()
                    ] : []
                ]
            }).build()
        ];
    }
}
exports.Assignment = Assignment;


/***/ }),

/***/ 277:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeaDocumentsContainer = void 0;
const renderable_1 = __webpack_require__(972);
const course_document_list_1 = __webpack_require__(984);
const element_builder_1 = __webpack_require__(358);
class LeaDocumentsContainer extends renderable_1.Renderable {
    constructor(documents) {
        // Start with the loading class.
        super('div', 'loading');
        this.courses = [];
        // Whether the courses have been loaded or not.
        this.ready = false;
        // Add the documents asynchronously.
        documents.then((courses) => {
            // Mark as loaded.
            this.ready = true;
            courses.forEach((course) => this.courses.push(course));
            // Call for a re-render if the container has been rendered already.
            if (this.lastRenderInfo) {
                this.rerender();
            }
        });
    }
    // Loads all courses and all documents from the document overview page on Lea.
    static loadFromDocumentOverviewPage(page) {
        const coursePromises = [];
        // Courses are placed within either table row elements with either the itemDataGrid or the
        // .itemDataGridAltern class, which correspond to even and odd-numbered documents.
        page.querySelectorAll('.itemDataGrid, .itemDataGridAltern').forEach((rowElement) => {
            // The link to the course is stored in the <a> element with the class .DisDoc_Sommaire_NomCours.
            const courseLink = rowElement.querySelector('.DisDoc_Sommaire_NomCours').href;
            // Await everything together to load faster.
            coursePromises.push(course_document_list_1.CourseDocumentList.loadFromCourseDocumentsURL(courseLink));
        });
        // Wait for all of them at once.
        return new LeaDocumentsContainer(Promise.all(coursePromises));
    }
    updateDomElement(renderInfo) {
        if (this.ready) {
            if (this.domElement.classList.contains('loading')) {
                this.domElement.classList.remove('loading');
            }
            if (!this.domElement.classList.contains('course-list')) {
                // Restore the tag after loading is complete.
                this.domElement.classList.add('course-list');
            }
            // Render courses only after everything have been loaded.
            // Display only courses that have documents that match the search term.
            this.courses.filter((course) => course.hasDocumentMatch(renderInfo.search))
                .forEach((course) => this.domElement.appendChild(course.render(renderInfo)));
        }
        else {
            // While the container is loading, insert the loading element.
            this.domElement.appendChild(new element_builder_1.ElementBuilder({
                tag: 'div',
                styleClasses: ['loading-spinner'],
            }).build());
        }
    }
    markAllDocumentsAsRead() {
        this.courses.forEach((course) => course.markAllDocumentsAsRead());
    }
}
exports.LeaDocumentsContainer = LeaDocumentsContainer;


/***/ }),

/***/ 984:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CourseDocumentList = void 0;
const document_1 = __webpack_require__(774);
const util_1 = __webpack_require__(192);
const element_builder_1 = __webpack_require__(358);
const renderable_1 = __webpack_require__(972);
// Represents a course rendered on the documents overview..
class CourseDocumentList extends renderable_1.Renderable {
    constructor(name, courseCode, documents = []) {
        super('div', 'course');
        this.courseName = name;
        this.courseCode = courseCode;
        this.documents = documents;
        this.sortDocuments();
    }
    // Load a course from its *components* page.
    static fromDocumentPage(page) {
        // The course code and course name are placed inside the second line of title on the top of the course
        // components page.
        const courseTitle = page.querySelector('.TitrePageLigne2').innerText;
        const courseCodeAndName = (0, util_1.extractCourseCodeAndNameFromCourseTitle)(courseTitle);
        // Extract the documents.
        const documents = document_1.LeaDocument.loadFromCourseDocumentPage(page);
        return new CourseDocumentList(courseCodeAndName[1], courseCodeAndName[0], documents);
    }
    // Extracts a course and its documents from a url to a course components page.
    static loadFromCourseDocumentsURL(url) {
        return (0, util_1.fetchDocumentFrom)(url).then((parsedDocument) => CourseDocumentList.fromDocumentPage(parsedDocument));
    }
    // Sorts the documents based on their read-status and their upload date.
    sortDocuments() {
        this.documents.sort((a, b) => {
            // Note that the comparison is in reverse because we want to display later documents (with greater time
            // value) first.
            // If the two have the same read status, compare the date.
            if (a.read == b.read) {
                return b.uploadDate.valueOf() - a.uploadDate.valueOf();
            }
            // Otherwise compare the read status.
            else {
                return (b.read ? 0 : 1) - (a.read ? 0 : 1);
            }
        });
    }
    updateDomElement(renderInfo) {
        this.domElement.append(new element_builder_1.ElementBuilder({
            tag: 'div',
            styleClasses: ['course-name'],
            text: this.courseName
        }).build(), new element_builder_1.ElementBuilder({
            tag: 'div',
            styleClasses: ['documents-list'],
            // Filter the documents to show only ones that match.
            children: this.documents.filter((leaDocument) => leaDocument.nameContains(renderInfo.search))
                .map((leaDocument) => leaDocument.render(renderInfo))
        }).build());
    }
    // Returns true if the course has any documents with a name that includes the search term.
    hasDocumentMatch(search) {
        return this.documents.some((leaDocument) => leaDocument.nameContains(search));
    }
    markAllDocumentsAsRead() {
        this.documents.forEach((leaDocument) => leaDocument.markAsRead());
    }
}
exports.CourseDocumentList = CourseDocumentList;


/***/ }),

/***/ 717:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeaDocumentType = void 0;
var LeaDocumentType;
(function (LeaDocumentType) {
    LeaDocumentType[LeaDocumentType["Link"] = 0] = "Link";
    LeaDocumentType[LeaDocumentType["File"] = 1] = "File";
    LeaDocumentType[LeaDocumentType["Video"] = 2] = "Video";
    LeaDocumentType[LeaDocumentType["YouTube"] = 3] = "YouTube";
})(LeaDocumentType = exports.LeaDocumentType || (exports.LeaDocumentType = {}));


/***/ }),

/***/ 774:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeaDocument = void 0;
const util_1 = __webpack_require__(192);
const element_builder_1 = __webpack_require__(358);
const document_type_1 = __webpack_require__(717);
const badge_1 = __webpack_require__(147);
const badged_card_1 = __webpack_require__(143);
// Represents a components under a course on Lea.
class LeaDocument extends badged_card_1.BadgedCard {
    constructor(name, description, read, uploadDate, originalOpenAction, type) {
        super({
            styleClasses: ['document']
        });
        this.name = name;
        this.description = description;
        this.read = read;
        this.uploadDate = uploadDate;
        this.originalOpenAction = originalOpenAction;
        this.type = type;
        // The url takes a bit of time to obtain, setting it to '#' as a filler.
        this.url = '#';
        // Extract the url asynchronously.
        LeaDocument.extractDocumentURL(originalOpenAction, type)
            .then((url) => {
            // Update the url.
            this.url = url;
            // And call for a rerender if the document has been rendered already.
            if (this.lastRenderInfo) {
                this.rerender();
            }
        });
    }
    // Loads relevant information of a components from its table row element.
    static fromElement(rowElement) {
        // Fetch the name from the <a> element responsible for the title of the components.
        const name = rowElement.querySelector('.lblTitreDocumentDansListe').innerText.trim();
        // The description of the child element is in a text node that is the parent of the name element.
        const description = rowElement.querySelector('.divDescriptionDocumentDansListe')
            // This means that innerText of the element will also include the name of the components.
            // Luckily, the description text node is the last child of the element.
            // However, this description node's content also includes many `\t` characters at its start and end, which
            // need to be removed with `trim()`.
            .lastChild.textContent.trim();
        // The status of the components is indicated by a star icon that appears if it has not been read. Check if that
        // icon is present to see if the components has been read.
        const read = rowElement.querySelector('.classeEtoileNouvDoc') == null;
        const date = LeaDocument.extractDocumentDate(rowElement.querySelector('.DocDispo').innerText);
        // The download url of the components is placed in an <a> element that is in the element with the class
        // .colVoirTelecharger.
        const originalOpenAction = rowElement.querySelector('.colVoirTelecharger a').href;
        const type = LeaDocument.determineDocumentTypeFromOpenAction(originalOpenAction);
        return new LeaDocument(name, description, read, date, originalOpenAction, type);
    }
    // Scrapes all elements from documents page of a given course.
    static loadFromCourseDocumentPage(page) {
        const documents = [];
        // Documents are placed within either table row elements with either the itemDataGrid or the
        // .itemDataGridAltern class, which correspond to even and odd-numbered documents.
        page.querySelectorAll('.itemDataGrid, .itemDataGridAltern').forEach((rowElement) => documents.push(LeaDocument.fromElement(rowElement)));
        return documents;
    }
    // Extracts all documents on the page from an url to a course components page.
    static loadFromCourseDocumentsURL(url) {
        return (0, util_1.fetchDocumentFrom)(url).then((parsedDocument) => LeaDocument.loadFromCourseDocumentPage(parsedDocument));
    }
    // Determines the type of the document from the href of the anchor element that opens it.
    static determineDocumentTypeFromOpenAction(href) {
        // Both file and link documents have a link in their href that includes
        // VisualiseDocument.aspx.
        if (href.includes('VisualiseDocument.aspx')) {
            // Link documents though refer to VisualiseDocument.aspx, have a
            // JavaScript execution in their href. More specifically, they have a
            // special line of code that contains the link to be redirected to.
            // Their href look something like this:
            // javascript:CallPageVisualiseDocument('VisualiseDocument.aspx?...');
            // ValiderLienDocExterne('Link Encoded in URI');
            // which means that they can be identified by their use of
            // 'ValiderLienDocExterne'.
            if (href.includes('ValiderLienDocExterne')) {
                return document_type_1.LeaDocumentType.Link;
            }
            // File documents have a direct link in their href that sends the user to
            // a new tab to directly download the document. Their links look
            // something like this:
            // VisualiseDocument.aspx?...
            else {
                return document_type_1.LeaDocumentType.File;
            }
        }
        // Both YouTube and media document types have the href containing a
        // JavaScript execution that contains the link to VisualiseVideo.aspx.
        else if (href.includes('VisualiseVideo.aspx')) {
            // Links that open a media has the second argument of the JavaScript
            // code set to false, which makes it looks like this:
            // javascript:VisualiserVideo('VisualiseVideo.aspx?...', false);
            if (href.includes('false')) {
                return document_type_1.LeaDocumentType.Video;
            }
            // While links that open a YouTube video has the second argument of the
            // JavaScript code set to true, which makes it look like this:
            // javascript:VisualiserVideo('VisualiseVideo.aspx?...', true);
            else if (href.includes('true')) {
                return document_type_1.LeaDocumentType.YouTube;
            }
        }
        // Default to file if all checks fail.
        return document_type_1.LeaDocumentType.File;
    }
    // Extracts the link of the document based on its type. Used to fetch the link and YouTube url for non-files.
    static extractDocumentURL(openAction, type) {
        // Decoding the component before matching because SOME browsers decide to encode the quotation
        // marks in URI too.
        const openActionDecoded = decodeURIComponent(openAction);
        switch (type) {
            case document_type_1.LeaDocumentType.File:
                // Files do not need any modifications.
                return new Promise((resolve) => resolve(openAction));
            case document_type_1.LeaDocumentType.Link:
                // Link documents have a href that looks like this:
                // javascript:CallPageVisualiseDocument('VisualiseDocument.aspx?...');
                // ValiderLienDocExterne('Link Encoded in URI');
                return new Promise((resolve) => {
                    // The link can be extracted by matching for the second string contained in single quotation marks.
                    resolve(openActionDecoded.match(util_1.quotationMarksRegex)[1]
                        // Remove the quotation marks.
                        .replaceAll("'", ''));
                });
            case document_type_1.LeaDocumentType.Video:
                // Video href have the following format:
                // javascript:VisualiserVideo('VisualiseVideo.aspx?...', false);
                // The link to the video preview can be obtained by matching for
                // everything inside the quotation marks and trimming out the quotation
                // marks.
                return new Promise((resolve) => resolve(openActionDecoded.match(util_1.quotationMarksRegex)[0].replaceAll("'", '')
                    // However, since the tokens and info are exactly the same after
                    // the .aspx, the true download link can simply be obtained by
                    // swapping the 'VisualiseVideo' with 'VisualiseDocument'.
                    .replace('VisualiseVideo', 'VisualiseDocument')));
            case document_type_1.LeaDocumentType.YouTube:
                // YouTube href have the following format.
                // javascript:VisualiserVideo('VisualiseVideo.aspx?...', true);
                // The link in the script can be extracted by matching for quotation
                // marks, trimming them out, and then adding to the root link.
                return (0, util_1.fetchDocumentFrom)(openActionDecoded.match(util_1.quotationMarksRegex)[0].replaceAll("'", ''))
                    // The true YouTube link is stored in the href of the anchor element
                    // with the class .Gen_Btn...
                    .then((document) => document.querySelector('.Gen_Btn'))
                    .then((anchor) => anchor.href)
                    // in the following format:
                    // javascript:OpenCentre('YouTube Link Encoded in URI', ...); Close();
                    .then((href) => decodeURIComponent(href.match(util_1.quotationMarksRegex)[0].replaceAll("'", '')));
        }
    }
    static extractDocumentDate(dateString) {
        // On Marianopolis's documents page, document dates are formatted in one
        // of the two following ways:
        // since<Month> <Day>, <Year>
        // from <Month> <Day>, <Year> to <Month> <Date>, <Year>
        // For the first case, there is no space between the "since" and the month, so it is necessary to trim the
        // since out and then fetch the month, day, and year from the indices 0, 1, and 2.
        if (dateString.startsWith('since')) {
            // \u00A0 is a non-breaking space.
            // Trim out the first 5 characters ('since').
            const words = dateString.substring(5).split(/[\u00A0 \n]/g);
            // Months on Omnivox are presented in their abbreviated form.
            const month = (0, util_1.getMonthIndexFromShortenedName)(words[0]);
            // Remove the comma by removing the last character.
            const day = parseInt(words[1].substring(0, words[1].length - 1));
            const year = parseInt(words[2]);
            return new Date(year, month, day);
        }
        else {
            const words = dateString.split(/[\u00A0 \n]/g);
            const month = (0, util_1.getMonthIndexFromShortenedName)(words[1]);
            const day = parseInt(words[2].substring(0, words[2].length - 1));
            const year = parseInt(words[3]);
            return new Date(year, month, day);
        }
    }
    // Marks the document as read locally and remotely.
    markAsRead() {
        // Condition to avoid sending too many requests to server.
        if (!this.read) {
            this.read = true;
            // If this is a file, fetch on the download link directly.
            if (this.type == document_type_1.LeaDocumentType.File) {
                fetch(this.url);
            }
            else {
                // Otherwise fetch the first quoted part in the open action to mark the document as read.
                // Remove the quotation marks after matching.
                fetch(this.originalOpenAction.match(util_1.quotationMarksRegex)[0].replaceAll("'", ''));
            }
            // Ignoring the responses of the fetch because the request is only sent to notify the server.
        }
    }
    // Returns the style class (colour) that corresponds to the document type.
    get documentIconTypeStyleClass() {
        switch (this.type) {
            case document_type_1.LeaDocumentType.File:
                return 'file-background';
            case document_type_1.LeaDocumentType.Link:
                return 'link-background';
            case document_type_1.LeaDocumentType.Video:
            case document_type_1.LeaDocumentType.YouTube:
                return 'video-background';
        }
    }
    // Returns the material icon displayed on the document type badge.
    get documentTypeIcon() {
        switch (this.type) {
            case document_type_1.LeaDocumentType.File:
                return 'description';
            case document_type_1.LeaDocumentType.Link:
                return 'link';
            case document_type_1.LeaDocumentType.Video:
                return 'video_file';
            case document_type_1.LeaDocumentType.YouTube:
                return 'video_library';
        }
    }
    // Returns the material icon displayed on the download badge.
    get documentActionIcon() {
        switch (this.type) {
            case document_type_1.LeaDocumentType.File:
                return 'file_download';
            case document_type_1.LeaDocumentType.Link:
                return 'open_in_new';
            case document_type_1.LeaDocumentType.Video:
                return 'play_circle';
            case document_type_1.LeaDocumentType.YouTube:
                return 'open_in_new';
        }
    }
    get formattedDate() {
        const dateStringParts = this.uploadDate.toDateString().split(' ');
        // The date string has the following format:
        // Weekday Month Date Year
        // We desire the following format:
        // Month Date, Year
        return `${dateStringParts[1]} ${dateStringParts[2]}, ${dateStringParts[3]}`;
    }
    buildBadges(renderInfo) {
        return [
            new badge_1.Badge({
                clickable: false,
                // The first badge represents the type of the document.
                styleClasses: [this.documentIconTypeStyleClass],
                icon: this.documentTypeIcon
            }),
            new badge_1.Badge({
                newTab: true,
                // Open the link in a new tab.
                styleClasses: ['clickable'],
                icon: this.documentActionIcon,
                href: this.url,
                onclick: () => {
                    // Mark the document as read.
                    this.markAsRead();
                    // Call for a re-render when the read status has been updated.
                    this.rerender();
                }
            })
        ];
    }
    buildContent(renderInfo) {
        return [
            // Render the date with the title inside another div so the gap from the card do not
            // separate them.
            new element_builder_1.ElementBuilder({
                tag: 'div',
                children: [
                    // Document Name
                    this.renderNameHighlight(renderInfo.search),
                    // Upload Date
                    new element_builder_1.ElementBuilder({
                        tag: 'div',
                        styleClasses: ['date'],
                        text: this.formattedDate
                    }).build()
                ]
            }).build(),
            // Only render the description if there is a description.
            ...this.description.length > 0 ? [new element_builder_1.ElementBuilder({
                    tag: 'div',
                    styleClasses: ['description'],
                    text: this.description
                }).build()] : []
        ];
    }
    // Renders the name of the document in DOM while highlighting the search term.
    renderNameHighlight(search) {
        const titleElement = new element_builder_1.ElementBuilder({
            tag: 'div',
            // Add the bold tag if the document has not been read.
            styleClasses: ['name', ...this.read ? [] : ['bold']]
        }).build();
        // Save the trouble of building the regex and dealing with 0-length matches here.
        if (search.length > 0) {
            // Add the ig flags to ignore case and match globally.
            // Since we are ignoring case, use replace to maintain the original match.
            titleElement.innerHTML = this.name.replace(new RegExp((0, util_1.regexEscape)(search), 'ig'), 
            // God I have sinned in using HTML to make elements. Please forgive me.
            (match) => `<mark>${match}</mark>`);
        }
        else {
            titleElement.appendChild(document.createTextNode(this.name));
        }
        return titleElement;
    }
    nameContains(search) {
        // Ignore casing for this check.
        return this.name.toLowerCase().includes(search.toLowerCase());
    }
}
exports.LeaDocument = LeaDocument;


/***/ }),

/***/ 824:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.injectDocumentsOverviewButtonToLea = void 0;
// Adds a document overview button to the topleft section on Lea.
const element_builder_1 = __webpack_require__(358);
function injectDocumentsOverviewButtonToLea() {
    // The link to the overview page is stored in the element with the id lienDDLE.
    const summaryAnchor = document.querySelector('#lienDDLE');
    // Potential fix for the teacher version of the website where the summary may not be present.
    if (summaryAnchor) {
        const overviewLink = summaryAnchor.href;
        // All the buttons are contained in this element.
        const buttonsContainer = document.querySelector('#region-raccourcis-services-skytech');
        buttonsContainer.insertBefore(new element_builder_1.ElementBuilder({
            tag: 'a',
            // Mirror the style of the Lea button.
            styleClasses: ['raccourci', 'id-service_CVIP', 'code-groupe_lea', 'documents-overview-icon-parent'],
            href: overviewLink,
            title: 'Documents Overview',
            children: [
                new element_builder_1.ElementBuilder({
                    tag: 'div',
                    // Mirror the style of the Lea button, but with the material icons class added.
                    styleClasses: ['svg-icon', 'material-icons'],
                    // Documents icon name
                    text: 'description'
                }).build(),
                new element_builder_1.ElementBuilder({
                    tag: 'div',
                    styleClasses: ['titre'],
                    text: 'Docs'
                }).build()
            ]
        }).build(), 
        // The last child is the MIO button, put the overview before the MIO button so it's together with Lea.
        buttonsContainer.lastElementChild);
    }
}
exports.injectDocumentsOverviewButtonToLea = injectDocumentsOverviewButtonToLea;


/***/ }),

/***/ 916:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeaDocumentsOverview = void 0;
const element_builder_1 = __webpack_require__(358);
const renderable_1 = __webpack_require__(972);
const render_info_1 = __webpack_require__(426);
const page_patcher_1 = __webpack_require__(50);
class LeaDocumentsOverview extends renderable_1.Renderable {
    constructor(documentsContainer) {
        super('div', 'omniplus-documents-overview', 'omniplus-lea-container');
        this.container = documentsContainer;
    }
    // Injects the container into the document overview page.
    injectToDocumentOverviewPage() {
        // The printer friendly version button blocks the view, not sure why it's there, why it exists, or what's
        // the purpose of printing out an overview like that.
        (0, page_patcher_1.removePrinterFriendlyButton)();
        // Fetch the original container of the overview table.
        const overviewContainer = document.querySelector('.cvirContenuCVIR');
        // Get rid of the centre align.
        overviewContainer.removeAttribute('align');
        // Clear everything off.
        while (overviewContainer.hasChildNodes()) {
            overviewContainer.removeChild(overviewContainer.firstChild);
        }
        overviewContainer.appendChild(this.domElement);
    }
    updateDomElement() {
        this.domElement.append(new element_builder_1.ElementBuilder({
            tag: 'div',
            styleClasses: ['control-bar'],
            children: [
                new element_builder_1.ElementBuilder({
                    tag: 'input',
                    styleClasses: ['search-bar']
                })
                    .withAttribute('type', 'text')
                    .withAttribute('placeholder', 'Search')
                    .withEventListener('input', (event) => {
                    // Call for a rerender on the container whenever the input changes.
                    // (because the inputs do not need to be rebuilt.)
                    this.container.render(new render_info_1.OverviewRenderInfo(event.target.value));
                })
                    .build(),
                // Using an anchor so the element unfocuses after the mouse button has been lifted.
                // Otherwise the focused style will remain active.
                new element_builder_1.ElementBuilder({
                    tag: 'a',
                    styleClasses: ['button'],
                    text: 'Mark All as Read',
                    href: '#',
                    onclick: (event) => {
                        this.container.markAllDocumentsAsRead();
                        // Call a rerender.
                        this.container.render(new render_info_1.OverviewRenderInfo(
                        // The button and the input share a common parent.
                        event.target.parentElement.firstElementChild.value));
                        // Unfocus after the click has been processed.
                        event.target.blur();
                    }
                }).build()
            ]
        }).build(), this.container.render(new render_info_1.OverviewRenderInfo("")));
    }
}
exports.LeaDocumentsOverview = LeaDocumentsOverview;


/***/ }),

/***/ 426:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OverviewRenderInfo = void 0;
class OverviewRenderInfo {
    constructor(search) {
        this.search = search;
    }
}
exports.OverviewRenderInfo = OverviewRenderInfo;


/***/ }),

/***/ 21:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FontType = void 0;
// The general category of typeface used for the text.
var FontType;
(function (FontType) {
    FontType[FontType["Serif"] = 0] = "Serif";
    FontType[FontType["SansSerif"] = 1] = "SansSerif";
    FontType[FontType["Monospace"] = 2] = "Monospace";
})(FontType = exports.FontType || (exports.FontType = {}));


/***/ }),

/***/ 141:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForumMessage = void 0;
const element_builder_1 = __webpack_require__(358);
const formatted_text_1 = __webpack_require__(641);
const badged_card_1 = __webpack_require__(143);
const badge_1 = __webpack_require__(147);
// Represents a message within a forum post.
class ForumMessage extends badged_card_1.BadgedCard {
    constructor(postTime, author, originalContentElement, quoteAction) {
        super({
            styleClasses: ['message']
        });
        this.contentExceedsHeight = false;
        this.expanded = false;
        this.postTime = postTime;
        this.author = author;
        this.content = formatted_text_1.FormattedText.fromContentNode(originalContentElement);
        this.quoteAction = quoteAction;
        const contentElement = new element_builder_1.ElementBuilder({
            tag: 'div',
            styleClasses: ['content'],
            children: [this.content.render()]
        }).build();
        // Add the element to the document so the height can be measured.
        document.body.appendChild(contentElement);
        // Cap content height at 200px.
        if (!this.expanded && contentElement.clientHeight > 200) {
            this.contentExceedsHeight = true;
        }
        // Get rid of it after.
        document.body.removeChild(contentElement);
    }
    // Forum messages are not grouped together under common elements per message. Instead a list of table rows are
    // placed under one table to display everything. This makes each forum message take two elements.
    static fromPostElements(timeElement, messageElement) {
        // The post time of the message is stored in the element with the class .titreMsg. Parse the information
        // from it to extract the post time.
        const postTime = ForumMessage.extractMessagePostTime(timeElement.querySelector('.titreMsg').innerText);
        // The name of the author is placed in the element with the class .nomAuteur alongside with the profile
        // button and the MIO button. They can be excluded by accessing the innerText property and trimming out the
        // extra tabs and spaces.
        const author = messageElement.querySelector('.nomAuteur').innerText.trim();
        // The actual message of the message is stored in an element with the class .Msg inside the message element
        // alongside a "quote" button. Choosing the first child to select the message and exclude the button.
        // Not confusing at all, right?
        const contentElement = messageElement.querySelector('.Msg').firstElementChild;
        // The reply button is stored in the anchor element in the message section in an element with the class
        // .liensMsg.
        const quoteAction = messageElement.querySelector('.liensMsg a').href;
        return new ForumMessage(postTime, author, contentElement, quoteAction);
    }
    // Extracts the time when the message was posted from its time string.
    static extractMessagePostTime(time) {
        const tokens = time.split(' ');
        // The time string on forum messages are formatted as follows:
        // YYYY-MM-DD at HH:MM AM/PM OR <yesterday/today>
        const dateStringTokens = tokens[0].split('-');
        let year, monthIndex, day;
        if (tokens[0] === 'yesterday') {
            // Subtract one day to obtain yesterday.
            const yesterday = new Date(Date.now() - 86400000);
            year = yesterday.getFullYear();
            monthIndex = yesterday.getMonth();
            day = yesterday.getDate();
        }
        else if (tokens[0] === 'today') {
            const today = new Date(Date.now());
            year = today.getFullYear();
            monthIndex = today.getMonth();
            day = today.getDate();
        }
        else {
            year = parseInt(dateStringTokens[0]);
            // Months start counting from 0. Subtract 1 from the parsed number.
            monthIndex = parseInt(dateStringTokens[1]) - 1;
            day = parseInt(dateStringTokens[2]);
        }
        const timeStringTokens = tokens[2].split(':');
        const isPM = tokens[3] == 'PM';
        // Mod the parsed hours by 12 before so 12AM becomes 0, and 12PM becomes 0 + 12.
        // Add 12 hours to the hour count if the post is made in PM.
        const hour = parseInt(timeStringTokens[0]) % 12 + (isPM ? 12 : 0);
        const minute = parseInt(timeStringTokens[1]);
        return new Date(year, monthIndex, day, hour, minute);
    }
    // Scrapes all forum messages from documents page of a given course.
    static loadFromForumPostPage(page) {
        // The time of the forum elements have class .enteteMsg and are always table row elements. Only selecting
        // the class adds noise.
        const timeElements = page.querySelectorAll('tr.enteteMsg');
        // Everything else is contained in row elements with .Msg class. Only selecting the class adds noise.
        const messageElements = page.querySelectorAll('tr.Msg');
        // Iterate through both at the same time.
        return Array.from(timeElements).map((timeElement, index) => ForumMessage.fromPostElements(timeElement, messageElements[index]));
    }
    // Formatted post time.
    get formattedTime() {
        // The date string has the following format:
        // Weekday Month Date Year
        // We desire the following format:
        // Month Date, Year
        const dateStringParts = this.postTime.toDateString().split(' ');
        // The time string has the following format:
        // HH:MM:SS GMT-NNNN (Time Zone Name)
        // We desire the following format:
        // HH:MM
        // To obtain the parts, first split by space, then by colon.
        const timeStringParts = this.postTime.toTimeString().split(' ')[0].split(':');
        return `${timeStringParts[0]}:${timeStringParts[1]} ${dateStringParts[1]} ${dateStringParts[2]}, ${dateStringParts[3]}`;
    }
    renderContentElement() {
        return new element_builder_1.ElementBuilder({
            tag: 'div',
            // Shorten if the content exceeds the height limit and the current message has not been expanded.
            styleClasses: ['content', ...(!this.expanded && this.contentExceedsHeight) ? ['shortened'] : []],
            children: [this.content.render()]
        }).build();
    }
    buildExpandButton() {
        return new badge_1.Badge({
            styleClasses: ['clickable', 'expand'],
            onclick: (event) => {
                // Invert the state
                this.expanded = !this.expanded;
                // And call for a rerender.
                this.render();
                // Unfocus after click.
                event.target.blur();
            },
            icon: this.expanded ? 'expand_less' : 'expand_more'
        });
    }
    buildBadges() {
        return [
            // Quote reply badge.
            new badge_1.Badge({
                styleClasses: ['clickable'],
                href: this.quoteAction,
                icon: 'format_quote'
            }),
            // Add the expand button if the content exceeds the height limit.
            ...this.contentExceedsHeight ? [this.buildExpandButton()] : []
        ];
    }
    buildContent() {
        return [
            new element_builder_1.ElementBuilder({
                tag: 'div',
                styleClasses: ['header'],
                children: [
                    // Boldface the author name.
                    new element_builder_1.ElementBuilder({
                        tag: 'b',
                        styleClasses: ['author'],
                        text: this.author
                    }).build(),
                    new element_builder_1.ElementBuilder({
                        tag: 'span',
                        styleClasses: ['filler']
                    }).build(),
                    new element_builder_1.ElementBuilder({
                        tag: 'span',
                        styleClasses: ['time'],
                        text: this.formattedTime
                    }).build()
                ]
            }).build(),
            this.renderContentElement()
        ];
    }
}
exports.ForumMessage = ForumMessage;


/***/ }),

/***/ 802:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForumSubject = void 0;
// Represents a whole forum subject.
const forum_message_1 = __webpack_require__(141);
const renderable_1 = __webpack_require__(972);
const page_patcher_1 = __webpack_require__(50);
const element_builder_1 = __webpack_require__(358);
class ForumSubject extends renderable_1.Renderable {
    constructor(messages, replyAction) {
        super('div', 'omniplus-forum-subject', 'omniplus-lea-container');
        this.expandedAll = false;
        this.scrolledToBottom = false;
        this.messages = messages;
        this.replyAction = replyAction;
    }
    static loadFromForumPostPage(page) {
        // The reply button is an anchor element in the toolbar.
        const replyAction = document.querySelector('.toolbarStrip a').href;
        return new ForumSubject(forum_message_1.ForumMessage.loadFromForumPostPage(page), replyAction);
    }
    updateDomElement() {
        this.domElement.append(new element_builder_1.ElementBuilder({
            tag: 'div',
            styleClasses: ['controls'],
            children: [
                // Reply to subject button
                new element_builder_1.ElementBuilder({
                    tag: 'a',
                    styleClasses: ['button', 'primary', 'material-icons'],
                    title: 'Reply to Subject',
                    href: this.replyAction,
                    text: 'comment',
                    onclick: (event) => event.target.blur()
                }).build(),
                // Scroll to top/buttom button.
                new element_builder_1.ElementBuilder({
                    tag: 'a',
                    styleClasses: ['button', 'primary', 'material-icons'],
                    text: this.scrolledToBottom ? 'vertical_align_top' : 'vertical_align_bottom',
                    title: this.scrolledToBottom ? 'Scroll to Bottom' : 'Scroll to Top',
                    onclick: () => {
                        // Toggle expand all and rerender.
                        this.scrolledToBottom = !this.scrolledToBottom;
                        if (this.scrolledToBottom) {
                            this.domElement.scrollTo(0, this.domElement.scrollHeight);
                        }
                        else {
                            this.domElement.scrollTo(0, 0);
                        }
                        this.render();
                    }
                }).build(),
                // Expand/collapse all button.
                new element_builder_1.ElementBuilder({
                    tag: 'a',
                    styleClasses: ['button', 'secondary', 'material-icons'],
                    text: this.expandedAll ? 'expand_less' : 'expand_more',
                    title: this.expandedAll ? 'Collapse All' : 'Expand All',
                    onclick: () => {
                        // Toggle expand all and rerender.
                        this.expandedAll = !this.expandedAll;
                        this.messages.forEach((message) => {
                            message.expanded = this.expandedAll;
                            // Rerender on the messages.
                            message.render();
                        });
                        this.render();
                    }
                }).build()
            ]
        }).build(), ...this.messages.map((msg) => msg.render()));
    }
    // Injects the container into the document overview page.
    injectToForumSubjectPage() {
        (0, page_patcher_1.removePrinterFriendlyButton)();
        // Fetch the original container of the subject.
        const overviewContainer = document.querySelector('.cvirContenuCVIR');
        // Get rid of the centre align.
        overviewContainer.removeAttribute('align');
        // Clear everything off.
        while (overviewContainer.hasChildNodes()) {
            overviewContainer.removeChild(overviewContainer.firstChild);
        }
        overviewContainer.appendChild(this.domElement);
    }
}
exports.ForumSubject = ForumSubject;


/***/ }),

/***/ 311:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Assessment = void 0;
// Represents an assessment on Lea.
const renderable_1 = __webpack_require__(972);
const element_builder_1 = __webpack_require__(358);
const util_1 = __webpack_require__(192);
class Assessment extends renderable_1.Renderable {
    constructor(name, weight, counted, mark, average) {
        // A grade might be dropped.
        super('tr', ...counted ? [] : ['dropped']);
        this.name = name;
        this.weight = weight;
        this.counted = counted;
        this.grade = mark;
        this.average = average;
    }
    // Extracts a grade represented on Lea as a ratio.
    static extractGrade(gradeText) {
        // Grades have the following format: grade/total, sometimes they are enclosed by parenthesis.
        // Start by removing the parentheses if they exist.
        const gradeAndTotal = gradeText.replace(/\(\)/g, '')
            // Then split by slash to break them apart
            .split('/')
            // And parse them into numbers.
            .map((str) => parseFloat(str));
        // Simply divide them to get the ratio.
        return gradeAndTotal[0] / gradeAndTotal[1];
    }
    // Loads an assessment from its corresponding table row.
    static fromElement(element) {
        // A row that contains the grades has the following hierarchy
        // tr[bg-colour = eeeeee]
        //   td
        //   td.td-nombre
        //   td
        //     font<assessment name>
        //     br font<This grade will be dropped> (only added if this grade is being dropped)
        //   td
        //     font<(personal grade/total)> OR font< - > if there's no grade
        //     br
        //     font<grade%>
        //   td
        //     font<average grade/total> OR font< - > if there's no average
        //   td
        //     font<weight%>
        //     font(weighted grade/total weight)
        // To obtain the information we need, we have to extract the 3rd to the 6th element of the row.
        const nameElement = element.childNodes.item(2);
        const name = nameElement.firstElementChild.innerText;
        const counted = !nameElement.innerText.includes('This mark will be discarded');
        const gradeElement = element.childNodes.item(3);
        // If there is a grade, there will be more than one element specifying the grade marking and the percent grade.
        const grade = gradeElement.childNodes.length > 1 ?
            Assessment.extractGrade(gradeElement.firstElementChild.innerText) : undefined;
        // If there is an average, the grade text will have more than 1 characters.
        const averageElement = element.childNodes.item(4).firstElementChild;
        const average = averageElement.innerText.length > 1 ? Assessment.extractGrade(averageElement.innerText) : undefined;
        const weightElement = element.childNodes.item(5);
        // The weight is displayed first in percentage "Weight%" alongside with the weighted vs. actual grade.
        // Extract the percentage from the first element, remove the percentage, and divide it by 100 to get the
        // actual ratio.
        const weight = parseFloat(weightElement.firstElementChild.innerText.replace('%', '')) / 100;
        return new Assessment(name, weight, counted, grade, average);
    }
    // Loads all assessments from a course assessments page.
    static loadAllAssessmentsFromCourseAssessmentPage(page) {
        // All grades are stored in a table with the class .table-notes.
        // Using the bgcolor requirement to select only ones that can contain grade.
        return Array.from(page.querySelectorAll(`.table-notes tr[bgcolor="#EEEEEE"]`))
            // However, some of these are empty and function as padding for some reason, so a second filter needs to
            // be applied. These padding rows have two children that fill out the row, so checking for more than 2
            // children should do the job.
            .filter((tr) => tr.childElementCount > 2)
            .map((tr) => Assessment.fromElement(tr));
    }
    get hasGrade() {
        return this.grade != undefined;
    }
    get hasAverage() {
        return this.average != undefined;
    }
    updateDomElement() {
        this.domElement.append(new element_builder_1.ElementBuilder({
            tag: 'td', text: this.name
        }).build(), new element_builder_1.ElementBuilder({
            // The grade always has precision to the ones.
            tag: 'td', text: this.hasGrade ? (0, util_1.formatGrade)(this.grade, 0) : '-'
        }).build(), new element_builder_1.ElementBuilder({
            // The average has precision to the tenths since it's calculated via division.
            tag: 'td', text: this.hasAverage ? (0, util_1.formatGrade)(this.average, 1) : '-'
        }).build(), new element_builder_1.ElementBuilder({
            // The average has precision to the tenths given.
            tag: 'td', text: (0, util_1.formatGrade)(this.weight, 1)
        }).build());
    }
}
exports.Assessment = Assessment;


/***/ }),

/***/ 39:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CourseGradesList = void 0;
const assessment_1 = __webpack_require__(311);
const util_1 = __webpack_require__(192);
const renderable_1 = __webpack_require__(972);
const element_builder_1 = __webpack_require__(358);
const grade_progression_graph_1 = __webpack_require__(619);
class CourseGradesList extends renderable_1.Renderable {
    constructor(name, code, assessments, grade, average, median, standardDeviation, graph) {
        super('div', 'card', 'course-grades-list');
        this.courseName = name;
        this.courseCode = code;
        this.assessments = assessments;
        this.currentGrade = grade;
        this.classAverage = average;
        this.classMedian = median;
        this.standardDeviation = standardDeviation;
        this.gradeProgressionGraph = graph;
    }
    // Gives the grade/value, in decimal of an element that has a percentage representation of a grade.
    static extractDecimalFromOverviewPercentageElement(element) {
        return parseFloat(
        // Convert it into an HTML element to extract its inner text.
        element.innerText
            // Some elements have extra spaces/line breaks before/after the grade percentage.
            .trim()
            // Remove the percentage sign
            .replace('%', ''))
            // Divide by 100 to convert the number into decimal.
            / 100;
    }
    static loadFromCourseAssessmentsPage(page) {
        // The course name and code is stored in an element with the class centrePageLea, which has the following
        // structure:
        // span.centrePageLea
        //   span.titrePageLea "Detailed marks per assessment"
        //   span [Course Title]
        // Extract title by excluding the class titrePageLea:
        const courseCodeAndName = (0, util_1.extractCourseCodeAndNameFromCourseTitle)(page.querySelector('.centerPageLea span span:not(.titrePageLea)').innerText);
        const courseCode = courseCodeAndName[0];
        const courseName = courseCodeAndName[1];
        // The student's and the class's average, median, and standard deviation grades are stored in a table with
        // the class tb-sommaire, which has the following structure:
        // table.tb-sommaire > tbody
        //   tr "Grade Summary"
        //   tr
        //     td (filler)
        //     td "Current Grade"
        //     td > font > b
        //       "Current Grade/Total"
        //       font [Current Grade]%
        //   tr > td
        //     font "Class Statistics"
        //     table > tbody
        //       Note: some professors may choose to not display the median and standard deviation, or to not
        //       display data related to the class average entirely, meaning that all the tr elements listed
        //       below are optional. However, no matter their decision, they are always presented in the order of
        //       average, median, and standard deviation.
        //       tr
        //         td (filler)
        //         td > font > "Class average:"
        //         td > font > [Class Average]%
        //       tr
        //         td > font > "Median:"
        //         td > font > [Median]%
        //       tr
        //         td > font > "Standard deviation:"
        //         td > font > [Standard Deviation]%
        // To extract the student's current grade, we can take advantage of the fact that it is the only element
        // within the table that is inside a font that is inside a font:
        const currentGrade = this.extractDecimalFromOverviewPercentageElement(page.querySelector('.tb-sommaire font font'));
        // To extract the class numbers (average, median, deviation), use the fact that they are in a separate
        // table, and are all the last elements of their parent.
        // Convert it to an array for easier access.
        const classStatistics = Array.from(page.querySelectorAll('.tb-sommaire table tr td:last-child font'));
        // The first number in the class statistics is always the class average.
        const classAverage = classStatistics.length > 0 ? this.extractDecimalFromOverviewPercentageElement(classStatistics[0]) : undefined;
        // The second is always the median.
        const classMedian = classStatistics.length > 1 ? this.extractDecimalFromOverviewPercentageElement(classStatistics[1]) : undefined;
        // The third is always the standard deviation.
        const standardDeviation = classStatistics.length > 2 ? this.extractDecimalFromOverviewPercentageElement(classStatistics[2]) : undefined;
        // Load in the assessments. Reverse the order to show the newest first.
        const assessments = assessment_1.Assessment.loadAllAssessmentsFromCourseAssessmentPage(page).reverse();
        // Put the ones that have been evaluated and counted on the top.
        assessments.sort((a, b) => {
            // First show assessments that have personal grades.
            if (a.hasGrade != b.hasGrade) {
                return (b.hasGrade ? 1 : 0) - (a.hasGrade ? 1 : 0);
            }
            // Then show assessments that are being counted.
            if (a.counted != b.counted) {
                return (b.counted ? 1 : 0) - (a.counted ? 1 : 0);
            }
            return 0;
        });
        // Load in the grades graph.
        const graph = grade_progression_graph_1.GradeProgressionGraph.loadFromCourseAssessmentsPage(page);
        return new CourseGradesList(courseName, courseCode, assessments, currentGrade, classAverage, classMedian, standardDeviation, graph);
    }
    get hasAssessments() {
        return this.assessments.length > 0;
    }
    get hasAverage() {
        return this.classAverage != undefined;
    }
    get hasMedian() {
        return this.classMedian != undefined;
    }
    get hasStandardDeviation() {
        return this.standardDeviation != undefined;
    }
    get hasZScore() {
        return this.hasAverage && this.hasStandardDeviation;
    }
    get zScore() {
        return (this.currentGrade - this.classAverage) / this.standardDeviation;
    }
    updateDomElement() {
        this.domElement.append(new element_builder_1.ElementBuilder({
            tag: 'div',
            styleClasses: ['title-bar'],
            children: [
                new element_builder_1.ElementBuilder({
                    tag: 'div',
                    styleClasses: ['course-name'],
                    text: this.courseName
                }).build(),
                new element_builder_1.ElementBuilder({
                    tag: 'div',
                    styleClasses: ['course-grade'],
                    text: (0, util_1.formatGrade)(this.currentGrade, 0)
                }).build()
            ]
        }).build(), 
        // Render the graph if there is any data.
        ...this.gradeProgressionGraph.hasData ? [this.gradeProgressionGraph.render()] : [], 
        // Render the class stats section if there is any data.
        ...(this.hasAverage && this.hasMedian && this.hasStandardDeviation) ? [
            // Divider
            new element_builder_1.ElementBuilder({ tag: 'hr' }).build(),
            new element_builder_1.ElementBuilder({
                tag: 'table', styleClasses: ['class-stats'],
                children: [
                    // Include the average if there is an average
                    ...this.hasAverage ? [new element_builder_1.ElementBuilder({
                            tag: 'tr',
                            children: [
                                new element_builder_1.ElementBuilder({
                                    tag: 'td', text: 'Class Average'
                                }).build(),
                                new element_builder_1.ElementBuilder({
                                    tag: 'td', text: (0, util_1.formatGrade)(this.classAverage, 1)
                                }).build()
                            ]
                        }).build()] : [],
                    // Include the median if there is a median
                    ...this.hasMedian ? [new element_builder_1.ElementBuilder({
                            tag: 'tr',
                            children: [
                                new element_builder_1.ElementBuilder({
                                    tag: 'td', text: 'Median'
                                }).build(),
                                new element_builder_1.ElementBuilder({
                                    tag: 'td', text: (0, util_1.formatGrade)(this.classMedian, 0)
                                }).build()
                            ]
                        }).build()] : [],
                    // Include the standard deviation if there is a standard deviation
                    ...this.hasStandardDeviation ? [new element_builder_1.ElementBuilder({
                            tag: 'tr',
                            children: [
                                new element_builder_1.ElementBuilder({
                                    tag: 'td', text: 'Standard Deviation'
                                }).build(),
                                new element_builder_1.ElementBuilder({
                                    tag: 'td', text: (0, util_1.formatGrade)(this.standardDeviation, 1)
                                }).build()
                            ]
                        }).build()] : [],
                    // Include the z-score deviation if it can be calculated
                    ...this.hasZScore ? [new element_builder_1.ElementBuilder({
                            tag: 'tr',
                            children: [
                                new element_builder_1.ElementBuilder({
                                    tag: 'td', text: 'Z-Score'
                                }).build(),
                                new element_builder_1.ElementBuilder({
                                    tag: 'td', text: this.zScore.toFixed(2)
                                }).build()
                            ]
                        }).build()] : []
                ]
            }).build()
        ] : [], 
        // Render the assessment table section if there are any assessments.
        ...this.hasAssessments ? [
            // Divider
            new element_builder_1.ElementBuilder({ tag: 'hr' }).build(),
            new element_builder_1.ElementBuilder({
                tag: 'table', styleClasses: ['assessments-list'],
                children: [
                    new element_builder_1.ElementBuilder({
                        tag: 'tr',
                        children: [
                            new element_builder_1.ElementBuilder({ tag: 'th', text: 'Assessment' }).build(),
                            new element_builder_1.ElementBuilder({ tag: 'th', text: 'Grade' }).build(),
                            new element_builder_1.ElementBuilder({ tag: 'th', text: 'Average' }).build(),
                            new element_builder_1.ElementBuilder({ tag: 'th', text: 'Weight' }).build()
                        ]
                    }).build(),
                    ...this.assessments.map((assessment) => assessment.render())
                ]
            }).build()
        ] : []);
    }
}
exports.CourseGradesList = CourseGradesList;


/***/ }),

/***/ 183:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GradeDataPoint = void 0;
// Represents a data point on the grade graph.
const util_1 = __webpack_require__(192);
const grade_progression_graph_1 = __webpack_require__(619);
class GradeDataPoint {
    constructor(grade, cumulatedPortionOfFinalGrade, releaseDate) {
        this.grade = grade;
        this.cumulatedPortionOfFinalGrade = cumulatedPortionOfFinalGrade;
        this.releaseDate = releaseDate;
    }
    // Loads a data point from its corresponding label on the grade chart.
    static fromDataPointLabel(label) {
        // The label is structured as follows:
        // div.evo
        //   "Your average: <Percentage>%"
        //   <br/>
        //   "Cumulated percentage of the final grade: <Percentage>%"
        //   <br/>
        //   "Update: <3 Letter Month>-<Day>, <Year>"
        // Where the text in quotations are text nodes.
        // Extract the information by filtering for text nodes and extracting their
        const [gradeLine, cumulatedLine, dateLine] = Array.from(label.childNodes).filter((node) => node instanceof Text)
            .map((textNode) => textNode.nodeValue);
        // The first line contains the grade, present as the last word in the string.
        // Split the line with spaces, select the last element, and remove the percentage sign, then divide by 100
        // to convert it into decimal.
        const grade = parseFloat(gradeLine.split(' ').pop().replace('%', '')) / 100;
        // The same rule applies to the cumulated portion of the grade on the second line.
        const cumulatedPortionOfFinalGrade = parseFloat(cumulatedLine.split(' ').pop().replace('%', '')) / 100;
        // To extract the date, split the third line by space and skip the first element.
        const [monthDayString, yearString] = dateLine.split(' ').slice(1);
        // Remove the comma and split by dash to extract the raw month and day.
        const [monthString, dayString] = monthDayString.replace(',', '').split('-');
        // Extract the full date.
        const date = new Date(parseInt(yearString), (0, util_1.getMonthIndexFromShortenedName)(monthString), parseInt(dayString));
        return new GradeDataPoint(grade, cumulatedPortionOfFinalGrade, date);
    }
    // Get the position of this data point on the grade progression graph.
    get positionInGraph() {
        return grade_progression_graph_1.GradeProgressionGraph.convertCoordinateToGraphCoordinate({
            x: this.cumulatedPortionOfFinalGrade,
            y: this.grade
        });
    }
}
exports.GradeDataPoint = GradeDataPoint;


/***/ }),

/***/ 619:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GradeProgressionGraph = void 0;
const grade_data_point_1 = __webpack_require__(183);
const svg_element_builder_1 = __webpack_require__(509);
const renderable_1 = __webpack_require__(972);
// Represents a graph that shows the student's grades compared to the group's average. The detailed specifications
// of the graph can be seen in `src/grade-graph.svg`.
// Dimensions of the coordinates and of the graph.
const start = { x: 50, y: 50 };
const end = { x: 570, y: 450 };
const size = { x: end.x - start.x, y: end.y - start.y };
class GradeProgressionGraph extends renderable_1.Renderable {
    constructor(individualDataPoints, averageDataPoints) {
        super('svg');
        // The SVG element has to be created with the SVG namespace, otherwise nothing shows up.
        this.domElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.individualDataPoints = individualDataPoints;
        this.averageDataPoints = averageDataPoints;
        // Initialise the SVG.
        this.domElement.setAttribute('viewBox', '0 0 600 400');
        this.domElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
    static loadFromCourseAssessmentsPage(page) {
        // Extract the chart data from the chart labels on each data point.
        // Conveniently, all labels for the student's individual grade have the style class .evoE, while the labels
        // for the group's grade have the style class .evoG.
        // Convert them into grade data point objects after being selected, then sort them by the cumulated portion.
        return new GradeProgressionGraph(Array.from(page.querySelectorAll('.evoE'))
            .map((label) => grade_data_point_1.GradeDataPoint.fromDataPointLabel(label))
            .sort((a, b) => a.cumulatedPortionOfFinalGrade - b.cumulatedPortionOfFinalGrade), Array.from(page.querySelectorAll('.evoG'))
            .map((label) => grade_data_point_1.GradeDataPoint.fromDataPointLabel(label))
            .sort((a, b) => a.cumulatedPortionOfFinalGrade - b.cumulatedPortionOfFinalGrade));
    }
    // Converts a coordinate where x and y values are between 0 and 1 to a corresponding point on a graph.
    static convertCoordinateToGraphCoordinate(point) {
        return {
            x: start.x + size.x * point.x,
            // On the SVG, the y+ direction points down, while on a graph, the y+ direction points up.
            // Start at the bottom and subtract the portion of the size to go up.
            y: end.y - size.y * point.y
        };
    }
    get hasData() {
        return this.individualDataPoints.length > 0 || this.averageDataPoints.length > 0;
    }
    renderAxesLines() {
        return svg_element_builder_1.SVGElementBuilder.group({
            children: [
                // Horizontal axis line.
                svg_element_builder_1.SVGElementBuilder.line({
                    x1: 45, y1: 350, x2: 575, y2: 350, strokeWidth: 2,
                    styleClasses: ['heavy-line']
                })
            ]
        });
    }
    renderGridlines() {
        return svg_element_builder_1.SVGElementBuilder.group({
            children: [
                // 100% line
                svg_element_builder_1.SVGElementBuilder.line({
                    x1: 45, y1: 50, x2: 575, y2: 50, strokeWidth: 1,
                    styleClasses: ['light-line']
                }),
                // 90% line
                svg_element_builder_1.SVGElementBuilder.line({
                    x1: 45, y1: 125, x2: 575, y2: 125, strokeWidth: 1,
                    styleClasses: ['light-line']
                }),
                // 80% line
                svg_element_builder_1.SVGElementBuilder.line({
                    x1: 45, y1: 200, x2: 575, y2: 200, strokeWidth: 1,
                    styleClasses: ['light-line']
                }),
                // 70% line
                svg_element_builder_1.SVGElementBuilder.line({
                    x1: 45, y1: 275, x2: 575, y2: 275, strokeWidth: 1,
                    styleClasses: ['light-line']
                })
            ]
        });
    }
    renderLeftLabels() {
        return svg_element_builder_1.SVGElementBuilder.group({
            children: [
                svg_element_builder_1.SVGElementBuilder.text({
                    x: 40, y: 50, dy: '0.3em', text: '100', textAnchor: 'end',
                    styleClasses: ['label']
                }),
                svg_element_builder_1.SVGElementBuilder.text({
                    x: 40, y: 125, dy: '0.3em', text: '90', textAnchor: 'end',
                    styleClasses: ['label']
                }),
                svg_element_builder_1.SVGElementBuilder.text({
                    x: 40, y: 200, dy: '0.3em', text: '80', textAnchor: 'end',
                    styleClasses: ['label']
                }),
                svg_element_builder_1.SVGElementBuilder.text({
                    x: 40, y: 275, dy: '0.3em', text: '70', textAnchor: 'end',
                    styleClasses: ['label']
                }),
                svg_element_builder_1.SVGElementBuilder.text({
                    x: 40, y: 350, dy: '0.3em', text: '60', textAnchor: 'end',
                    styleClasses: ['label']
                })
            ]
        });
    }
    renderBottomLabels() {
        return svg_element_builder_1.SVGElementBuilder.group({
            children: [
                svg_element_builder_1.SVGElementBuilder.text({
                    x: 50, y: 350, dy: '1.2em', text: '0', textAnchor: 'middle',
                    styleClasses: ['label']
                }),
                svg_element_builder_1.SVGElementBuilder.text({
                    x: 180, y: 350, dy: '1.2em', text: '25', textAnchor: 'middle',
                    styleClasses: ['label']
                }),
                svg_element_builder_1.SVGElementBuilder.text({
                    x: 310, y: 350, dy: '1.2em', text: '50', textAnchor: 'middle',
                    styleClasses: ['label']
                }),
                svg_element_builder_1.SVGElementBuilder.text({
                    x: 440, y: 350, dy: '1.2em', text: '75', textAnchor: 'middle',
                    styleClasses: ['label']
                }),
                svg_element_builder_1.SVGElementBuilder.text({
                    x: 570, y: 350, dy: '1.2em', text: '100', textAnchor: 'middle',
                    styleClasses: ['label']
                })
            ]
        });
    }
    renderLines() {
        return svg_element_builder_1.SVGElementBuilder.group({
            children: [
                // Use a polyline to draw the line between the points.
                svg_element_builder_1.SVGElementBuilder.polyline({
                    points: this.averageDataPoints.map((point) => point.positionInGraph),
                    strokeWidth: 2,
                    styleClasses: ['average-line']
                }),
                // Do the same for the individual. Draw individual data last so they appear on top.
                svg_element_builder_1.SVGElementBuilder.polyline({
                    // Go through every point in the individual/group's grade
                    points: this.individualDataPoints.map((point) => point.positionInGraph),
                    strokeWidth: 2,
                    styleClasses: ['individual-line']
                })
            ]
        });
    }
    renderPoints() {
        return svg_element_builder_1.SVGElementBuilder.group({
            children: [
                // Group grades
                svg_element_builder_1.SVGElementBuilder.group({
                    children: this.averageDataPoints.map((point) => point.positionInGraph)
                        .map((position) => svg_element_builder_1.SVGElementBuilder.circle({
                        x: position.x, y: position.y, radius: 5, styleClasses: ['average-point']
                    }))
                }),
                // Individual grades. Draw individual data last so they appear on top.
                svg_element_builder_1.SVGElementBuilder.group({
                    children: this.individualDataPoints.map((point) => point.positionInGraph)
                        .map((position) => svg_element_builder_1.SVGElementBuilder.circle({
                        x: position.x, y: position.y, radius: 5, styleClasses: ['individual-point']
                    }))
                })
            ]
        });
    }
    updateDomElement(renderInfo) {
        this.domElement.append(this.renderGridlines(), this.renderAxesLines(), this.renderLeftLabels(), this.renderBottomLabels(), this.renderLines(), this.renderPoints());
    }
}
exports.GradeProgressionGraph = GradeProgressionGraph;


/***/ }),

/***/ 120:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeaGradesOverview = void 0;
const course_grades_list_1 = __webpack_require__(39);
const util_1 = __webpack_require__(192);
const page_patcher_1 = __webpack_require__(50);
const renderable_1 = __webpack_require__(972);
const element_builder_1 = __webpack_require__(358);
class LeaGradesOverview extends renderable_1.Renderable {
    constructor(courseListPromise) {
        super('div', 'omniplus-lea-container', 'omniplus-grades-overview');
        this.courses = [];
        this.loading = true;
        courseListPromise.then((courseList) => {
            this.courses.push(...courseList);
            this.loading = false;
            this.rerender();
        });
    }
    static loadFromGradesOverviewPage(page) {
        // A list of courses and their average grades are stored in a table with the style class tableau-notes.
        // The names of the courses can be clicked on and provide links to each course's grades overview, which are
        // stored in anchor elements that belong to the third column of the table.
        return new LeaGradesOverview(Promise.all(Array.from(page.querySelectorAll('.tableau-notes td:nth-child(3) a'))
            // Extract the link to the class's page and load them.
            .map((anchor) => (0, util_1.fetchDocumentFrom)(anchor.href)))
            .then((pages) => pages.map((page) => course_grades_list_1.CourseGradesList.loadFromCourseAssessmentsPage(page))));
    }
    injectToGradesOverviewPage() {
        // The printer friendly version button blocks the view, not sure why it's there, why it exists, or what's
        // the purpose of printing out an overview like that.
        (0, page_patcher_1.removePrinterFriendlyButton)();
        // Fetch the original container of the overview table.
        const overviewContainer = document.querySelector('.cvirContenuCVIR');
        // Get rid of the centre align.
        overviewContainer.removeAttribute('align');
        // Clear everything off.
        while (overviewContainer.hasChildNodes()) {
            overviewContainer.removeChild(overviewContainer.firstChild);
        }
        overviewContainer.appendChild(this.domElement);
    }
    updateDomElement() {
        if (this.loading) {
            // Render the loading spinner while loading.
            this.domElement.append(new element_builder_1.ElementBuilder({
                tag: 'div', styleClasses: ['loading'],
                children: [
                    new element_builder_1.ElementBuilder({
                        tag: 'div', styleClasses: ['loading-spinner']
                    }).build()
                ]
            }).build());
        }
        else {
            // Render the cards after it's done.
            this.courses.forEach((course) => this.domElement.appendChild(course.render()));
        }
    }
}
exports.LeaGradesOverview = LeaGradesOverview;


/***/ }),

/***/ 347:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.injectOmniplusLogo = void 0;
// 6-petaled Omnivox Flower
const omniplusLogoSource = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 34 34" style="enable-background:new 0 0 34 34;" xml:space="preserve">
<style type="text/css">
.flower{fill-rule:evenodd;clip-rule:evenodd;fill:#FC8D33;}
</style>
<path class="flower" d="M17,23.2c0.2,17.3,20.2,5.7,5.4-3.1c-0.1,0-0.2-0.1-0.3-0.2c0.1,0,0.2,0.1,0.3,0.1c15.1,8.4,15.1-14.7,0-6.2
\tl0,0l0,0c14.8-8.8-5.2-20.3-5.4-3c-0.2-17.3-20.2-5.7-5.4,3.1l0,0c-15.1-8.5-15.1,14.7,0,6.2l0,0C-3.3,29,16.8,40.5,17,23.2z
\t M11.7,17c0-0.9,0.2-1.8,0.6-2.5c0.9-1.6,2.6-2.8,4.6-2.8s3.7,1.1,4.6,2.8c0.4,0.7,0.6,1.6,0.6,2.5c0,0.5-0.1,1.1-0.2,1.6
\tc-0.7,2.2-2.7,3.7-5,3.7C14.1,22.3,11.7,19.9,11.7,17z"/>
</svg>`;
const domParser = new DOMParser();
function getOmniplusLogoElement() {
    const xmlDocument = domParser.parseFromString(omniplusLogoSource, 'image/svg+xml');
    const svg = xmlDocument.firstElementChild;
    // Set the svg to its correct size.
    // No need to touch the size because the element maintains its ratio.
    svg.style.width = '36px';
    return svg;
}
function injectOmniplusLogo() {
    const omnivoxLogoContainer = document.querySelector('#headerOmnivoxLogo');
    if (omnivoxLogoContainer) {
        const originalLogo = omnivoxLogoContainer.querySelector('img');
        // Put the new logo before the original logo.
        omnivoxLogoContainer.insertBefore(getOmniplusLogoElement(), originalLogo);
        // Remove the original logo.
        omnivoxLogoContainer.removeChild(originalLogo);
    }
}
exports.injectOmniplusLogo = injectOmniplusLogo;


/***/ }),

/***/ 50:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.autoLogin = exports.removeLeaAnchorHoverCSSRule = exports.removePrinterFriendlyButton = exports.removeAllLineBreaks = exports.removeHeaderImage = void 0;
// Removes the header image on Omnivox to free up more space.
function removeHeaderImage() {
    const headerImageElement = document.querySelector('#headerImage');
    if (headerImageElement) {
        // Set its height to 0.
        headerImageElement.style.height = '0';
    }
}
exports.removeHeaderImage = removeHeaderImage;
// Removes all line break elements that extend the size of the page for no reason.
function removeAllLineBreaks() {
    Array.from(document.querySelectorAll('br'))
        .forEach((element) => element.parentElement.removeChild(element));
}
exports.removeAllLineBreaks = removeAllLineBreaks;
// Certain Lea pages have an unnecessary print version button.
function removePrinterFriendlyButton() {
    const printerFriendlyButton = document.querySelector('.td-liens');
    if (printerFriendlyButton) {
        printerFriendlyButton.style.display = 'none';
    }
}
exports.removePrinterFriendlyButton = removePrinterFriendlyButton;
// Lea's stylesheet makes all hovered <a> elements red. Remove the rule if it exists.
function removeLeaAnchorHoverCSSRule() {
    for (const styleSheet of document.styleSheets) {
        for (let i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i].cssText.includes('a:hover:not(.btn.waves-effect)')) {
                styleSheet.deleteRule(i);
            }
        }
    }
}
exports.removeLeaAnchorHoverCSSRule = removeLeaAnchorHoverCSSRule;
function autoLogin() {
    const usernameElement = document.querySelector('#Identifiant');
    const passwordElement = document.querySelector('#Password');
    // If the elements exist and they have been filled.
    if (usernameElement && passwordElement) {
        const username = usernameElement.value;
        const password = passwordElement.value;
        if (username && password) {
            // Click the login button.
            document.querySelector('.btn.green').click();
        }
    }
}
exports.autoLogin = autoLogin;


/***/ }),

/***/ 147:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Badge = void 0;
const element_builder_1 = __webpack_require__(358);
// Quick class to build badges that incorporates some shared properties to make badge building easier.
class Badge extends element_builder_1.ElementBuilder {
    constructor({ clickable = true, newTab = false, icon, styleClasses = [], href = '#', title = '', onclick }) {
        super({
            // Use an anchor if it's clickable so the cursor changes based on the badge's behaviour.
            tag: clickable ? 'a' : 'div',
            styleClasses: ['badge', 'material-icons', ...styleClasses],
            text: icon,
            href, title,
            onclick: clickable ? (e) => {
                onclick(e);
                // Unfocus after the click has been processed.
                e.target.blur();
            } : null
        });
        if (newTab) {
            // Target a new page if this badge opens a new tab.
            this.withAttribute('target', '_blank');
        }
    }
}
exports.Badge = Badge;


/***/ }),

/***/ 143:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BadgedCard = void 0;
const element_builder_1 = __webpack_require__(358);
const renderable_1 = __webpack_require__(972);
// Easier way of building badged cards that collapse some boilerplate code.
// Instead of building the full element through updateDomElement, inheritors of this class will implement
// buildBadges and buildContent instead to provide the mutable parts of the card.
class BadgedCard extends renderable_1.Renderable {
    constructor({ styleClasses = [] }) {
        super('div', 'badged-card', ...styleClasses);
    }
    updateDomElement(renderInfo) {
        this.domElement.append(new element_builder_1.ElementBuilder({
            tag: 'div',
            styleClasses: ['badge-holder'],
            children: this.buildBadges(renderInfo).map((badge) => badge.build())
        }).build(), new element_builder_1.ElementBuilder({
            tag: 'div',
            styleClasses: ['card'],
            children: this.buildContent(renderInfo)
        }).build());
    }
}
exports.BadgedCard = BadgedCard;


/***/ }),

/***/ 358:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ElementBuilder = void 0;
class ElementBuilder {
    // Use HTML as the default namespace.
    constructor({ tag, namespace = 'http://www.w3.org/1999/xhtml', styleClasses = [], children = [], text = '', href = '', title = '', onclick }) {
        this.attributes = new Map();
        this.styleRules = new Map();
        this.eventListeners = new Map();
        this.tag = tag;
        this.namespace = namespace;
        this.styleClasses = styleClasses;
        this.children = children;
        this.text = text;
        this.href = href;
        this.title = title;
        this.onclick = onclick;
    }
    withStyleClasses(...classes) {
        classes.forEach((styleClass) => this.styleClasses.push(styleClass));
        return this;
    }
    withChildren(...children) {
        children.forEach((child) => this.children.push(child));
        return this;
    }
    withText(text) {
        this.text = text;
        return this;
    }
    withAttribute(attribute, value) {
        this.attributes.set(attribute, value);
        return this;
    }
    withEventListener(event, listener) {
        this.eventListeners.set(event, listener);
        return this;
    }
    withStyle(rule, value) {
        this.styleRules.set(rule, value);
        return this;
    }
    build() {
        const element = document.createElementNS(this.namespace, this.tag);
        this.styleClasses.forEach((styleClass) => element.classList.add(styleClass));
        this.children.forEach((child) => element.appendChild(child));
        if (this.text) {
            element.appendChild(document.createTextNode(this.text));
        }
        if (this.href) {
            element.setAttribute('href', this.href);
        }
        if (this.title) {
            element.setAttribute('title', this.title);
        }
        if (this.onclick) {
            element.addEventListener('click', this.onclick);
        }
        this.attributes.forEach((value, attribute) => element.setAttribute(attribute, value));
        // Add the style if it is an HTML element.
        if (element instanceof HTMLElement) {
            this.styleRules.forEach((value, rule) => element.style.setProperty(rule, value));
        }
        this.eventListeners.forEach((listener, event) => element.addEventListener(event, listener));
        return element;
    }
}
exports.ElementBuilder = ElementBuilder;


/***/ }),

/***/ 641:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormattedText = void 0;
const font_type_1 = __webpack_require__(21);
const element_builder_1 = __webpack_require__(358);
// List of fonts supported by Omnivox Forum Posts:
// Sans Serif fonts: Arial, MS Sans Serif, Segoe UI, Tahoma, Verdana
// Serif fonts: Garamond, Georgia, Times New Roman
// Monospace: Courier New
// Though there are subtle differences between the fonts, we will be using variants of Roboto for all of
// them for the sake of consistency.
const sansSerifTypefaces = ['Arial', 'MS Sans Serif', 'Segoe UI', 'Tahoma', 'Verdana'];
const serifTypefaces = ['Garamond', 'Georgia', 'Times New Roman'];
const monospaceTypefaces = (/* unused pure expression or super */ null && (['Courier New']));
class FormattedText {
    constructor(isTextNode, tag, content, fontType, additionalDecoration, children) {
        this.isTextNode = false;
        this.children = [];
        this.isTextNode = isTextNode;
        this.tag = tag;
        this.content = content;
        this.fontType = fontType;
        this.additionalTextDecoration = additionalDecoration;
        this.children = children;
    }
    static textNode(content) {
        return new FormattedText(true, null, content);
    }
    static element(tag, fontType, additionalDecoration, children) {
        return new FormattedText(false, tag, null, fontType, additionalDecoration, children);
    }
    // Extracts text formatting from the formatted text.
    static fromContentNode(node) {
        // If this is an element.
        if (node instanceof HTMLElement) {
            // Copy the tag.
            let tag = node.tagName.toLowerCase();
            const elementStyle = getComputedStyle(node);
            // CSS font rules are complex and differ in different browsers, using if contains for the best
            // compatibility.
            const fontFamilyCSSRule = elementStyle.getPropertyValue('font-family');
            let fontType;
            if (sansSerifTypefaces.some((typeface) => fontFamilyCSSRule.includes(typeface))) {
                fontType = font_type_1.FontType.SansSerif;
            }
            else if (serifTypefaces.some((typeface) => fontFamilyCSSRule.includes(typeface))) {
                fontType = font_type_1.FontType.Serif;
            }
            else {
                fontType = font_type_1.FontType.Monospace;
            }
            // Copy any special text decorations.
            const additionalTextDecoration = elementStyle.getPropertyValue('text-decoration');
            const children = [];
            // Dotted borders means that the element is a quote, which means that it should be organised differently
            // from the rest.
            if (elementStyle.getPropertyValue('border-style').includes('dotted')) {
                // Use the block quote tag instead when the message is a quote.
                tag = 'blockquote';
                // The author's name is contained in the first div element in the dotted container with an image.
                // Using innerText and trim to extract it.
                const authorSaidElement = node.querySelector('div');
                const authorSaid = authorSaidElement.innerText.trim();
                // Since the author name is getting special treatment, remove it so it doesn't get counted twice.
                node.removeChild(authorSaidElement);
                children.push(FormattedText.element('div', font_type_1.FontType.SansSerif, '', [
                    FormattedText.element('strong', font_type_1.FontType.SansSerif, '', [
                        FormattedText.textNode(authorSaid)
                    ])
                ]));
            }
            // And copy all the node's children.
            Array.from(node.childNodes).forEach((node) => children.push(FormattedText.fromContentNode(node)));
            return FormattedText.element(tag, fontType, additionalTextDecoration, children);
        }
        // If this is a text node.
        else {
            return FormattedText.textNode(node.nodeValue);
        }
    }
    // Returns the corresponding Roboto family based on the font category.
    get fontFamily() {
        switch (this.fontType) {
            case font_type_1.FontType.SansSerif:
                return `'Roboto', 'Helvetica', sans-serif`;
            case font_type_1.FontType.Serif:
                return `'Roboto Slab', 'Times New Roman', serif`;
            case font_type_1.FontType.Monospace:
                return `'Roboto Mono', monospace`;
        }
    }
    render() {
        if (this.isTextNode) {
            return document.createTextNode(this.content);
        }
        else {
            return new element_builder_1.ElementBuilder({
                tag: this.tag,
                children: [...this.children.map((node) => node.render())]
            }).withStyle('font-family', this.fontFamily ? this.fontFamily : 'inherit')
                .withStyle('text-decoration', this.additionalTextDecoration ? this.additionalTextDecoration : 'inherit')
                .build();
        }
    }
}
exports.FormattedText = FormattedText;


/***/ }),

/***/ 972:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Renderable = void 0;
// Represents an objected that can be rendered on a DOM element.
// T represents the render information passed down to the object for it to adjust its rendering.
class Renderable {
    constructor(tag, ...styleClasses) {
        this.domElement = document.createElement(tag);
        styleClasses.forEach((styleClass) => this.domElement.classList.add(styleClass));
    }
    clearDomElement() {
        while (this.domElement.hasChildNodes()) {
            this.domElement.removeChild(this.domElement.firstChild);
        }
    }
    // Updates the domElement based on the given information and returns it.
    render(renderInfo) {
        this.lastRenderInfo = renderInfo;
        this.clearDomElement();
        this.updateDomElement(renderInfo);
        return this.domElement;
    }
    // Updates the domElement with the last render info.
    rerender() {
        this.render(this.lastRenderInfo);
    }
}
exports.Renderable = Renderable;


/***/ }),

/***/ 509:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SVGElementBuilder = void 0;
const element_builder_1 = __webpack_require__(358);
// Builder for elements in the SVG namespace, with helper methods for creating certain SVG elements quickly.
class SVGElementBuilder extends element_builder_1.ElementBuilder {
    constructor({ tag, styleClasses = [], children = [], text = '', href = '', title = '', onclick }) {
        super({
            tag, namespace: 'http://www.w3.org/2000/svg',
            styleClasses, children, text, href, title, onclick
        });
    }
    static group({ children, styleClasses = [] }) {
        return new SVGElementBuilder({ tag: 'g', children, styleClasses }).build();
    }
    static line({ x1, y1, x2, y2, strokeWidth, styleClasses = [] }) {
        const line = new SVGElementBuilder({
            tag: 'line',
            styleClasses
        }).build();
        line.setAttribute('x1', x1.toString());
        line.setAttribute('y1', y1.toString());
        line.setAttribute('x2', x2.toString());
        line.setAttribute('y2', y2.toString());
        line.setAttribute('stroke-width', strokeWidth.toString());
        return line;
    }
    static polyline({ points, strokeWidth, styleClasses = [] }) {
        const line = new SVGElementBuilder({
            tag: 'polyline',
            styleClasses
        }).build();
        line.setAttribute('points', points.map((point) => `${point.x},${point.y}`).join(' '));
        line.setAttribute('stroke-width', strokeWidth.toString());
        return line;
    }
    static text({ x, y, dx = '0', dy = '0', text, textAnchor = 'start', styleClasses = [] }) {
        const textElement = new SVGElementBuilder({
            tag: 'text', text, styleClasses
        }).build();
        textElement.setAttribute('x', x.toString());
        textElement.setAttribute('y', y.toString());
        textElement.setAttribute('dx', dx);
        textElement.setAttribute('dy', dy);
        textElement.setAttribute('text-anchor', textAnchor);
        return textElement;
    }
    static circle({ x, y, radius, styleClasses = [] }) {
        const circle = new SVGElementBuilder({
            tag: 'circle', styleClasses
        }).build();
        circle.setAttribute('cx', x.toString());
        circle.setAttribute('cy', y.toString());
        circle.setAttribute('r', radius.toString());
        return circle;
    }
}
exports.SVGElementBuilder = SVGElementBuilder;


/***/ }),

/***/ 192:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.zip = exports.millisecondsInAWeek = exports.millisecondsInADay = exports.openCenteredPopup = exports.formatGrade = exports.extractCourseCodeAndNameFromCourseTitle = exports.getMonthIndexFromName = exports.months = exports.getMonthIndexFromShortenedName = exports.monthsShortened = exports.regexEscape = exports.toTitleCase = exports.fetchDocumentFrom = exports.quotationMarksRegex = exports.getCurrentLeaRoot = void 0;
// The root URL of the current lea page, without the final part after the slash.
function getCurrentLeaRoot() {
    const terms = window.location.href.split('/');
    // Remove the last element.
    terms.pop();
    return terms.join('/');
}
exports.getCurrentLeaRoot = getCurrentLeaRoot;
exports.quotationMarksRegex = new RegExp("'.+?'", 'g');
// Fetches and parses a components from the given url.
function fetchDocumentFrom(url) {
    return fetch(url).then((response) => response.text())
        .then((text) => new DOMParser().parseFromString(text, 'text/html'));
}
exports.fetchDocumentFrom = fetchDocumentFrom;
function toTitleCase(text) {
    return text.split(' ').map((word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(' ');
}
exports.toTitleCase = toTitleCase;
// Escapes regular tex to regex expression.
function regexEscape(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
exports.regexEscape = regexEscape;
exports.monthsShortened = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
// Returns the month from its shortened, 3-character representation.
function getMonthIndexFromShortenedName(month) {
    return exports.monthsShortened.indexOf(month);
}
exports.getMonthIndexFromShortenedName = getMonthIndexFromShortenedName;
exports.months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
// Returns the month from its full name.
function getMonthIndexFromName(month) {
    return exports.months.indexOf(month);
}
exports.getMonthIndexFromName = getMonthIndexFromName;
const spaceRegex = new RegExp('\\s');
// Extracts the course code and name from the course title, with the following format:
// <Course Code> <Course Name> section/sect. <section number>
// Returns a tuple of (course code, course name)
function extractCourseCodeAndNameFromCourseTitle(courseTitle) {
    // To extract the course code and the name, split the title by 'section/sect.', pick the first part and then trim
    // off the extra space on the right.
    // Pre-split the course code and names, note that Omnivox sometimes uses non-breaking space instead of
    // regular space, hence the use of the \s regex.
    const courseCodeAndName = courseTitle.split(/section|sect\./g)[0].trim().split(spaceRegex);
    // The course code and name are separated by a space, the first element is the course code.
    const courseCode = courseCodeAndName[0];
    // Since course names may contain spaces, the rest of the elements make up the course.
    // Convert the whole thing from all caps to title case.
    const courseName = toTitleCase(courseCodeAndName.slice(1).join(' ')
        // The course name itself is structured as follows:
        // [Program] [-] <Course Name>
        // The program and the dash may not exist, but as an unfortunate Arts and Science student, it bothers me
        // that it blocks the course name.
        // Split the course name by '-', pick the last part and trim off the extra space on the left.
        .split('-')
        // Meaning to pick the last element here but since there's no implementation of it this will suffice.
        .reverse()[0].trim());
    return [courseCode, courseName];
}
exports.extractCourseCodeAndNameFromCourseTitle = extractCourseCodeAndNameFromCourseTitle;
// Formats a grade, between 0 and 1 to a percentage, up to a certain precision.
function formatGrade(grade, precisionDigits) {
    return (grade * 100).toFixed(precisionDigits) + '%';
}
exports.formatGrade = formatGrade;
const popupWidth = 700;
const popupHeight = 780;
// Mirrors Omnivox's OpenCentre function - opens a window centered at the screen with size 700 by 780.
function openCenteredPopup(url) {
    const popupPositionX = Math.round(screen.availWidth / 2 - popupWidth / 2);
    const popupPositionY = Math.round(screen.availHeight / 2 - popupHeight / 2);
    //screenx=379,screeny=96,left=379,top=96,height=780,width=700,toolbar=no,location=no,
    // directories=no,status=no,menubar=no,resizable=yes,scrollbars=yes
    window.open(url, '_blank', `screenx=${popupPositionX},screeny=${popupPositionY},width=${popupWidth},height=${popupHeight},popup=1`);
}
exports.openCenteredPopup = openCenteredPopup;
exports.millisecondsInADay = 86400000;
exports.millisecondsInAWeek = exports.millisecondsInADay * 7;
// Zips two arrays. Assumes that they have equal length.
function zip(a, b) {
    return a.map((element, index) => [element, b[index]]);
}
exports.zip = zip;


/***/ }),

/***/ 604:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(663);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(638);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".omniplus-assignments-overview {\r\n    /* Vertical flexbox */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-content: stretch;\r\n\r\n    gap: 20px;\r\n\r\n    user-select: none;\r\n\r\n    /* Assignments tend to have longer name and descriptions than documents, their cards will be wider so they don't take up as much space vertically. */\r\n    --badge-card-width: 400px;\r\n    --max-section-height: 600px;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment-section {\r\n    min-width: calc(var(--badge-card-width));\r\n    flex-grow: 0;\r\n    flex-shrink: 0;\r\n\r\n    /* Vertical flexbox */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-content: stretch;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment-section .content {\r\n    flex-grow: 0;\r\n    flex-shrink: 0;\r\n    max-height: var(--max-section-height);\r\n\r\n    /* Vertical flexbox */\r\n    display: flex;\r\n    flex-direction: column;\r\n    flex-wrap: wrap;\r\n    align-content: flex-start;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment-section .title {\r\n    font-size: 24px;\r\n    line-height: 30px;\r\n    font-weight: 500;\r\n\r\n    padding: 4px;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment {\r\n    margin: 4px;\r\n\r\n    /* Auto-size */\r\n    height: auto;\r\n    /* Keep width at 300px */\r\n    min-width: var(--badge-card-width);\r\n    width: var(--badge-card-width);\r\n\r\n    /* Do not adjust the card's size based on the flexbox. */\r\n    flex-grow: 0;\r\n    flex-shrink: 0;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment .card {\r\n    /* Space between sections in the card */\r\n    gap: 4px;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment .card .name {\r\n    font-size: 20px;\r\n    font-weight: 400;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment .card .course-name {\r\n    font-size: 14px;\r\n    color: rgba(0, 0, 0, 0.6);\r\n\r\n    font-weight: 400;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment .card .date {\r\n    font-size: 14px;\r\n    color: rgba(0, 0, 0, 0.4);\r\n\r\n    font-weight: 400;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment .card .overdue {\r\n    color: var(--error);\r\n}\r\n\r\n.omniplus-assignments-overview .assignment .card .description {\r\n    font-size: 16px;\r\n    color: rgba(0, 0, 0, 0.6);\r\n\r\n    font-weight: 400;\r\n\r\n    /* Make sure that the size of each card does not exceed its section */\r\n    /* Divide by 2 to leave space for the other components. */\r\n    max-height: calc(var(--max-section-height) / 2);\r\n    overflow-y: scroll;\r\n    flex-basis: 100%;\r\n}", "",{"version":3,"sources":["webpack://./scripts/assignments-overview.css"],"names":[],"mappings":"AAAA;IACI,qBAAqB;IACrB,aAAa;IACb,sBAAsB;IACtB,2BAA2B;IAC3B,sBAAsB;;IAEtB,SAAS;;IAET,iBAAiB;;IAEjB,oJAAoJ;IACpJ,yBAAyB;IACzB,2BAA2B;AAC/B;;AAEA;IACI,wCAAwC;IACxC,YAAY;IACZ,cAAc;;IAEd,qBAAqB;IACrB,aAAa;IACb,sBAAsB;IACtB,2BAA2B;IAC3B,sBAAsB;AAC1B;;AAEA;IACI,YAAY;IACZ,cAAc;IACd,qCAAqC;;IAErC,qBAAqB;IACrB,aAAa;IACb,sBAAsB;IACtB,eAAe;IACf,yBAAyB;AAC7B;;AAEA;IACI,eAAe;IACf,iBAAiB;IACjB,gBAAgB;;IAEhB,YAAY;AAChB;;AAEA;IACI,WAAW;;IAEX,cAAc;IACd,YAAY;IACZ,wBAAwB;IACxB,kCAAkC;IAClC,8BAA8B;;IAE9B,wDAAwD;IACxD,YAAY;IACZ,cAAc;AAClB;;AAEA;IACI,uCAAuC;IACvC,QAAQ;AACZ;;AAEA;IACI,eAAe;IACf,gBAAgB;AACpB;;AAEA;IACI,eAAe;IACf,yBAAyB;;IAEzB,gBAAgB;AACpB;;AAEA;IACI,eAAe;IACf,yBAAyB;;IAEzB,gBAAgB;AACpB;;AAEA;IACI,mBAAmB;AACvB;;AAEA;IACI,eAAe;IACf,yBAAyB;;IAEzB,gBAAgB;;IAEhB,qEAAqE;IACrE,yDAAyD;IACzD,+CAA+C;IAC/C,kBAAkB;IAClB,gBAAgB;AACpB","sourcesContent":[".omniplus-assignments-overview {\r\n    /* Vertical flexbox */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-content: stretch;\r\n\r\n    gap: 20px;\r\n\r\n    user-select: none;\r\n\r\n    /* Assignments tend to have longer name and descriptions than documents, their cards will be wider so they don't take up as much space vertically. */\r\n    --badge-card-width: 400px;\r\n    --max-section-height: 600px;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment-section {\r\n    min-width: calc(var(--badge-card-width));\r\n    flex-grow: 0;\r\n    flex-shrink: 0;\r\n\r\n    /* Vertical flexbox */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-content: stretch;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment-section .content {\r\n    flex-grow: 0;\r\n    flex-shrink: 0;\r\n    max-height: var(--max-section-height);\r\n\r\n    /* Vertical flexbox */\r\n    display: flex;\r\n    flex-direction: column;\r\n    flex-wrap: wrap;\r\n    align-content: flex-start;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment-section .title {\r\n    font-size: 24px;\r\n    line-height: 30px;\r\n    font-weight: 500;\r\n\r\n    padding: 4px;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment {\r\n    margin: 4px;\r\n\r\n    /* Auto-size */\r\n    height: auto;\r\n    /* Keep width at 300px */\r\n    min-width: var(--badge-card-width);\r\n    width: var(--badge-card-width);\r\n\r\n    /* Do not adjust the card's size based on the flexbox. */\r\n    flex-grow: 0;\r\n    flex-shrink: 0;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment .card {\r\n    /* Space between sections in the card */\r\n    gap: 4px;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment .card .name {\r\n    font-size: 20px;\r\n    font-weight: 400;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment .card .course-name {\r\n    font-size: 14px;\r\n    color: rgba(0, 0, 0, 0.6);\r\n\r\n    font-weight: 400;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment .card .date {\r\n    font-size: 14px;\r\n    color: rgba(0, 0, 0, 0.4);\r\n\r\n    font-weight: 400;\r\n}\r\n\r\n.omniplus-assignments-overview .assignment .card .overdue {\r\n    color: var(--error);\r\n}\r\n\r\n.omniplus-assignments-overview .assignment .card .description {\r\n    font-size: 16px;\r\n    color: rgba(0, 0, 0, 0.6);\r\n\r\n    font-weight: 400;\r\n\r\n    /* Make sure that the size of each card does not exceed its section */\r\n    /* Divide by 2 to leave space for the other components. */\r\n    max-height: calc(var(--max-section-height) / 2);\r\n    overflow-y: scroll;\r\n    flex-basis: 100%;\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 302:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(663);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(638);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".omniplus-documents-overview {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-content: stretch;\r\n\r\n    gap: 20px;\r\n\r\n    user-select: none;\r\n}\r\n\r\n.omniplus-documents-overview .control-bar {\r\n    /* Prevent the course list from squishing the control bar. */\r\n    flex-shrink: 0;\r\n\r\n    padding: 4px;\r\n\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n\r\n    gap: 10px;\r\n}\r\n\r\n.omniplus-documents-overview .control-bar .search-bar {\r\n    flex-grow: 1;\r\n\r\n    font-size: 20px;\r\n    /* Give the text some space */\r\n    line-height: 28px;\r\n    /* Lots and lots of space */\r\n    padding: 4px;\r\n\r\n    border-style: none none solid none;\r\n    border-width: 3px;\r\n    border-color: var(--grey-400);\r\n    outline: none;\r\n\r\n    transition-duration: 0.2s;\r\n}\r\n\r\n.omniplus-documents-overview .control-bar .search-bar:hover {\r\n    border-color: var(--grey-600);\r\n}\r\n.omniplus-documents-overview .control-bar .search-bar:focus {\r\n    border-color: black;\r\n}\r\n\r\n.omniplus-documents-overview .control-bar .button {\r\n    flex-shrink: 0;\r\n\r\n    font-size: 20px;\r\n    /* Give the text some space */\r\n    line-height: 28px;\r\n\r\n    /* Extra horizontal padding */\r\n    padding: 4px 8px 4px 8px;\r\n\r\n    text-transform: uppercase;\r\n    font-weight: 400;\r\n    color: white;\r\n\r\n    background-color: var(--primary);\r\n    border: none;\r\n    border-radius: 2px;\r\n    /* Material 2dp shadow */\r\n    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);\r\n\r\n    /* Using flexbox to centre-align vertically */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n\r\n    transition-duration: 0.2s;\r\n}\r\n\r\n.omniplus-documents-overview .control-bar .button:hover {\r\n    background-color: var(--primary-dark);\r\n}\r\n.omniplus-documents-overview .control-bar .button:focus {\r\n    background-color: var(--primary-darker);\r\n}\r\n\r\n.omniplus-documents-overview .course-list {\r\n    flex-grow: 1;\r\n\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n\r\n    gap: 20px;\r\n\r\n    overflow-x: auto;\r\n\r\n    /* Scrollbar styling for Firefox */\r\n    scrollbar-color: grey rgba(0, 0, 0, 0);\r\n}\r\n\r\n/* Scrollbar styling for webkit browsers. */\r\n.omniplus-documents-overview .course-list::-webkit-scrollbar {\r\n    background: none;\r\n    width: 8px;\r\n}\r\n\r\n.omniplus-documents-overview .course-list::-webkit-scrollbar-track {\r\n    background: none;\r\n}\r\n\r\n.omniplus-documents-overview .course-list::-webkit-scrollbar-thumb {\r\n    background: gray;\r\n    border-radius: 4px;\r\n}\r\n\r\n.omniplus-documents-overview .course-list .course-name {\r\n    font-size: 24px;\r\n    line-height: 30px;\r\n\r\n\r\n    /* Double line height for up to 2 lines of text. */\r\n    min-height: 60px;\r\n    /* Using flexbox to bottom-align vertically */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-end;\r\n\r\n    font-weight: 500;\r\n    /* Give the title some extra space. */\r\n    margin: 4px;\r\n}\r\n\r\n.omniplus-documents-overview .course {\r\n    min-width: 300px;\r\n    width: 300px;\r\n\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n}\r\n\r\n.omniplus-documents-overview .documents-list {\r\n    /* Make the list itself fill the content of the course node. */\r\n    flex-grow: 1;\r\n\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n\r\n    overflow-x: auto;\r\n}\r\n\r\n/* Scrollbar styling for webkit browsers. */\r\n.omniplus-documents-overview .documents-list::-webkit-scrollbar {\r\n    background: none;\r\n    width: 8px;\r\n}\r\n\r\n.omniplus-documents-overview .documents-list::-webkit-scrollbar-track {\r\n    background: none;\r\n}\r\n\r\n.omniplus-documents-overview .documents-list::-webkit-scrollbar-thumb {\r\n    background: gray;\r\n    border-radius: 4px;\r\n}\r\n\r\n.omniplus-documents-overview .bold {\r\n    font-weight: 500 !important;\r\n}\r\n\r\n.omniplus-documents-overview mark {\r\n    background-color: var(--primary-light);\r\n    border-radius: 3px;\r\n}\r\n\r\n.omniplus-documents-overview .document {\r\n    margin: 4px;\r\n    /* Auto-size */\r\n    width: auto;\r\n    height: auto;\r\n}\r\n\r\n.omniplus-documents-overview .document .badge-holder .file-background {\r\n    background-color: var(--dark-grey);\r\n}\r\n.omniplus-documents-overview .document .badge-holder .link-background {\r\n    background-color: var(--dark-blue);\r\n}\r\n.omniplus-documents-overview .document .badge-holder .video-background {\r\n    background-color: var(--dark-red);\r\n}\r\n\r\n.omniplus-documents-overview .document .card .name {\r\n    font-size: 20px;\r\n\r\n    font-weight: 400;\r\n}\r\n\r\n.omniplus-documents-overview .document .card .date {\r\n    font-size: 14px;\r\n    color: rgba(0, 0, 0, 0.4);\r\n\r\n    font-weight: 400;\r\n}\r\n\r\n.omniplus-documents-overview .document .card .description {\r\n    font-size: 16px;\r\n    color: rgba(0, 0, 0, 0.6);\r\n\r\n    font-weight: 400;\r\n}\r\n\r\n/* Icon displayed on the left section as a quick link to the documents overview page. */\r\n.documents-overview-icon-parent .material-icons {\r\n    /* Copied from the colour of the lea icon. */\r\n    color: #7fd91b;\r\n    font-size: 30px;\r\n}\r\n/* Icon displayed on the left section as a quick link to the documents overview page. */\r\n.documents-overview-icon-parent:hover .material-icons {\r\n    color: white;\r\n}", "",{"version":3,"sources":["webpack://./scripts/documents-overview.css"],"names":[],"mappings":"AAAA;IACI,aAAa;IACb,sBAAsB;IACtB,2BAA2B;IAC3B,sBAAsB;;IAEtB,SAAS;;IAET,iBAAiB;AACrB;;AAEA;IACI,4DAA4D;IAC5D,cAAc;;IAEd,YAAY;;IAEZ,aAAa;IACb,mBAAmB;IACnB,2BAA2B;IAC3B,oBAAoB;;IAEpB,SAAS;AACb;;AAEA;IACI,YAAY;;IAEZ,eAAe;IACf,6BAA6B;IAC7B,iBAAiB;IACjB,2BAA2B;IAC3B,YAAY;;IAEZ,kCAAkC;IAClC,iBAAiB;IACjB,6BAA6B;IAC7B,aAAa;;IAEb,yBAAyB;AAC7B;;AAEA;IACI,6BAA6B;AACjC;AACA;IACI,mBAAmB;AACvB;;AAEA;IACI,cAAc;;IAEd,eAAe;IACf,6BAA6B;IAC7B,iBAAiB;;IAEjB,6BAA6B;IAC7B,wBAAwB;;IAExB,yBAAyB;IACzB,gBAAgB;IAChB,YAAY;;IAEZ,gCAAgC;IAChC,YAAY;IACZ,kBAAkB;IAClB,wBAAwB;IACxB,iGAAiG;;IAEjG,6CAA6C;IAC7C,aAAa;IACb,sBAAsB;IACtB,uBAAuB;;IAEvB,yBAAyB;AAC7B;;AAEA;IACI,qCAAqC;AACzC;AACA;IACI,uCAAuC;AAC3C;;AAEA;IACI,YAAY;;IAEZ,aAAa;IACb,mBAAmB;IACnB,2BAA2B;IAC3B,oBAAoB;;IAEpB,SAAS;;IAET,gBAAgB;;IAEhB,kCAAkC;IAClC,sCAAsC;AAC1C;;AAEA,2CAA2C;AAC3C;IACI,gBAAgB;IAChB,UAAU;AACd;;AAEA;IACI,gBAAgB;AACpB;;AAEA;IACI,gBAAgB;IAChB,kBAAkB;AACtB;;AAEA;IACI,eAAe;IACf,iBAAiB;;;IAGjB,kDAAkD;IAClD,gBAAgB;IAChB,6CAA6C;IAC7C,aAAa;IACb,sBAAsB;IACtB,yBAAyB;;IAEzB,gBAAgB;IAChB,qCAAqC;IACrC,WAAW;AACf;;AAEA;IACI,gBAAgB;IAChB,YAAY;;IAEZ,aAAa;IACb,sBAAsB;IACtB,2BAA2B;IAC3B,oBAAoB;AACxB;;AAEA;IACI,8DAA8D;IAC9D,YAAY;;IAEZ,aAAa;IACb,sBAAsB;IACtB,2BAA2B;IAC3B,oBAAoB;;IAEpB,gBAAgB;AACpB;;AAEA,2CAA2C;AAC3C;IACI,gBAAgB;IAChB,UAAU;AACd;;AAEA;IACI,gBAAgB;AACpB;;AAEA;IACI,gBAAgB;IAChB,kBAAkB;AACtB;;AAEA;IACI,2BAA2B;AAC/B;;AAEA;IACI,sCAAsC;IACtC,kBAAkB;AACtB;;AAEA;IACI,WAAW;IACX,cAAc;IACd,WAAW;IACX,YAAY;AAChB;;AAEA;IACI,kCAAkC;AACtC;AACA;IACI,kCAAkC;AACtC;AACA;IACI,iCAAiC;AACrC;;AAEA;IACI,eAAe;;IAEf,gBAAgB;AACpB;;AAEA;IACI,eAAe;IACf,yBAAyB;;IAEzB,gBAAgB;AACpB;;AAEA;IACI,eAAe;IACf,yBAAyB;;IAEzB,gBAAgB;AACpB;;AAEA,uFAAuF;AACvF;IACI,4CAA4C;IAC5C,cAAc;IACd,eAAe;AACnB;AACA,uFAAuF;AACvF;IACI,YAAY;AAChB","sourcesContent":[".omniplus-documents-overview {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-content: stretch;\r\n\r\n    gap: 20px;\r\n\r\n    user-select: none;\r\n}\r\n\r\n.omniplus-documents-overview .control-bar {\r\n    /* Prevent the course list from squishing the control bar. */\r\n    flex-shrink: 0;\r\n\r\n    padding: 4px;\r\n\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n\r\n    gap: 10px;\r\n}\r\n\r\n.omniplus-documents-overview .control-bar .search-bar {\r\n    flex-grow: 1;\r\n\r\n    font-size: 20px;\r\n    /* Give the text some space */\r\n    line-height: 28px;\r\n    /* Lots and lots of space */\r\n    padding: 4px;\r\n\r\n    border-style: none none solid none;\r\n    border-width: 3px;\r\n    border-color: var(--grey-400);\r\n    outline: none;\r\n\r\n    transition-duration: 0.2s;\r\n}\r\n\r\n.omniplus-documents-overview .control-bar .search-bar:hover {\r\n    border-color: var(--grey-600);\r\n}\r\n.omniplus-documents-overview .control-bar .search-bar:focus {\r\n    border-color: black;\r\n}\r\n\r\n.omniplus-documents-overview .control-bar .button {\r\n    flex-shrink: 0;\r\n\r\n    font-size: 20px;\r\n    /* Give the text some space */\r\n    line-height: 28px;\r\n\r\n    /* Extra horizontal padding */\r\n    padding: 4px 8px 4px 8px;\r\n\r\n    text-transform: uppercase;\r\n    font-weight: 400;\r\n    color: white;\r\n\r\n    background-color: var(--primary);\r\n    border: none;\r\n    border-radius: 2px;\r\n    /* Material 2dp shadow */\r\n    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);\r\n\r\n    /* Using flexbox to centre-align vertically */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n\r\n    transition-duration: 0.2s;\r\n}\r\n\r\n.omniplus-documents-overview .control-bar .button:hover {\r\n    background-color: var(--primary-dark);\r\n}\r\n.omniplus-documents-overview .control-bar .button:focus {\r\n    background-color: var(--primary-darker);\r\n}\r\n\r\n.omniplus-documents-overview .course-list {\r\n    flex-grow: 1;\r\n\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n\r\n    gap: 20px;\r\n\r\n    overflow-x: auto;\r\n\r\n    /* Scrollbar styling for Firefox */\r\n    scrollbar-color: grey rgba(0, 0, 0, 0);\r\n}\r\n\r\n/* Scrollbar styling for webkit browsers. */\r\n.omniplus-documents-overview .course-list::-webkit-scrollbar {\r\n    background: none;\r\n    width: 8px;\r\n}\r\n\r\n.omniplus-documents-overview .course-list::-webkit-scrollbar-track {\r\n    background: none;\r\n}\r\n\r\n.omniplus-documents-overview .course-list::-webkit-scrollbar-thumb {\r\n    background: gray;\r\n    border-radius: 4px;\r\n}\r\n\r\n.omniplus-documents-overview .course-list .course-name {\r\n    font-size: 24px;\r\n    line-height: 30px;\r\n\r\n\r\n    /* Double line height for up to 2 lines of text. */\r\n    min-height: 60px;\r\n    /* Using flexbox to bottom-align vertically */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-end;\r\n\r\n    font-weight: 500;\r\n    /* Give the title some extra space. */\r\n    margin: 4px;\r\n}\r\n\r\n.omniplus-documents-overview .course {\r\n    min-width: 300px;\r\n    width: 300px;\r\n\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n}\r\n\r\n.omniplus-documents-overview .documents-list {\r\n    /* Make the list itself fill the content of the course node. */\r\n    flex-grow: 1;\r\n\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n\r\n    overflow-x: auto;\r\n}\r\n\r\n/* Scrollbar styling for webkit browsers. */\r\n.omniplus-documents-overview .documents-list::-webkit-scrollbar {\r\n    background: none;\r\n    width: 8px;\r\n}\r\n\r\n.omniplus-documents-overview .documents-list::-webkit-scrollbar-track {\r\n    background: none;\r\n}\r\n\r\n.omniplus-documents-overview .documents-list::-webkit-scrollbar-thumb {\r\n    background: gray;\r\n    border-radius: 4px;\r\n}\r\n\r\n.omniplus-documents-overview .bold {\r\n    font-weight: 500 !important;\r\n}\r\n\r\n.omniplus-documents-overview mark {\r\n    background-color: var(--primary-light);\r\n    border-radius: 3px;\r\n}\r\n\r\n.omniplus-documents-overview .document {\r\n    margin: 4px;\r\n    /* Auto-size */\r\n    width: auto;\r\n    height: auto;\r\n}\r\n\r\n.omniplus-documents-overview .document .badge-holder .file-background {\r\n    background-color: var(--dark-grey);\r\n}\r\n.omniplus-documents-overview .document .badge-holder .link-background {\r\n    background-color: var(--dark-blue);\r\n}\r\n.omniplus-documents-overview .document .badge-holder .video-background {\r\n    background-color: var(--dark-red);\r\n}\r\n\r\n.omniplus-documents-overview .document .card .name {\r\n    font-size: 20px;\r\n\r\n    font-weight: 400;\r\n}\r\n\r\n.omniplus-documents-overview .document .card .date {\r\n    font-size: 14px;\r\n    color: rgba(0, 0, 0, 0.4);\r\n\r\n    font-weight: 400;\r\n}\r\n\r\n.omniplus-documents-overview .document .card .description {\r\n    font-size: 16px;\r\n    color: rgba(0, 0, 0, 0.6);\r\n\r\n    font-weight: 400;\r\n}\r\n\r\n/* Icon displayed on the left section as a quick link to the documents overview page. */\r\n.documents-overview-icon-parent .material-icons {\r\n    /* Copied from the colour of the lea icon. */\r\n    color: #7fd91b;\r\n    font-size: 30px;\r\n}\r\n/* Icon displayed on the left section as a quick link to the documents overview page. */\r\n.documents-overview-icon-parent:hover .material-icons {\r\n    color: white;\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 807:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(663);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(638);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".omniplus-forum-subject {\r\n    /* Vertical flexbox */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-items: center;\r\n\r\n    /* Space between the posts */\r\n    gap: 20px;\r\n\r\n    overflow-y: scroll;\r\n\r\n    user-select: none;\r\n}\r\n\r\n\r\n.omniplus-forum-subject .message {\r\n    /* Prevent the messages from being squished when the page overflows. */\r\n    flex-shrink: 0;\r\n    height: auto;\r\n    /* A few sources suggest that the width of each line should not exceed 75 characters.\r\n    With the padding this limit will be a bit shorter. */\r\n    font-size: 16px;\r\n    line-height: 20px;\r\n    width: 75ex;\r\n}\r\n\r\n.omniplus-forum-subject .message .card .header {\r\n    /* Horizontal flexbox */\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: flex-start;\r\n}\r\n\r\n.omniplus-forum-subject .message .card .header .filler {\r\n    /* Make the filler fill the space and push the time to the right. */\r\n    flex-grow: 1;\r\n}\r\n.omniplus-forum-subject .message .card .header .author {\r\n    /* Prevent from getting squished. */\r\n    flex-shrink: 0;\r\n}\r\n.omniplus-forum-subject .message .card .header .time {\r\n    /* Prevent from getting squished. */\r\n    flex-shrink: 0;\r\n    color: var(--grey-700);\r\n\r\n    /* Put the fonts on a smaller size */\r\n    font-size: 14px;\r\n}\r\n\r\n.omniplus-forum-subject .message .card .shortened {\r\n    max-height: 200px;\r\n    overflow: hidden;\r\n}\r\n\r\n.omniplus-forum-subject .message .card blockquote {\r\n    /* Block quotes should have a light background and a left border to show that they're block quotes. */\r\n    background-color: rgba(0, 0, 0, 0.03); /* Using translucent background so nested quotes still stand out. */\r\n    border-left: rgba(0, 0, 0, 0.1) 4px solid;\r\n\r\n    /* Space for text handled by the padding instead as the border already exists. */\r\n    margin: 0;\r\n    padding: 8px;\r\n}\r\n\r\n/* Give the expand button the secondary colour so it doesn't look too similar. */\r\n.omniplus-forum-subject .badged-card .badge-holder .expand {\r\n    --badge-clickable-background: var(--secondary);\r\n    --badge-clickable-background-hovered: var(--secondary-dark);\r\n    --badge-clickable-background-focused: var(--secondary-darker);\r\n}\r\n\r\n.omniplus-forum-subject .controls {\r\n    position: absolute;\r\n    z-index: 99;\r\n    /* Align this to the right */\r\n    align-self: end;\r\n\r\n    /* Vertical flexbox */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-items: center;\r\n\r\n    gap: 12px;\r\n\r\n    --button-size: 48px;\r\n}\r\n\r\n.omniplus-forum-subject .controls .button {\r\n    height: var(--button-size);\r\n    width: var(--button-size);\r\n\r\n    border-radius: 4px;\r\n    /* Material 2dp shadow */\r\n    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);\r\n\r\n    /* Centre-align horizontally */\r\n    text-align: center;\r\n    /* Using flexbox to centre-align vertically */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n\r\n    /* icon size and colour */\r\n    color: white;\r\n    font-size: calc(var(--button-size) * 0.67);\r\n\r\n    text-decoration: none !important;\r\n\r\n    /* Pointer indicating that the file can be downloaded. */\r\n    cursor: pointer;\r\n    background-color: var(--button-clickable-background);\r\n\r\n    transition-duration: 0.2s;\r\n}\r\n.omniplus-forum-subject .controls .button:hover {\r\n    background-color: var(--button-clickable-background-hovered);\r\n}\r\n.omniplus-forum-subject .controls .button:focus {\r\n    background-color: var(--button-clickable-background-focused);\r\n}\r\n\r\n.omniplus-forum-subject .controls .primary {\r\n    --button-clickable-background: var(--primary);\r\n    --button-clickable-background-hovered: var(--primary-dark);\r\n    --button-clickable-background-focused: var(--primary-darker);\r\n}\r\n.omniplus-forum-subject .controls .secondary {\r\n    --button-clickable-background: var(--secondary);\r\n    --button-clickable-background-hovered: var(--secondary-dark);\r\n    --button-clickable-background-focused: var(--secondary-darker);\r\n}", "",{"version":3,"sources":["webpack://./scripts/forum.css"],"names":[],"mappings":"AAAA;IACI,qBAAqB;IACrB,aAAa;IACb,sBAAsB;IACtB,2BAA2B;IAC3B,mBAAmB;;IAEnB,4BAA4B;IAC5B,SAAS;;IAET,kBAAkB;;IAElB,iBAAiB;AACrB;;;AAGA;IACI,sEAAsE;IACtE,cAAc;IACd,YAAY;IACZ;wDACoD;IACpD,eAAe;IACf,iBAAiB;IACjB,WAAW;AACf;;AAEA;IACI,uBAAuB;IACvB,aAAa;IACb,mBAAmB;IACnB,2BAA2B;AAC/B;;AAEA;IACI,mEAAmE;IACnE,YAAY;AAChB;AACA;IACI,mCAAmC;IACnC,cAAc;AAClB;AACA;IACI,mCAAmC;IACnC,cAAc;IACd,sBAAsB;;IAEtB,oCAAoC;IACpC,eAAe;AACnB;;AAEA;IACI,iBAAiB;IACjB,gBAAgB;AACpB;;AAEA;IACI,qGAAqG;IACrG,qCAAqC,EAAE,mEAAmE;IAC1G,yCAAyC;;IAEzC,gFAAgF;IAChF,SAAS;IACT,YAAY;AAChB;;AAEA,gFAAgF;AAChF;IACI,8CAA8C;IAC9C,2DAA2D;IAC3D,6DAA6D;AACjE;;AAEA;IACI,kBAAkB;IAClB,WAAW;IACX,4BAA4B;IAC5B,eAAe;;IAEf,qBAAqB;IACrB,aAAa;IACb,sBAAsB;IACtB,2BAA2B;IAC3B,mBAAmB;;IAEnB,SAAS;;IAET,mBAAmB;AACvB;;AAEA;IACI,0BAA0B;IAC1B,yBAAyB;;IAEzB,kBAAkB;IAClB,wBAAwB;IACxB,iGAAiG;;IAEjG,8BAA8B;IAC9B,kBAAkB;IAClB,6CAA6C;IAC7C,aAAa;IACb,sBAAsB;IACtB,uBAAuB;;IAEvB,yBAAyB;IACzB,YAAY;IACZ,0CAA0C;;IAE1C,gCAAgC;;IAEhC,wDAAwD;IACxD,eAAe;IACf,oDAAoD;;IAEpD,yBAAyB;AAC7B;AACA;IACI,4DAA4D;AAChE;AACA;IACI,4DAA4D;AAChE;;AAEA;IACI,6CAA6C;IAC7C,0DAA0D;IAC1D,4DAA4D;AAChE;AACA;IACI,+CAA+C;IAC/C,4DAA4D;IAC5D,8DAA8D;AAClE","sourcesContent":[".omniplus-forum-subject {\r\n    /* Vertical flexbox */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-items: center;\r\n\r\n    /* Space between the posts */\r\n    gap: 20px;\r\n\r\n    overflow-y: scroll;\r\n\r\n    user-select: none;\r\n}\r\n\r\n\r\n.omniplus-forum-subject .message {\r\n    /* Prevent the messages from being squished when the page overflows. */\r\n    flex-shrink: 0;\r\n    height: auto;\r\n    /* A few sources suggest that the width of each line should not exceed 75 characters.\r\n    With the padding this limit will be a bit shorter. */\r\n    font-size: 16px;\r\n    line-height: 20px;\r\n    width: 75ex;\r\n}\r\n\r\n.omniplus-forum-subject .message .card .header {\r\n    /* Horizontal flexbox */\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: flex-start;\r\n}\r\n\r\n.omniplus-forum-subject .message .card .header .filler {\r\n    /* Make the filler fill the space and push the time to the right. */\r\n    flex-grow: 1;\r\n}\r\n.omniplus-forum-subject .message .card .header .author {\r\n    /* Prevent from getting squished. */\r\n    flex-shrink: 0;\r\n}\r\n.omniplus-forum-subject .message .card .header .time {\r\n    /* Prevent from getting squished. */\r\n    flex-shrink: 0;\r\n    color: var(--grey-700);\r\n\r\n    /* Put the fonts on a smaller size */\r\n    font-size: 14px;\r\n}\r\n\r\n.omniplus-forum-subject .message .card .shortened {\r\n    max-height: 200px;\r\n    overflow: hidden;\r\n}\r\n\r\n.omniplus-forum-subject .message .card blockquote {\r\n    /* Block quotes should have a light background and a left border to show that they're block quotes. */\r\n    background-color: rgba(0, 0, 0, 0.03); /* Using translucent background so nested quotes still stand out. */\r\n    border-left: rgba(0, 0, 0, 0.1) 4px solid;\r\n\r\n    /* Space for text handled by the padding instead as the border already exists. */\r\n    margin: 0;\r\n    padding: 8px;\r\n}\r\n\r\n/* Give the expand button the secondary colour so it doesn't look too similar. */\r\n.omniplus-forum-subject .badged-card .badge-holder .expand {\r\n    --badge-clickable-background: var(--secondary);\r\n    --badge-clickable-background-hovered: var(--secondary-dark);\r\n    --badge-clickable-background-focused: var(--secondary-darker);\r\n}\r\n\r\n.omniplus-forum-subject .controls {\r\n    position: absolute;\r\n    z-index: 99;\r\n    /* Align this to the right */\r\n    align-self: end;\r\n\r\n    /* Vertical flexbox */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-items: center;\r\n\r\n    gap: 12px;\r\n\r\n    --button-size: 48px;\r\n}\r\n\r\n.omniplus-forum-subject .controls .button {\r\n    height: var(--button-size);\r\n    width: var(--button-size);\r\n\r\n    border-radius: 4px;\r\n    /* Material 2dp shadow */\r\n    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);\r\n\r\n    /* Centre-align horizontally */\r\n    text-align: center;\r\n    /* Using flexbox to centre-align vertically */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n\r\n    /* icon size and colour */\r\n    color: white;\r\n    font-size: calc(var(--button-size) * 0.67);\r\n\r\n    text-decoration: none !important;\r\n\r\n    /* Pointer indicating that the file can be downloaded. */\r\n    cursor: pointer;\r\n    background-color: var(--button-clickable-background);\r\n\r\n    transition-duration: 0.2s;\r\n}\r\n.omniplus-forum-subject .controls .button:hover {\r\n    background-color: var(--button-clickable-background-hovered);\r\n}\r\n.omniplus-forum-subject .controls .button:focus {\r\n    background-color: var(--button-clickable-background-focused);\r\n}\r\n\r\n.omniplus-forum-subject .controls .primary {\r\n    --button-clickable-background: var(--primary);\r\n    --button-clickable-background-hovered: var(--primary-dark);\r\n    --button-clickable-background-focused: var(--primary-darker);\r\n}\r\n.omniplus-forum-subject .controls .secondary {\r\n    --button-clickable-background: var(--secondary);\r\n    --button-clickable-background-hovered: var(--secondary-dark);\r\n    --button-clickable-background-focused: var(--secondary-darker);\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 595:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(663);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(638);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".omniplus-grades-overview svg {\r\n    /* Placeholder sizing */\r\n}\r\n\r\n.omniplus-grades-overview svg .label {\r\n    font-family: \"Roboto\", sans-serif;\r\n    font-size: 20px;\r\n    user-select: none;\r\n}\r\n\r\n.omniplus-grades-overview svg .heavy-line {\r\n    stroke: black;\r\n}\r\n.omniplus-grades-overview svg .light-line {\r\n    stroke: var(--grey-400);\r\n}\r\n\r\n/* Why do they have fill in the first place, aren't they polyLINEs? */\r\n.omniplus-grades-overview svg polyline {\r\n    fill: none;\r\n}\r\n\r\n.omniplus-grades-overview svg .individual-line {\r\n    stroke: var(--primary);\r\n}\r\n.omniplus-grades-overview svg .individual-point {\r\n    fill: var(--primary);\r\n}\r\n\r\n.omniplus-grades-overview svg .average-line {\r\n    stroke: var(--grey-600);\r\n}\r\n.omniplus-grades-overview svg .average-point {\r\n    fill: var(--grey-600);\r\n}", "",{"version":3,"sources":["webpack://./scripts/grades-graph.css"],"names":[],"mappings":"AAAA;IACI,uBAAuB;AAC3B;;AAEA;IACI,iCAAiC;IACjC,eAAe;IACf,iBAAiB;AACrB;;AAEA;IACI,aAAa;AACjB;AACA;IACI,uBAAuB;AAC3B;;AAEA,qEAAqE;AACrE;IACI,UAAU;AACd;;AAEA;IACI,sBAAsB;AAC1B;AACA;IACI,oBAAoB;AACxB;;AAEA;IACI,uBAAuB;AAC3B;AACA;IACI,qBAAqB;AACzB","sourcesContent":[".omniplus-grades-overview svg {\r\n    /* Placeholder sizing */\r\n}\r\n\r\n.omniplus-grades-overview svg .label {\r\n    font-family: \"Roboto\", sans-serif;\r\n    font-size: 20px;\r\n    user-select: none;\r\n}\r\n\r\n.omniplus-grades-overview svg .heavy-line {\r\n    stroke: black;\r\n}\r\n.omniplus-grades-overview svg .light-line {\r\n    stroke: var(--grey-400);\r\n}\r\n\r\n/* Why do they have fill in the first place, aren't they polyLINEs? */\r\n.omniplus-grades-overview svg polyline {\r\n    fill: none;\r\n}\r\n\r\n.omniplus-grades-overview svg .individual-line {\r\n    stroke: var(--primary);\r\n}\r\n.omniplus-grades-overview svg .individual-point {\r\n    fill: var(--primary);\r\n}\r\n\r\n.omniplus-grades-overview svg .average-line {\r\n    stroke: var(--grey-600);\r\n}\r\n.omniplus-grades-overview svg .average-point {\r\n    fill: var(--grey-600);\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 373:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(663);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(638);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".omniplus-grades-overview {\r\n    /* Vertical Flexbox */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n\r\n    /* Specify a height for wrapping, each card can extend this height but if it does, a card should not appear right after. */\r\n    height: 100%;\r\n    /* Wrap the cards into one page. */\r\n    flex-wrap: wrap;\r\n\r\n    gap: 12px;\r\n    padding: 12px;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list {\r\n    width: 350px;\r\n\r\n    /* Vertical Flexbox */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n\r\n    padding: 8px;\r\n    /* With the use of dividers, the gaps can be shortened as dividers double the gap sizes. */\r\n    gap: 0 !important;\r\n\r\n    user-select: none;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .title-bar {\r\n    /* Horizontal Flexbox */\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n\r\n    gap: 4px;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .title-bar .course-name {\r\n    /* Larger, heavier font. */\r\n    font-size: 24px;\r\n    line-height: 30px;\r\n    font-weight: 500;\r\n\r\n    /* Expand to fill the flexbox. */\r\n    flex-grow: 1;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .title-bar .course-grade {\r\n    /* Larger, heavier font */\r\n    font-size: 24px;\r\n    line-height: 30px;\r\n    font-weight: 500;\r\n    color: var(--grey-700);\r\n\r\n    /* Make sure it doesn't get squished by the course name */\r\n    flex-shrink: 0;\r\n\r\n    /* Using flexbox to centre-align the text vertically */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .class-stats {\r\n    font-size: 16px;\r\n\r\n    /* Cell spacing */\r\n    border-collapse: separate;\r\n    border-spacing: 0 4px;\r\n}\r\n\r\n/* hr elements function as dividers */\r\n.omniplus-grades-overview .course-grades-list hr {\r\n    border-top: 1px solid var(--grey-400);\r\n    border-bottom: none;\r\n    border-left: none;\r\n    border-right: none;\r\n\r\n    width: 100%;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .class-stats td:nth-child(2) {\r\n    text-align: right;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .assessments-list {\r\n    border-collapse: collapse;\r\n}\r\n\r\n/* Dropped grades have lower opacity. */\r\n.omniplus-grades-overview .course-grades-list .assessments-list .dropped {\r\n    opacity: 0.3;\r\n}\r\n\r\n/* Add spacing between cells. */\r\n.omniplus-grades-overview .course-grades-list .assessments-list th,\r\n.omniplus-grades-overview .course-grades-list .assessments-list td {\r\n    padding: 8px;\r\n}\r\n\r\n/* Add a bottom border for every row except the first to function as dividers. */\r\n.omniplus-grades-overview .course-grades-list .assessments-list tr:nth-child(n + 2) {\r\n    border-top: 1px solid var(--grey-300);\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .assessments-list th:nth-child(1),\r\n.omniplus-grades-overview .course-grades-list .assessments-list td:nth-child(1) {\r\n    /* Align to the left for text (assessment name). */\r\n    text-align: left;\r\n\r\n    /* Make sure that the assessment name field is at least 45% wide. */\r\n    width: 45%;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .assessments-list th:nth-child(n + 2),\r\n.omniplus-grades-overview .course-grades-list .assessments-list td:nth-child(n + 2) {\r\n    /* Align to the right for numbers (grade, average, worth) */\r\n    text-align: right;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .assessments-list td:nth-child(n + 3) {\r\n    /* The average and the weight have a lighter colour. */\r\n    color: var(--grey-700);\r\n}", "",{"version":3,"sources":["webpack://./scripts/grades-overview.css"],"names":[],"mappings":"AAAA;IACI,qBAAqB;IACrB,aAAa;IACb,sBAAsB;IACtB,2BAA2B;;IAE3B,0HAA0H;IAC1H,YAAY;IACZ,kCAAkC;IAClC,eAAe;;IAEf,SAAS;IACT,aAAa;AACjB;;AAEA;IACI,YAAY;;IAEZ,qBAAqB;IACrB,aAAa;IACb,sBAAsB;IACtB,2BAA2B;IAC3B,oBAAoB;;IAEpB,YAAY;IACZ,0FAA0F;IAC1F,iBAAiB;;IAEjB,iBAAiB;AACrB;;AAEA;IACI,uBAAuB;IACvB,aAAa;IACb,mBAAmB;IACnB,2BAA2B;IAC3B,oBAAoB;;IAEpB,QAAQ;AACZ;;AAEA;IACI,0BAA0B;IAC1B,eAAe;IACf,iBAAiB;IACjB,gBAAgB;;IAEhB,gCAAgC;IAChC,YAAY;AAChB;;AAEA;IACI,yBAAyB;IACzB,eAAe;IACf,iBAAiB;IACjB,gBAAgB;IAChB,sBAAsB;;IAEtB,yDAAyD;IACzD,cAAc;;IAEd,sDAAsD;IACtD,aAAa;IACb,sBAAsB;IACtB,uBAAuB;AAC3B;;AAEA;IACI,eAAe;;IAEf,iBAAiB;IACjB,yBAAyB;IACzB,qBAAqB;AACzB;;AAEA,qCAAqC;AACrC;IACI,qCAAqC;IACrC,mBAAmB;IACnB,iBAAiB;IACjB,kBAAkB;;IAElB,WAAW;AACf;;AAEA;IACI,iBAAiB;AACrB;;AAEA;IACI,yBAAyB;AAC7B;;AAEA,uCAAuC;AACvC;IACI,YAAY;AAChB;;AAEA,+BAA+B;AAC/B;;IAEI,YAAY;AAChB;;AAEA,gFAAgF;AAChF;IACI,qCAAqC;AACzC;;AAEA;;IAEI,kDAAkD;IAClD,gBAAgB;;IAEhB,mEAAmE;IACnE,UAAU;AACd;;AAEA;;IAEI,2DAA2D;IAC3D,iBAAiB;AACrB;;AAEA;IACI,sDAAsD;IACtD,sBAAsB;AAC1B","sourcesContent":[".omniplus-grades-overview {\r\n    /* Vertical Flexbox */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n\r\n    /* Specify a height for wrapping, each card can extend this height but if it does, a card should not appear right after. */\r\n    height: 100%;\r\n    /* Wrap the cards into one page. */\r\n    flex-wrap: wrap;\r\n\r\n    gap: 12px;\r\n    padding: 12px;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list {\r\n    width: 350px;\r\n\r\n    /* Vertical Flexbox */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n\r\n    padding: 8px;\r\n    /* With the use of dividers, the gaps can be shortened as dividers double the gap sizes. */\r\n    gap: 0 !important;\r\n\r\n    user-select: none;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .title-bar {\r\n    /* Horizontal Flexbox */\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n\r\n    gap: 4px;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .title-bar .course-name {\r\n    /* Larger, heavier font. */\r\n    font-size: 24px;\r\n    line-height: 30px;\r\n    font-weight: 500;\r\n\r\n    /* Expand to fill the flexbox. */\r\n    flex-grow: 1;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .title-bar .course-grade {\r\n    /* Larger, heavier font */\r\n    font-size: 24px;\r\n    line-height: 30px;\r\n    font-weight: 500;\r\n    color: var(--grey-700);\r\n\r\n    /* Make sure it doesn't get squished by the course name */\r\n    flex-shrink: 0;\r\n\r\n    /* Using flexbox to centre-align the text vertically */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .class-stats {\r\n    font-size: 16px;\r\n\r\n    /* Cell spacing */\r\n    border-collapse: separate;\r\n    border-spacing: 0 4px;\r\n}\r\n\r\n/* hr elements function as dividers */\r\n.omniplus-grades-overview .course-grades-list hr {\r\n    border-top: 1px solid var(--grey-400);\r\n    border-bottom: none;\r\n    border-left: none;\r\n    border-right: none;\r\n\r\n    width: 100%;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .class-stats td:nth-child(2) {\r\n    text-align: right;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .assessments-list {\r\n    border-collapse: collapse;\r\n}\r\n\r\n/* Dropped grades have lower opacity. */\r\n.omniplus-grades-overview .course-grades-list .assessments-list .dropped {\r\n    opacity: 0.3;\r\n}\r\n\r\n/* Add spacing between cells. */\r\n.omniplus-grades-overview .course-grades-list .assessments-list th,\r\n.omniplus-grades-overview .course-grades-list .assessments-list td {\r\n    padding: 8px;\r\n}\r\n\r\n/* Add a bottom border for every row except the first to function as dividers. */\r\n.omniplus-grades-overview .course-grades-list .assessments-list tr:nth-child(n + 2) {\r\n    border-top: 1px solid var(--grey-300);\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .assessments-list th:nth-child(1),\r\n.omniplus-grades-overview .course-grades-list .assessments-list td:nth-child(1) {\r\n    /* Align to the left for text (assessment name). */\r\n    text-align: left;\r\n\r\n    /* Make sure that the assessment name field is at least 45% wide. */\r\n    width: 45%;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .assessments-list th:nth-child(n + 2),\r\n.omniplus-grades-overview .course-grades-list .assessments-list td:nth-child(n + 2) {\r\n    /* Align to the right for numbers (grade, average, worth) */\r\n    text-align: right;\r\n}\r\n\r\n.omniplus-grades-overview .course-grades-list .assessments-list td:nth-child(n + 3) {\r\n    /* The average and the weight have a lighter colour. */\r\n    color: var(--grey-700);\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 535:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(663);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(638);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_documents_overview_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(302);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_forum_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(807);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_grades_graph_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(595);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_grades_overview_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(373);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_assignments_overview_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(604);
// Imports







var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500&family=Roboto+Slab:wght@300;400;500&family=Roboto:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap);"]);
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/icon?family=Material+Icons);"]);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_documents_overview_css__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_forum_css__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_grades_graph_css__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_grades_overview_css__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z);
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_assignments_overview_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* Roboto, Roboto Slab, and Roboto Mono */\r\n\r\n/* Define the colours here. */\r\n/* Source: https://material.io/resources/color/ */\r\nbody {\r\n    /* Lea Green */\r\n    --primary: #8bc34a;\r\n    --primary-opaque: rgba(139, 195, 74, 0.5);\r\n    --primary-light: #bef67a;\r\n    --primary-dark: #5a9216;\r\n    --primary-darker: #255d00;\r\n\r\n    /* MIO Blue */\r\n    --secondary: #0288d1;\r\n    --secondary-opaque: rgba(2, 136, 209, 0.5);\r\n    --secondary-light: #5eb8ff;\r\n    --secondary-dark: #005b9f;\r\n    --secondary-darker: #003270;\r\n\r\n    --error: #b00020;\r\n\r\n    /* Dark grey, used to indicate the file document type. */\r\n    --dark-grey: #1b1b1b;\r\n    /* Dark blue, used to indicate the link document type. */\r\n    --dark-blue: #000045;\r\n    /* Dark red, used to indicate the video document type. */\r\n    --dark-red: #300000;\r\n\r\n    /* Greyscales */\r\n    --grey-100: #f5f5f5;\r\n    --grey-200: #eeeeee;\r\n    --grey-300: #e0e0e0;\r\n    --grey-400: #bdbdbd;\r\n    --grey-500: #9e9e9e;\r\n    --grey-600: #757575;\r\n    --grey-700: #616161;\r\n    --grey-800: #424242;\r\n    --grey-900: #212121;\r\n}\r\n\r\n/* Container for all Lea content injections. */\r\n.omniplus-lea-container {\r\n    padding: 20px;\r\n\r\n    /* Since the body scroll is disabled, ensure that the container is in the screen so its horizontal scroll bar shows up. */\r\n    height: calc(100vh - 120px);\r\n    /* Leave space for the left lea toolbar */\r\n    max-width: calc(100vw - 400px);\r\n\r\n    /* Roboto */\r\n    font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\r\n\r\n    --badge-card-width: 300px;\r\n\r\n    --badge-size: 36px;\r\n    --badge-background: var(--dark-grey);\r\n    --badge-clickable-background: var(--primary);\r\n    --badge-clickable-background-hovered: var(--primary-dark);\r\n    --badge-clickable-background-focused: var(--primary-darker);\r\n    --badge-clickable-secondary-background: var(--secondary);\r\n    --badge-clickable-secondary-background-hovered: var(--secondary-dark);\r\n    --badge-clickable-secondary-background-focused: var(--secondary-darker);\r\n}\r\n\r\n.omniplus-lea-container .badged-card, .omniplus-lea-container .badged-card-horizontal {\r\n    display: flex;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n\r\n    /* Prevent long words from overflowing the container. */\r\n    overflow-wrap: anywhere;\r\n}\r\n\r\n.omniplus-lea-container .badged-card {\r\n    /* Reverse horizontal flexbox */\r\n    /* Reverse the order to put the icons on the right and the card itself on the left.\r\n     This is done instead of reversing the order of the elements so the card is always\r\n     above the badges without having to specify indices. */\r\n    flex-direction: row-reverse;\r\n}\r\n\r\n/* For objects with more badges, excessive badges may stretch the length of the card and leave out empty space.\r\nThis means that it's a better idea to align the badges to the bottom of the cards rather than the right. */\r\n.omniplus-lea-container .badged-card-horizontal {\r\n    /* Vertical flexbox. See badged-card comment for reasons to reverse. */\r\n    flex-direction: column-reverse;\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder, .omniplus-lea-container .badged-card-horizontal .badge-holder {\r\n    /* Prevent the badges from being squished by the description. */\r\n    flex-shrink: 0;\r\n\r\n    display: flex;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n\r\n    /* Give the badges a bit of space from each other. */\r\n    gap: 8px;\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder {\r\n    width: var(--badge-size);\r\n    /* Give the badges a bit of space vertically. */\r\n    /* Also to match the padding of the card's content. */\r\n    margin-top: 12px;\r\n    margin-bottom: 12px;\r\n\r\n    /* Vertical Flexbox */\r\n    flex-direction: column;\r\n}\r\n\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder {\r\n    height: var(--badge-size);\r\n    /* Give the badges a bit of space vertically. */\r\n    /* Also to match the padding of the card's content. */\r\n    margin-left: 12px;\r\n    margin-right: 12px;\r\n\r\n    /* Horizontal Flexbox */\r\n    flex-direction: row;\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder .badge,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .badge {\r\n    /* Centre-align horizontally */\r\n    text-align: center;\r\n    /* Using flexbox to centre-align vertically */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n\r\n    /* icon size and colour */\r\n    color: white;\r\n    font-size: calc(var(--badge-size) * 0.67);\r\n\r\n    text-decoration: none !important;\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder .badge {\r\n    height: var(--badge-size);\r\n\r\n    /* Rounded corners on top and bottom left. */\r\n    /* border-radius: 2px 0 0 2px; */\r\n    border-radius: 0 2px 2px 0;\r\n}\r\n\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .badge {\r\n    width: var(--badge-size);\r\n\r\n    /* Rounded corners on bottom left and right. */\r\n    border-radius: 0 0 2px 2px;\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder .default {\r\n    background-color: var(--dark-grey);\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder .clickable,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .clickable {\r\n    /* Pointer indicating that the file can be downloaded. */\r\n    cursor: pointer;\r\n    background-color: var(--badge-clickable-background);\r\n}\r\n.omniplus-lea-container .badged-card .badge-holder .clickable:hover,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .clickable:hover {\r\n    background-color: var(--badge-clickable-background-hovered);\r\n}\r\n.omniplus-lea-container .badged-card .badge-holder .clickable:focus,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .clickable:focus {\r\n    background-color: var(--badge-clickable-background-focused);\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder .clickable-disabled,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .clickable-disabled {\r\n    /* Pointer indicating that this cannot be interacted with. */\r\n    cursor: not-allowed;\r\n    background-color: var(--primary-opaque);\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder .clickable-secondary,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .clickable-secondary {\r\n    /* Pointer indicating that the file can be downloaded. */\r\n    cursor: pointer;\r\n    background-color: var(--badge-clickable-secondary-background);\r\n\r\n    transition-duration: 0.2s;\r\n}\r\n.omniplus-lea-container .badged-card .badge-holder .clickable-secondary:hover,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .clickable-secondary:hover {\r\n    background-color: var(--badge-clickable-secondary-background-hovered);\r\n}\r\n.omniplus-lea-container .badged-card .badge-holder .clickable-secondary:focus,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .clickable-secondary:focus {\r\n    background-color: var(--badge-clickable-secondary-background-focused);\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder .clickable-secondary-disabled,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .clickable-secondary-disabled {\r\n    /* Pointer indicating that this cannot be interacted with. */\r\n    cursor: not-allowed;\r\n    background-color: var(--secondary-opaque);\r\n}\r\n\r\n.omniplus-lea-container .card {\r\n    /* The card fills the horizontal content. */\r\n    flex-grow: 1;\r\n    border-radius: 2px;\r\n    /* Material 2dp shadow */\r\n    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);\r\n\r\n    padding: 12px;\r\n\r\n    /* Vertical Flexbox */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n\r\n    /* Added space between title and descriptions. */\r\n    gap: 8px;\r\n}\r\n\r\n.omniplus-lea-container .loading {\r\n    flex-grow: 1;\r\n\r\n    /* Center the animated loader */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: center;\r\n\r\n    /* Gap between spinner and explanation */\r\n    gap: 40px;\r\n}\r\n\r\n.omniplus-lea-container .loading .loading-spinner {\r\n    width: 120px;\r\n    height: 120px;\r\n\r\n    border: 8px solid white;\r\n    border-top: 8px solid var(--grey-600);\r\n    border-radius: 50%;\r\n\r\n    animation: spin 1s linear infinite;\r\n}\r\n\r\n@keyframes spin {\r\n    0% {\r\n        transform: rotate(0deg);\r\n    }\r\n    100% {\r\n        transform: rotate(360deg);\r\n    }\r\n}\r\n\r\n\r\n.omniplus-lea-container .loading .explanation {\r\n    font-size: 20px;\r\n    color: var(--grey-600);\r\n    text-align: center;\r\n\r\n    max-width: 400px;\r\n}", "",{"version":3,"sources":["webpack://./scripts/omniplus.css"],"names":[],"mappings":"AAAA,yCAAyC;;AAUzC,6BAA6B;AAC7B,iDAAiD;AACjD;IACI,cAAc;IACd,kBAAkB;IAClB,yCAAyC;IACzC,wBAAwB;IACxB,uBAAuB;IACvB,yBAAyB;;IAEzB,aAAa;IACb,oBAAoB;IACpB,0CAA0C;IAC1C,0BAA0B;IAC1B,yBAAyB;IACzB,2BAA2B;;IAE3B,gBAAgB;;IAEhB,wDAAwD;IACxD,oBAAoB;IACpB,wDAAwD;IACxD,oBAAoB;IACpB,wDAAwD;IACxD,mBAAmB;;IAEnB,eAAe;IACf,mBAAmB;IACnB,mBAAmB;IACnB,mBAAmB;IACnB,mBAAmB;IACnB,mBAAmB;IACnB,mBAAmB;IACnB,mBAAmB;IACnB,mBAAmB;IACnB,mBAAmB;AACvB;;AAEA,8CAA8C;AAC9C;IACI,aAAa;;IAEb,yHAAyH;IACzH,2BAA2B;IAC3B,yCAAyC;IACzC,8BAA8B;;IAE9B,WAAW;IACX,uDAAuD;;IAEvD,yBAAyB;;IAEzB,kBAAkB;IAClB,oCAAoC;IACpC,4CAA4C;IAC5C,yDAAyD;IACzD,2DAA2D;IAC3D,wDAAwD;IACxD,qEAAqE;IACrE,uEAAuE;AAC3E;;AAEA;IACI,aAAa;IACb,2BAA2B;IAC3B,oBAAoB;;IAEpB,uDAAuD;IACvD,uBAAuB;AAC3B;;AAEA;IACI,+BAA+B;IAC/B;;0DAEsD;IACtD,2BAA2B;AAC/B;;AAEA;0GAC0G;AAC1G;IACI,sEAAsE;IACtE,8BAA8B;AAClC;;AAEA;IACI,+DAA+D;IAC/D,cAAc;;IAEd,aAAa;IACb,2BAA2B;IAC3B,oBAAoB;;IAEpB,oDAAoD;IACpD,QAAQ;AACZ;;AAEA;IACI,wBAAwB;IACxB,+CAA+C;IAC/C,qDAAqD;IACrD,gBAAgB;IAChB,mBAAmB;;IAEnB,qBAAqB;IACrB,sBAAsB;AAC1B;;AAEA;IACI,yBAAyB;IACzB,+CAA+C;IAC/C,qDAAqD;IACrD,iBAAiB;IACjB,kBAAkB;;IAElB,uBAAuB;IACvB,mBAAmB;AACvB;;AAEA;;IAEI,8BAA8B;IAC9B,kBAAkB;IAClB,6CAA6C;IAC7C,aAAa;IACb,sBAAsB;IACtB,uBAAuB;;IAEvB,yBAAyB;IACzB,YAAY;IACZ,yCAAyC;;IAEzC,gCAAgC;AACpC;;AAEA;IACI,yBAAyB;;IAEzB,4CAA4C;IAC5C,gCAAgC;IAChC,0BAA0B;AAC9B;;AAEA;IACI,wBAAwB;;IAExB,8CAA8C;IAC9C,0BAA0B;AAC9B;;AAEA;IACI,kCAAkC;AACtC;;AAEA;;IAEI,wDAAwD;IACxD,eAAe;IACf,mDAAmD;AACvD;AACA;;IAEI,2DAA2D;AAC/D;AACA;;IAEI,2DAA2D;AAC/D;;AAEA;;IAEI,4DAA4D;IAC5D,mBAAmB;IACnB,uCAAuC;AAC3C;;AAEA;;IAEI,wDAAwD;IACxD,eAAe;IACf,6DAA6D;;IAE7D,yBAAyB;AAC7B;AACA;;IAEI,qEAAqE;AACzE;AACA;;IAEI,qEAAqE;AACzE;;AAEA;;IAEI,4DAA4D;IAC5D,mBAAmB;IACnB,yCAAyC;AAC7C;;AAEA;IACI,2CAA2C;IAC3C,YAAY;IACZ,kBAAkB;IAClB,wBAAwB;IACxB,iGAAiG;;IAEjG,aAAa;;IAEb,qBAAqB;IACrB,aAAa;IACb,sBAAsB;IACtB,2BAA2B;IAC3B,oBAAoB;;IAEpB,gDAAgD;IAChD,QAAQ;AACZ;;AAEA;IACI,YAAY;;IAEZ,+BAA+B;IAC/B,aAAa;IACb,sBAAsB;IACtB,uBAAuB;IACvB,mBAAmB;;IAEnB,wCAAwC;IACxC,SAAS;AACb;;AAEA;IACI,YAAY;IACZ,aAAa;;IAEb,uBAAuB;IACvB,qCAAqC;IACrC,kBAAkB;;IAElB,kCAAkC;AACtC;;AAEA;IACI;QACI,uBAAuB;IAC3B;IACA;QACI,yBAAyB;IAC7B;AACJ;;;AAGA;IACI,eAAe;IACf,sBAAsB;IACtB,kBAAkB;;IAElB,gBAAgB;AACpB","sourcesContent":["/* Roboto, Roboto Slab, and Roboto Mono */\r\n@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500&family=Roboto+Slab:wght@300;400;500&family=Roboto:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');\r\n@import url('https://fonts.googleapis.com/icon?family=Material+Icons');\r\n\r\n@import \"documents-overview.css\";\r\n@import \"forum.css\";\r\n@import \"grades-graph.css\";\r\n@import \"grades-overview.css\";\r\n@import \"assignments-overview.css\";\r\n\r\n/* Define the colours here. */\r\n/* Source: https://material.io/resources/color/ */\r\nbody {\r\n    /* Lea Green */\r\n    --primary: #8bc34a;\r\n    --primary-opaque: rgba(139, 195, 74, 0.5);\r\n    --primary-light: #bef67a;\r\n    --primary-dark: #5a9216;\r\n    --primary-darker: #255d00;\r\n\r\n    /* MIO Blue */\r\n    --secondary: #0288d1;\r\n    --secondary-opaque: rgba(2, 136, 209, 0.5);\r\n    --secondary-light: #5eb8ff;\r\n    --secondary-dark: #005b9f;\r\n    --secondary-darker: #003270;\r\n\r\n    --error: #b00020;\r\n\r\n    /* Dark grey, used to indicate the file document type. */\r\n    --dark-grey: #1b1b1b;\r\n    /* Dark blue, used to indicate the link document type. */\r\n    --dark-blue: #000045;\r\n    /* Dark red, used to indicate the video document type. */\r\n    --dark-red: #300000;\r\n\r\n    /* Greyscales */\r\n    --grey-100: #f5f5f5;\r\n    --grey-200: #eeeeee;\r\n    --grey-300: #e0e0e0;\r\n    --grey-400: #bdbdbd;\r\n    --grey-500: #9e9e9e;\r\n    --grey-600: #757575;\r\n    --grey-700: #616161;\r\n    --grey-800: #424242;\r\n    --grey-900: #212121;\r\n}\r\n\r\n/* Container for all Lea content injections. */\r\n.omniplus-lea-container {\r\n    padding: 20px;\r\n\r\n    /* Since the body scroll is disabled, ensure that the container is in the screen so its horizontal scroll bar shows up. */\r\n    height: calc(100vh - 120px);\r\n    /* Leave space for the left lea toolbar */\r\n    max-width: calc(100vw - 400px);\r\n\r\n    /* Roboto */\r\n    font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\r\n\r\n    --badge-card-width: 300px;\r\n\r\n    --badge-size: 36px;\r\n    --badge-background: var(--dark-grey);\r\n    --badge-clickable-background: var(--primary);\r\n    --badge-clickable-background-hovered: var(--primary-dark);\r\n    --badge-clickable-background-focused: var(--primary-darker);\r\n    --badge-clickable-secondary-background: var(--secondary);\r\n    --badge-clickable-secondary-background-hovered: var(--secondary-dark);\r\n    --badge-clickable-secondary-background-focused: var(--secondary-darker);\r\n}\r\n\r\n.omniplus-lea-container .badged-card, .omniplus-lea-container .badged-card-horizontal {\r\n    display: flex;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n\r\n    /* Prevent long words from overflowing the container. */\r\n    overflow-wrap: anywhere;\r\n}\r\n\r\n.omniplus-lea-container .badged-card {\r\n    /* Reverse horizontal flexbox */\r\n    /* Reverse the order to put the icons on the right and the card itself on the left.\r\n     This is done instead of reversing the order of the elements so the card is always\r\n     above the badges without having to specify indices. */\r\n    flex-direction: row-reverse;\r\n}\r\n\r\n/* For objects with more badges, excessive badges may stretch the length of the card and leave out empty space.\r\nThis means that it's a better idea to align the badges to the bottom of the cards rather than the right. */\r\n.omniplus-lea-container .badged-card-horizontal {\r\n    /* Vertical flexbox. See badged-card comment for reasons to reverse. */\r\n    flex-direction: column-reverse;\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder, .omniplus-lea-container .badged-card-horizontal .badge-holder {\r\n    /* Prevent the badges from being squished by the description. */\r\n    flex-shrink: 0;\r\n\r\n    display: flex;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n\r\n    /* Give the badges a bit of space from each other. */\r\n    gap: 8px;\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder {\r\n    width: var(--badge-size);\r\n    /* Give the badges a bit of space vertically. */\r\n    /* Also to match the padding of the card's content. */\r\n    margin-top: 12px;\r\n    margin-bottom: 12px;\r\n\r\n    /* Vertical Flexbox */\r\n    flex-direction: column;\r\n}\r\n\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder {\r\n    height: var(--badge-size);\r\n    /* Give the badges a bit of space vertically. */\r\n    /* Also to match the padding of the card's content. */\r\n    margin-left: 12px;\r\n    margin-right: 12px;\r\n\r\n    /* Horizontal Flexbox */\r\n    flex-direction: row;\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder .badge,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .badge {\r\n    /* Centre-align horizontally */\r\n    text-align: center;\r\n    /* Using flexbox to centre-align vertically */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n\r\n    /* icon size and colour */\r\n    color: white;\r\n    font-size: calc(var(--badge-size) * 0.67);\r\n\r\n    text-decoration: none !important;\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder .badge {\r\n    height: var(--badge-size);\r\n\r\n    /* Rounded corners on top and bottom left. */\r\n    /* border-radius: 2px 0 0 2px; */\r\n    border-radius: 0 2px 2px 0;\r\n}\r\n\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .badge {\r\n    width: var(--badge-size);\r\n\r\n    /* Rounded corners on bottom left and right. */\r\n    border-radius: 0 0 2px 2px;\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder .default {\r\n    background-color: var(--dark-grey);\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder .clickable,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .clickable {\r\n    /* Pointer indicating that the file can be downloaded. */\r\n    cursor: pointer;\r\n    background-color: var(--badge-clickable-background);\r\n}\r\n.omniplus-lea-container .badged-card .badge-holder .clickable:hover,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .clickable:hover {\r\n    background-color: var(--badge-clickable-background-hovered);\r\n}\r\n.omniplus-lea-container .badged-card .badge-holder .clickable:focus,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .clickable:focus {\r\n    background-color: var(--badge-clickable-background-focused);\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder .clickable-disabled,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .clickable-disabled {\r\n    /* Pointer indicating that this cannot be interacted with. */\r\n    cursor: not-allowed;\r\n    background-color: var(--primary-opaque);\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder .clickable-secondary,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .clickable-secondary {\r\n    /* Pointer indicating that the file can be downloaded. */\r\n    cursor: pointer;\r\n    background-color: var(--badge-clickable-secondary-background);\r\n\r\n    transition-duration: 0.2s;\r\n}\r\n.omniplus-lea-container .badged-card .badge-holder .clickable-secondary:hover,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .clickable-secondary:hover {\r\n    background-color: var(--badge-clickable-secondary-background-hovered);\r\n}\r\n.omniplus-lea-container .badged-card .badge-holder .clickable-secondary:focus,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .clickable-secondary:focus {\r\n    background-color: var(--badge-clickable-secondary-background-focused);\r\n}\r\n\r\n.omniplus-lea-container .badged-card .badge-holder .clickable-secondary-disabled,\r\n.omniplus-lea-container .badged-card-horizontal .badge-holder .clickable-secondary-disabled {\r\n    /* Pointer indicating that this cannot be interacted with. */\r\n    cursor: not-allowed;\r\n    background-color: var(--secondary-opaque);\r\n}\r\n\r\n.omniplus-lea-container .card {\r\n    /* The card fills the horizontal content. */\r\n    flex-grow: 1;\r\n    border-radius: 2px;\r\n    /* Material 2dp shadow */\r\n    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);\r\n\r\n    padding: 12px;\r\n\r\n    /* Vertical Flexbox */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    align-items: stretch;\r\n\r\n    /* Added space between title and descriptions. */\r\n    gap: 8px;\r\n}\r\n\r\n.omniplus-lea-container .loading {\r\n    flex-grow: 1;\r\n\r\n    /* Center the animated loader */\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: center;\r\n\r\n    /* Gap between spinner and explanation */\r\n    gap: 40px;\r\n}\r\n\r\n.omniplus-lea-container .loading .loading-spinner {\r\n    width: 120px;\r\n    height: 120px;\r\n\r\n    border: 8px solid white;\r\n    border-top: 8px solid var(--grey-600);\r\n    border-radius: 50%;\r\n\r\n    animation: spin 1s linear infinite;\r\n}\r\n\r\n@keyframes spin {\r\n    0% {\r\n        transform: rotate(0deg);\r\n    }\r\n    100% {\r\n        transform: rotate(360deg);\r\n    }\r\n}\r\n\r\n\r\n.omniplus-lea-container .loading .explanation {\r\n    font-size: 20px;\r\n    color: var(--grey-600);\r\n    text-align: center;\r\n\r\n    max-width: 400px;\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 638:
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ 663:
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ 450:
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 199:
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ 994:
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 653:
/***/ ((module) => {



/* istanbul ignore next  */
var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join("\n");
  };
}();
/* istanbul ignore next  */


function apply(styleElement, index, remove, obj) {
  var css;

  if (remove) {
    css = "";
  } else {
    css = "";

    if (obj.supports) {
      css += "@supports (".concat(obj.supports, ") {");
    }

    if (obj.media) {
      css += "@media ".concat(obj.media, " {");
    }

    var needLayer = typeof obj.layer !== "undefined";

    if (needLayer) {
      css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
    }

    css += obj.css;

    if (needLayer) {
      css += "}";
    }

    if (obj.media) {
      css += "}";
    }

    if (obj.supports) {
      css += "}";
    }
  } // For old IE

  /* istanbul ignore if  */


  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = styleElement.childNodes;

    if (childNodes[index]) {
      styleElement.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index]);
    } else {
      styleElement.appendChild(cssNode);
    }
  }
}

var singletonData = {
  singleton: null,
  singletonCounter: 0
};
/* istanbul ignore next  */

function domAPI(options) {
  // eslint-disable-next-line no-undef,no-use-before-define
  var styleIndex = singletonData.singletonCounter++;
  var styleElement = // eslint-disable-next-line no-undef,no-use-before-define
  singletonData.singleton || ( // eslint-disable-next-line no-undef,no-use-before-define
  singletonData.singleton = options.insertStyleElement(options));
  return {
    update: function update(obj) {
      apply(styleElement, styleIndex, false, obj);
    },
    remove: function remove(obj) {
      apply(styleElement, styleIndex, true, obj);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ 99:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(450);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_singletonStyleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(653);
/* harmony import */ var _node_modules_style_loader_dist_runtime_singletonStyleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_singletonStyleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(199);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(458);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(994);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_omniplus_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(535);

      
      
      
      
      
      
      
      
      

var options = {};

;
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_singletonStyleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_omniplus_css__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z, options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_omniplus_css__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z && _node_modules_css_loader_dist_cjs_js_omniplus_css__WEBPACK_IMPORTED_MODULE_5__/* ["default"].locals */ .Z.locals ? _node_modules_css_loader_dist_cjs_js_omniplus_css__WEBPACK_IMPORTED_MODULE_5__/* ["default"].locals */ .Z.locals : undefined);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
const overview_1 = __webpack_require__(916);
const container_1 = __webpack_require__(277);
const logo_patcher_1 = __webpack_require__(347);
const overview_button_1 = __webpack_require__(824);
const page_patcher_1 = __webpack_require__(50);
const forum_subject_1 = __webpack_require__(802);
const grades_overview_1 = __webpack_require__(120);
const assignment_overview_1 = __webpack_require__(179);
__webpack_require__(99);
(0, page_patcher_1.removeHeaderImage)();
(0, logo_patcher_1.injectOmniplusLogo)();
// If the script is being run on Lea.
if (window.location.href.includes('ovx.omnivox.ca')) {
    (0, overview_button_1.injectDocumentsOverviewButtonToLea)();
    (0, page_patcher_1.removeLeaAnchorHoverCSSRule)();
    // If the script is being run on the document overview page.
    if (window.location.href.includes('SommaireDocuments.aspx')) {
        (0, page_patcher_1.removeAllLineBreaks)();
        const overview = new overview_1.LeaDocumentsOverview(container_1.LeaDocumentsContainer.loadFromDocumentOverviewPage(document));
        overview.injectToDocumentOverviewPage();
        overview.render();
    }
    // If the script is being run on the class forum.
    if (window.location.href.includes('ForumClasse.aspx')) {
        // If this is a forum subject page.
        if (window.location.href.includes('a=msg')) {
            const subject = forum_subject_1.ForumSubject.loadFromForumPostPage(document);
            subject.injectToForumSubjectPage();
            subject.render();
        }
    }
    // If the script is being run on the grades overview page.
    if (window.location.href.includes('ListeEvalCVIR.ovx') &&
        window.location.href.includes('SOMMAIREEVAL')) {
        (0, page_patcher_1.removeAllLineBreaks)();
        const overview = grades_overview_1.LeaGradesOverview.loadFromGradesOverviewPage(document);
        overview.injectToGradesOverviewPage();
        overview.render();
    }
    if (window.location.href.includes('SommaireTravaux.aspx')) {
        (0, page_patcher_1.removeAllLineBreaks)();
        const overview = assignment_overview_1.LeaAssignmentOverview.loadAllAssignmentsFromAssignmentsSummaryPage(document);
        overview.injectToAssignmentsOverviewPage();
        overview.render();
    }
}
// If the script is being run on Omnivox/MIO
else {
    // If this is the login page.
    if (window.location.href.includes('Login')) {
        (0, page_patcher_1.autoLogin)();
    }
}

})();

/******/ })()
;
//# sourceMappingURL=main.bundle.js.map