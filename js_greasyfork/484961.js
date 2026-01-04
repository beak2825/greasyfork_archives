// ==UserScript==
// @name         Coursera Auto Fill Answer
// @namespace    https://github.com/DemonDucky
// @version      1.0.0
// @description  Auto fill answer quizz
// @author       DemonDucky
// @match        https://www.coursera.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coursera.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484961/Coursera%20Auto%20Fill%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/484961/Coursera%20Auto%20Fill%20Answer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const fullData = [
    {
      question: 'What is the mechanism through which IT governance affects firm performance?',
      answer: 'IT governances impacts IT-Business Alignment, and IT-Business Alignment impacts Firm Performance.'
    },
    {
      question:
        'If a company has a well functioning IT steering committee, the company is more likely to achieve IT-Business alignment?',
      answer: 'True'
    },
    {
      question: 'IT governance leads to?',
      answer: 'All of the above.'
    },
    {
      question: 'IT governance includes choices about?',
      answer: 'All of the above.'
    },
    {
      question:
        'If a company is primarily interested in IT-enabled innovation and differentiation, the _________ is the most appropriate decision making structure.',
      answer: 'Feudal'
    },
    {
      question: 'An IT investment approval process is used to describe:',
      answer: 'All of the above.'
    },
    {
      question: 'What is a key managerial IT governance decision?',
      answer: 'IT Principle'
    },
    {
      question:
        'If a company competes on the basis of differentiation, then the CIO should ideally report to the ____________.',
      answer: 'CEO'
    },
    {
      question:
        'The IT steering committee is a key IT governance decision making structure. The primary role of this decision making structure is to:',
      answer: 'Define IT principles.'
    },
    {
      question: 'In the replication operating model, firms share data across different business units?',
      answer: 'False'
    },
    {
      question:
        'The rationalized data/optimized core stage of the enterprise IT architecture would be appropriate for a firm operating with the replication model?',
      answer: 'True'
    },
    {
      question:
        'A distinctive feature of the rationalized data/optimized core stage of the enterprise IT architecture is:',
      answer: 'Standardized business processes across the organization.'
    },
    {
      question:
        'A distinctive governance mechanism in the rationalized data /optimized core stage of enterprise IT architecture is:',
      answer: 'Enterprise-wide process owners.'
    },
    {
      question:
        'In which operating model do firms standardize business processes and share data across business units?',
      answer: 'Unification.'
    },
    {
      question: 'The evolution of enterprise IT architecture follows this sequence.',
      answer: 'Application Silo, Standardized Technology, Rationalized Data/Optimized Core, Modular Architecture.'
    },
    {
      question: 'A distinctive feature of the modularity stage of the enterprise IT architecture is:',
      answer: 'Experiments to meet local needs.'
    },
    {
      question:
        'The key strategic implication of the rationalized data / optimized core stage of enterprise IT architecture is?',
      answer: 'Operational efficiency.'
    },
    {
      question:
        'This type of estimate requires understanding of the work packages (units of work) that have to be executed to complete the project.',
      answer: 'Definitive.'
    },
    {
      question:
        'In calculating the environmental complexity factor, if a factor (e.g., stability of requirements) has higher assigned value then that factor increases the environmental complexity factor:',
      answer: 'False'
    },
    {
      question: 'IT systems often create strategic benefits. Strategic benefits are generally ________.',
      answer: 'Intangible.'
    },
    {
      question:
        'In the use case method a complex actor has higher impact on the final use case point compared to a less complex use case.',
      answer: 'True'
    },
    {
      question:
        'In the use case point method of software cost estimation, a higher/larger number for the productivity factor means the developer takes more time to code one use case point, thus the developer is less productive:',
      answer: 'True'
    },
    {
      question:
        'IT systems often create intangible benefits. These intangible benefits are reflected in the __________ of the firm?',
      answer: 'Market value.'
    },
    {
      question:
        'An IT system is implemented, even when it has a negative NPV, because the system allows other follow on projects. This is an example of _________ ?',
      answer: 'Growth option.'
    },
    {
      question: 'Process improvement projects are appropriately evaluated using __________ .',
      answer: 'NPV based business case.'
    },
    {
      question:
        'Large system implementations often require cooperation customers and/or supplier? This is an example of _______________ risk.',
      answer: 'Market.'
    },
    {
      question:
        'An IT system is being implemented as it has a positive NPV. However, during system development, regulations change and the project no longer has a positive NPV. The real options approach would suggest _________ ?',
      answer: 'Terminate the project and reallocate resources to a more profitable project.'
    },
    {
      question: 'Transformation projects are appropriately evaluated using __________ .',
      answer: 'Real Options analysis.'
    },
    {
      question:
        'Project Management is about doing the right projects, whereas Portfolio Management is about doing projects right.',
      answer: 'False'
    },
    {
      question: 'An innovation focused firm spends more on __________ compared to the average firm.',
      answer: 'Strategic systems'
    },
    {
      question: 'Information Technology Portfolio Management is more important for firms that:',
      answer: 'Execute multiple projects in a given year.'
    },
    {
      question: 'Strategic systems are about?',
      answer: 'Providing competitive advantage or reducing competitive disadvantage.'
    },
    {
      question: 'Which element of the IT investment portfolio is about the long-term strategy of the firm?',
      answer: 'Firm wide infrastructure'
    },
    {
      question:
        "In the service center approach to IT chargeback, IT units offer services for a price where the price is set to recover the IT unit's costs of providing the service.",
      answer: 'True'
    },
    {
      question: 'The main advantage of the service center approach to IT chargeback is __________.',
      answer: 'The incentives for users to consume IT services prudently.'
    },
    {
      question:
        'If the IT and the user organizations understand IT costs because of the IT chargeback system in place, then the IT chargeback system is likely to lead to better IT decisions.',
      answer: 'True'
    },
    {
      question:
        'In the profit center approach to IT chargeback, IT units offer services for a price where the price is set based on the market price for the same service.',
      answer: 'True'
    },
    {
      question:
        'If the IT chargeback system suggests that the IT organization has been continuously reducing the price for an IT service and the price charged compares favorably with the market price for the service, then the IT chargeback system is likely to lead to a higher reputation for competence for the IT organization.',
      answer: 'True'
    },
    {
      question:
        'If users believe that leaning to use the new information system is going to cost significant time and effort on their part, it is rational on their part to resist the implementation of the new system.',
      answer: 'True'
    },
    {
      question:
        'In the demand driven model of user adoption, if a user believes that many other users are adopting the new system, they are less likely to themselves adopt the new system.',
      answer: 'False'
    },
    {
      question:
        'Top management support is more important in information systems implementations when task interdependence is low than when task interdependence is high.',
      answer: 'False'
    },
    {
      question:
        'If users have invested significant time and effort to learn and master using the current system, they are more likely to resist the implementation of a new system:',
      answer: 'True'
    },
    {
      question:
        'In the supply driven model of user adoption, institutions that remove knowledge barriers reduce the adoption of new systems.',
      answer: 'False'
    },
    {
      question:
        'Users find it easier to learn from and solve problems with the help of peers and coworkers than with help form external consultants and the internal help desk.',
      answer: 'True'
    },
    {
      question: 'The evolutionary approach uses ______ to implement a new system.',
      answer: 'Flexible milestones'
    },
    {
      question: 'The role of management in the learning approach to implementing a new system emphasizes:',
      answer: 'Creating an environment where new capabilities are developed and knowledge is shared.'
    },
    {
      question:
        'In the learning approach to implementing a new system, users are more likely to learn to use the new system from ____________________.',
      answer: 'Self discovery and from peers.'
    },
    {
      question:
        'The use of outsiders and new management team is more appropriate for the implementation of ___________.',
      answer: 'Revolutionary change.'
    },
    {
      question:
        'In what deliverable does a PM identify phases & deliverables, create WBS, estimate tasks, create dependencies, and assign people to tasks?',
      answer: 'Work Plan'
    },
    {
      question: 'Which of the following diagrams can be used to document a business process?',
      answer: 'All of the above'
    },
    {
      question: 'What diagram includes a system, external entities, processes, boundaries, inputs, and outputs?',
      answer: 'Context diagram'
    },
    {
      question: 'What are the four phases of SDLC methodology in order?',
      answer: 'Plan, Analyze, Design, Implement'
    },
    {
      question: 'What differentiates RAD from Waterfall?',
      answer: 'Iteration'
    },
    {
      question: 'What differentiates Agile from Waterfall?',
      answer: 'Iteratively delivers features via sprints'
    },
    {
      question: 'In what phase(s) of SDLC does an ideal Business Analyst contribute?',
      answer: 'All of the above'
    },
    {
      question: 'In what phase(s) is a System Request document introduced?',
      answer: 'Plan'
    },
    {
      question: 'What does a feasibility analysis focus on?',
      answer: 'None of the above'
    },
    {
      question: 'In what phase of SDLC methodology does Organizational Readiness occur?',
      answer: 'All of the above'
    },
    {
      question: 'What phase of the SDLC results in a System Proposal?',
      answer: 'Analyze'
    },
    {
      question: 'Which of the following is NOT a desirable quality of a good requirement?',
      answer: 'Multiple'
    },
    {
      question: 'Which of the following is a good sample syntax for writing a good requirement.',
      answer: '[Condition] [Subject] [Action] [Object] [Constraint]'
    },
    {
      question: 'Which of the following is a good sample syntax for writing a good requirement.',
      answer: '[Condition] [Action or Constraint] [Value]'
    },
    {
      question: 'Functional requirements are usually discussed with subject-matter experts.',
      answer: 'True'
    },
    {
      question: 'Non-functional requirements are usually discussed with developers.',
      answer: 'True'
    },
    {
      question:
        'Which traceability method identifies the gold-plating example given at the beginning of the module video?',
      answer: 'Forward Traceability'
    },
    {
      question: 'In what phase of SDLC methodology do we write use cases?',
      answer: 'Analyze'
    },
    {
      question: 'In a use case, what level of detail has exhaustive, numbered steps with data flows?',
      answer: 'Fully-dressed'
    },
    {
      question: 'What are the two major types of relationships among use cases?',
      answer: '<<extend>> <<include>>'
    },
    {
      question: 'When balancing DFDs and ERDs, what will data stores & some external entities become in an ERD?',
      answer: 'Entities'
    },
    {
      question: 'When balancing DFDs and ERDs, what will data flows become in an ERD?',
      answer: 'Attributes'
    },
    {
      question: 'What are the elements of a DFD?',
      answer: 'Process, data flow, data store, external entity'
    },
    {
      question: 'What differentiates a context diagram from a process flow diagram?',
      answer:
        'Context diagram depicts data flows, sequences of events are not depicted. Process flow depicts the process. Non-data elements are included. Sequence matters.'
    },
    {
      question: 'What DFD type focuses on the business and business activities?',
      answer: 'Logical DFD'
    },
    {
      question: 'How can a DFD be decomposed into a primitive?',
      answer: 'Through structured english, decision tree, or decision table'
    },
    {
      question: 'Business Process Model and Notation includes which of the following components?',
      answer: 'A start event, sequence flow, task, gateway "decision", and end event'
    },
    {
      question:
        'What refers to the maximum number of times an instance in one entity can be associated with instances in the related entity?',
      answer: 'Cardinality'
    },
    {
      question: 'What type of entity instances store attributes that are common to one or more entity subtypes?',
      answer: 'Supertype'
    },
    {
      question: 'What type of entity instances may inherit common attributes from its entity supertype?',
      answer: 'Subtype'
    },
    {
      question:
        'In Object-Oriented Programming, an object is kind of person, place, event, or thing about which we want to capture.',
      answer: 'False'
    },
    {
      question:
        'An application for a fast food chain models each user with a class. Any user can apply a 5% off coupon code when ordering a meal above $10 (represented by a class labelled User), however users that pay a monthly fee can also apply a 10% off coupon code when ordering any menu item from the store and are represented by a subclass of User labeled specialUser. Is this an example of inheritance?',
      answer: 'Yes'
    },
    {
      question: 'Which of the following is false?',
      answer:
        'In a state machine diagram, various states of an object in a program are represented by arrows throughout the diagram.'
    },
    {
      question: 'Which of the following is true about acquisition strategies?',
      answer:
        'One of the drawbacks to outsourcing software development is that it is harder to control the quality of the design and ensure that it meets the necessary requirements.'
    },
    {
      question: 'Which is the best way to describe an Alternative Matrix?',
      answer:
        "The scores of an Alternative Matrix should only be considered as a factor in the decision-making process for a firm, and should be weighed against other external criteria by an experienced leader responsible for the system's development."
    },
    {
      question:
        'Online retailers frequently implement systems that recommend other products to customers based on their previous purchase history, what time of year they made the purchase, what other customers frequently bought in addition to the customers purchase, and other data relating to the purchase. This is an example of:',
      answer: 'Business Intelligence Architecture'
    },
    {
      question: 'The best implementation might be a human implementation of a physical process.',
      answer: 'True'
    },
    {
      question: 'Which of the following is the definition of "scope creep"?',
      answer:
        'When additional features are requested during the implementation phase of a project, thus increasing the cost and time required to complete said project.'
    },
    {
      question: 'The Business Analyst is involved with preparing the technology during the migration plan.',
      answer: 'False'
    },
    {
      question: 'The Maintenance phase in the SDLC described in this course is the longest and costliest phase.',
      answer: 'True'
    },
    {
      question: 'What are some of the roles of the Project Manager during ERP implementation?',
      answer: 'A and B only'
    },
    {
      question: 'All Fortune 1000 companies use some form of ERP systems.',
      answer: 'True'
    },
    {
      question: 'Business processes are activities that businesses do in their daily operations.',
      answer: 'True'
    },
    {
      question: 'What are some difficulties faced when executing business processes?',
      answer: 'B and C only'
    },
    {
      question: 'Why do silo effect arise?',
      answer: 'A and B only'
    },
    {
      question: 'Question 6',
      answer: 'B and C only'
    },
    {
      question: "'R' in SAP R/3 stands for 'real-time'.",
      answer: 'True'
    },
    {
      question: 'What are the three layers in SAP R/3?',
      answer: 'Database, Application, Presentation'
    },
    {
      question: 'Data created in SAP can be deleted easily.',
      answer: 'False'
    },
    {
      question: 'Users can access SAP via the following devices:',
      answer: 'All of above'
    },
    {
      question: 'Which of the following are organizational data?',
      answer: 'All of the above'
    },
    {
      question: 'Fields of master data change frequently.',
      answer: 'False'
    },
    {
      question: 'Fields of master data can be different across organizational units (e.g., plants).',
      answer: 'True'
    },
    {
      question: 'Within SAP, how many main types of data are there?',
      answer: '3'
    },
    {
      question: 'A unique sale area is made up by a combination of',
      answer: 'Sales organization, distribution channel, Division'
    },
    {
      question: 'Why would companies want to have different sales areas in SAP?',
      answer: 'All of above'
    },
    {
      question: 'What are instances of master data seen in the class?',
      answer: 'Customer'
    },
    {
      question: 'Purchase order is an example of a master data.',
      answer: 'False'
    },
    {
      question:
        'The good issue step is performed to indicate that a focal company has fulfilled their part of the transaction by shipping goods to the customer.',
      answer: 'True'
    },
    {
      question: 'What are possible scenarios in which delivery and billing documents are combined?',
      answer: 'A and C only'
    },
    {
      question: 'The SAP All-in-One ERP solution is good for large enterprises.',
      answer: 'False'
    },
    {
      question: 'What is true of the SAP By-Design ERP?',
      answer: 'A and C only'
    },
    {
      question: 'Which of the following are offerings provided by Oracle?',
      answer: 'B and C only'
    },
    {
      question: 'According to the Clash of Titan report presented in the video, which ERP vendor has the market share?',
      answer: 'SAP'
    },
    {
      question:
        'Completion of vision in the magic quadrant refers to whether a ERP vendor/provider has a good understanding of the industry to provide ERP features that meets their future needs.',
      answer: 'True'
    },
    {
      question:
        'If my company has many specialized and sophisticated business processes, and is operating in a business environment causes rapid changes to business needs, what type of ERP should I shortlist based on the magic quadrant?',
      answer: 'Leaders'
    },
    {
      question:
        'If I run a simple business that does not have complicated business processes and is not subjected to rapid changes in the business environment, I should shortlist ERPs from the _________ quadrant.',
      answer: 'Niche Players'
    },
    {
      question: 'If a company buys all its ERP module from a single vendor, it is said to be pursuing a',
      answer: 'Best of Suite Strategy'
    },
    {
      question: 'What are the advantages of using a Best of Suite Strategy?',
      answer: 'A and B only'
    },
    {
      question: 'What are the advantages of using a Best of Breed Strategy?',
      answer: 'It provides the best features across all ERP offerings'
    },
    {
      question:
        "In the opening case of Target's ERP implementation, what were the bad managerial decisions made that led to a failed outcome?",
      answer: 'All of above'
    },
    {
      question: 'Change Management is:',
      answer: 'A and B only'
    },
    {
      question:
        'When assessing the possible areas of changes during an ERP implementation, it is important to consider elements of',
      answer: 'All of above'
    },
    {
      question:
        'Constant communication of project benefits to the users and a clear illustration of milestones are useful change management techniques for keeping motivation levels high during ERP implementation.',
      answer: 'True'
    },
    {
      question:
        'Workers do not need time to adjust to newly implemented ERP if they are well-trained to use the new system prior to its launch.',
      answer: 'False'
    },
    {
      question: 'What are indicators of ERP implementation success?',
      answer: 'All of above.'
    },
    {
      question:
        'A small company with small amount of capital that has finished implementing a small scale ERP system. The consulting team concludes that there are little risk of of go-live problems as the system does not involve complex interdependencies due to its small scale. What might be a good approach in the rollout of this system?',
      answer: 'Big Bang'
    },
    {
      question:
        'A large company with operations in multiple countries has just finished upgrading its legacy system to an Oracle ERP system. The consultant team believes that the risk of go-live problems can be subtantial, given that there are multiple interdependencies across business units. What might be a good approach in the roll out of this system?',
      answer: 'Phased Approach'
    },
    {
      question:
        'A retail company has zero experience with ERP implementation. They have hired an external consultant to help them with the implementation of SAP. The retail company is very amendable to the recommendations provided by their consultants. What role should the consultants take on, in general?',
      answer: 'Commanders'
    },
    {
      question:
        'A client company wanted to implement a large scale ERP system. The project scope appears to be highly uncertain and the client does not seem to know what features are to be included in the final deliverable. What would be a good pricing model to use here when charging the client?',
      answer: 'Time and Material'
    },
    {
      question: 'Businesses can use virtualization technology to:',
      answer: 'All of the above'
    },
    {
      question: 'Why does the opex model (such as pay-as-you-go) work for the cloud providers?',
      answer: 'All of the above'
    },
    {
      question:
        'Which of the following is used to distribute incoming requests among various servers that form a computer cluster?',
      answer: 'Load balancer'
    },
    {
      question: 'Which of the following statements is NOT true for web applications?',
      answer: "Requires virtualization of the client's machine"
    },
    {
      question: 'Which of the following is an example of a hypervisor?',
      answer: 'All of the above'
    },
    {
      question: 'Which is the core technology behind "cloud computing"?',
      answer: 'Virtualization'
    },
    {
      question: "Google's cloud platform offering is a:",
      answer: 'Public cloud'
    },
    {
      question:
        'Which kind of infrastructure will you prefer if you are operating a business in which some applications have to comply with strict regulatory compliance requirements on data security, while others require automated scalability and load balancing?',
      answer: 'Hybrid Cloud'
    },
    {
      question:
        'You are the CIO of a company that wants to create a new software application that would require customizing the operating system for optimal performance. What kind of cloud service are you basically looking for?',
      answer: 'IaaS'
    },
    {
      question: 'Which of the following statements is true for data centers?',
      answer: 'All of the above'
    },
    {
      question: 'Which of the following statements is NOT true?',
      answer: 'Wireless technologies that offer high data speed/rate also offer greater coverage area'
    },
    {
      question: 'Which of the following statements is true about base stations in a cellular network?',
      answer: 'All of the above'
    },
    {
      question:
        'Suppose an airport is using RFID tags on ventilation units for monitoring and reporting of their functional status, PDAs for technicians, and SAP Mobile Asset Management software. Which of the following activities can be achieved using these solutions?',
      answer: 'All of the above'
    },
    {
      question: 'Which of the following will be most useful for enabling wider usage of QR codes?',
      answer: 'Include built-in QR scanner app in the smartphones'
    },
    {
      question: 'Which of the following statements is NOT true about WiFi networks?',
      answer: 'WiFi and cellular networks use the same set of frequencies'
    },
    {
      question: 'Which of the following statements is NOT true about femtocells?',
      answer: 'Existing WiFi or DSL routers can be upgraded to a femtocell without the need for any new hardware'
    },
    {
      question: 'Which of the following pairing of technology to its coverage area is mismatched?',
      answer: 'WiFi - Wirelss Metropolitan Area Network (WMAN)'
    },
    {
      question: 'Which of the following is the primary technology used in a mobile payment system like Apple Pay?',
      answer: 'Near Field Communication (NFC)'
    },
    {
      question:
        'A shopping mall plans to send targeted offers to customers connected to their WiFi network. Which type of data about the customer will be most valuable to send these offers?',
      answer: 'Geolocation'
    },
    {
      question:
        'Which of the following issues cannot be addressed effectively with flat rate pricing of network bandwidth?',
      answer: 'All of the above'
    },
    {
      question: "Denial of service (DOS) security attacks are intended to compromise a system's _______.",
      answer: 'Availability'
    },
    {
      question: 'Which of the following statements is true for malwares?',
      answer: 'All of the above'
    },
    {
      question: 'Which of the following techniques system administrators use to reduce the risk of password hacking?',
      answer: 'Enforcing a cap on the number of password retries at login before the account gets locked'
    },
    {
      question: 'Which of the following statements about basic encryption techniques NOT true?',
      answer:
        'The key used in Caesar cipher should be made publicly available to allow the receiver to decrypt the message'
    },
    {
      question: 'Which of the following statements about private key cryptography is true?',
      answer: 'The same key is used by both the sender and the receiver to encrypt and decrypt a message'
    },
    {
      question: 'Which of the following statements is true for public key cryptosystem?',
      answer:
        'A secret message should be encrypted using the public key of the receiver and decrypted using the private key of the receiver'
    },
    {
      question:
        'In case of digital signatures, which of the following statements will be true? (Digital signatures are not meant to be secret messages, instead they are used to demonstrate that the message must have originated from a particular sender who signed it).',
      answer:
        "The message will need to be encrypted using the sender's private key. Anyone can then use the sender's public key to decrypt it, and thereby verify that it must have been encrypted (signed) by that particular sender."
    },
    {
      question: 'Which of the following statements is NOT true about these cyber defense systems?',
      answer:
        'Intrusion detection systems cannot look inside the contents of the data packets, and therefore only use traffic filtering rules.'
    },
    {
      question: 'Which of the following should be practiced to prevent confidential data loss from cyberattacks?',
      answer: 'All of the above'
    },
    {
      question:
        'The type of disclosure process in which a new bug discovery is first reported to the software vendor whose product contains the bug is known as:',
      answer: 'Responsible Disclosure'
    },
    {
      question: 'Which of the following statements regarding Blockchain is NOT true?',
      answer:
        'Blockchain is designed as a centralized solution so that a single entity can control it and validate all transactions.'
    },
    {
      question: 'Which of the following statements is NOT true?',
      answer: 'The cryptocurrency used in Ethereum are called Bitcoins'
    },
    {
      question: 'Which of the following statements is true?',
      answer: 'All of the above.'
    },
    {
      question: 'Which of the following is NOT true for Bitcoin mining?',
      answer: 'Miners will use the public key to compute the private key of the sender'
    },
    {
      question: 'Which of the following statement is true?',
      answer: 'All of the above.'
    },
    {
      question: 'Which of the following is an application area for smart contracts?',
      answer: 'All of the above.'
    },
    {
      question:
        'Suppose your organization needs multiple people to store and update transaction records while ensuring immutability. Which one should you choose?',
      answer: 'Blockchain'
    },
    {
      question:
        'Suppose the requirements that your organization has in regards to storing transaction information can be met with either a traditional database or a blockchain. Which one should you choose?',
      answer: 'Traditional database'
    },
    {
      question:
        'Suppose your organization needs to store transaction data that should be kept private, immutable, verifiable, but also control who can read and write to it in order to maintain scalability. What should you choose?',
      answer: 'Permissioned blockchain'
    },
    {
      question: 'Which of the following statements is true?',
      answer: 'All of the above.'
    }
  ];

  const formatString = (str) => {
    const regexSymbol = /[^a-zA-Z0-9 ]/g;
    const regexSpace = /[\s,\t,\n]+/;

    return str.trim().replace(regexSymbol, '').split(regexSpace).join(' ').toLowerCase();
  };

  const compareApproximately = (string, subString) => {
    const stringFormatted = formatString(string);
    const subStringFormatted = formatString(subString);

    const singleword = subStringFormatted.split(' ');
    const doubleWorld = singleword.reduce((acc, word, index, arr) => {
      if (arr.length % 2 === 1 && index === arr.length - 1) {
        acc.push(word);
        return acc;
      }

      if (index % 2 === 0) {
        acc.push(`${word} ${arr[index + 1]}`);
      }

      return acc;
    }, []);

    return (
      stringFormatted === subStringFormatted ||
      stringFormatted.includes(subStringFormatted) ||
      doubleWorld.every((word) => stringFormatted.includes(word)) ||
      singleword.every((word) => stringFormatted.includes(word))
    );
  };

  const doubleKeydownEvent = (callback, key1, key2) => {
    const keydownHandler = (e) => {
      if (e.key !== key2) return;
      callback(e);
    };

    document.addEventListener('keydown', (e) => {
      if (e.key !== key1) return;

      document.addEventListener('keydown', keydownHandler);
    });

    document.addEventListener('keyup', (e) => {
      if (e.key !== key2) return;

      document.removeEventListener('keydown', keydownHandler);
    });
  };

  const fillDataQuiz = (keyData) => {
    const allQuestionsForm = document.querySelectorAll('.rc-FormPartsQuestion');
    // let answersFilled = 0;
    const elementToClick = [];

    for (const [index, form] of allQuestionsForm.entries()) {
      // let isClicked = false;
      const csrQuestion = form.children[0]
        .querySelector('.rc-FormPartsQuestion__contentCell div[data-testid=cml-viewer] p')
        .innerText.trim();

      const answersContainer = form.children[1].querySelector(
        '.rc-FormPartsQuestion__contentCell .rc-FormPartsMcq'
      ).children;

      const matched = keyData.filter((key) => {
        return compareApproximately(csrQuestion, key.question);
      });

      const answer = matched.map((key) => key.answer);

      if (answer.length === 0) {
        console.log(`Question ${index + 1} not found`);
        continue;
      }

      const csrAnswers = Array.from(answersContainer).map((answer) => {
        const answerElement = answer.querySelector('div[data-testid=cml-viewer]');
        const answerText = answerElement.innerText;
        return [answerElement, answerText];
      });

      csrAnswers.forEach((csrAnswerContainer) => {
        const [csrAnswerElement, csrAnswerText] = csrAnswerContainer;

        answer.forEach((answer) => {
          if (compareApproximately(csrAnswerText, answer)) {
            elementToClick.push(csrAnswerElement);
            // csrAnswerElement.click();
            // isClicked = true;
          }
        });
      });

      // isClicked && answersFilled++;
    }

    const delay = 700;

    elementToClick.forEach((element, index) => {
      setTimeout(() => {
        element.click();
      }, index * delay);
    });

    if (allQuestionsForm.length <= elementToClick.length) {
      setTimeout(() => {
        document.querySelector('#agreement-checkbox-base').click();
        document.querySelector('button[type=button][data-test=submit-button]').click();
      }, elementToClick.length * delay);
    }
  };

  // const simulateKeyboardInput = (element, textToType) => {
  //   // Simulate typing each character
  //   for (var i = 0; i < textToType.length; i++) {
  //     var char = textToType.charAt(i);
  //     var keyEvent = new KeyboardEvent('keypress', {
  //       key: char,
  //       bubbles: true,
  //       cancelable: true
  //     });
  //     element.dispatchEvent(keyEvent);
  //   }
  // };

  const randomWord = ['Good', 'Excellent', 'Magnificient', 'Cool', 'Awesome', 'Best'];

  const fillFromOptions = (option, delay = 300) => {
    setTimeout(() => {
      switch (option.tagName) {
        case 'DIV':
          {
            const lastChild = option.lastElementChild;
            const label = lastChild.querySelector('label');
            label.click();
          }
          break;
        case 'TEXTAREA': {
          option.value = randomWord[Math.floor(Math.random() * randomWord.length)];
          break;
        }
      }
    }, delay);
  };

  const fillDataPeerReview = () => {
    const allOptions = document.querySelectorAll('div.rc-FormParts .rc-FormPart [aria-describedby*=form-part-label]');
    const allOptionsArray = Array.from(allOptions);
    const delay = 300;

    allOptionsArray.forEach((option, index) => fillFromOptions(option, index * delay));

    if (allOptionsArray.some((option) => option.tagName === 'TEXTAREA')) return;

    setTimeout(() => {
      document.querySelector('button[type=button][data-track-component=submit]').click();

      const optionsFormPart = document.querySelectorAll('.rc-OptionsFormPart');

      Array.from(optionsFormPart).some((formPart) => formPart.children.length > 2) ? fillDataPeerReview() : null;
    }, allOptionsArray.length * delay);
  };

  let running = false;

  const mutationOptions = { subTree: true, childList: true, attributes: false };

  const mutationHandler = () => {
    const button = document.querySelector('button[type=button][data-track-component=submit]');
    if (!button || button.disabled) return;

    fillDataPeerReview();
  };

  const mutationObserve = new MutationObserver(mutationHandler);

  const autoFillDataPeerReview = () => {
    if (running) {
      console.log('disconnected');
      running = false;
      mutationObserve.disconnect();
      return;
    }

    const rendered = document.querySelector('head');
    fillDataPeerReview();
    console.log('observed');
    mutationObserve.observe(rendered, mutationOptions);
    running = true;
  };

  const init = () => {
    doubleKeydownEvent(() => fillDataQuiz(fullData), 'z', '1');
    doubleKeydownEvent(fillDataPeerReview, 'z', '2');
    doubleKeydownEvent(autoFillDataPeerReview, 'z', '3');
  };

  init();
})();
