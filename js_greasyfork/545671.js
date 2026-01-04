// ==UserScript==
// @name         ActualGUMS-SyllabusData
// @namespace    shmVirus-scripts
// @version      0.0.1
// @description  Syllabus definitions for ActualGUMS
// @author       shmVirus
// @license      GPL-3.0-or-later
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545671/ActualGUMS-SyllabusData.user.js
// @updateURL https://update.greasyfork.org/scripts/545671/ActualGUMS-SyllabusData.meta.js
// ==/UserScript==

(() => {
  'use strict';
  window.ACTUAL_GUMS = window.ACTUAL_GUMS || {};
  window.ACTUAL_GUMS.SYLLABI = Object.freeze({
    201: {
      name : 'CSE Syllabus 201',
      groups: [
        {
          name:           'Remedial', /* ───── Remedial (student specific, do *not* count toward 144) ───── */
          coursesNeeded:  0,
          creditsNeeded:  0,
          courses: [
            { code:'EAP 009', title:'English for Academic Purposes', credits:0, reqType:'REMEDIAL', prereq:[] },
            { code:'MAT 009', title:'Remedial Math Course',    credits:0, reqType:'REMEDIAL', prereq:[] }
          ]
        },
        {
          name:           'PSD', /* ───── PSD (mandatory, do *not* count toward 144) ───── */
          coursesNeeded:  1,
          creditsNeeded:  0,
          courses: [
            { code:'PSD-400', title:'Professional Life Skills Development (PLSD)',             credits:0, reqType:'MANDATORY', prereq:[] },
          ]
        },
        {
          name:           'EAP',  /* ───── EAP (all mandatory) ───── */
          coursesNeeded:  2,
          creditsNeeded:  5,
          courses: [
            { code:'EAP 101', title:'English for Academic Purpose I',                   credits:3, reqType:'MANDATORY', prereq:[] },
            { code:'EAP 103', title:'English for Academic Purpose II',                  credits:2, reqType:'MANDATORY', prereq:[] },
          ]
        },
        {
          name:           'Science', /* ───── Science  (all mandatory) ───── */
          coursesNeeded:  5,
          creditsNeeded:  11.5,
          courses: [
            { code:'PHY 101', title:'Physics I',         credits:3,   reqType:'MANDATORY', prereq:[] },
            { code:'PHY 103', title:'Physics II',        credits:3,   reqType:'MANDATORY', prereq:[] },
            { code:'PHY 104', title:'Physics Lab',       credits:1.5, reqType:'MANDATORY', prereq:[] },
            { code:'CHE 101', title:'Chemistry',         credits:3,   reqType:'MANDATORY', prereq:[] },
            { code:'CHE 102', title:'Chemistry Lab',     credits:1,   reqType:'MANDATORY', prereq:[] },
          ]
        },
        {
          name:           'MAT', /* ───── MAT  (all mandatory) ───── */
          coursesNeeded:  4,
          creditsNeeded:  12,
          courses: [
            { code:'MAT 101', title:'Differential and Integral Calculus',                                   credits:3, reqType:'MANDATORY', prereq:[] },
            { code:'MAT 103', title:'Ordinary and Partial Differential Equations and Coordinate Geometry',  credits:3, reqType:'MANDATORY', prereq:['MAT 101'] },
            { code:'MAT 105', title:'Linear Algebra and Vector Analysis',                                   credits:3, reqType:'MANDATORY', prereq:['MAT 101','MAT 103'] },
            { code:'MAT 201', title:'Statistics and Complex Variables',                                     credits:3, reqType:'MANDATORY', prereq:['MAT 101'] },
          ]
        },
        {
          name:           'EEE', /* ───── EEE  (all mandatory) ───── */
          coursesNeeded:  5,
          creditsNeeded:  11,
          courses: [
            { code:'EEE 201', title:'Introduction to Electrical Engineering',                 credits:3,    reqType:'MANDATORY',  prereq:[''] },
            { code:'EEE 202', title:'Introduction to Electrical Engineering Lab',             credits:1,    reqType:'MANDATORY',  prereq:[''] },
            { code:'EEE 203', title:'Electronic Devices and Circuits & Pulse Techniques',     credits:3,    reqType:'MANDATORY',  prereq:['EEE 201'] },
            { code:'EEE 204', title:'Electronic Devices and Circuits & Pulse Techniques Lab', credits:1,    reqType:'MANDATORY',  prereq:['EEE 201'] },
            { code:'EEE 205', title:'Electrical Drives and Instrumentation',                  credits:3,    reqType:'MANDATORY',  prereq:['EEE 203'] },
          ]
        },
        {
          name:           'GED-MANDATORY', /* ───── GED-MANDATORY (all mandatory) ───── */
          coursesNeeded:  3,
          creditsNeeded:  6,
          courses: [
            { code:'GED 201', title:'Functional Bengali',                               credits:2, reqType:'MANDATORY', prereq:[] },
            { code:'GED 409', title:'Professional Ethics and Environmental Protection', credits:2, reqType:'MANDATORY', prereq:[] },
            { code:'GED 411', title:'Bangladesh Studies',                               credits:2, reqType:'MANDATORY', prereq:[] },
          ]
        },
        {
          name:           'GED-Social-Science-I', /* ───── GED-Social-Science-I  (pick any *one*) ───── */
          coursesNeeded:  1,
          creditsNeeded:  3,
          courses: [
            { code:'GED 301', title:'Engineering Economics', credits:3, reqType:'ELECTIVE', pool:'SOCSCI1', prereq:[] },
            { code:'GED 303', title:'Sociology',             credits:3, reqType:'ELECTIVE', pool:'SOCSCI1', prereq:[] }
          ]
        },
        {
          name:           'GED-Social-Science-II',  /* ───── GED-Social-Science-II  (one mandatory) ───── */
          coursesNeeded:  1,
          creditsNeeded:  3,
          courses: [
            { code:'GED 401', title:'Financial and Managerial Accounting',  credits:3, reqType:'MANDATORY', prereq:[] },
          ]
        },
        {
          name:           'GED-Business', /* ───── GED-Business  (pick any *one*) ───── */
          coursesNeeded:  1,
          creditsNeeded:  3,
          courses: [
            { code:'GED 403', title:'Business Communication',               credits:3, reqType:'ELECTIVE', pool:'BUSINESS', prereq:[] },
            { code:'GED 405', title:'Industrial & Operational Management',  credits:3, reqType:'ELECTIVE', pool:'BUSINESS', prereq:[] },
            { code:'GED 407', title:'Technology Entrepreneurship',          credits:3, reqType:'ELECTIVE', pool:'BUSINESS', prereq:[] }
          ]
        },

        {
          name:           'CSE-MANDATORY', /* ───── CSE-MANDATORY  (all mandatory) ───── */
          coursesNeeded:  33,
          creditsNeeded:  72.5,
          courses: [
            { code:'CSE 101', title:'Discrete Mathematics',                      credits:3,   reqType:'MANDATORY', prereq:[] },
            { code:'CSE 103', title:'Structured Programming',                    credits:3,   reqType:'MANDATORY', prereq:[] },
            { code:'CSE 104', title:'Structured Programming Lab',                credits:1.5, reqType:'MANDATORY', prereq:['CSE 103'] },
            { code:'CSE 105', title:'Data Structures',                           credits:3,   reqType:'MANDATORY', prereq:['CSE 103'] },
            { code:'CSE 106', title:'Data Structures Lab',                       credits:1.5, reqType:'MANDATORY', prereq:['CSE 105'] },
            { code:'CSE 201', title:'Object Oriented Programming',               credits:3,   reqType:'MANDATORY', prereq:['CSE 103'] },
            { code:'CSE 202', title:'Object Oriented Programming Lab',           credits:1.5, reqType:'MANDATORY', prereq:['CSE 201'] },
            { code:'CSE 203', title:'Digital Logic Design',                      credits:3,   reqType:'MANDATORY', prereq:[] },
            { code:'CSE 204', title:'Digital Logic Design Lab',                  credits:1,   reqType:'MANDATORY', prereq:['CSE 203'] },
            { code:'CSE 205', title:'Algorithms',                                credits:3,   reqType:'MANDATORY', prereq:['CSE 103'] },
            { code:'CSE 206', title:'Algorithms Lab',                            credits:1.5, reqType:'MANDATORY', prereq:['CSE 205'] },
            { code:'CSE 208', title:'Engineering Drawing',                       credits:1.5, reqType:'MANDATORY', prereq:[] },
            { code:'CSE 209', title:'Database System',                           credits:3,   reqType:'MANDATORY', prereq:['CSE 205'] },
            { code:'CSE 210', title:'Database System Lab',                       credits:1.5, reqType:'MANDATORY', prereq:['CSE 209'] },
            { code:'CSE 211', title:'Computer Architecture',                     credits:3,   reqType:'MANDATORY', prereq:['CSE 203'] },
            { code:'CSE 301', title:'Web Programming',                           credits:3,   reqType:'MANDATORY', prereq:['CSE 209'] },
            { code:'CSE 302', title:'Web Programming Lab',                       credits:1.5, reqType:'MANDATORY', prereq:['CSE 301'] },
            { code:'CSE 303', title:'Microprocessors & Microcontrollers',        credits:3,   reqType:'MANDATORY', prereq:['CSE 203'] },
            { code:'CSE 304', title:'Microprocessors & Microcontrollers Lab',    credits:1,   reqType:'MANDATORY', prereq:['CSE 303'] },
            { code:'CSE 309', title:'Operating System',                          credits:3,   reqType:'MANDATORY', prereq:['CSE 205'] },
            { code:'CSE 310', title:'Operating System Lab',                      credits:1.5, reqType:'MANDATORY', prereq:['CSE 309'] },
            { code:'CSE 311', title:'Computer Networking',                       credits:3,   reqType:'MANDATORY', prereq:['CSE 205'] },
            { code:'CSE 312', title:'Computer Networking Lab',                   credits:1.5, reqType:'MANDATORY', prereq:['CSE 311'] },
            { code:'CSE 313', title:'Software Engineering',                      credits:3,   reqType:'MANDATORY', prereq:['CSE 205'] },
            { code:'CSE 315', title:'Artificial Intelligence',                   credits:3,   reqType:'MANDATORY', prereq:['CSE 201'] },
            { code:'CSE 316', title:'Artificial Intelligence Lab',               credits:1.5, reqType:'MANDATORY', prereq:['CSE 315'] },
            { code:'CSE 324', title:'Integrated Design Project I',               credits:1.5, reqType:'MANDATORY', prereq:[] },
            { code:'CSE 403', title:'Information System and Design',             credits:3,   reqType:'MANDATORY', prereq:['CSE 313'] },
            { code:'CSE 406', title:'Integrated Design Project II',              credits:1.5, reqType:'MANDATORY', prereq:['CSE 324'] },
            { code:'CSE 458', title:'Industrial Training',                       credits:3,   reqType:'MANDATORY', prereq:[] },
            { code:'CSE 400A',title:'Capstone Project/Thesis',                   credits:2,   reqType:'MANDATORY', prereq:[] },
            { code:'CSE 400B',title:'Capstone Project/Thesis',                   credits:2,   reqType:'MANDATORY', prereq:['CSE 400A'] },
            { code:'CSE 400C',title:'Capstone Project/Thesis',                   credits:2,   reqType:'MANDATORY', prereq:['CSE 400B'] },
          ]
        },
        {
          name:           'CSE-Optional-I', /* ───── CSE-Optional-I  (choose one *pair* = 2 courses) ───── */
          coursesNeeded:  2,          /* Compiler+Lab  *or*  DC+Lab     */
          creditsNeeded:  4,          /* 3 cr + 1 cr                    */
          courses: [
            { code:'CSE 305', title:'Compiler',                credits:3, reqType:'ELECTIVE', pool:'OPTIONAL_I', prereq:['CSE 201'] },
            { code:'CSE 306', title:'Compiler Lab',            credits:1, reqType:'ELECTIVE', pool:'OPTIONAL_I', prereq:['CSE 305'] },
            { code:'CSE 307', title:'Data Communication',      credits:3, reqType:'ELECTIVE', pool:'OPTIONAL_I', prereq:['CSE 311'] },
            { code:'CSE 308', title:'Data Communication Lab',  credits:1, reqType:'ELECTIVE', pool:'OPTIONAL_I', prereq:['CSE 307'] },
          ]
        },
        {
          name:           'CSE-Optional-II',  /* ───── CSE-Optional-II  (pick any *one*) ───── */
          coursesNeeded:  1,
          creditsNeeded:  3,
          courses: [
            { code:'CSE 317', title:'Mathematical Analysis for Computer Science',  credits:3, reqType:'ELECTIVE', pool:'OPTIONAL_II', prereq:['MAT 105'] },
            { code:'CSE 319', title:'Digital System Design',                       credits:3, reqType:'ELECTIVE', pool:'OPTIONAL_II', prereq:['CSE 211'] },
            { code:'CSE 321', title:'Human Computer Interaction',                  credits:3, reqType:'ELECTIVE', pool:'OPTIONAL_II', prereq:['CSE 313'] },
            { code:'CSE 323', title:'Computer and Cyber Security',                 credits:3, reqType:'ELECTIVE', pool:'OPTIONAL_II', prereq:['CSE 311'] },
          ]
        },
        {
          name:           'CSE-Specialization-I', /* ───── CSE-Specialisation-I  (level-1, pick *one pair*) ───── */
          coursesNeeded:  2,      /* always a course + its lab (1.5 cr)   */
          creditsNeeded:  4.5,
          courses: [
            /* – Theoretical CS – */
            { code:'CSE 407', title:'Graph Theory',                   credits:3,   reqType:'ELECTIVE', pool:'SPEC1_TCS',    track:'TCS',    specLevel:1, prereq:['CSE 101'] },
            { code:'CSE 408', title:'Graph Theory Lab',               credits:1.5, reqType:'ELECTIVE', pool:'SPEC1_TCS',    track:'TCS',    specLevel:1, prereq:['CSE 407'] },
            { code:'CSE 409', title:'Algorithm Engineering',          credits:3,   reqType:'ELECTIVE', pool:'SPEC1_TCS',    track:'TCS',    specLevel:1, prereq:['CSE 205'] },
            { code:'CSE 410', title:'Algorithm Engineering Lab',      credits:1.5, reqType:'ELECTIVE', pool:'SPEC1_TCS',    track:'TCS',    specLevel:1, prereq:['CSE 409'] },

            /* – Machine Learning & DS – */
            { code:'CSE 411', title:'Machine Learning',               credits:3,   reqType:'ELECTIVE', pool:'SPEC1_MLDS',   track:'MLDS',   specLevel:1, prereq:['CSE 315'] },
            { code:'CSE 412', title:'Machine Learning Lab',           credits:1.5, reqType:'ELECTIVE', pool:'SPEC1_MLDS',   track:'MLDS',   specLevel:1, prereq:['CSE 411'] },
            { code:'CSE 413', title:'Natural Language Processing',    credits:3,   reqType:'ELECTIVE', pool:'SPEC1_MLDS',   track:'MLDS',   specLevel:1, prereq:['CSE 411'] },
            { code:'CSE 414', title:'Natural Language Processing Lab',credits:1.5, reqType:'ELECTIVE', pool:'SPEC1_MLDS',   track:'MLDS',   specLevel:1, prereq:['CSE 413'] },
            { code:'CSE 415', title:'Digital Image Processing',       credits:3,   reqType:'ELECTIVE', pool:'SPEC1_MLDS',   track:'MLDS',   specLevel:1, prereq:['CSE 315'] },
            { code:'CSE 416', title:'Digital Image Processing Lab',   credits:1.5, reqType:'ELECTIVE', pool:'SPEC1_MLDS',   track:'MLDS',   specLevel:1, prereq:['CSE 415'] },

            /* – Network & System – */
            { code:'CSE 417', title:'Wireless Networks',                credits:3,   reqType:'ELECTIVE', pool:'SPEC1_NETSYS', track:'NETSYS', specLevel:1, prereq:['CSE 311'] },
            { code:'CSE 418', title:'Wireless Networks Lab',            credits:1.5, reqType:'ELECTIVE', pool:'SPEC1_NETSYS', track:'NETSYS', specLevel:1, prereq:['CSE 417'] },
            { code:'CSE 419', title:'Embedded System',                  credits:3,   reqType:'ELECTIVE', pool:'SPEC1_NETSYS', track:'NETSYS', specLevel:1, prereq:['CSE 303'] },
            { code:'CSE 420', title:'Embedded System Lab',              credits:1.5, reqType:'ELECTIVE', pool:'SPEC1_NETSYS', track:'NETSYS', specLevel:1, prereq:['CSE 419'] },
            { code:'CSE 421', title:'VLSI Design',                      credits:3,   reqType:'ELECTIVE', pool:'SPEC1_NETSYS', track:'NETSYS', specLevel:1, prereq:['CSE 211'] },
            { code:'CSE 422', title:'VLSI Design Lab',                  credits:1.5, reqType:'ELECTIVE', pool:'SPEC1_NETSYS', track:'NETSYS', specLevel:1, prereq:['CSE 421'] },
            { code:'CSE 423', title:'Peripherals and Interfacing',      credits:3,   reqType:'ELECTIVE', pool:'SPEC1_NETSYS', track:'NETSYS', specLevel:1, prereq:['CSE 419'] },
            { code:'CSE 424', title:'Peripherals and Interfacing Lab',  credits:1.5, reqType:'ELECTIVE', pool:'SPEC1_NETSYS', track:'NETSYS', specLevel:1, prereq:['CSE 423'] },

            /* – Software Systems – */
            { code:'CSE 425', title:'Mobile App Development',         credits:3,   reqType:'ELECTIVE', pool:'SPEC1_SOFTSYS',track:'SOFTSYS',specLevel:1, prereq:['CSE 201'] },
            { code:'CSE 426', title:'Mobile App Development Lab',     credits:1.5, reqType:'ELECTIVE', pool:'SPEC1_SOFTSYS',track:'SOFTSYS',specLevel:1, prereq:['CSE 425'] },
            { code:'CSE 427', title:'Software Design Pattern',        credits:3,   reqType:'ELECTIVE', pool:'SPEC1_SOFTSYS',track:'SOFTSYS',specLevel:1, prereq:['CSE 313'] },
            { code:'CSE 428', title:'Software Design Pattern Lab',    credits:1.5, reqType:'ELECTIVE', pool:'SPEC1_SOFTSYS',track:'SOFTSYS',specLevel:1, prereq:['CSE 427'] },
          ]
        },
        {
          name:           'CSE-Specialization-II',  /* ───── CSE-Specialisation-II  (level-2, pick *one pair*) ───── */
          coursesNeeded:  2,
          creditsNeeded:  4,
          courses: [
            /* Theoretical CS */
            { code:'CSE 429', title:'Bioinformatics',                 credits:3, reqType:'ELECTIVE', pool:'SPEC2_TCS',    track:'TCS',    specLevel:2, prereq:['CSE 315'] },
            { code:'CSE 430', title:'Bioinformatics Lab',             credits:1, reqType:'ELECTIVE', pool:'SPEC2_TCS',    track:'TCS',    specLevel:2, prereq:['CSE 429'] },
            { code:'CSE 431', title:'Computational Geometry',         credits:3, reqType:'ELECTIVE', pool:'SPEC2_TCS',    track:'TCS',    specLevel:2, prereq:['CSE 205'] },
            { code:'CSE 432', title:'Computational Geometry Lab',     credits:1, reqType:'ELECTIVE', pool:'SPEC2_TCS',    track:'TCS',    specLevel:2, prereq:['CSE 431'] },
            { code:'CSE 433', title:'Computer Graphics',              credits:3, reqType:'ELECTIVE', pool:'SPEC2_TCS',    track:'TCS',    specLevel:2, prereq:['CSE 303'] },
            { code:'CSE 434', title:'Computer Graphics Lab',          credits:1, reqType:'ELECTIVE', pool:'SPEC2_TCS',    track:'TCS',    specLevel:2, prereq:['CSE 433'] },

            /* Machine Learning & DS */
            { code:'CSE 435', title:'Data Mining',                    credits:3, reqType:'ELECTIVE', pool:'SPEC2_MLDS',   track:'MLDS',   specLevel:2, prereq:['CSE 315'] },
            { code:'CSE 436', title:'Data Mining Lab',                credits:1, reqType:'ELECTIVE', pool:'SPEC2_MLDS',   track:'MLDS',   specLevel:2, prereq:['CSE 435'] },
            { code:'CSE 437', title:'Information Retrieval',          credits:3, reqType:'ELECTIVE', pool:'SPEC2_MLDS',   track:'MLDS',   specLevel:2, prereq:['CSE 313'] },
            { code:'CSE 438', title:'Information Retrieval Lab',      credits:1, reqType:'ELECTIVE', pool:'SPEC2_MLDS',   track:'MLDS',   specLevel:2, prereq:['CSE 437'] },
            { code:'CSE 439', title:'Pattern Recognition',            credits:3, reqType:'ELECTIVE', pool:'SPEC2_MLDS',   track:'MLDS',   specLevel:2, prereq:['CSE 315'] },
            { code:'CSE 440', title:'Pattern Recognition Lab',        credits:1, reqType:'ELECTIVE', pool:'SPEC2_MLDS',   track:'MLDS',   specLevel:2, prereq:['CSE 439'] },
            { code:'CSE 441', title:'Big Data Analytics',             credits:3, reqType:'ELECTIVE', pool:'SPEC2_MLDS',   track:'MLDS',   specLevel:2, prereq:['CSE 435'] },
            { code:'CSE 442', title:'Big Data Analytics Lab',         credits:1, reqType:'ELECTIVE', pool:'SPEC2_MLDS',   track:'MLDS',   specLevel:2, prereq:['CSE 441'] },

            /* Network & System */
            { code:'CSE 443', title:'Internet of Things',             credits:3, reqType:'ELECTIVE', pool:'SPEC2_NETSYS', track:'NETSYS', specLevel:2, prereq:['CSE 417'] },
            { code:'CSE 444', title:'Internet of Things Lab',         credits:1, reqType:'ELECTIVE', pool:'SPEC2_NETSYS', track:'NETSYS', specLevel:2, prereq:['CSE 443'] },
            { code:'CSE 445', title:'Cloud Computing',                credits:3, reqType:'ELECTIVE', pool:'SPEC2_NETSYS', track:'NETSYS', specLevel:2, prereq:['CSE 311'] },
            { code:'CSE 446', title:'Cloud Computing Lab',            credits:1, reqType:'ELECTIVE', pool:'SPEC2_NETSYS', track:'NETSYS', specLevel:2, prereq:['CSE 445'] },
            { code:'CSE 447', title:'Simulation & Modelling',         credits:3, reqType:'ELECTIVE', pool:'SPEC2_NETSYS', track:'NETSYS', specLevel:2, prereq:['CSE 211'] },
            { code:'CSE 448', title:'Simulation & Modelling Lab',     credits:1, reqType:'ELECTIVE', pool:'SPEC2_NETSYS', track:'NETSYS', specLevel:2, prereq:['CSE 447'] },
            { code:'CSE 449', title:'Robotics',                       credits:3, reqType:'ELECTIVE', pool:'SPEC2_NETSYS', track:'NETSYS', specLevel:2, prereq:['CSE 303'] },
            { code:'CSE 450', title:'Robotics Lab',                   credits:1, reqType:'ELECTIVE', pool:'SPEC2_NETSYS', track:'NETSYS', specLevel:2, prereq:['CSE 449'] },
            { code:'CSE 451', title:'Blockchain',                     credits:3, reqType:'ELECTIVE', pool:'SPEC2_NETSYS', track:'NETSYS', specLevel:2, prereq:['CSE 311'] },
            { code:'CSE 452', title:'Blockchain Lab',                 credits:1, reqType:'ELECTIVE', pool:'SPEC2_NETSYS', track:'NETSYS', specLevel:2, prereq:['CSE 451'] },

            /* Software Systems */
            { code:'CSE 453', title:'Software Testing and Quality Assurance',     credits:3, reqType:'ELECTIVE', pool:'SPEC2_SOFTSYS',track:'SOFTSYS',specLevel:2, prereq:['CSE 313'] },
            { code:'CSE 454', title:'Software Testing and Quality Assurance Lab', credits:1, reqType:'ELECTIVE', pool:'SPEC2_SOFTSYS',track:'SOFTSYS',specLevel:2, prereq:['CSE 453'] },
            { code:'CSE 455', title:'Software Maintenance and Management',        credits:3, reqType:'ELECTIVE', pool:'SPEC2_SOFTSYS',track:'SOFTSYS',specLevel:2, prereq:['CSE 313'] },
            { code:'CSE 456', title:'Software Maintenance and Management Lab',    credits:1, reqType:'ELECTIVE', pool:'SPEC2_SOFTSYS',track:'SOFTSYS',specLevel:2, prereq:['CSE 455'] }
          ]
        }
      ] /* end groups */
    },

    231: {
      name: 'CSE Syllabus 231',
      groups: [
        {
          name: 'Remedial',
          coursesNeeded: 0, creditsNeeded: 0,
          courses: [
            { code:'ESP 009', title:'English for Academic Purpose (Optional)', credits:0, reqType:'REMEDIAL', prereq:[] },
            { code:'MAT 009', title:'Remedial Math Course',                    credits:0, reqType:'REMEDIAL', prereq:[] }
          ]
        },
        {
          name: 'PSD',
          coursesNeeded: 1, creditsNeeded: 0,
          courses: [
            { code:'PSD 400', title:'Professional Life Skills Development (PLSD)', credits:0, reqType:'MANDATORY', prereq:[] },
          ]
        },
        {
          name: 'EAP',
          coursesNeeded: 2, creditsNeeded: 5,
          courses: [
            { code:'ESP 101', title:'English for Academic Purpose I', credits:3, reqType:'MANDATORY', prereq:[] },
            { code:'ESP 401', title:'Professional English',           credits:2, reqType:'MANDATORY', prereq:[] },
          ]
        },
        {
          name: 'Science',
          coursesNeeded: 5, creditsNeeded: 11.5,
          courses: [
            { code:'PHY 101', title:'Physics I',     credits:3,   reqType:'MANDATORY', prereq:[] },
            { code:'CHE 101', title:'Chemistry',     credits:3,   reqType:'MANDATORY', prereq:[] },
            { code:'CHE 102', title:'Chemistry Lab', credits:1,   reqType:'MANDATORY', prereq:[] },
            { code:'PHY 103', title:'Physics II',    credits:3,   reqType:'MANDATORY', prereq:[] },
            { code:'PHY 104', title:'Physics Lab',   credits:1.5, reqType:'MANDATORY', prereq:[] },
          ]
        },
        {
          name: 'MAT',
          coursesNeeded: 4, creditsNeeded: 12,
          courses: [
            { code:'MAT 101', title:'Calculus for Computing',                     credits:3, reqType:'MANDATORY', prereq:[] },
            { code:'MAT 103', title:'Linear Algebra and Vector Analysis',         credits:3, reqType:'MANDATORY', prereq:['MAT 101'] },
            { code:'MAT 201', title:'Differential Equations and Coordinate Geometry', credits:3, reqType:'MANDATORY', prereq:['MAT 101'] },
            { code:'MAT 203', title:'Probability and Statistics for Computing',   credits:3, reqType:'MANDATORY', prereq:['MAT 101'] },
          ]
        },
        {
          name: 'EEE',
          coursesNeeded: 5, creditsNeeded: 11,
          courses: [
            { code:'EEE 101', title:'Introduction to Electrical Engineering',                     credits:3, reqType:'MANDATORY', prereq:[] },
            { code:'EEE 102', title:'Introduction to Electrical Engineering Lab',                 credits:1, reqType:'MANDATORY', prereq:[] },
            { code:'EEE 201', title:'Electronic Devices, Circuits and Pulse Techniques',          credits:3, reqType:'MANDATORY', prereq:['EEE 101'] },
            { code:'EEE 202', title:'Electronic Devices, Circuits and Pulse Techniques Lab',      credits:1, reqType:'MANDATORY', prereq:['EEE 101'] },
            { code:'EEE 301', title:'Electrical Drives and Instrumentations',                     credits:3, reqType:'MANDATORY', prereq:['EEE 201'] },
          ]
        },
        {
          name: 'GED-MANDATORY',
          coursesNeeded: 3, creditsNeeded: 6,
          courses: [
            { code:'GED 103', title:'Functional Bengali',                         credits:2, reqType:'MANDATORY', prereq:[] },
            { code:'GED 301', title:'History of Emergence of Bangladesh',         credits:2, reqType:'MANDATORY', prereq:[] },
            { code:'GED 407', title:'Professional Ethics and Environmental Protection', credits:2, reqType:'MANDATORY', prereq:[] },
          ]
        },
        {
          name: 'GED-Social-Science-I',
          coursesNeeded: 1, creditsNeeded: 3,
          courses: [
            { code:'GED 201', title:'Financial and Managerial Accounting', credits:3, reqType:'ELECTIVE', pool:'SOCSCI1', prereq:[] },
            { code:'GED 203', title:'Sociology',                           credits:3, reqType:'ELECTIVE', pool:'SOCSCI1', prereq:[] },
            { code:'GED 205', title:'Engineering Economics',               credits:3, reqType:'ELECTIVE', pool:'SOCSCI1', prereq:[] },
          ]
        },
        {
          name: 'GED-Business',
          coursesNeeded: 1, creditsNeeded: 3,
          courses: [
            { code:'GED 401', title:'Business Communication',              credits:3, reqType:'ELECTIVE', pool:'BUSINESS', prereq:[] },
            { code:'GED 403', title:'Industrial and Operational Management',credits:3, reqType:'ELECTIVE', pool:'BUSINESS', prereq:[] },
            { code:'GED 405', title:'Technology Entrepreneurship',         credits:3, reqType:'ELECTIVE', pool:'BUSINESS', prereq:[] },
          ]
        },

        {
          name: 'CSE-MANDATORY',
          coursesNeeded: 34, creditsNeeded: 74,
          courses: [
            { code:'CSE 100', title:'Computational Thinking and Problem Solving', credits:1.5, reqType:'MANDATORY', prereq:[] },
            { code:'CSE 101', title:'Discrete Mathematics',                      credits:3,   reqType:'MANDATORY', prereq:[] },
            { code:'CSE 103', title:'Structured Programming',                    credits:3,   reqType:'MANDATORY', prereq:[] },
            { code:'CSE 104', title:'Structured Programming Lab',                credits:1.5, reqType:'MANDATORY', prereq:['CSE 103'] },
            { code:'CSE 201', title:'Object Oriented Programming',               credits:3,   reqType:'MANDATORY', prereq:['CSE 103'] },
            { code:'CSE 202', title:'Object Oriented Programming Lab',           credits:1.5, reqType:'MANDATORY', prereq:['CSE 201'] },
            { code:'CSE 203', title:'Digital Logic Design',                      credits:3,   reqType:'MANDATORY', prereq:[] },
            { code:'CSE 204', title:'Digital Logic Design Lab',                  credits:1,   reqType:'MANDATORY', prereq:['CSE 203'] },
            { code:'CSE 205', title:'Data Structures',                           credits:3,   reqType:'MANDATORY', prereq:['CSE 103'] },
            { code:'CSE 206', title:'Data Structures Lab',                       credits:1.5, reqType:'MANDATORY', prereq:['CSE 205'] },
            { code:'CSE 207', title:'Algorithms',                                credits:3,   reqType:'MANDATORY', prereq:['CSE 205'] },
            { code:'CSE 208', title:'Algorithms Lab',                            credits:1.5, reqType:'MANDATORY', prereq:['CSE 207'] },
            { code:'CSE 209', title:'Database System',                           credits:3,   reqType:'MANDATORY', prereq:['CSE 205'] },
            { code:'CSE 210', title:'Database System Lab',                       credits:1.5, reqType:'MANDATORY', prereq:['CSE 209'] },
            { code:'CSE 211', title:'Computer Architecture',                     credits:3,   reqType:'MANDATORY', prereq:['CSE 203'] },
            { code:'CSE 301', title:'Web Programming',                           credits:3,   reqType:'MANDATORY', prereq:['CSE 209'] },
            { code:'CSE 302', title:'Web Programming Lab',                       credits:1.5, reqType:'MANDATORY', prereq:['CSE 301'] },
            { code:'CSE 303', title:'Microprocessors & Microcontrollers',        credits:3,   reqType:'MANDATORY', prereq:['CSE 203'] },
            { code:'CSE 304', title:'Microprocessors & Microcontrollers Lab',    credits:1,   reqType:'MANDATORY', prereq:['CSE 303'] },
            { code:'CSE 305', title:'Information System and Design',             credits:3,   reqType:'MANDATORY', prereq:['CSE 313'] },
            { code:'CSE 308', title:'Design Project I',                          credits:1.5, reqType:'MANDATORY', prereq:[] },
            { code:'CSE 313', title:'Software Engineering',                      credits:3,   reqType:'MANDATORY', prereq:['CSE 205'] },
            { code:'CSE 315', title:'Artificial Intelligence',                   credits:3,   reqType:'MANDATORY', prereq:['CSE 201'] },
            { code:'CSE 316', title:'Artificial Intelligence Lab',               credits:1.5, reqType:'MANDATORY', prereq:['CSE 315'] },
            { code:'CSE 317', title:'Computer Networking',                       credits:3,   reqType:'MANDATORY', prereq:['CSE 205'] },
            { code:'CSE 318', title:'Computer Networking Lab',                   credits:1.5, reqType:'MANDATORY', prereq:['CSE 317'] },
            { code:'CSE 320', title:'Design Project II',                         credits:1.5, reqType:'MANDATORY', prereq:['CSE 308'] },
            { code:'CSE 401', title:'Operating System',                          credits:3,   reqType:'MANDATORY', prereq:['CSE 207'] },
            { code:'CSE 402', title:'Operating System Lab',                      credits:1.5, reqType:'MANDATORY', prereq:['CSE 401'] },
            { code:'CSE 403', title:'Machine Learning',                          credits:3,   reqType:'MANDATORY', prereq:['CSE 315'] },
            { code:'CSE 404', title:'Machine Learning Lab',                      credits:1.5, reqType:'MANDATORY', prereq:['CSE 403'] },
            { code:'CSE 458', title:'Internships',                               credits:3,   reqType:'MANDATORY', prereq:[] },
            { code:'CSE 400A',title:'Final Year Project/Thesis',                 credits:3,   reqType:'MANDATORY', prereq:[] },
            { code:'CSE 400B',title:'Final Year Project/Thesis',                 credits:3,   reqType:'MANDATORY', prereq:['CSE 400A'] },
          ]
        },
        {
          name: 'CSE-Optional-I',
          coursesNeeded: 2, creditsNeeded: 4,
          courses: [
            { code:'CSE 309', title:'Compiler',               credits:3, reqType:'ELECTIVE', pool:'OPTIONAL_I', prereq:['CSE 201'] },
            { code:'CSE 310', title:'Compiler Lab',           credits:1, reqType:'ELECTIVE', pool:'OPTIONAL_I', prereq:['CSE 309'] },
            { code:'CSE 311', title:'Data Communication',     credits:3, reqType:'ELECTIVE', pool:'OPTIONAL_I', prereq:['CSE 317'] },
            { code:'CSE 312', title:'Data Communication Lab', credits:1, reqType:'ELECTIVE', pool:'OPTIONAL_I', prereq:['CSE 311'] },
          ]
        },
        {
          name: 'CSE-Optional-II',
          coursesNeeded: 1, creditsNeeded: 3,
          courses: [
            { code:'CSE 321', title:'Human Computer Interaction',                 credits:3, reqType:'ELECTIVE', pool:'OPTIONAL_II', prereq:['CSE 313'] },
            { code:'CSE 323', title:'Computer and Cyber Security',                credits:3, reqType:'ELECTIVE', pool:'OPTIONAL_II', prereq:['CSE 317'] },
            { code:'CSE 325', title:'Mathematical Analysis for Computer Science', credits:3, reqType:'ELECTIVE', pool:'OPTIONAL_II', prereq:['MAT 103'] },
            { code:'CSE 327', title:'Digital System Design',                       credits:3, reqType:'ELECTIVE', pool:'OPTIONAL_II', prereq:['CSE 211'] },
          ]
        },
        {
          name: 'CSE-Specialization-I',
          coursesNeeded: 2, creditsNeeded: 4,
          courses: [
            /* Theoretical CS */
            { code:'CSE 407', title:'Graph Theory',              credits:3, reqType:'ELECTIVE', pool:'SPEC1_TCS',  track:'TCS',  specLevel:1, prereq:['CSE 101'] },
            { code:'CSE 408', title:'Graph Theory Lab',          credits:1, reqType:'ELECTIVE', pool:'SPEC1_TCS',  track:'TCS',  specLevel:1, prereq:['CSE 407'] },
            { code:'CSE 409', title:'Algorithm Engineering',     credits:3, reqType:'ELECTIVE', pool:'SPEC1_TCS',  track:'TCS',  specLevel:1, prereq:['CSE 207'] },
            { code:'CSE 410', title:'Algorithm Engineering Lab', credits:1, reqType:'ELECTIVE', pool:'SPEC1_TCS',  track:'TCS',  specLevel:1, prereq:['CSE 409'] },

            /* Data Science */
            { code:'CSE 413', title:'Natural Language Processing',     credits:3, reqType:'ELECTIVE', pool:'SPEC1_MLDS', track:'MLDS', specLevel:1, prereq:['CSE 403'] },
            { code:'CSE 414', title:'Natural Language Processing Lab', credits:1, reqType:'ELECTIVE', pool:'SPEC1_MLDS', track:'MLDS', specLevel:1, prereq:['CSE 413'] },
            { code:'CSE 415', title:'Digital Image Processing',        credits:3, reqType:'ELECTIVE', pool:'SPEC1_MLDS', track:'MLDS', specLevel:1, prereq:['CSE 315'] },
            { code:'CSE 416', title:'Digital Image Processing Lab',    credits:1, reqType:'ELECTIVE', pool:'SPEC1_MLDS', track:'MLDS', specLevel:1, prereq:['CSE 415'] },

            /* Network & Systems */
            { code:'CSE 417', title:'Wireless Networks',         credits:3, reqType:'ELECTIVE', pool:'SPEC1_NETSYS', track:'NETSYS', specLevel:1, prereq:['CSE 317'] },
            { code:'CSE 418', title:'Wireless Networks Lab',     credits:1, reqType:'ELECTIVE', pool:'SPEC1_NETSYS', track:'NETSYS', specLevel:1, prereq:['CSE 417'] },
            { code:'CSE 421', title:'VLSI Design',               credits:3, reqType:'ELECTIVE', pool:'SPEC1_NETSYS', track:'NETSYS', specLevel:1, prereq:['CSE 211'] },
            { code:'CSE 422', title:'VLSI Design Lab',           credits:1, reqType:'ELECTIVE', pool:'SPEC1_NETSYS', track:'NETSYS', specLevel:1, prereq:['CSE 421'] },

            /* Software Systems */
            { code:'CSE 425', title:'Mobile Application Development',      credits:3, reqType:'ELECTIVE', pool:'SPEC1_SOFTSYS', track:'SOFTSYS', specLevel:1, prereq:['CSE 201'] },
            { code:'CSE 426', title:'Mobile Application Development Lab',  credits:1, reqType:'ELECTIVE', pool:'SPEC1_SOFTSYS', track:'SOFTSYS', specLevel:1, prereq:['CSE 425'] },
            { code:'CSE 427', title:'Software Design Pattern',             credits:3, reqType:'ELECTIVE', pool:'SPEC1_SOFTSYS', track:'SOFTSYS', specLevel:1, prereq:['CSE 313'] },
            { code:'CSE 428', title:'Software Design Pattern Lab',         credits:1, reqType:'ELECTIVE', pool:'SPEC1_SOFTSYS', track:'SOFTSYS', specLevel:1, prereq:['CSE 427'] },
          ]
        },
        {
          name: 'CSE-Specialization-II',
          coursesNeeded: 1, creditsNeeded: 3,
          courses: [
            /* Theoretical CS */
            { code:'CSE 429', title:'Bioinformatics',            credits:3, reqType:'ELECTIVE', pool:'SPEC2_TCS',  track:'TCS',  specLevel:2, prereq:['CSE 315'] },
            { code:'CSE 431', title:'Computational Geometry',    credits:3, reqType:'ELECTIVE', pool:'SPEC2_TCS',  track:'TCS',  specLevel:2, prereq:['CSE 207'] },
            { code:'CSE 433', title:'Computer Graphics',         credits:3, reqType:'ELECTIVE', pool:'SPEC2_TCS',  track:'TCS',  specLevel:2, prereq:['CSE 303'] },

            /* Data Science */
            { code:'CSE 435', title:'Data Mining',               credits:3, reqType:'ELECTIVE', pool:'SPEC2_MLDS', track:'MLDS', specLevel:2, prereq:['CSE 403'] },
            { code:'CSE 437', title:'Information Retrieval',     credits:3, reqType:'ELECTIVE', pool:'SPEC2_MLDS', track:'MLDS', specLevel:2, prereq:['CSE 313'] },
            { code:'CSE 439', title:'Pattern Recognition',       credits:3, reqType:'ELECTIVE', pool:'SPEC2_MLDS', track:'MLDS', specLevel:2, prereq:['CSE 315'] },
            { code:'CSE 441', title:'Big Data Analytics',        credits:3, reqType:'ELECTIVE', pool:'SPEC2_MLDS', track:'MLDS', specLevel:2, prereq:['CSE 435'] },

            /* Network & Systems */
            { code:'CSE 443', title:'Internet of Things',        credits:3, reqType:'ELECTIVE', pool:'SPEC2_NETSYS', track:'NETSYS', specLevel:2, prereq:['CSE 417'] },
            { code:'CSE 445', title:'Cloud Computing',           credits:3, reqType:'ELECTIVE', pool:'SPEC2_NETSYS', track:'NETSYS', specLevel:2, prereq:['CSE 317'] },
            { code:'CSE 447', title:'Simulation and Modelling',  credits:3, reqType:'ELECTIVE', pool:'SPEC2_NETSYS', track:'NETSYS', specLevel:2, prereq:['CSE 211'] },
            { code:'CSE 449', title:'Robotics',                  credits:3, reqType:'ELECTIVE', pool:'SPEC2_NETSYS', track:'NETSYS', specLevel:2, prereq:['CSE 303'] },
            { code:'CSE 451', title:'Blockchain',                credits:3, reqType:'ELECTIVE', pool:'SPEC2_NETSYS', track:'NETSYS', specLevel:2, prereq:['CSE 317'] },

            /* Software Systems */
            { code:'CSE 453', title:'Software Testing and Quality Assurance', credits:3, reqType:'ELECTIVE', pool:'SPEC2_SOFTSYS', track:'SOFTSYS', specLevel:2, prereq:['CSE 313'] },
            { code:'CSE 455', title:'Software Maintenance and Reengineering',  credits:3, reqType:'ELECTIVE', pool:'SPEC2_SOFTSYS', track:'SOFTSYS', specLevel:2, prereq:['CSE 313'] },
          ]
        },
      ]
    }
  });
})();