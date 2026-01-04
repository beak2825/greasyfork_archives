// ==UserScript==
// @name         工程英语视听说脚本
// @namespace    http://tampermonkey.net/
// @version      5.1.3
// @description  南京工程学院工程学科英语视听说教程
// @author       Binconan
// @match        *://*/StudentSTS/*
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @license      GNU General Public License v3.0

// @downloadURL https://update.greasyfork.org/scripts/393373/%E5%B7%A5%E7%A8%8B%E8%8B%B1%E8%AF%AD%E8%A7%86%E5%90%AC%E8%AF%B4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/393373/%E5%B7%A5%E7%A8%8B%E8%8B%B1%E8%AF%AD%E8%A7%86%E5%90%AC%E8%AF%B4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

/*********************************************************************************/
/*  如果使用中遇到技术问题,请通过邮件与我联系 邮件地址:binconan@outlook.com */
/*********************************************************************************/

// Warning : !!!!!!!!!!!!!!!!!!!!!本脚本只适用于南京工程学院工程英语视听说自动填充,请勿作它用!!!!!!!!!!!!!!!!!!!!!!!!!!!!



//以下为答案,代码转至4603行
var content_up= "U1\n" +
  "Task 1\n" +
  "1.(permutation) [n.] an event in which one thing is substituted for another\n" +
  "2.  (confine) [v.] to keep something or someone within a limited area so it cannot escape\n" +
  "3.  (accumulation) [n.] the act of getting or becoming bigger or more over time \n" +
  "4.  (bacteria) [n.] the very small creatures that cause diseases in humans and animals\n" +
  "5.  (diagnostic) [a.] used for making a judgment about what a particular problem is\n" +
  "6.  (denote) [v.] to be a name or symbol for \n" +
  "7.  (commodity) [n.] something useful or valuable, usually for sale\n" +
  "8.  (thesis) [n.] a long essay; a position taken in an argument supported by a set of reasons\n" +
  "9.  (discipline) [n.] a branch of knowledge \n" +
  "10.  (apparatus) [n.] equipment designed to serve a specific function \n" +
  "11.  (sensitivity) [n.] the quality of reacting quickly or more than usual to something\n" +
  "12.  (onset) [n.] the beginning\n" +
  "13.  (workshop) [n.] a brief intensive course for a small group \n" +
  "14.  (valve) [n.] a device along the pipe that can either open and allow something to flow, or close and block it \n" +
  "15.  (inversion) [n.] a change in position of things so they become the opposite \n" +
  "16.  (graph) [n.] a picture that shows how two sets of information or variables are related, usually by lines or curves \n" +
  "17.  (variance) [n.] (statistics) amount of difference in distributions \n" +
  "18.  (layout) [n.] a plan or design of something\n" +
  "19.  (dynamic) [a.] & [n.] always active or changing; a force related to motion \n" +
  "20.  (transparency) [n.] the amount you can see through something \n" +
  "21.  (fringe) [n.] the edge of something\n" +
  "22.  (orientation) [n.] the ability to locate oneself in his environment with reference to time, place, and people\n" +
  "23.  (accumulate) [v.] to gather or acquire so that you have more of something \n" +
  "24.  (molecule) [n.] two or more atoms chemically combined \n" +
  "25.  (gradient) [n.] a measure of how steep something is \n" +
  "26.  (occurrence ) [n.] specific instance of something happening \n" +
  "27.  (incumbent ) [n.] a person who holds a particular office or position \n" +
  "28.  (ion) [n.] a charged atom\n" +
  "29.  (stabilize) [v.] to make something stable or consistent, with no major changes \n" +
  "30.  (irrigation) [n.] supplying land with water using pipes \n" +
  "31.  (partition) [n.] a wall, screen, or piece of glass used to separate one area from another \n" +
  "32.  (quantitative) [a.] the describing or measuring of quantity \n" +
  "33.  (generalization ) [n.] making a statement about a group from a limited data \n" +
  "34.  (fabric ) [n.] material used for making clothes, curtains, etc. and for covering furniture \n" +
  "35.  (circa) [prep.] about\n" +
  "36.  (processor) [n.] a machine or company that prepares something and makes it ready for use\n" +
  "37.  (drain ) [n.] a pipe that removes water, or other liquids \n" +
  "38.  (plantation) [n.] a large area of plants, usually in a hot climate \n" +
  "39.  (sediment) [n.] the material that settles to the bottom of a liquid \n" +
  "40.  (transcribe) [v.] to write something spoken \n" +
  "41.  (lateral) [a.] connected with the side of something or with movement to the side \n" +
  "42.  (proposition) [n.] an idea; a suggestion \n" +
  "43.  (cognitive) [a.] connected with mental processes of understanding \n" +
  "44.  (equilibrium) [n.] a state of balance\n" +
  "45.  (quantum) [n.] the smallest unit or amount of energy\n" +
  "46.  (scenario) [n.] an outline; an imagined sequence of events in a plan or project \n" +
  "47.  (transmit) [v.] to broadcast by using electrical signals to a radio or TV\n" +
  "48.  (footnote) [n.] extra information at the bottom of a page\n" +
  "49.  (generator) [n.] an engine that converts mechanical energy into electrical energy by electromagnetic induction\n" +
  "50.  (presume) [v.] to think that something is probably true\n" +
  "\n" +
  "Task 2\n" +
  "\n" +
  "平衡  (equilibrium)\n" +
  "2. 学科  (discipline)\n" +
  "3. 边缘  (fringe)\n" +
  "4. 量子  (quantum)\n" +
  "5. 图表  (graph)\n" +
  "6. 分子  (molecule)\n" +
  "7. 发电机  (generator)\n" +
  "8. 仪器  (apparatus)\n" +
  "9. 阀  (valve)\n" +
  "10. 梯度  (gradient)\n" +
  "\n" +
  "Task 3\n" +
  "\n" +
  "X and Y aren’t a formula; they’re a pair of mathematical symbols used to  (denote) an unknown quantity.\n" +
  "2. The method allowed him to investigate the independence of the sample mean and sample  (variance)in certain cases.\n" +
  "3. According to the model, the Big Bang is followed by a period of slow expansion and gradual  (accumulation) of dark energy.\n" +
  "4. These systems affect the  (layout) and design of modern libraries.\n" +
  "5. If each wall in this room were painted this color, you’d feel as if you were  (confined) in a tight, little box, albeit a box with a pretty color.\n" +
  "6. The moving electrons  (transmit) electrical energy from one point to another.\n" +
  "7. However in some patients, the  (onset) of symptoms is sudden; this is usually seen in patients with a neurological basis for their illness.\n" +
  "8. Research in  (cognitive) psychology has shown that we remember iconic images better than text.\n" +
  "9. The proportion of coarse  (sediment) deposited in the plot drains increased with larger storms.\n" +
  "10. Therefore, new  (diagnostic) techniques with significantly improved sensitivity and specificity are required.\n" +
  "\n" +
  "Task 4\n" +
  "\n" +
  "  As a very ancient field of human (1)  (endeavor) , engineering was used by early humans, who used their (2)  (knowledge ) of the natural world to (3)  (figure out) things like irrigation schemes and how to build boats that didn’t sink. Over time, as humans learned more about science and mathematics, engineering got more complex, and this field (4)  (paved the way) for modern society.\n" +
  "    Most engineers pride themselves on being (5)  (problem solvers ) . Their field of work involves (6)  (the analysis of a problem), such as the need for a safe and stable water supply for a city, and (7)  (the creation of a solution) , such as an aqueduct. In the course of their work, engineers often (8)  (interact with) people in a number of other disciplines, and this field of work places a high value on (9)  (collaboration),(10)  (fact checking),and quick thinking.\n" +
  "\n" +
  "Task 5\n" +
  "1.What are the subfields of engineering mentioned in the video? \n" +
  "Your answer：\n" +
  "Reference answer： Electrical engineering, civil engineering, mechanical engineering and chemical engineering.\n" +
  "2.What qualities are required for the engineers in related subfields?\n" +
  "Your answer：\n" +
  "Reference answer： The qualities of being practical, analytical, logical; of thinking outside the box; of being curious, interested in problem-solving and creative.\n" +
  "Task 6\n" +
  "Name of the engineering legacy: \n" +
  "Your answer：\n" +
  "Reference answer： Dujiangyan\n" +
  "Age of the engineering legacy: \n" +
  "Your answer：\n" +
  "Reference answer： over 2000 years\n" +
  "Designer of the project:\n" +
  "Your answer：\n" +
  "Reference answer： LI Bing\n" +
  "Function of the project:\n" +
  "Your answer：\n" +
  "Reference answer： regulating the flow of the Min River to prevent floods and provide consistent irrigation for farming\n" +
  "Working principle of the project:\n" +
  "Your answer：\n" +
  "Reference answer： diverting part of the Min River at Dujiangyan\n" +
  "Task 7\n" +
  "\n" +
  "While Europe endured the so-called Dark Ages, ancient China reigned supreme as the world’s technological superpower. Only now are we discovering that many of the inventions that shape our modern world have their roots in this remarkable oriental civilization— complex geared machines that (1)  (allowed production on an industrial scale), precision seismographs for (2)  (detecting earthquakes), drilling machines that (3)  (bored for natural gas) hundreds of meters beneath the earth, the cosmic engine, a super-scale astronomical computer that not only told the time but also predicted (4)  (the passage of the planets and the stars), and even blast furnaces capable of (5)  (forging metal) on a scale that rivals that of the modern world. Some of these technologies were so complex that for centuries they remained a mystery.\n" +
  "\n" +
  "Task 8\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "1\n" +
  " (craft) \n" +
  " (C)  \n" +
  "6\n" +
  "   (simulation) \n" +
  "   (H) \n" +
  "2\n" +
  "   (aeronautical) \n" +
  "   (F) \n" +
  "7\n" +
  "   (status quo) \n" +
  "   (A) \n" +
  "3\n" +
  "   (epistemology) \n" +
  "   ( E) \n" +
  "8\n" +
  "   (scale model) \n" +
  "   (I) \n" +
  "4\n" +
  "   (construe) \n" +
  "   (B) \n" +
  "9\n" +
  "   (stipulation) \n" +
  "   (D) \n" +
  "5\n" +
  "   (prototype) \n" +
  "   (J) \n" +
  "10\n" +
  "   (filter) \n" +
  "   (G) \n" +
  "Task 9\n" +
  "\n" +
  " (B)\n" +
  " A. The Epistemology of Engineering\n" +
  " B. The Methodology of Engineering\n" +
  " C. The Branches of Engineering\n" +
  " D. The Procedures of Engineering\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "Task 10\n" +
  "Part One\n" +
  "Question 1: It is implied that the typical job of an engineer is to ___________. (C)\n" +
  " A. invent something new\n" +
  " B. discover something hidden\n" +
  " C. improve something insufficient\n" +
  " D. design something practical\n" +
  "Part Two\n" +
  "Question 2: Which of the following is NOT included in the considerations of an engineer? (D)\n" +
  " A. Technical confines.\n" +
  " B. Market condition.\n" +
  " C. Sustainable development.\n" +
  " D. Service strategy.\n" +
  "Part Three\n" +
  "Question 3: Why is testing important? (C)\n" +
  " A. Because it helps an engineer to craft a technically fruitful product.\n" +
  " B. Because it helps an engineer to solve all problems of a product.\n" +
  " C. Because it helps an engineer to revise the design of a product.\n" +
  " D. Because it helps an engineer to draft all solutions to a problem.\n" +
  "\n" +
  "\n" +
  "Task 11\n" +
  "\n" +
  "\n" +
  "1.\n" +
  "Your answer：\n" +
  "Reference answer： The main job of an engineer is to recognize, comprehend and construe the limitations on a particular design to get successful results.\n" +
  "2.\n" +
  "Your answer：\n" +
  "Reference answer： Problem solving: understanding of mathematics, logic, science and economics and proper experience is used tactfully by the engineers to solve potential problems.\n" +
  "3.\n" +
  "Your answer：\n" +
  "Reference answer： Engineers normally try to foresee how their designs will perform to their specifications before it can be produced on a larger scale.\n" +
  "Task 12\n" +
  "Directions：Listen to the report in Task 9 for the final time and answer the question in your own words. \n" +
  "\n" +
  "\n" +
  "Question: “Scientists investigate that which already is; engineers create that which has never been.” How do you understand the words by Albert Einstein?\n" +
  "Your answer：\n" +
  "Reference answer： \n" +
  "\n" +
  "\n" +
  "Task 14\n" +
  "Directions：Watch the video in Task 13 for the second time and note down the English terms in it. Their Chinese meanings are given. \n" +
  "\n" +
  "1. 流水线  (assembly line) \n" +
  "2. 制造设施  (manufacturing facilities) \n" +
  "3. 电气技术  (electrical technology)\n" +
  "4. 自动化生产  (automated production)\n" +
  "5. 可再生能源  (renewable energy)\n" +
  "6. 可编程逻辑控制器  (programmable logic controller )\n" +
  "7. 机器学习  (machine learning)\n" +
  "8. 物联网技术  (the Internet of Things)\n" +
  "9. 信息物理系统  (cyber-physical system )\n" +
  "10. 云计算  (cloud computing)\n" +
  "\n" +
  "Task 15\n" +
  "Directions：Watch the video in Task 13 with subtitles and retell the content. The outline is given. \n" +
  "\n" +
  "   There are four main revolutions in the industrial world. The first revolution (industry 1.0) witnessed the emergence of (1)  (mechanization of steam and water power). The second revolution saw the development of (2)  ( various management programs that perfected the effectiveness of manufacturing facilities ).The third revolution gave rise to high-level automation in production thanks to (3)  (Internet access, connectivity and renewable energy )\n" +
  "    The first industrial revolution used (4)  (steam and water power)to mechanize production, the second used (5)  (electrical power)to create mass production and the third used (6)  (programmable logic controllers) to automate production. The fourth revolution is the first industrial revolution rooted in a new technological phenomenon—digitalization—rather than in the emergence of a new type of energy. It is the era of (7)  (smart machine, storage systems, production facilities ).\n" +
  "    There are four key elements of industry 4.0. The first element is (8)  (the Internet of Things). This adds (9)  (a level of digital intelligence to devices (enabling them to communicate without a human being involved and merging the digital and physical worlds)). The second element is (10)  (cyber-physical systems). CPSs (11)  (link the physical world with the virtual world of information processing). The third element is (12)  (cloud computing ). With this technology (13)  (users are able to access software and applications from wherever they are ). The fourth element is (14)  (cognitive computing ). The goal is to (15)  (simulate human thought processes in a computerized model). \n" +
  "\n" +
  "\n" +
  "U2\n" +
  "Task 1\n" +
  "Directions：Listen carefully. Note down the academic words you hear. Every word will be read twice. Refer to your dictionary if necessary. \n" +
  "\n" +
  "1.  (receptor) [n.] a device that receives information \n" +
  "2.  (adjacent ) [a.] being close or near to a border, wall, or point \n" +
  "3.  (diameter) [n.] a straight line going from one side of a circle or any other round object to the other side, passing through the centre \n" +
  "4.  (millimeter) [n.] 1/1000 of a meter \n" +
  "5.  (fracture) [n.] a break or crack in something hard, especially a bone \n" +
  "6.  (inference) [n.] an opinion that you form based on information you already have \n" +
  "7.  (transplant ) [n.] a medical operation in which a new organ is placed inside a patient’s body \n" +
  "8.  (thickness) [n.] the distance between the opposite sides of something \n" +
  "9.  (modular) [a.] consisting of separate parts or units that can be joined together \n" +
  "10.  (bubble) [n.] a small ball of air inside of a liquid \n" +
  "11.  (reconstruct ) [v.] to rebuild something after it has been destroyed \n" +
  "12.  (entrant) [n.] a person who enters a contest \n" +
  "13.  (detection) [n.] the act of discovering something or solving a crime \n" +
  "14.  (decentralize) [v.] to distribute the administrative powers or functions (of a central authority) over a less concentrated area \n" +
  "15.  (deflection) [n.] the action of making something move in a different direction \n" +
  "16.  (integral) [a.] necessary and important as a part of a whole \n" +
  "17.  (approximate) [a.] not completely accurate but close \n" +
  "18.  (artifact) [n.] an object that is made by a person, such as a tool or a decoration, especially one that is of historical interest \n" +
  "19.  (alien) [n.] a person or creature from a planet other than earth \n" +
  "20.  (magnitude) [n.] a numerical quantitative measure expressed usually as a multiple of a standard unit \n" +
  "21.  (gauge) [n.] a tool used to measure things \n" +
  "22.  (instability) [n.] uncertainty caused by the possibility of a sudden change in the present situation \n" +
  "23.  (consent) [v.] to agree to do or allow doing something \n" +
  "24.  (generalize) [v.] to apply a particular idea to a large group \n" +
  "25.  (alert) [v.] to advise or warn; cause to be on guard \n" +
  "26.  (oxidize) [v.] to combine with oxygen \n" +
  "27.  (allocate) [v.] to distribute or set apart for a plan or purpose \n" +
  "28.  (insert) [v.] to put something in something \n" +
  "29.  (approximation) [n.] something that is similar, but not an exact copy \n" +
  "30.  (fossil) [n.] a plant or animal that has become rock after many thousands of years \n" +
  "31.  (practitioner) [n.] a person working in a profession, such as medicine \n" +
  "32.  (randomize) [v.] to arrange in a random order \n" +
  "33.  (vector ) [n.] a quantity that has both size and direction \n" +
  "34.  (thereby) [ad.] with the result that something else happens \n" +
  "35.  (manual) [n.] a book of information or instructions \n" +
  "36.  (quotation) [n.] a phrase or short piece of writing taken from a longer work of literature, poetry, etc. or what someone else has said \n" +
  "37.  (bulk) [n.] big size; largeness; heaviness \n" +
  "38.  (economist) [n.] a person who studies economics \n" +
  "39.  (deadline) [n.] a date or time before which something must be done \n" +
  "40.  (membrane) [n.] a very thin piece of material that covers an opening \n" +
  "41.  (indigenous) [a.] living or growing naturally in an area, not brought from somewhere else \n" +
  "42.  (unstable) [a.] likely to move from its position or fall \n" +
  "43.  (contradiction) [n.] the act of saying that something is not true or very different \n" +
  "44.  (slab) [n.] a broad, flat, somewhat thick piece of stone, wood, or other solid material \n" +
  "45.  (epidemic) [n.] the appearance of a particular disease in a large number of people at the same time \n" +
  "46.  (acidic) [a.] containing acid \n" +
  "47.  (utility ) [n.] the quality of being useful \n" +
  "48.  (pulse) [n.] the regular beating of the heart, especially when it is felt at the wrist or side of the neck \n" +
  "49.  (genetics) [n.] the scientifc study of genes \n" +
  "50.  (identical) [a.] the same in every way \n" +
  "\n" +
  "Task 2\n" +
  "Directions：Choose the words from the list in Task 1 that match the Chinese meanings below. \n" +
  "1. 厚板  (slab)\n" +
  "2. 测量仪器  (gauge)\n" +
  "3. 量值  (magnitude)\n" +
  "4. 毫米  (millimeter )\n" +
  "5. 模块化的  (modular)\n" +
  "6. 接收器  (receptor)\n" +
  "7. 直径  (diameter)\n" +
  "8. 氧化  (oxidize)\n" +
  "9. 手册  (manual)\n" +
  "10. （使）分散  (decentralize)\n" +
  "\n" +
  "Task 3\n" +
  "Directions: Listen to the following sentences and fill in the blanks with appropriate words from the word list in Task 1. \n" +
  "\n" +
  "1. We now use half of our  (fossil) fuel to light, heat and cool buildings and we should do something about it. \n" +
  "2. Single stars are of comparatively small mass, cosmically speaking, and so produce little  (deflection) of light beams.\n" +
  "3. Future applications for my robot include automated vacuum cleaning and fire and intrusion  (detection ).\n" +
  "4. There are two articles currently doing the rounds that both talk about the value and  (utility) of being part of the networked world, and what it means to participate within it.\n" +
  "5. In past years we didn’t  (allocate) enough funds to infrastructure maintenance.\n" +
  "6. Because of surface tension, the water does not fall out of the tiny hole, although a thin  (membrane) may be added, just to be safe.\n" +
  "7. There is only one way to ensure that base load and the  (bulk) of our electricity comes from a reliable source that does not damage the atmosphere—nuclear power. \n" +
  "8. Even with a human-to-human organ  (transplant) the body’s defence mechanisms attempt to destroy the foreign organ.\n" +
  "9. The order of the questions was  (randomized ) but was the same for all participants.\n" +
  "10. The authors conclude from this study that the risk of hip  (fracture) in elderly persons can be greatly reduced by the use of a hip-protector device.\n" +
  "\n" +
  "Task 4\n" +
  "Directions：Listen to the following piece three times and fill in the missing words and terms. \n" +
  "\n" +
  "   Big data is (1)  (high-volume) , (2)  (high-velocity) and/or (3)  (high-variety) information assets that demand cost-effective, innovative forms of information processing that enable enhanced insight, decision making, and (4)  (process automation)\n" +
  "    Although the concept of big data itself is relatively new, the origins of large data sets go back to the 1960s and 70s when the world of data was just getting started, with the first data centers and the development of (5)  (the relational database) . \n" +
  "   Around 2005, people began to realize just how much data users generated through Facebook, YouTube, and other (6)  (online services). (7)  (Hadoop) , (an open-source framework created specifically to store and analyze big data sets) was developed that same year. NoSQL also began to gain popularity during this time.\n" +
  "  The development of (8)  (open-source frameworks) , such as Hadoop (and more recently, Spark) was essential for the growth of big data because they make big data (9)  (easier to work with), and (10)  (cheaper to store), In the years since then, the volume of big data has skyrocketed. Users are still generating huge amounts of data—but it’s not just humans who are doing it. \n" +
  "\n" +
  "Task 5\n" +
  "Directions：Watch a short video about big data analytics and answer the questions. \n" +
  "\n" +
  "\n" +
  "1. What are the four types of big data analytics?\n" +
  "Your answer：\n" +
  "Reference answer： The descriptive one, the diagnostic one, the predictive one and the prescriptive one.\n" +
  "2. What can big data analytics do for us?\n" +
  "Your answer：\n" +
  "Reference answer： It helps companies or public administrations understand their users better, find previously unnoticeable opportunities, provide a better service, and even mitigate fraud.\n" +
  "\n" +
  "\n" +
  "Task 6\n" +
  "Directions: Watch a short video three times and complete the outline below. \n" +
  "\n" +
  "\n" +
  "Three Vs of big data: \n" +
  "Your answer：\n" +
  "Reference answer： Volume,Velocity,Variety \n" +
  "Advantages of using big data: \n" +
  "Your answer：\n" +
  "Reference answer： greater efficiency,fewer defects,greater profitability\n" +
  "Strategies\n" +
  "to use big data in manufacturing:\n" +
  "Your answer：\n" +
  "Reference answer： Identify a problem that needs to be solved now and a person who wants to solve it;\n" +
  "Find relationships and causes, predict problems, and improve efficiency.\n" +
  "\n" +
  "\n" +
  "Task 7\n" +
  "Directions：Listen to a report about the Five-hundred-meter Aperture Spherical Radio Telescope in China (FAST) and fill in the missing words. \n" +
  "\n" +
  "    The 180,000,000 dollar FAST telescope is (1)  (probing the cosmos), more deeply than any radio telescope before it. Completed in 2016, it detects (2)  (the radio waves emitted by objects), in deep space, allowing astronomers to see what’s out there on a truly epic scale. \n" +
  "      This massive 1,600-foot diameter antenna consists of (3)  (a spider’s web ) of 10,000 steel cables weighing nearly 1,800 tons. These support a sprawling 4,450 (4)  (triangular panels),which formed the dish itself. And at the center, suspended from six 330-foot high towers hangs a 33-ton receiver cabin. This incredible device (5)  (collects data from billions of light years away) . \n" +
  "\n" +
  "Task 8\n" +
  "Directions：Write down the words you hear and match them with the Chinese meanings. These words will appear in the report in Task. \n" +
  "\n" +
  "A. 服务器   \t\tB. 硬盘  \tC. 备份  \t\tD. 访问    \tE. 收入\n" +
  "F. 扩大               \t         G. 兑现   \t   H. 占（百分比）    \t\tI. 中断    \tJ. 同步\n" +
  "\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "1\n" +
  " (revenue) \n" +
  " (E)  \n" +
  "6\n" +
  "   (scale up) \n" +
  "   (F) \n" +
  "2\n" +
  "   (hard drive) \n" +
  "   (B) \n" +
  "7\n" +
  "   (sync) \n" +
  "   (J) \n" +
  "3\n" +
  "   (outage) \n" +
  "   (I) \n" +
  "8\n" +
  "   (cash in) \n" +
  "   (G) \n" +
  "4\n" +
  "   (server ) \n" +
  "   (A) \n" +
  "9\n" +
  "   (back up) \n" +
  "   (C) \n" +
  "5\n" +
  "   (account for ) \n" +
  "   (H) \n" +
  "10\n" +
  "   (access ) \n" +
  "   (D) \n" +
  "\n" +
  "\n" +
  "Task 9\n" +
  "Directions：Listen to a report for the first time and choose the best topic for it. \n" +
  "\n" +
  "\n" +
  " (B)\n" +
  " A. How the Cloud Works\n" +
  " B. What the Cloud Is\n" +
  " C. Benefts of the Cloud\n" +
  " D. Risks of the Cloud\n" +
  "\n" +
  "\n" +
  "Task 10\n" +
  "Directions：Listen to the report in Task 9 part by part and choose the best answer to each question. \n" +
  "\n" +
  "\n" +
  "Part One\n" +
  "Question 1: Our data in the cloud isn’t lost forever because ________. (C)\n" +
  " A. we back up our data to our computer hard drive\n" +
  " B. we can access our data by connecting to the internet\n" +
  " C. we send our data to the servers of a company\n" +
  " D. we never lose or break our phones\n" +
  "Part Two\n" +
  "Question 2: All of the following are benefits of the cloud EXCEPT ________ .(C)\n" +
  " A. less money for bigger storage\n" +
  " B. convenience of data use\n" +
  " C. security of our phones and data\n" +
  " D. signifcant profit of cloud services\n" +
  "Part Three\n" +
  "Question 3: The risks of the cloud include _______________. (A)\n" +
  " A. the Internet breakdown, cyber attack and excessive power of big companies\n" +
  " B. the Internet breakdown, data leak and excessive power of big companies\n" +
  " C. the Internet breakdown, cyber attack and monopoly of big companies\n" +
  " D. the Internet breakdown, data leak and monopoly of big companies\n" +
  "\n" +
  "\n" +
  "Task 11\n" +
  "Directions：Listen to three sentences in the report and have a dictation. Every sentence will be read three times. \n" +
  "\n" +
  "\n" +
  "1.\n" +
  "Your answer：\n" +
  "Reference answer： The cloud is a global network of servers around the world acting as one massive hard drive.\n" +
  "2.\n" +
  "Your answer：\n" +
  "Reference answer： Before the cloud, you might have backed up your documents, photos and music to an external device like a CD-ROM or to your computer’s hard drive.\n" +
  "3.\n" +
  "Your answer：\n" +
  "Reference answer： You can access your data anytime anywhere if you’re connected to the Internet and you don’t have to worry about using up all of your storage on your hard drive.\n" +
  "\n" +
  "\n" +
  "Task 14\n" +
  "Directions：Watch the video in Task 13 for the second time and note down the English terms in it. Their Chinese meanings are given. \n" +
  "\n" +
  "1. 负荷  (load) \n" +
  "2. 太阳能电池板  (solar panel) \n" +
  "3. 涡轮机  (turbine)\n" +
  "4. 破坏性的  (disruptive )\n" +
  "5. 节点  (node )\n" +
  "6. 互操作性  (interoperability)\n" +
  "7. 分布式数据库同步系统  (databus)\n" +
  "8. 优化  (optimize)\n" +
  "9. 异构系统  (heterogeneous system )\n" +
  "10. 利用  ( leverage)\n" +
  "\n" +
  "Task 15\n" +
  "Directions：Watch the video in Task 13 with subtitles and retell the content. The outline is given. \n" +
  "\n" +
  "  Today’s grid operators must maintain extra power plant reserves because(1)  (they want to ensure sufficient power to compensate for the fluctuations ). Renewable power sources(2)  (operate on update cycles) that are as long as 15 minutes. \n" +
  "    In order to make the smart grid infrastructure(3)  (interoperable, resilient, scalable, and secure), the Industrial Internet Consortium (IIC) started a new initiative to(4)  (enable the efficient use of renewable energy resources at a large scale ). Many companies worked together for a real-time, secure connectivity framework, enabling(5)  (machine-to-machine, machine-to-control center, and machine-to-cloud data connectivity). A high-speed feld databus connects(6)  (devices and intelligent nodes),interacts(7)  (with the central station and the cloud)and operates(8)  (optimally (by taking advantage of both local and remote state)). \n" +
  "\n" +
  "U3\n" +
  "Task 1\n" +
  "(oxygen ) [n.] a gas that all animals need to breathe \n" +
  "2.  (rack) [n.] a frame, stand or hook on which things are set or hung \n" +
  "3.  (regression) [n.] the process of going back to an earlier or less advanced form or state \n" +
  "4.  (conceive) [v.] to form an idea, a plan, etc. in your mind; to imagine something \n" +
  "5.  (damp) [a.] slightly wet, often in a way that is unpleasant \n" +
  "6.  (scalable) [a.] capable of being scaled \n" +
  "7.  (nominal) [a.] existing in name only \n" +
  "8.  (infinite) [a.] having no limits or boundaries in time or space or extent or magnitude \n" +
  "9.  (thermal) [a.] connected with heat \n" +
  "10.  (terminal) [n.] the end of something \n" +
  "11.  (strand ) [n.] a single thin piece of thread, wire, hair, etc. \n" +
  "12.  (watershed) [n.] an event or a period of time that marks an important change \n" +
  "13.  (cone ) [n.] a solid or hollow object with a round flat base and sides that slope up to a point \n" +
  "14.  (conduction ) [n.] the transmission of heat, electricity or sound \n" +
  "15.  (amplitude) [n.] the distance between the middle and the top or bottom of a wave such as a sound wave \n" +
  "16.  (maximize) [v.] to increase, or become as large or great as possible \n" +
  "17.  (contradict) [v.] to disagree with something, especially by saying that the opposite is true \n" +
  "18.  (proprietary ) [a.] manufactured and sold only by the owner of the patent, formula, brand name, or trademark \n" +
  "19.  (classification) [n.] the act or process of putting people or things into a group or class \n" +
  "20.  (fraction) [n.] a part of a whole \n" +
  "21.  ( clip) [n.] a metal holder used for keeping things together \n" +
  "22.  (elevate) [v.] to make something higher \n" +
  "23.  (configuration) [n.] an arrangement of the parts of something or a group of things; the form or shape that this arrangement produces \n" +
  "24.  (fetal ) [a.] concerning a fetus, an unborn baby \n" +
  "25.  (incidence) [n.] the rate that something happens \n" +
  "26.  (residue) [n.] a small amount of something that remains at the end of a process \n" +
  "27.  (acid) [n.] sour substance that reacts with metals \n" +
  "28.  (paradox) [n.] a saying that seems contrary to popular belief, but which may be true \n" +
  "29.  (industrialize) [v.] to develop industry \n" +
  "30.  (specification) [n.] a detailed description of the design and materials used to make something \n" +
  "31.  (liter) [n.] a unit for measuring the volume of a liquid or a gas, equal to 1,000 cubic centimetres \n" +
  "32.  (manipulate ) [v.] to control something or someone \n" +
  "33.  (velocity) [n.] the speed of something in a particular direction \n" +
  "34.  (versatile) [a.] having or capable of many uses \n" +
  "35.  ( nucleus) [n.] the central part of something around which other parts are located or collected \n" +
  "36.  (hierarchy) [n.] a system for organizing people or things according to their importance \n" +
  "37.  (deficiency) [n.] the state of not having, or not having enough of, something that is essential \n" +
  "38.  (optical) [a.] concerning vision or helping people see \n" +
  "39.  (audio ) [a.] connected with sound that is recorded \n" +
  "40.  (spray) [v.] to force liquid out of a container so that it comes out in a stream of very small drops and covers an area \n" +
  "41.  (discourse) [n.] serious conversation or discussion between people \n" +
  "42.  (solvent) [n.] something that dissolves or can melt another substance \n" +
  "43.  (exponential ) [a.] growing or increasing very rapidly \n" +
  "44.  ( autonomy ) [n.] the power to make independent decisions \n" +
  "45.  (likelihood) [n.] the chance that something might happen \n" +
  "46.  (chromosome) [n.] cell structures that carry the genetic material that is copied and passed to the next generation \n" +
  "47.  (displacement) [n.] the act of taking the place of something or someone else \n" +
  "48.  ( mechanic) [n.] a person whose job is repairing machines, especially the engines of vehicles \n" +
  "49.  (organism) [n.] a living thing, especially one that is extremely small \n" +
  "50.  ( helix) [n.] a shape like a spiral or a line curved around a cylinder or cone\n" +
  "\n" +
  "Task 2\n" +
  "Directions：Choose the words from the list in Task 1 that match the Chinese meanings below. \n" +
  "1. 速度  (velocity)\n" +
  "2. 可称量的  ( scalable )\n" +
  "3. 专利的  (proprietary)\n" +
  "4. 多功能的  (versatile )\n" +
  "5. 螺旋  (helix)\n" +
  "6. 音频  (audio )\n" +
  "7. 回归  (regression)\n" +
  "8. 圆锥体  (cone)\n" +
  "9. 核心  (nucleus)\n" +
  "10. 热量的  (thermal)\n" +
  "\n" +
  "Task 3\n" +
  "Directions: Listen to the following sentences and fill in the blanks with appropriate words from the word list in Task 1. \n" +
  "\n" +
  "1. Finally, the volume and flow of potentially relevant information has increased seemingly at an  (exponential) rate. \n" +
  "2. No other country would  (industrialize) to the same extent before the 1870s, giving Britain a nearmonopoly on the production of manufactured goods. \n" +
  "3. In solids that conduct electricity, heat  (conduction ) is further enhanced by the drift of free electrons.\n" +
  "4. Small businesses and traders are expected to be hit hardest by the ban, with skilled  ( mechanics) losing work. \n" +
  "5. The new process allowed mass production using a  (fraction) of the amount of silver thereby reducing costs. \n" +
  "6. Our genes are located on 46 paired structures, or  ( chromosomes) , in the cell nucleus. \n" +
  "7. One robotic arm is used to position the endoscope to provide visualization of the operative site, while the other two robotic arms  (manipulate) surgical instruments under the surgeon’s control. \n" +
  "8. His role, however, was  (nominal) ,and the group was actually managed by professionals. \n" +
  "9. We need to accept that there is always the chance of failure and the  (likelihood ) of flaws.\n" +
  "10. In principle, there may be several architectural solutions involving different network, software, and hardware  (configurations).\n" +
  "\n" +
  "Task 4\n" +
  "Directions：Listen to the following piece and fill in the missing words and terms. \n" +
  "\n" +
  "   The definition of virtual reality comes, naturally, from the definitions for both   ‘virtual’ and ‘reality’. The definition of ‘virtual’ is near and ‘reality’ is what we experience as human beings. So the term ‘virtual reality’ basically means ‘near-reality’. This could, of course, mean anything but it usually refers to a specific type of (1)  (reality emulation). \n" +
  "   Virtual reality (VR) is essentially:\n" +
  "    (2)  (believable): You really need to feel like you’re in your virtual world (on Mars, or wherever) and to keep believing that, or the illusion of virtual reality will disappear.\n" +
  "     (3)  (interactive): As you move around, the VR world needs to move with you.\n" +
  " (4)  (computer-generated): Why is that important? Because only powerful machines, with (5)  (realistic 3D computer graphics) ,are fast enough to make believable, interactive, alternative worlds that change (6)  (in real-time) as we move around them.\n" +
  "   (7)  (explorable): A VR world needs to be (8)  (big and detailed enough) for you to explore. \n" +
  "   (9)  (immersive): To be both believable and interactive, VR needs to (10)  (engage both your body and your mind).\n" +
  "\n" +
  "Task 5\n" +
  "Directions：Watch a video about AR and VR, and answer the questions. \n" +
  "\n" +
  "\n" +
  "1. What are the similarities between augmented reality (AR) and virtual reality (VR)?\n" +
  "Your answer：\n" +
  "Reference answer： AR is based on the technology of VR. First, they both offer users good virtual experience: People can interact with visuals, and in AR and VR places are navigable; second, both of them are pretty green and have a long way to go before they hopefully merge into a smooth continuum of abilities.\n" +
  "2.What are the differences between VR and AR?\n" +
  "Your answer：\n" +
  "Reference answer： AR is when you look at the real world, it’s augmented with additional and unreal information or graphics in your view, while VR is that the world you’re standing in is replaced with a virtual one: Everything you see and hear is replaced with something computer-generated. Furthermore, AR can be had via a phone and one of the many AR apps out there, while VR is experienced with a headset, which is quite cumbersome.\n" +
  "\n" +
  "\n" +
  "Task 6\n" +
  "Directions: Watch a short video and complete the outline below. \n" +
  "\n" +
  "\n" +
  "Advantages of virtual reality for professional training in industry:\n" +
  "Your answer：\n" +
  "Reference answer： Full immersion into virtual simulation;\n" +
  "No risks to real equipment and health;\n" +
  "No limits to simulation scenarios;\n" +
  "Lower training costs by 10–20 times;\n" +
  "Multi-user simulations;\n" +
  "Augmented reality helmets for in-field work.\n" +
  "Other uses of VR or AR in industry: \n" +
  "Your answer：\n" +
  "Reference answer： AR information in real-time;\n" +
  "Supervising.\n" +
  "\n" +
  "\n" +
  "Task 7\n" +
  "Directions：Listen to a report about 5G technology and fill in the missing words. \n" +
  "\n" +
  "      5G—the fifth generation of cellular mobile communications—promises a lot more than the fastest Internet speed. It will allow devices to communicate with virtually zero lag time. That would (1)  (pave the way for cutting-edge advances).\n" +
  "       Imagine a surgeon performing an operation, using (2)  (a virtual reality headset and a special glove), and the patient, who is actually on the other side of the country, being operated on by a robotic arm that moves in harmony with the surgeon’s hand inside the special glove. \n" +
  "       5G could also enable (3)  (the wide adoption of a new generation of self-driving cars) It would connect autonomous vehicles in a way where they could talk to one another. It would also link a network of sensors built around a city, so that these cars would be able to drive around without bumping into other vehicles or hitting people. Baidu, the Chinese search engine company, successfully tested a self-driving car connected to a 5G network in March 2018. And in September, the Chinese government and China Mobile launched the country’s first 5G autonomous vehicle test site in Beijing with a 2.2-kilometre track. \n" +
  "       5G would also bring video game to a new level with (4)  (an enhanced VR experience that includes the sense of touch). It would also allow games to be stored via cloud computing and streamed to any device with the same performance levels as console-based games.\n" +
  "    Simply put, 5G technology has the potential to help (5)  (revolutionize many industries) . That’s why China is pushing hard to lead efforts in 5G development and deployment as part of the government’s Made in China 2025 Initiative. \n" +
  "\n" +
  "Task 8\n" +
  "Directions：Write down the words you hear and match them with the Chinese meanings. These words will appear in the report in Task . \n" +
  "\n" +
  "A. 图像   \t\tB. 控制台  \tC. 运动追踪的  \t\tD. 创伤    \tE. 收缩\n" +
  "F. 倾斜的               \tG. 过滤的   \t   H. 头像    \t\tI. 原型    \tJ. 隐形眼镜\n" +
  "\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "1\n" +
  " (shrink) \n" +
  " (E)  \n" +
  "6\n" +
  "   (tilted) \n" +
  "   (F) \n" +
  "2\n" +
  "   (graphics) \n" +
  "   (A) \n" +
  "7\n" +
  "   (prototype) \n" +
  "   (I) \n" +
  "3\n" +
  "   (filtered) \n" +
  "   (G) \n" +
  "8\n" +
  "   (motion-tracked) \n" +
  "   (C) \n" +
  "4\n" +
  "   (contact lenses) \n" +
  "   (J) \n" +
  "9\n" +
  "   (avatar) \n" +
  "   (H) \n" +
  "5\n" +
  "   (console) \n" +
  "   (B) \n" +
  "10\n" +
  "   (trauma) \n" +
  "   (D) \n" +
  "\n" +
  "\n" +
  "Task 9\n" +
  "Directions：Listen to a report for the first time and choose the best topic for it. \n" +
  "\n" +
  "\n" +
  " (C)\n" +
  " A. The History of VR\n" +
  " B. The Bright and Dark Sides of VR\n" +
  " C. The Future of VR\n" +
  " D. The Application of VR\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "Task 10\n" +
  "Directions：Listen to the report in Task 9 part by part and choose the best answer to each question. \n" +
  "\n" +
  "\n" +
  "Part One\n" +
  "Question 1: Consumers began to use VR when ________. (B)\n" +
  " A. many experiments were done in the 1960s\n" +
  " B. Nintendo released the Virtual Boy in 1995\n" +
  " C. Palmer Luckey invented the Oculus Rift in 2012\n" +
  " D. the technology became more affordable\n" +
  "Part Two\n" +
  "Question 2: According to the report, VR technology are being used in all the following areas EXCEPT_________ .(D)\n" +
  " A. military sector\n" +
  " B. medical sector\n" +
  " C. educational sector\n" +
  " D. industrial sector\n" +
  "Part Three\n" +
  "Question 3: It seems that the future of VR is __________. (C)\n" +
  " A. absolutely bright\n" +
  " B. absolutely gloomy\n" +
  " C. somewhat uncertain\n" +
  " D. inevitably destructive\n" +
  "\n" +
  "\n" +
  "Task 11\n" +
  "Directions：Listen to three sentences in the report and have a dictation. Every sentence will be read three times. \n" +
  "\n" +
  "\n" +
  "1.\n" +
  "Your answer：\n" +
  "Reference answer： There have been many experiments with virtual reality and augmented graphics in every decade since the 1960s.\n" +
  "2.\n" +
  "Your answer：\n" +
  "Reference answer： Kauffold says that lessons using VR immersion could be more engaging, rid the classroom of distractions, and give teachers further control of their students.\n" +
  "3.\n" +
  "Your answer：\n" +
  "Reference answer： Even though the future of VR and augmentation could be both dark and bright, all we can do is hope that we don’t end up as the lead role in our own personal episode of Black Mirror.\n" +
  "\n" +
  "\n" +
  "Task 14\n" +
  "Directions：Watch the video in Task 13 for the second time and note down the English terms in it. Their Chinese meanings are given. \n" +
  "\n" +
  "1. 电路  (circuit) \n" +
  "2. 芯片  (chip) \n" +
  "3. 中央处理器  (central processing unit )\n" +
  "4. 存储器  (memory )\n" +
  "5. 二进制的  (binary )\n" +
  "6. 执行  (execute)\n" +
  "7. 序列  ( sequence)\n" +
  "8. 长方形  (rectangle)\n" +
  "9. 操作系统  (the operating system)\n" +
  "10. 少量  ( fraction)\n" +
  "\n" +
  "Task 15\n" +
  "Directions：Watch the video in Task 13 with subtitles and retell the content. The outline is given. \n" +
  "\n" +
  "    A computer device consists of (1)  (hardware) and (2)  (software). Hardware includes. (3)  (circuits, chips, wires, speakers, plugs), and all other visible stuffs.(4)  (Software ) is all the programs running on the computer, including(5)  (applications, games, web pages, and the data science software ). \n" +
  "    (6)  (CPU) is the heart of a computer, which (7)  ( controls all the other parts of the computer). It receives commands, which can be represented (8)  (in binary ones and zeros or on and off electrical signals). The sequence of binary commands is actually (9)  (a very simple computer program). Binary code is (10)  (the most basic form of software and it controls all the hardware of a computer ).\n" +
  "      Inside every computer is (11)  (an operating system managing software) that controls the computer’s hardware. Binary code is (12)  (just electrical signals flowing through billions of tiny circuits). \n" +
  "\n" +
  "U4\n" +
  "Task 1\n" +
  "Directions：Listen carefully. Note down the academic words you hear. Every word will be read twice. Refer to your dictionary if necessary. \n" +
  "1.  (substitution ) [n.] the action of replacing someone or something with another person or thing\n" +
  "2.  ( interactive) [a.] (of a computer program or system) interacting with a human user\n" +
  "3.  (terminology ) [n.] specific words and expressions used in a particular field \n" +
  "4.  (legitimate) [a.] reasonable and sound\n" +
  "5.  ( clone) [v.] to make an exact copy of a living thing\n" +
  "6.  (comparative) [a.] connected with studying things to find out how similar or different they are\n" +
  "7.  (mediate) [v.] to bring about an agreement between persons or groups and act as a helper \n" +
  "8.  (sperm) [n.] male sex cell \n" +
  "9.  (utilize) [v.] to use something practically for a particular purpose \n" +
  "10.  (athletic) [a.] physically capable\n" +
  "11.  (virtual) [a.] noting or relating to digital technology or images that actively engage one’s senses and may create an altered mental state \n" +
  "12.  (niche ) [n.] an opportunity to sell a product or service to a particular group of people who have similar needs, interests etc. \n" +
  "13.  (molecular) [a.] relating to or involving molecules \n" +
  "14.  (standardize) [v.] to change something in order to make everything the same or make everything agree\n" +
  "15.  (neural) [a.] connected with a nerve or the nervous system \n" +
  "16.  (spontaneous) [a.] happening naturally, without being made to happen\n" +
  "17.  (rationality ) [n.] the state of having good sense and sound judgment\n" +
  "18.  ( ritual ) [n.] a series of actions that are always performed in the same way, especially as part of a religious ceremony\n" +
  "19.  (expertise) [n.] special skills or knowledge in a particular subject, that you learn by experience or training\n" +
  "20.  (project) [v.] to make light, an image, etc. fall onto a flat surface or screen \n" +
  "21.  (facilitate) [v.] to make an action or process easier\n" +
  "22.  (analogy) [n.] a comparison of things based on their similarity\n" +
  "23.  (toxic) [a.] poisonous; harmful \n" +
  "24.  (precipitation) [n.] rain, snow, etc. that falls; the amount of this that falls\n" +
  "25.  ( innate) [a.] present in a person or animal from the time of birth\n" +
  "26.  (differential ) [a.] showing or depending on a difference; not equal \n" +
  "27.  (soluble) [a.] (of a substance) capable of being dissolved in some solvent (usually water)\n" +
  "28.  (induction) [n.] the process by which electricity or magnetism passes from one object to another without them touching\n" +
  "29.  ( fluid) [a.] a material that can easily flow \n" +
  "30.  (lever) [n.] a handle that one pulls to operate a machine \n" +
  "31.  (consensus) [n.] an opinion that all members of a group agree with \n" +
  "32.  (marginal) [a.] small and not important \n" +
  "33.  (rhythm) [n.] a pattern of sound and beats in music \n" +
  "34.  (dissertation) [n.] a long piece of writing on a particular subject, especially one written for a university degree \n" +
  "35.  ( metabolism) [n.] the chemical processes of the body in which food is converted to energy \n" +
  "36.  (null) [a.] having the value zero; having no legal force \n" +
  "37.  (yeast ) [n.] a single-celled fungus used to make bread and beer \n" +
  "38.  (transaction) [n.] a piece of business that is done between people, especially an act of buying or selling \n" +
  "39.  (dissolve) [v.] to melt into a liquid so that a substance mixes with the liquid itself \n" +
  "40.  (longitudinal) [a.] going from the top to the bottom of something \n" +
  "41.  (mobility) [n.] the ability to move \n" +
  "42.  (criteria) [n.] standard used to make judgments or decisions \n" +
  "43.  (rotate ) [v.] to move or turn around a central point \n" +
  "44.  (sophisticate) [n.] a sophisticated person \n" +
  "45.  (artificial) [a.] not real or not made of natural things but made to be like something that is real or natural \n" +
  "46.  (inhibit) [v.] to make it difficult for a process to start or continue in a normal way \n" +
  "47.  (discrete) [a.] separate; composed of distinct parts \n" +
  "48.  (turbulent) [a.] moving violently and unevenly \n" +
  "49.  (embed) [v.] to fix something firmly into a substance or solid object \n" +
  "50.  (nonlinear) [a.] not in a line\n" +
  "\n" +
  "Task 2\n" +
  "Directions：Choose the words from the list in Task 1 that match the Chinese meanings below. \n" +
  "分子的  (molecular)\n" +
  "2. 人工的  (artificial )\n" +
  "3. 交互的  (interactive )\n" +
  "4. 非线性的  ( nonlinear )\n" +
  "5. 虚拟的  (virtual)\n" +
  "6. 新陈代谢  (metabolism)\n" +
  "7. 术语  (terminology)\n" +
  "8. 操纵杆  ( lever )\n" +
  "9. 流体  (fluid)\n" +
  "10. 纵向的  (longitudinal)\n" +
  "Task 3\n" +
  "Directions: Listen to the following sentences and fill in the blanks with appropriate words from the word list in Task 1. \n" +
  "\n" +
  "Industrialization will open up increasing chances of social  (mobility) . \n" +
  "2. A major effort has been made to  (standardize) the way in which the data are displayed for the user.\n" +
  "3. Digital watermarking technology allows users to  (embed) a digital code into audio, images, video and printed documents that is imperceptible during normal use but readable by computers and software.\n" +
  "4. These activities can  (facilitate) product development in markets where the risks are high. \n" +
  "5. The atoms in iron, in contrast, do not cluster into  (discrete) molecules. \n" +
  "6. Large chunks of money and technical  (expertise ) went into the production of these films. \n" +
  "7. It is slightly  (soluble) in water, alcohol, and a few other common liquids. \n" +
  "8. Vitamin C helps your body  (utilize ) the iron present in your diet. \n" +
  "9. The vacuum proceeds almost at random across the floor, only knowing to  ( rotate) and keep moving when it hits an object.\n" +
  "10. There is a limited  (analogy) between the relation of theology to religious discourse and the relation of logic to language.\n" +
  "\n" +
  "Task 4\n" +
  "Directions：Listen to the following piece and fill in the missing words and terms. \n" +
  "The Internet of things (IoT) is a (1)  (computing concept) that describes the idea of everyday physical objects being connected to the Internet and being able to (2)  (identify themselves to other devices).\n" +
  "    There are numerous (3)  (real-world applications) of the Internet of things, ranging from consumer IoT and enterprise IoT to manufacturing and industrial IoT(IIoT). IoT applications span numerous verticals, including automotive, telco, energy and more. \n" +
  "    In the consumer segment, for example (4)  (smart homes) that are equipped with smart thermostats, smart appliances and connected heating, lighting and electronic devices can be controlled remotely via (5)  (computers, smartphones or other mobile devices).\n" +
  "    (6)  (Smart buildings) can, for instance, reduce energy costs using (7)  (sensors) that detect how many occupants are in a room. The temperature can (8)  (adjust automatically) —for example, turning the air conditioner on if sensors detect a conference room is full or turning the heat down if everyone in the office has gone. \n" +
  "   In a smart city, IoT sensors and deployments, such as smart streetlights and smart meters, can help (9)  ( alleviate traffic), conserve energy, monitor and address environmental concerns, and (10)  (improve sanitation).\n" +
  "\n" +
  "Task 5\n" +
  "Directions：Watch a video about IoT and answer the questions. \n" +
  "\n" +
  "1.What are the major risks posed by IoT?\n" +
  "Your answer：\n" +
  "Reference answer： Security risks.\n" +
  "2. What are the reasons for the threats?\n" +
  "Your answer：\n" +
  "Reference answer： Security vulnerabilities in the IoT devices can be exploited by hackers so that they may become uninvited guests to people’s homes.\n" +
  "Task 6\n" +
  "Directions: Watch a short video and complete the outline below. \n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "Plan of China:\n" +
  "Your answer：\n" +
  "Reference answer： China will officially begin the actual development of 6G in 2020;\n" +
  "begin commercial use until 2030.\n" +
  "Differences between 6G and 5G: \n" +
  "Your answer：\n" +
  "Reference answer： 6G networks will be a thousand times faster than 5G; \n" +
  "connect to all the devices people use;\n" +
  "achieve better application in large bandwidth, low latency and wide connection.\n" +
  "Benefits of 6G:\n" +
  "Your answer：\n" +
  "Reference answer： fast download speed;\n" +
  "greatly improved Internet of Everything;\n" +
  "greatly improved machine-to-machine communication;\n" +
  "high-definition video stream; \n" +
  "impact on autonomous vehicles, Car-Internet, smart homes, remote diagnostics and remote education\n" +
  "Task 7\n" +
  "Directions：Listen to a report about China’s Beidou navigation system and fill in the missing words. \n" +
  "What did people use before GPS? A compass. And don’t forget the stars! The Big Dipper was possibly the most commonly used navigation tool. It is one of the most easily observable star patterns in the northern celestial hemisphere. In ancient China, (1)  (people also navigated by the Big Dipper)—called Beidou in Chinese.\n" +
  "     Inspired by these “navigation stars”, China developed its own navigation satellite system named Beidou. Following the US’s GPS, Russia’s GLONASS and the EU’s Galileo, Beidou is (2)  (the world’s fourth navigation satellite system).\n" +
  "      The use of Beidou in China started in 2000. 12 years later, it reached the Asia-Pacific region. And by 2020, it is expected to go global.\n" +
  "     Now, China is upgrading Beidou from previous networks Beidou-1 and Beidou-2 to Beidou-3 that can achieve (3)  (global coverage). The fully operational Beidou-3 network will consist of more than 30 satellites, sending signals (4)  (that are compatible with GPS). The user of either system could use the other one without any extra costs.\n" +
  "     Beidou is intended for both military and civil uses, offering (5)  (positioning, navigation, timing and short-messaging services) . It has been widely used in transportation, fishing, agriculture, and disaster relief.\n" +
  "Task 8\n" +
  "Directions：Write down the words you hear and match them with the Chinese meanings. These words will appear in the report in Task  \n" +
  "A. 地球静止轨道   \t\tB. 模拟  \tC. 光纤  \t\tD. 分组交换    \tE. 边缘\n" +
  "F. 共识               \tG. 成指数倍增地   \t   H. 可持续的    \t\tI. 和谐，一致    \tJ. 海啸\n" +
  "\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "1\n" +
  " (brink) \n" +
  " (E)  \n" +
  "6\n" +
  "   (tsunami) \n" +
  "   (J) \n" +
  "2\n" +
  "   (optical fiber) \n" +
  "   (C) \n" +
  "7\n" +
  "   (packet switching) \n" +
  "   (D) \n" +
  "3\n" +
  "   (unison) \n" +
  "   (I) \n" +
  "8\n" +
  "   (analog) \n" +
  "   (B) \n" +
  "4\n" +
  "   (consensus) \n" +
  "   (F) \n" +
  "9\n" +
  "   (sustainable) \n" +
  "   (H) \n" +
  "5\n" +
  "   (exponentially) \n" +
  "   (G) \n" +
  "10\n" +
  "   (geostationary orbit) \n" +
  "   (A) \n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "Task 9\n" +
  "Directions：Listen to a report for the first time and choose the best topic for it. \n" +
  " (B)\n" +
  " A. The History of ITU\n" +
  " B. The Standardization of ITU\n" +
  " C. The Importance of ITU\n" +
  " D. The Future of ITU\n" +
  "Task 10\n" +
  "Directions：Listen to the report in Task 9 part by part and choose the best answer to each question. \n" +
  "Part One\n" +
  "Question 1: _______ makes/made the basis for the transition to packet switching. (D)\n" +
  " A. The first voice call crossing the Atlantic from Canada to Scotland in 1956\n" +
  " B. The first communication satellite installed in a geostationary orbit in 1964\n" +
  " C. The digital revolution resulting from the creation and advances of the Internet in 1980s\n" +
  " D. The international standards developed by International Telecommunication Union (ITU)\n" +
  "Part Two\n" +
  "Question 2: The international standards enables the _______ of the world. (C)\n" +
  " A. sustainability\n" +
  " B. digitalization\n" +
  " C. connectivity\n" +
  " D. automation\n" +
  "Part Three\n" +
  "Question 3: It is implied that _____________________________________. (D)\n" +
  " A. the standards promote the education in developing countries\n" +
  " B. the standards ensure the efficiency of climate warning systems\n" +
  " C. the standards lay the foundation for international collaboration\n" +
  " D. the standards improve the harmony between physical reality and virtual world\n" +
  "\n" +
  "Task 11\n" +
  "Directions：Listen to three sentences in the report and have a dictation. Every sentence will be read three times. \n" +
  "1.\n" +
  "Your answer：\n" +
  "Reference answer： In 1964, the first communication satellite was installed in a geostationary orbit.\n" +
  "2.\n" +
  "Your answer：\n" +
  "Reference answer： Optical fiber networks were installed and the transition to packet switching began—the highly efficient triple play of voice, video, and data. \n" +
  "3.\n" +
  "Your answer：\n" +
  "Reference answer： ITU standardization is working to build a human-centric ICT environment, where physical space and cyberspace are managed in unison.\n" +
  "Task 12\n" +
  "Directions：Listen to the report in Task 9 for the final time and answer the question in your own words. \n" +
  "Question: How do you understand ITU standardization will work to ensure that our digital identities are as trusted as our identities in the real world? \n" +
  "Your answer：\n" +
  "Reference answer： \n" +
  "Task 13\n" +
  "Directions：Watch a video without subtitles and tell what it is about.\n" +
  "Your answer：\n" +
  "Reference answer：\n" +
  "\n" +
  "\n" +
  "Task 14\n" +
  "Directions：Watch the video in Task 13 for the second time and note down the English terms in it. Their Chinese meanings are given. \n" +
  "嵌入  (embed) \n" +
  "2. 平台  (platform) \n" +
  "3. 引发，触发  (trigger)\n" +
  "4. 制动管路  (brake line)\n" +
  "5. 诊断总线  (diagnostic bus)\n" +
  "6. 网关  (gateway)\n" +
  "7. 优惠券  (coupon)\n" +
  "8. 保修单  ( warranty)\n" +
  "9. 精准确定  (pinpoint)\n" +
  "10. 库存  (inventory)\n" +
  "Task 15\n" +
  "Directions：Watch the video in Task 13 with subtitles and retell the content. The outline is given. \n" +
  "The Internet of Things (IoT) is the network of devices such as (1)  (vehicles), and (2)  (home appliances), making a platform that (3)  ( brings us diverse information together and provides the common language for the devices and apps to communicate with each other ). Valuable data can be gathered (4)  (by sophisticated sensors and chips ) embedded in (5)  ( the physical things that surround us).\n" +
  "   For example, a driver can make sure (6)  (whether it’s something minor or something that needs immediate attention ) with relevant diagnostic information (7)  (being transmitted to the manufacturer’s platform ). With a historical record (8)  (in a secure database) and (9)  (rules and logic) added by the manufacturer, the driver may receive (10)  (an alert in the car).\n" +
  "  In addition, the manufacturer can use the platform to (11)  (create and manage applications that solve specific issues), to (12)  (deploy an application on the platform called the asset management system),and to (13)  (deploy a continuous engineering application that tracks not only one person’s car, but hundreds of thousands of others, looking for ways to improve the design and manufacturing process of the car itself).\n" +
  "\n" +
  "\n" +
  "U5\n" +
  "Task 1\n" +
  "Directions：Listen carefully. Note down the academic words you hear. Every word will be read twice. Refer to your dictionary if necessary. \n" +
  "1.  (monopoly) [n.] the complete control of the market for a service or product\n" +
  "2.  (proton) [n.] a very small part of an atom that has a positive electrical charge\n" +
  "3.  (complement) [n.] a thing that adds new qualities to something in a way that improves it or makes it more attractive \n" +
  "4.  (interface) [n.] a shared boundary between two persons or systems through which information is communicated\n" +
  "5.  (dilute) [v.] to make something weaker or less effective \n" +
  "6.  (scatter) [v.] to make things separate and go in different directions\n" +
  "7.  (circulation) [n.] the movement of blood through the body\n" +
  "8.  (logical) [a.] sensible; reasonable \n" +
  "9.  (constrain) [v.] to make someone do something by strong persuasion or force \n" +
  "10.  (vitamin) [n.] a natural substance found in food that is an essential part of what humans and animals eat to help them grow and stay healthy \n" +
  "11.  (magnetic) [a.] having the properties of a magnet; being able to attract\n" +
  "12.  (reactive) [a.] easily reacting to; responsive\n" +
  "13.  (swap) [v.] to trade or exchange \n" +
  "14.  (missile) [n.] a weapon that is sent through the air and that explodes when it hits the thing that it is aimed at\n" +
  "15.  (tremendous) [a.] having great size, excellence, or power \n" +
  "16.  (mercury) [n.] a heavy, silver-white metal that is used in thermometers to measure temperature \n" +
  "17.  (cord) [n.] an electrical wire \n" +
  "18.  (replicate) [v.] to repeat something, such as an experiment, study or process\n" +
  "19.  (mole) [n.] a unit for measuring the amount of substance \n" +
  "20.  (immersive) [a.] temporarily simulated or extended by computer software \n" +
  "21.  (repertoire) [n.] a collection of skills or accomplishments\n" +
  "22.  (antibody) [n.] a defense provided by the body against disease\n" +
  "23.  (static) [a.] being unchangeable or unmovable \n" +
  "24.  (conservation) [n.] the management of land and water in ways that stop it from being damaged \n" +
  "25.  (multiply) [v.] to increase greatly in number \n" +
  "26.  (antibiotic) [n.] a substance, for example penicillin, that can destroy or prevent the growth of bacteria and cure infections\n" +
  "27.  (simulate) [v.] to look, feel, or behave like something\n" +
  "28.  (feedback) [n.] a response to a message\n" +
  "29.  (marrow) [n.] a soft, fatty tissue inside bones\n" +
  "30.  (coordination) [n.] the act of making parts of something, groups of people, etc. work together in an efficient and organized way \n" +
  "31.  (articulate) [v.] to express something clearly using language \n" +
  "32.  (linear ) [a.] of or in lines \n" +
  "33.  (sodium) [n.] a common silver-white metal that usually exists in combination with other substances \n" +
  "34.  ( nitrogen) [n.] a gas that has no colour or smell, and that forms most of the Earth’s air\n" +
  "35.  (assert) [v.] to state or declare your ideas positively strongly\n" +
  "36.  (numerical) [a.] expressed or considered in numbers \n" +
  "37.  (predominantly) [ad.] in a way that is larger, greater or has more power than others \n" +
  "38.  (potassium) [n.] a common, soft, silvery white metal that is usually used for farming or industrial purposes \n" +
  "39.  (flux) [n.] a flow; an act of flowing \n" +
  "40.  ( inhibition) [n.] the act of blocking or holding back \n" +
  "41.  (factorial) [a.] concerning factors or factorials \n" +
  "42.  (unintelligible) [a.] impossible to understand \n" +
  "43.  (dissection) [n.] the act of cutting up a dead person or animal to study it \n" +
  "44.  (variant) [n.] a thing that is a slightly different form or type of something else\n" +
  "45.  (beam) [n.] a line of light or energy\n" +
  "46.  (forum ) [n.] an organization, meeting, TV programme, etc. where people have a chance to publicly discuss an important subject \n" +
  "47.  (correlation ) [n.] a connection between two things in which one thing changes as the other does\n" +
  "48.  (enzyme) [n.] a substance, produced by all living things, which helps a chemical change happen or happen more quickly, without being changed itself\n" +
  "49.  (dimensional) [a.] of or relating to dimensions\n" +
  "50.  (momentum) [n.] the quantity of movement of a moving object, measured as its mass multiplied by its speed\n" +
  "Task 2\n" +
  "Directions：Choose the words from the list in Task 1 that match the Chinese meanings below. \n" +
  "1. 抗生素  (antibiotic)\n" +
  "2. 动量  (momentum)\n" +
  "3. 质子  (proton)\n" +
  "4. 光束  (beam)\n" +
  "5. 酶  (enzyme)\n" +
  "6. 界面  (interface)\n" +
  "7. 通量  (flux)\n" +
  "8. 维他命  (vitamin)\n" +
  "9. 氮  (nitrogen)\n" +
  "10. 钠  (sodium)\n" +
  "\n" +
  "Task 3\n" +
  "Directions: Listen to the following sentences and fill in the blanks with appropriate words from the word list in Task 1. \n" +
  "\n" +
  "1. The third example of synthesis involves  (feedback) between ecosystems and climate.\n" +
  "2.If active and  (reactive) power are not properly balanced, voltage collapse may occur in one part of the system and could propagate system failure.\n" +
  "3. Computer crimes are frequently online  (variants) of established crimes, like fraud and blackmail.\n" +
  "4. Architects have no unique insights into these questions and have no  (monopoly) on the answers but, as citizens, they have as much to offer as anyone else.\n" +
  "5.Other researchers have already had made some progress  (simulating) turbulence with powerful computer models.\n" +
  "6. There is a clear  (correlation) between petrol price and consumption.\n" +
  "7. It works on strict adherence to the scientific method, through double-blind studies, good lab practices, etc. and the ability to  (replicate) results.\n" +
  "8. Spacecraft that visit Jupiter must be designed to remain unaffected by this powerful  (magnetic) field.\n" +
  "9.These electrons are then accelerated by a  (static) electric field towards a fluorescent screen.\n" +
  "10. Enhanced carbon dioxide levels have some effect, but the worst offender is sulphur dioxide, which dissolves in water and acts as a  (dilute) acid.\n" +
  "\n" +
  "Task 4\n" +
  "Directions：Listen to the following piece and fill in the missing words and terms. \n" +
  "\n" +
  "    AI as a concept refers to (1) (computing hardware) being able to essentially think for itself, and make decisions based on(2)  (the data) it is being fed. AI systems are often hugely (3) (complex and powerful) , with the ability to process unfathomable depths of information in an extremely quick time in order to come to(4)  (an effective conclusion).\n" +
  "   Thanks to (4) (detailed algorithms), AI systems are now able to perform mammoth(5)  (computing Tasks) much faster and more efficiently than (6) (human minds), helping making big strides in research and development areas around the world.\n" +
  "   There seems no limit to the (7) (applications) of AI technologies, and perhaps the most exciting aspect of the (8) (ecosystem) is that there’s no telling where it can go next, and what problems (9) (it may ultimately be able to solve ). \n" +
  "\n" +
  "Task 5\n" +
  "Directions：Watch a video about machine learning and answer the questions\n" +
  "1. In what areas has machine learning been used? \n" +
  "Your answer：\n" +
  "Reference answer： Social media sites use it to create your feed based on your preferences and search engines use it to improve the accuracy of their search results. It’s also being used on a larger scale: the medical industry is applying machine learning to things like predicting life spans, organizing patient data and even diagnosing certain diseases. \n" +
  "2. What is the possible negative effect of machine leaning?\n" +
  "Your answer：\n" +
  "Reference answer： There is a concern that machine learning, just like many emergent technologies, may eliminate certain jobs.\n" +
  "Task 6\n" +
  "Directions: Watch a short video and complete the outline below. \n" +
  "\n" +
  "\n" +
  "Functions of five robots that are changing everything:\n" +
  "1. RoboSimian: \n" +
  "Your answer：\n" +
  "Reference answer： executing rescue missions\n" +
  "2. Ada: \n" +
  "Your answer：\n" +
  "Reference answer： 3D printing \n" +
  "3. Phoenix:\n" +
  "Your answer：\n" +
  "Reference answer： assisting human beings to do things that you cannot do on your own \n" +
  "(lifting heavy things, help disabled people in mobility)\n" +
  "4. Pepper:\n" +
  "Your answer：\n" +
  "Reference answer： emotional intelligence\n" +
  "5. Curiosity Mars Rover:\n" +
  "Your answer：\n" +
  "Reference answer： using very little power and accomplish a lot (e.g. in medical treatment)\n" +
  "\n" +
  "\n" +
  "Task 7\n" +
  "Directions：Listen to a report about a FashionAI concept store in China and fill in the missing words. \n" +
  "\n" +
  "  Fashionable, accessible and seamless. Alibaba has opened a new FashionAI concept store right next to Hong Kong Polytechnic University’s fashion faculty, where (1)  (academics, engineers and fashionists are working together to envision the future of fashion retail)\n" +
  "    Check into the concept store with a Mobile Taobao ID code, and shoppers can opt in to a face scan for a more personalized experience. You can browse around like you would at any clothing store. The difference is that (2)  (items you pick up from RFID-enabled clothing rack will automatically show up on the Mirror). The smart mirror also shows personalized mix-and-match options to complete the look. It also directs shoppers to where other suggested items can be found inside the store.\n" +
  "    For people that like “try before they buy” like me, there is no need to carry around a pile of clothes while you shop. Just (3)  (add items to your virtual shopping car), and head to the fitting room hand-free.\n" +
  "   There is more to the FashionAI concept store than its futuristic appeal.(4)  (Real-time analytics enable staff to move much faster and provide customers with an efficient, stress-free experience). It also helps brands to maintain their inventory. Before entering the fitting room where there aren’t any cameras installed, the stuff scan your Taobao ID code to connect your account to the Mirror. Use the Mirror to look through the selected items and update size and colour changes. The Mirror will alert the staff to bring in the garment or shoes in the new size or colour.\n" +
  "    With FashionAI, you never have to worry about how to put an outfit together. Can’t make up your mind? Shoppers can also browse through a virtual wardrobe on Mobile Taobao to see the clothes they’ve tried in-store, and (5)  (explore more mix-and-match options from other brands) on Alibaba’s e-commerce site, Taobao and Tmall. \n" +
  "\n" +
  "\n" +
  "Task 8\n" +
  "Directions：Write down the words you hear and match them with the Chinese meanings. These words will appear in the report in Task . \n" +
  "\n" +
  "A. 人形的   \t\tB. 被引用的  \tC. 交通  \t\tD. 后勤    \tE. 机车\n" +
  "F. （火车）制动员               \tG. 急剧上升   \t   H. 复制    \t\tI. 同情    \tJ. 再培训\n" +
  "\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "1\n" +
  " (surge ) \n" +
  " (G)  \n" +
  "6\n" +
  "   (brakeman) \n" +
  "   (F) \n" +
  "2\n" +
  "   (locomotive) \n" +
  "   (E) \n" +
  "7\n" +
  "   (humanoid) \n" +
  "   (A) \n" +
  "3\n" +
  "   ( cited) \n" +
  "   (B) \n" +
  "8\n" +
  "   (retrain) \n" +
  "   (J) \n" +
  "4\n" +
  "   (transportation) \n" +
  "   (C) \n" +
  "9\n" +
  "   (logistics) \n" +
  "   (D) \n" +
  "5\n" +
  "   ( empathy) \n" +
  "   (I) \n" +
  "10\n" +
  "   (replicate) \n" +
  "   (H) \n" +
  "\n" +
  "\n" +
  "Task 9\n" +
  "Directions：Listen to a report for the first time and choose the best topic for it. \n" +
  "\n" +
  "\n" +
  " (C)\n" +
  " A. Are robots increasingly part of our daily life?\n" +
  " B. Will robots do everything better than us?\n" +
  " C. Will robots take our jobs?\n" +
  " D. Will robots be our friends in the workplace?\n" +
  "\n" +
  "\n" +
  "Task 10\n" +
  "Directions：Listen to the report in Task 9 part by part and choose the best answer to each question. \n" +
  "\n" +
  "\n" +
  "Part One\n" +
  "Question 1: Why are robots replacing humans in some areas?  (D)\n" +
  " A. Because a humanoid robot acts like a human.\n" +
  " B. Because robots are good at doing repetitive and predictable Tasks.\n" +
  " C. Because robots are friendly and smart.\n" +
  " D. Because robots can work 7/24 without pay.\n" +
  "Part Two\n" +
  "Question 2: It is suggested that ________. (B)\n" +
  " A. our jobs are disappearing because of automation\n" +
  " B. the jobs for us are more and more demanding\n" +
  " C. news jobs will be created by automation\n" +
  " D. all economists agree on the threat of robots\n" +
  "Part Three\n" +
  "Question 3: What problem will the rise of robots lead to?  (A)\n" +
  " A. Wider income gap\n" +
  " B. Higher unemployment rate\n" +
  " C. Conflicts between humans and robots\n" +
  " D. Shortage of nurses and babysitters\n" +
  "\n" +
  "\n" +
  "Task 11\n" +
  "Directions：Listen to three sentences in the report and have a dictation. Every sentence will be read three times. \n" +
  "\n" +
  "\n" +
  "1.\n" +
  "Your answer：\n" +
  "Reference answer： There's no denying robots and automation are increasingly part of our daily lives.\n" +
  "2.\n" +
  "Your answer：\n" +
  "Reference answer： Occupations that require repetitive and predictable Tasks in transportation, logistics, and administrative support were at specially high risk.\n" +
  "3.\n" +
  "Your answer：\n" +
  "Reference answer： It's hard to imagine that robots can replicate human characteristics like empathy or compassion that are required in many jobs.\n" +
  "\n" +
  "\n" +
  "Task 12\n" +
  "Directions：Listen to the report in Task 9 for the final time and answer the question in your own words. \n" +
  "\n" +
  "\n" +
  "Question: What do you think of relationship between humans and humanoid robots in the future?\n" +
  "Your answer：\n" +
  "Reference answer： \n" +
  "\n" +
  "\n" +
  "Task 13\n" +
  "Directions：Watch a video without subtitles and tell what it is about.\n" +
  "Your answer：\n" +
  "Reference answer：\n" +
  "Task 14\n" +
  "Directions：Watch the video in Task 13 for the second time and note down the English terms in it. Their Chinese meanings are given. \n" +
  "\n" +
  "1. 深度学习  (deep learning) \n" +
  "2. 计算程序  (algorithm) \n" +
  "3. 模仿  (mimic)\n" +
  "4. 弱人工智能  (weak AI)\n" +
  "5. 强人工智能  (strong AI)\n" +
  "6. 无人监督的  (unsupervised)\n" +
  "7. 神经的  (neural)\n" +
  "8. 节点  (node)\n" +
  "9. 浩繁的  (voluminous )\n" +
  "10. 子集  (subset)\n" +
  "\n" +
  "Task 15\n" +
  "Directions：Watch the video in Task 13 with subtitles and retell the content. The outline is given. \n" +
  "\n" +
  "   (1)  (Artificial intelligence, machine learning and deep learning)are crucial for the field of data science, helping scientists and analysts (2)  (interpret tons of data). (3)  (Artificial intelligence) includes (4)  (machine learning), and (5)  (deep learning)is the subset of (6)  (machine learning).\n" +
  "   Artificial intelligence is (7)  (simply any code, technique or algorithm that enables machines to mimic, develop and demonstrate human cognition or behavior ). We are now in the era of (8)  (weak AI ) and on the way to (9)  (strong AI ). Machine learning is typical of (10)  (using techniques and processes to help machines learn the ways of humans) Machine learning is either (11)  (supervised) or (12)  (unsupervised). When machines can draw meaningful inferences from large volumes of data sets, (13)  (they demonstrate the ability to learn deeply). Most modern deep learning models are based on (14)  (an artificial neural network), which are inspired by (15)  (the biological neural networks ) that constitute animal brains. These networks contain (16)  (nodes) in different (17)  (layers) that are connected and communicate with each other to make sense of (18)  (voluminous input data ). \n" +
  "\n" +
  "U6\n" +
  "Task 1\n" +
  "Directions：Listen carefully. Note down the academic words you hear. Every word will be read twice. Refer to your dictionary if necessary. \n" +
  "1.  (nutrient) [n.] a substance that is needed to keep a living thing alive and to help it to grow\n" +
  "2.  (accelerate) [v.] to increase the speed or rate of something\n" +
  "3.  (multinational) [a.] involving many countries \n" +
  "4.  (enforcement ) [n.] the act or process of making sure that rules are followed\n" +
  "5.  (sensible) [a.] able to make good judgments based on reason and experience rather than emotion\n" +
  "6.  (triangle) [n.] a flat shape with three straight sides and three angles\n" +
  "7.  (elasticity) [n.] the ability to stretch easily and then quickly return to the original shape \n" +
  "8.  (derivative) [n.] a word or thing that has been developed or produced from another word or thing \n" +
  "9.  (immune) [a.] not affected by something, such as disease \n" +
  "10.  (plug) [n.] an electrical device with two or three pins that is inserted in a socket to make an electrical connection\n" +
  "11.  (shuttle) [n.] a plane, bus or train that travels regularly between two places \n" +
  "12.  (projection) [n.] an image on a screen\n" +
  "13.  ( urine) [n.] the yellow liquid waste that comes out of the body from the bladder \n" +
  "14.  (radiation) [n.] energy that is radiated or transmitted in the form of rays, waves or particles\n" +
  "15.  (protocol) [n.] a set of rules\n" +
  "16.  (scroll) [v.] to move text on a computer screen up or down so that you can read different parts of it\n" +
  "17.  (transformation) [n.] a complete change in shape or form of something\n" +
  "18.  ( spatial) [a.] relating to space and the position, size, shape, etc. of things in it\n" +
  "19.  (degrade) [v.] to reduce in amount or strength\n" +
  "20.  ( interval) [n.] a period of time between two events \n" +
  "21.  (jargon) [n.] words or expressions that are used by a particular profession or group of people, and are difficult for others to understand\n" +
  "22.  (uplift ) [v.] to make someone feel happier or more hopeful\n" +
  "23.  ( notation) [n.] a set of written signs or shapes that are used in music or mathematics \n" +
  "24.  (binary) [a.] using only 0 and 1 as a system of numbers\n" +
  "25.  (distribution) [n.] the act of giving or delivering something to a number of people\n" +
  "26.  (photographic) [a.] concerning the art of making images with cameras\n" +
  "27.  (customize) [v.] to make or change something according to the buyer’s or user’s needs\n" +
  "28.  (conceptual ) [a.] related to or based on ideas\n" +
  "29.  (reactor) [n.] a large structure used for the controlled production of nuclear energy \n" +
  "30.  (pi) [n.] the ratio of the circumference to the diameter of a circle \n" +
  "31.  (crystal) [n.] a solid formed by the solidification of a chemical \n" +
  "32.  (overlap) [v.] to cover something partly by going over its edge \n" +
  "33.  (tech ) [n.] short for “technology”\n" +
  "34.  (subtract) [v.] to take a number or an amount away from another number or amount \n" +
  "35.  (flip) [v.] to turn over into a different position with a sudden quick movement \n" +
  "36.  (diffusion) [n.] the movement of light in many directions \n" +
  "37.  (precipitate) [v.] to cause to happen \n" +
  "38.  (duration ) [n.] the length of time that something lasts \n" +
  "39.  ( cortex) [n.] the outer part of an organ or structure \n" +
  "40.  (encode) [v.] to convert (a message, information, etc.) into code \n" +
  "41.  (reservoir) [n.] a lake, usually artificial, where water is collected and stored for the use of a community or industry \n" +
  "42.  (splice) [n.] a join between two pieces of something so that they form one long piece \n" +
  "43.  (stadium) [n.] a very large building with a sports field and rows of seats all around that is used for various events\n" +
  "44.  (ecology) [n.] the study of plants, animals, people, and their environments\n" +
  "45.  ( fluorescent) [a.] strikingly bright, vivid, or glowing \n" +
  "46.  (outsource) [v.] (of a company or organization) to purchase (goods) or subcontract (services) from an outside supplier or source \n" +
  "47.  (retrieve) [v.] to find and get something from somewhere\n" +
  "48.  (norm ) [n.] an established standard of performance or behavior \n" +
  "49.  ( threshold) [n.] a level or point at which something would start or stop happening\n" +
  "50.  ( flexibility) [n.] the quality of being able to be bent or stretched\n" +
  "\n" +
  "Task 2\n" +
  "Directions：Choose the words from the list in Task 1 that match the Chinese meanings below. \n" +
  "1. 反应堆  (reactor)\n" +
  "2. 行话  ( jargon)\n" +
  "3. 外包  (outsource)\n" +
  "4. 三角  ( triangle)\n" +
  "5. 体育场  (stadium)\n" +
  "6. 简谱  (notation)\n" +
  "7. 拼接处  (splice)\n" +
  "8. 二进制的  (binary )\n" +
  "9. 皮质  (cortex )\n" +
  "10. 荧光的  ( fluorescent)\n" +
  "\n" +
  "Task 3\n" +
  "Directions: Listen to the following sentences and fill in the blanks with appropriate words from the word list in Task 1. \n" +
  "1. If you  (scroll) down the page a little, you can see my pictures. \n" +
  "2. A global system implies the emergence of  (multinational) companies which operate in a number of states, and which own especial loyalty to no one state.\n" +
  "3. Using a database ensures that we can store and  (retrieve) data needed by our web application without having to create our own persistent storage layer.\n" +
  "4. Think about how plastic and rubber made from hydrocarbons  (degrade) under exposure to sunlight. \n" +
  "5. Foreign banks have a more sophisticated system for evaluating and pricing credit risks associated with  (derivative) products. \n" +
  "6. Modifying or  (customizing ) a vehicle has also become a trend among car enthusiasts nowadays. \n" +
  "7. Radioactivity is the process of emission of  (radiation) as a radioactive material changes form, often to a different element. \n" +
  "8. Interconnectedness also contributes to the rapid  (diffusion) of ideas and technology. \n" +
  "9. The radical  (conceptual) design by leading architect Will Alsop may not be quite what residents imagined. \n" +
  "10. According to experts, several printer companies quietly  (encode) the serial number and the manufacturing code of their color laser printers and color copiers on every document those machines produce. \n" +
  "\n" +
  "Task 4\n" +
  "Directions：Listen to the following piece and fill in the missing words and terms. \n" +
  "    There are in fact a number of different (1)  (subtypes) , of additive manufacturing including not only (2)  (3D printing), but also rapid prototyping and direct digital manufacturing (DDM). Recent advances in this technology have seen its use become far more widespread and it offers (3)  (exciting possibilities) for future development. \n" +
  "     The clue to the basics of additive manufacturing: rather than producing an end result by (4)  (taking material away), it (5)  (adds to it) instead. \n" +
  "   Traditional manufacturing methods involve a material being carved or shaped into the desired product by parts of it (6)  (being removed) in a variety of ways. Additive manufacturing is the pole opposite; (7)  (structures are made) by the addition of thousands of (8)  (minuscule layers) which combine to create the product. The process involves the use of a computer and special CAD software which can (9)  (relay messages) to the printer so it “prints” in (10)  (the desired shape). \n" +
  "\n" +
  "Task 5\n" +
  "Directions：Watch a video about Audi smart factory and answer the questions. \n" +
  "\n" +
  "1.What can smart factory bring to industrial production?\n" +
  "Your answer：\n" +
  "Reference answer： The smart factory optimizes production processes and increases efficiency.\n" +
  "2.How are advanced techniques used in Audi smart factory?\n" +
  "Your answer：\n" +
  "Reference answer： a) Augmented Reality: Augmented reality adds virtual information to the real world environment; data goggles simplify assembly Tasks.\n" +
  "\n" +
  "b) Big Data: High-performance computers analyze vast amounts of data and identify correlations.\n" +
  "\n" +
  "c) Virtual Factory Plan: Production segments are planned virtually in every respect and checked using computer simulations to confirm that everything is working properly and ergonomically sound.\n" +
  "\n" +
  "d) Innovative Procedures: State-of-the-art 3D printers create new forms based on the ideal model of nature; with an intelligent material mix, lighter, more stable and more precise tools are built.\n" +
  "\n" +
  "e) Wearable Exoskeleton: Employees can perform assembly activities either seated or standing without additional physical stress or strain.\n" +
  "\n" +
  "f) Human-Robot Collaboration: Humans and robots work hand-in-hand on the production line.\n" +
  "\n" +
  "g) Driverless Transport System: Autonomous transport systems are revolutionizing logistics on the ground and in the air.\n" +
  "\n" +
  "\n" +
  "Task 6\n" +
  "Directions: Watch a short video and complete the outline below. \n" +
  "\n" +
  "Ultimate goal:\n" +
  "Your answer：\n" +
  "Reference answer： creating specific engineered tissues or whole organs to match individual’s unique anatomy with no immune rejection.\n" +
  "Advantages of the technique:\n" +
  "Your answer：\n" +
  "Reference answer： great control in building materials and structures in 3D.\n" +
  "Difficulties of the technique:\n" +
  "Your answer：\n" +
  "Reference answer： tough to deal with soft material like collagen.\n" +
  "Process of the test:\n" +
  "Your answer：\n" +
  "Reference answer： 3D print the artery made out of a gel inside a support gel made out of gelatin at room temperature;\n" +
  "place the whole thing in the cell culture incubator at 37℃;\n" +
  "melt the gelatin around the artery into liquid;\n" +
  "take the 3D printed artery out.\n" +
  "\n" +
  "\n" +
  "Task 7\n" +
  "Directions：Listen to a report about Chinese industry’s robotization and fill in the missing words. \n" +
  "      Almost a quarter of the manufactured products in the world today are made in China. According to the CIA’s World Factbook, China ranks second on the list of nations with the greatest industrial output, the United States being the first. But that may not be the case for long. One of the reasons is that Chinese companies (1)  (are increasingly replacing human workers with robots).\n" +
  "      MIT Technology Review editor Will Knight recently visited China. He spoke via Skype, “The grand plan is (to) rather than to see manufacturing, you know, move to different countries as it means, say, from US to China, they want to hold on to it by (2)  (just investing a lot in automation and robotics).\n" +
  "    Knight says two factors contribute to the move,(3)  (an open attitude) towards whatever helps get things done and the desire by Chinese workers to (4)  (move away from low-skilled jobs).(He said,) “I was really struck by the spirit of the innovation and the speed of innovation, and how everybody was on board with that. It was amazing how much the workers actually themselves were really involved with helping to (5)  (redesign the production lines) to introduce more mechanization and automation.” \n" +
  "\n" +
  "Task 8\n" +
  "Directions：Write down the words or phrases you hear and match them with the Chinese meanings. These words will appear in the report in Task . \n" +
  "A. 开始，初期   \t\tB. 盈亏总额  \tC. 仪器，机械  \t\tD. 自动化机械    \tE. 复制，仿制\n" +
  "F. 产生，引起               \tG. 监督的，管理的   \tH. 通报    \t\tI. 精密的    \tJ. 领域，范围\n" +
  "\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "1\n" +
  " (apparatus) \n" +
  " (C)  \n" +
  "6\n" +
  "   (bottom line) \n" +
  "   (B) \n" +
  "2\n" +
  "   (replicate) \n" +
  "   (E) \n" +
  "7\n" +
  "   (supervisory ) \n" +
  "   (G) \n" +
  "3\n" +
  "   (inception) \n" +
  "   (A) \n" +
  "8\n" +
  "   (generate) \n" +
  "   (F) \n" +
  "4\n" +
  "   (realm) \n" +
  "   (J) \n" +
  "9\n" +
  "   (automated machinery) \n" +
  "   (D) \n" +
  "5\n" +
  "   (sophisticated) \n" +
  "   (I) \n" +
  "10\n" +
  "   (notify) \n" +
  "   (H) \n" +
  "\n" +
  "\n" +
  "Task 9\n" +
  "Directions：Listen to a report for the first time and choose the best topic for it. \n" +
  "\n" +
  " (A)\n" +
  " A. What Industrial Automation Is\n" +
  " B. How Automation Changes Manufacturing\n" +
  " C. How Automation Increases Productivity\n" +
  " D. What a Modern Manufacturing Plant Looks Like\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "Task 10\n" +
  "Directions：Listen to the report in Task 9 part by part and choose the best answer to each question. \n" +
  "\n" +
  "Part One\n" +
  "Question 1: Factory owners look to automation because ________. (D)\n" +
  " A. they can’t find low-paid qualified workers\n" +
  " B. they want to modernize their plants\n" +
  " C. they want machines to take the place of human labor\n" +
  " D. they want to improve productivity for bottom line\n" +
  "Part Two\n" +
  "Question 2: Automation results in better efficiency. Which of the following statements is NOT included in the reasons? (D)\n" +
  " A. Automatically controlled machines make less mistakes than humans.\n" +
  " B. Automatically controlled machines work more consistently than humans.\n" +
  " C. Automatically controlled machines make manufacturing smarter.\n" +
  " D. Automatically controlled machines can solve potential problems on the line.\n" +
  "Part Three\n" +
  "Question 3: In the future, manufacturing plants may run _______________. (B)\n" +
  " A. without humans at all\n" +
  " B. without humans on spot\n" +
  " C. without human involvement on line\n" +
  " D. without human workers and owners\n" +
  "\n" +
  "\n" +
  "Task 11\n" +
  "Directions：Listen to three sentences in the report and have a dictation. Every sentence will be read three times. \n" +
  "\n" +
  "1.\n" +
  "Your answer：\n" +
  "Reference answer： Automation is the automatically controlled operation of an apparatus, process, or system by mechanical or electronic devices that take the place of human labor. \n" +
  "2.\n" +
  "Your answer：\n" +
  "Reference answer： Automation practically eliminates error, increases productivity and allows for better monitoring and control of the manufacturing process.\n" +
  "3.\n" +
  "Your answer：\n" +
  "Reference answer： As it advances even further, it is not outside the realm of possibility that one day manufacturing facilities could run without the need for humans on site at all.\n" +
  "\n" +
  "\n" +
  "Task 14\n" +
  "Directions：Watch the video in Task 13 for the second time and note down the English terms in it. Their Chinese meanings are given. \n" +
  "1. 熔融沉积成型  (fused deposition modeling) \n" +
  "2. 喷嘴  (nozzle) \n" +
  "3. 熔化的  (molten)\n" +
  "4. 细丝  (filament)\n" +
  "5. 卷盘  (spool)\n" +
  "6. 通用的  (generic)\n" +
  "7. 光固化成型  (stereolithography)\n" +
  "8. 树脂  (resin)\n" +
  "9. 选择性激光烧结  (selective laser sintering)\n" +
  "10. 处理时间  (turnaround )\n" +
  "\n" +
  "Task 15\n" +
  "Directions：Watch the video in Task 13 with subtitles and retell the content. The outline is given. \n" +
  "      There are two types of consumer-level 3D printers, namely (1)  (FDM) and (2)  (SLA ). FDM printers work by (3)  (melting the raw material through a nozzle), and (4)  (then the nozzle lays out the object layer by layer ). SLA printers work differently from FDM printers in that (5)  (they use a liquid resin which is hardened by a laser). FDM printers cost less because (6)  (the material for FDM printers could be very cheap), but SLA printers can (7)  (get much higher resolution and finer detail). In addition to the FDM and SLA printers, there are many other kinds of 3D printers such as (8)  (SLS), but they are (9)  ( too expensive) for common consumers. \n" +
  "      To sum up, FDM printers are (10)  (great for learning about 3D printing, experimenting with different types of filaments, rapid prototyping, and more affordable ), but (11)  (if you want to print a lot of detail in the model or need the model to come out of the printer looking shiny and smooth ), an FDM printer might not work for you. If you can afford the more expensive printers and resin, SLA printers are (12)  ( a better fit for your needs). \n" +
  "\n" +
  "U7\n" +
  "Part one\n" +
  "Task 1\n" +
  " (optimal) [a.] the best or most suitable \n" +
  "2.  (paradigm) [n.] a set of ideas that are used for understanding or explaining something \n" +
  "3.  (methodology) [n.] a set of methods and principles used to perform a particular activity \n" +
  "4.  ( breakdown ) [n.] a failure of a relationship, discussion or system \n" +
  "5.  (productivity) [n.] the rate at which goods are produced \n" +
  "6.  (memorize) [v.] to study something so that you remember it \n" +
  "7.  (parameter) [n.] a set of fixed limits that control the way that something should be done \n" +
  "8.  (renewable) [a.] capable of being replaced by ecological cycles or sound management practices \n" +
  "9.  (ethics) [n.] the moral principles, standards, and rules for deciding what is right and wrong \n" +
  "10.  (bacterial) [a.] concerning or caused by bacteria \n" +
  "11.  (invert) [v.] to turn something upside down \n" +
  "12.  (erase) [v.] to remove written information or information on a computer memory \n" +
  "13.  (motif ) [n.] an idea, subject, or image that is regularly repeated and developed in a book, film, work of art, etc. \n" +
  "14.  (elevation) [n.] the height of a place \n" +
  "15.  (portfolio) [n.] a list of the financial assets held by an individual or a financial institution \n" +
  "16.  (peripheral ) [a.] not connected to the main or important part of something \n" +
  "17.  (friction) [n.] the act of sliding two objects against each other \n" +
  "18.  (aerosol) [n.] a container that sprays liquid under pressure \n" +
  "19.  (facet) [n.] a particular part or aspect of something \n" +
  "20.  (resemble) [v.] to be similar to someone or something in looks or manner \n" +
  "21.  (trivial) [a.] unimportant \n" +
  "22.  (aesthetic) [a.] concerning the sense of artistic beauty \n" +
  "23.  (discharge) [v.] to release force or power \n" +
  "24.  (particle) [n.] a very small piece of matter, such as an electron or proton, that is part of an atom \n" +
  "25.  ( problematic) [a.] difficult to deal with or to understand \n" +
  "26.  (preliminary) [a.] happening before a more important action or event \n" +
  "27.  (carrier) [n.] a company, usually an airline, that carries things \n" +
  "28.  (reinforce) [v.] to strengthen \n" +
  "29.  (infrastructure) [n.] the basic systems and services that are necessary for a country or an organization to run smoothly \n" +
  "30.  (magnitude) [n.] the great size or importance of something \n" +
  "31.  (formulation) [n.] the development of a plan, system, or proposal \n" +
  "32.  (grid) [n.] a system of electric wires or pipes carrying gas, for sending power over a large area \n" +
  "33.  (anthropology) [n.] the study of human origins and the development of society \n" +
  "34.  (archaeology) [n.] the study of ancient societies by looking at old tools, bones and buildings \n" +
  "35.  (variability) [n.] the fact of something being likely to vary \n" +
  "36.  (monetary) [a.] concerning money, often referring to a country’s economic system \n" +
  "37.  (empirical) [a.] based on observation or experiment \n" +
  "38.  (outlet) [n.] a way for something to be released; a pipe, hole or wire through which gas, liquid or electricity flows \n" +
  "39.  (phosphate) [n.] any compound containing phosphorus, used in industry or for helping plants to grow \n" +
  "40.  ( ethical) [a.] morally right or wrong \n" +
  "41.  (residual) [a.] remaining at the end of a process \n" +
  "42.  (stack) [v.] to put one thing on top of another \n" +
  "43.  (inject ) [v.] to put medicine into someone with a syringe \n" +
  "44.  (connector) [n.] a device that joins things together \n" +
  "45.  ( mentor) [n.] an experienced or wise person who teaches or helps another person \n" +
  "46.  (dioxide) [n.] a substance formed by combining two atoms of oxygen and one atom of another chemical element \n" +
  "47.  (meter) [n.] a device that measures and records the amount of electricity, gas, water, etc. that you have used \n" +
  "48.  (prevalence) [n.] the quality of prevailing generally; being widespread \n" +
  "49.  ( synthetic ) [a.] not natural; made from artificial materials \n" +
  "50.  ( fungus) [n.] any plant without leaves, flowers or green colouring, usually growing on other plants or on decaying matter\n" +
  "\n" +
  "Task 2\n" +
  "Directions：Choose the words from the list in Task 1 that match the Chinese meanings below. \n" +
  "1. 输电网  (grid )\n" +
  "2. 计量表  (meter )\n" +
  "3. 插座  (outlet)\n" +
  "4. 主题  (motif)\n" +
  "5. 范例  (paradigm)\n" +
  "6. 经验的  (empirical )\n" +
  "7. 基础设施  (infrastructure)\n" +
  "8. 二氧化物  (dioxide)\n" +
  "9. 粒子  (particle)\n" +
  "10. 考古学  ( archaeology)\n" +
  "\n" +
  "Task 3\n" +
  "Directions: Listen to the following sentences and fill in the blanks with appropriate words from the word list in Task 1. \n" +
  "1. Little is being invested in the  (infrastructure) and maintenance of the oil industry. \n" +
  "2. The art on the walls was contemporary and unusual, creating an ambience of  (aesthetic) appreciation. \n" +
  "3. The programming uses script files that contain specific system  (parameters) to operate in each of these modes. \n" +
  "4. What are the  (optimal) temperature and light conditions for the germination of these seeds? \n" +
  "5. In addition, the long-term  (discharge) of waste water from thousands of small-sized dyeing and finishing plants and foodstuff factories makes the river dark and stinky. \n" +
  "6. It is, after all, free information usable for blackmail, theft or provoking a crippling system  (breakdown). \n" +
  "7. The way scientific knowledge is used raises  (ethical) issues for everyone involved, not just scientists.. \n" +
  "8. Nylon was the first  (synthetic) fiber not based on natural materials such as cellulose. \n" +
  "9. Two front-mounted USB ports make it easier to connect  (peripheral) devices. \n" +
  "10. The reason why we work on the solar car is to show that there is an applicability of  ( renewable) resources. \n" +
  "\n" +
  "Task 4\n" +
  "Directions：Listen to the following piece and fill in the missing words and terms. \n" +
  "       We use many different (1)  (energy sources) to do work. Energy sources are classified as renewable and nonrenewable. They can be used as primary energy sources and (2)  (converted) into secondary energy sources such as (3)  ( electricity and hydrogen). \n" +
  "     Nonrenewable energy sources supply most of the energy we use. Nonrenewable energy sources include coal, natural gas, (4)  (petroleum) made from (5)  ( crude oil) and natural gas liquids, and (6)  (uranium). These energy sources are called nonrenewable because (7)  (their supplies are limited) and take a very long time to form. Coal, crude oil, and natural gas formed from (8)  (the remains of plants) buried underground millions of years ago.\n" +
  "   Renewable energy sources include biomass, (9)  (geothermal energy), hydropower, solar energy, and wind energy. They are called renewable because(10)  (they are naturally replenished) in a short period of time. Day after day, the sun shines, the wind blows, and rivers flow. \n" +
  "\n" +
  "Task 5\n" +
  "Directions：Watch a video about energy and answer the questions. \n" +
  "\n" +
  "1.What are the problems posed by fossil fuels?\n" +
  "Your answer：\n" +
  "Reference answer： Fossil fuels cost more than people pay at the pump and impact our environments in many ways like global warming, air quality deterioration, oil spills and acid rain. It’s also predicted that fossil fuel resources, a one-time-resource in the human timescale, will be depleted within the next 50-100 years.\n" +
  "2.What are the advantages of renewable energy?\n" +
  "Your answer：\n" +
  "Reference answer： As for renewable energy coming from resources which naturally replenish in our lifetime, the biggest advantages are that people don’t need to compromise the planet to harness it nor do they have to rely on other nations for resources, which history has shown to be a contributor to war, famine and political instability.\n" +
  "Part Three Engineering Report\n" +
  "Task 6\n" +
  "Directions: Watch a short video and complete the outline below. \n" +
  "\n" +
  "Advantages of hydrogen trains: \n" +
  "Your answer：\n" +
  "Reference answer： no pollution/helping with the problem of global warming, going to areas where electric trains can’t go.\n" +
  "Disadvantage of hydrogen trains: \n" +
  "Your answer：\n" +
  "Reference answer：  Hydrogen trains are more expensive than diesel ones.\n" +
  "How hydrogen trains work:\n" +
  "Your answer：\n" +
  "Reference answer： Hydrogen cells use an electrochemical process to make power—taking in hydrogen and mixing it with oxygen from the air to produce electricity.\n" +
  "\n" +
  "\n" +
  "Task 7\n" +
  "Directions：Listen to a report about China’s push for renewable energy and fill in the missing words. \n" +
  "      Through expansion of green energy production, including (1)  (wind, solar and hydroelectric power), China will reduce relative demand for coal. The government has postponed or halted construction of many new (2)  (coal-fired power plants), and by 2040, the percentage of total energy generated from coal is expected to be almost cut in half. \n" +
  "      China’s expansion of renewable energy also supports the country’s pledge under the Paris Climate Agreement to (3)  (cap carbon emissions). After several successful pilot programs for regional carbon markets, China rolled out a national system in 2017. The national “cap and trade” market cuts the country’s total emissions by (4)  (giving enterprises a limit on allowable emissions). Higher emitters can buy “allowances” from companies with lower emissions, but over time, the overall emissions limit is lowered, and it becomes more affordable to reduce pollution.\n" +
  "      There are challenges involved in China’s transition to sustainable energy, including the need for popular support, the (5)  ( maintenance of economic growth), and the difficulty of enforcing environmental laws. Nonetheless, China is rising to become a global leader in green energy. \n" +
  "\n" +
  "Task 8\n" +
  "Directions：Write down the words or phrases you hear and match them with the Chinese meanings. These words will appear in the report in Task . \n" +
  "A. 动荡   \t\tB. 脚本  \tC. 耗油  \t\tD. 讣告    \tE. 石化产品\n" +
  "F. 航空               \tG. 退后，挪开   \tH. 原油    \t\tI. 页岩钻井    \tJ. 抽水机，加油器\n" +
  "\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "1\n" +
  " (crude oil) \n" +
  " (H)  \n" +
  "6\n" +
  "   (shale drilling) \n" +
  "   (I) \n" +
  "2\n" +
  "   (turmoil) \n" +
  "   (A) \n" +
  "7\n" +
  "   (scenario ) \n" +
  "   (B) \n" +
  "3\n" +
  "   (obituary) \n" +
  "   (D) \n" +
  "8\n" +
  "   (back off) \n" +
  "   (G) \n" +
  "4\n" +
  "   (pump) \n" +
  "   (J) \n" +
  "9\n" +
  "   (guzzling) \n" +
  "   (C) \n" +
  "5\n" +
  "   ( aviation) \n" +
  "   (F) \n" +
  "10\n" +
  "   (petrochemicals) \n" +
  "   (E) \n" +
  "\n" +
  "\n" +
  "Task 9\n" +
  "Directions：Listen to a report for the first time and choose the best topic for it. \n" +
  "\n" +
  " (C)\n" +
  " A. The Problems of Oil\n" +
  " B. The History of Oil\n" +
  " C. The Future of Oil\n" +
  " D. The Market of Oil\n" +
  "\n" +
  "\n" +
  "Task 10\n" +
  "Directions：Listen to the report in Task 9 part by part and choose the best answer to each question. \n" +
  "\n" +
  "Part One\n" +
  "Question 1: The world depends less on oil because ____________. (D)\n" +
  " A. the oil era is over\n" +
  " B. the oil demand has stopped growing\n" +
  " C. the resource has started wars and caused global market turmoil\n" +
  " D. the world is pushing for clean energy\n" +
  "Part Two\n" +
  "Question 2: __________ contribute(s) to decreasing demand of oil. (B)\n" +
  " A. Ready infrastructure for electric vehicles\n" +
  " B. Sluggish world economy\n" +
  " C. No investment in oil production\n" +
  " D. Shale drilling and geopolitical tensions\n" +
  "Part Three\n" +
  "Question 3: We can conclude that _______________. (C)\n" +
  " A. the era of oil will end soon because of low demand\n" +
  " B. a new era of alternative energy will come soon\n" +
  " C. renewable energy will eventually take the place of oil\n" +
  " D. big oil companies will go bankrupt because of low oil price\n" +
  "\n" +
  "\n" +
  "Task 11\n" +
  "Directions：Listen to three sentences in the report and have a dictation. Every sentence will be read three times. \n" +
  "\n" +
  "1.\n" +
  "Your answer：\n" +
  "Reference answer： One scenario has oil peaking in the mid-2020s and the other shows oil demand growing until 2040.\n" +
  "2.\n" +
  "Your answer：\n" +
  "Reference answer： Experts say it’ll be a long time before the infrastructure is in place for electric cars to overtake the streets and even then, there will still be demand for oil.\n" +
  "3.\n" +
  "Your answer：\n" +
  "Reference answer： Big oil companies like Shell and BP have responded to low oil prices and increased regulations by trying to diversify their businesses.\n" +
  "\n" +
  "\n" +
  "Task 14\n" +
  "Directions：Watch the video in Task 13 for the second time and note down the English terms in it. Their Chinese meanings are given. \n" +
  "1. 涡轮机  (turbine) \n" +
  "2.桨叶  (blade) \n" +
  "3. 动能  (kinetic energy)\n" +
  "4. 中心，枢纽  (hub)\n" +
  "5. 连接，结合  (couple)\n" +
  "6. （机器的）轴  (shaft )\n" +
  "7. 齿轮箱，变速箱  (gearbox)\n" +
  "8. 旋转，绕转  (revolution)\n" +
  "9. 转换器  (converter )\n" +
  "10. 电压  ( voltage)\n" +
  "\n" +
  "Task 15\n" +
  "Directions：Watch the video in Task 13 with subtitles and retell the content. The outline is given. \n" +
  "      Wind turbines operate on a simple principle. (1)  (A wind vane at the top ) measures the wind direction. (2)  (The blades) lift and rotate when wind is blown over them, causing the rotor to spin. The blades can be as long as (3)  (60 meters each) and are made of (4)  (very light and resistant materials) in order to (5)  (move easily ). The blades are attached to the wind turbine through (6)  (the hub which is coupled to the low-speed shaft ).(7)  (The gearbox) connects (8)  ( the low-speed shaft) to the (9)  (high-speed shaft) and (10)  (increase the rotational speed) over 100 times. The high-speed shaft is connected to (11)  (a generator), which (12)  (converts the kinetic energy into electricity). A converter in the banks(13)  (transforms it into alternating current (which is the most commonly used kind) ), and a transformer (14)  (raises the voltage ) for transport inside the wind farm.\n" +
  "      From each turbine, alternating current is sent to (15)  ( the substation ) through(16)  (underground cables). Here, the voltage is increased again to (17)  (feed it into the power grid)and transport it to end consumers. \n" +
  "\n" +
  "\n" +
  "\n" +
  "U8\n" +
  "Task 1\n" +
  "Directions：Listen carefully. Note down the academic words you hear. Every word will be read twice. Refer to your dictionary if necessary. \n" +
  "\n" +
  "1.  (swell) [v.] to become larger than normal, often because of injury\n" +
  "2.  ( precede) [v.] to go before \n" +
  "3.  (vertical ) [a.] (of a line, pole, etc.) going straight up or down from a level surface or from top to bottom in a picture, etc.\n" +
  "4.  (orient) [v.] to focus your attention or efforts on something \n" +
  "5.  (fusion) [n.] (physics) the act or process of combining the nuclei of atoms to form a heavier nucleus, with energy being released \n" +
  "6.  (audit) [v.] to examine carefully for accuracy \n" +
  "7.  ( circulate) [v.] to go round continuously \n" +
  "8.  (chemotherapy) [n.] the treatment of diseases, such as cancer, using chemicals \n" +
  "9.  ( par) [n.] the value that a share in a company had originally \n" +
  "10.  (stimulus) [n.] something that helps a process to develop more quickly or more strongly\n" +
  "11.  (prey) [n.] an animal that is killed and eaten by another animal\n" +
  "12.  (tribe) [n.] a racial group united by language, religion and customs\n" +
  "13.  ( closure) [n.] the act of closing something \n" +
  "14.  (congruent ) [a.] having the same shape and size \n" +
  "15.  (periodic) [a.] happening regularly, but not frequently \n" +
  "16.  (likewise) [ad.] in the same way\n" +
  "17.  (stance) [n.] a position or opinion that is stated to the public \n" +
  "18.  (pesticide) [n.] a chemical substance used to kill pests \n" +
  "19.  (psychiatric ) [a.] relating to psychiatry or to mental illness \n" +
  "20.  (convergence) [n.] the fact that two or more things, ideas, etc. become similar or come together \n" +
  "21.  (statistics) [n.] a type of mathematics that provide specific information or prove something\n" +
  "22.  (bracket) [n.] a piece of wood, metal or plastic fixed to the wall to support a shelf, lamp, etc. \n" +
  "23.  (manuscript) [n.] a copy of a book, piece of music, etc. before it has been printed \n" +
  "24.  ( spectrum) [n.] a band of coloured lights in order of their wavelengths, as seen in a rainbow and into which light may be separated \n" +
  "25.  (render) [v.] to cause someone or something to behave in a particular way, or to enter into a particular condition\n" +
  "26.  (controversy) [n.] strong public disagreement about something \n" +
  "27.  (gravity) [n.] the force that makes things fall down towards the ground \n" +
  "28.  (antiquity ) [n.] an ancient period; an object from ancient times\n" +
  "29.  (mechanical) [a.] using or having to do with machines\n" +
  "30.  (intermediate) [a.] located between two places, things, states, etc. \n" +
  "31.  (sphere) [n.] a solid figure that is completely round, with every point on its surface at an equal distance from the centre\n" +
  "32.  (node) [n.] an intersection or junction point in a network\n" +
  "33.  (plywood) [n.] a material used for various building purposes, consisting usually of thin layers of veneers glued over each other \n" +
  "34.  (faculty) [n.] the teachers in a school or college\n" +
  "35.  ( punch) [v.] to make a quick hit with a closed hand \n" +
  "36.  (simulation ) [n.] a situation in which a particular set of conditions is created artificially in order to study or experience something that could exist in reality\n" +
  "37.  (affirm ) [v.] to state, strengthen or support a belief you have \n" +
  "38.  (susceptible ) [a.] very likely to be influenced, harmed or affected by someone or something \n" +
  "39.  (stereotype ) [n.] an idea or belief about what someone or something is like, often unfair or untrue \n" +
  "40.  (wavelength) [n.] the size of a wave \n" +
  "41.  (poster ) [n.] a large, printed notice or picture\n" +
  "42.  ( cylinder) [n.] the tube within which a piston moves forwards and backwards in an engine \n" +
  "43.  (connotation) [n.] an association; an implication \n" +
  "44.  (hydrogen) [n.] a colourless gas that is the lightest and commonest element in the universe \n" +
  "45.  (metaphor) [n.] a figure of speech in which an expression is used to refer to something that it does not literally denote in order to suggest a similarity\n" +
  "46.  (critique) [n.] a piece of written criticism of a set of ideas, a work of art, etc. \n" +
  "47.  (algebra) [n.] mathematics using letters and symbols in place of some numbers\n" +
  "48.  (tumor ) [n.] a mass of abnormal cells that develops when cancerous cells divide and grow uncontrollably \n" +
  "49.  (slot) [n.] a long narrow opening, into which you put or fit something \n" +
  "50.  (chronic) [a.] lasting for a long time; difficult to cure or get rid of \n" +
  "\n" +
  "Task 2\n" +
  "Directions：Choose the words from the list in Task 1 that match the Chinese meanings below. \n" +
  "1. 夹板  ( plywood)\n" +
  "2. 光谱  ( spectrum )\n" +
  "3. 票面价值  (par)\n" +
  "4. 狭槽  ( slot)\n" +
  "5. 核聚变  (fusion)\n" +
  "6. 汽缸  (cylinder)\n" +
  "7. 托架  ( bracket )\n" +
  "8. 全等的  (congruent)\n" +
  "9. 化疗  (chemotherapy)\n" +
  "10. 节点  (node)\n" +
  "\n" +
  "Task 3\n" +
  "Directions: Listen to the following sentences and fill in the blanks with appropriate words from the word list in Task 1. \n" +
  "\n" +
  "1. The library’s use of crayon-colored highlights adds drama and helps  (orient) visitors by making essential features such as escalators and stairs easy to spot. \n" +
  "2. Some economists argue that  ( periodic) credit crunches are the price emerging markets must pay for faster growth. \n" +
  "3. Graphics chips  (render) images by breaking them into small pieces called polygons. \n" +
  "4. A vitamin deficiency can cause normal body functions to break down and render a person  ( susceptible) to disease. \n" +
  "5. Japan anticipates a huge  (swell ) of senior citizens in coming years. \n" +
  "6. It was also realized that globalization is not a homogeneous process, but contains a striking paradox in that it brings about both  (convergence) and divergence. \n" +
  "7. This is important because a long  (wavelength) means that the sound wave can pass around barriers, like rocks, easily. \n" +
  "8. But gravity actually functions as a source of support for structures that are properly aligned around a predominantly  (vertical ) axis. \n" +
  "9. I do not agree with the  (closure ) of Frenches Road and think the process of building the relief road has been most unhelpful to residents and visitors. \n" +
  "10. The country has been struggling with an economic crisis marked by  (chronic) budget deficits and a national debt that is 116 percent of gross domestic product. \n" +
  "\n" +
  "Task 4\n" +
  "Directions：Listen to the following piece and fill in the missing words and terms. \n" +
  "\n" +
  "        Modes of transport or types of transportation refer to a combination of (1)  (networks, infrastructures, vehicles and operations). Different modes of transportation have emerged over time.\n" +
  "      1. Road transport\n" +
  "      Road transport involves the use of motor vehicles (cars, lorries, buses, bicycles, and trucks). It has (2)  (a high capacity) of carrying goods over short distances. (3)  (Maintenance) is one of the major disadvantages of this mode of transport. \n" +
  "      2. Railway transport\n" +
  "      Railways were developed during the period of industrial revolution in the 19th century, partly for political reasons and partly for economic reasons. In many countries, they were built especially to (4)  ( penetrate isolated regions) and help (5)  (promote political unity). \n" +
  "     3. Water transport\n" +
  "      Water transport is very important because it is the cheapest way of transporting (6)  (bulky goods) over a long distance. In the world, there are two major types of water transport namely: Inland water transport and ocean water transport. Inland water transport is the system of transport through all (7)  (navigable) rivers, lakes and man-made canals. However, ocean waterways carry a lot of the world’s trade, majority of the bulky goods, materials and passengers pass through ocean waterways from one country to another at the cheapest cost.\n" +
  "      4. Air transport\n" +
  "      Air transport is (8)  (the newest means of transport); it was introduced in 1903 but developed into full means of transporting people and goods in the 1930s. The greatest of the air transportation started after the Second World War (WWII). This mode of transportation can be used for (9)  (both domestic and international flights).\n" +
  "      5. Pipeline transport\n" +
  "      This system of transport involves the use of hollow pipes in the transportation of water, crude oil, (petroleum) and gas. This mode of transportation is safer than using (10)  ( tankers or trailers) in the transportation of these liquids. \n" +
  "\n" +
  "Task 5\n" +
  "Directions：Watch a video about transportation and answer the questions. \n" +
  "\n" +
  "\n" +
  "1.What is the problem of transportation?\n" +
  "Your answer：\n" +
  "Reference answer： Transportation system impacts the climate, accounting for 23% of the world’s greenhouse gas emissions in 2015.\n" +
  "2. What can we do to solve the problems?\n" +
  "Your answer：\n" +
  "Reference answer： There is great potential for reducing environmental impact by adopting new and efficient technologies, by changing the mode of transport we use or when possible, by choosing options that require little to no transportation at all, like eating local food or telecommuting. Furthermore, governments and companies around the world are increasingly looking to innovate biofuels, electric vehicles, mass transportation and even new types of freight ships.\n" +
  "\n" +
  "\n" +
  "Task 6\n" +
  "Directions: Watch a short video and complete the outline below. \n" +
  "\n" +
  "\n" +
  "The risk of using drones:\n" +
  "Your answer：\n" +
  "Reference answer： Attacking stadiums, military bases, airports or political rallies.\n" +
  "How the “DroneHunter” works: \n" +
  "Your answer：\n" +
  "Reference answer： Using a powerful radar to identify potentially malicious drones;\n" +
  "Firing a net to capture malicious drones after getting a permission, letting them fall down or towing them to a safe landing location.\n" +
  "\n" +
  "\n" +
  "Task 7\n" +
  "Directions：Listen to a report about Hong Kong’s high-speed railway and fill in the missing words. \n" +
  "\n" +
  "       Hong Kong has a new high-speed rail link to mainland China. The new trains, which travel at 200 km an hour, connect directly to 44 cities in the mainland and incorporate Hong Kong into China’s 25,000 km high-speed rail network. It’s supposed to (1)  (significantly reduce travelling time). For example, getting from Hong Kong to Guangzhou South Station will take just 48 minutes. Before, it takes two hours to travel between the two cities.\n" +
  "      The link will be operated by MTR Corporation, Hong Kong’s government-backed railway giant. It’s already boasting about the new train carriages (2)  (that will have power plugs and rotating seats).\n" +
  "  MTR Corp.claims the new rail link will greatly benefit Hong Kong’s economy. But the project has (3)  ( its share of controversies).It is 3 years behind schedule and costs one third over its original budget. There are also issues with the quality of the construction. These images revealed by Hong Kong’s Civic Party show (4)  (water dripping in several locations, and rusty tracks, flooding and water accumulating under electrical equipment). MTR Corp. has responded with a video saying the seepage problems were minor and most have been resolved.\n" +
  "      But those aren’t the only issues. The roof of (5)  ( the high-speed rail terminus), formed with 4,000 custom-made glass panels, is also leaking. MTR claims it is working to fix the problem before the first day of operation. \n" +
  "Task 8\n" +
  "Directions：Write down the words or phrases you hear and match them with the Chinese meanings. These words will appear in the report in Task . \n" +
  "\n" +
  "A. 吊舱   \t\tB. 摩擦力  \tC. 大幅减少  \t\tD. 盘绕的    \tE. 压缩\n" +
  "F. 负载，负荷               \tG. 活塞   \t   H. 副翼，阻力板    \t\tI. 密封的    \tJ. 新兴公司\n" +
  "\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "1\n" +
  " (slash) \n" +
  "　 (C)  \n" +
  "6\n" +
  "   (friction) \n" +
  "　   (B) \n" +
  "2\n" +
  "   (flap) \n" +
  "　   (H) \n" +
  "7\n" +
  "   (piston) \n" +
  "　   (G) \n" +
  "3\n" +
  "   (pod) \n" +
  "　   (A) \n" +
  "8\n" +
  "   (convoluted) \n" +
  "　   (D) \n" +
  "4\n" +
  "   (bearings) \n" +
  "　   (F) \n" +
  "9\n" +
  "   (airtight) \n" +
  "　   (I) \n" +
  "5\n" +
  "   (startup) \n" +
  "　   (J) \n" +
  "10\n" +
  "   ( compression ) \n" +
  "　   (E) \n" +
  "\n" +
  "\n" +
  "Task 9\n" +
  " \n" +
  "Directions：Listen to a report for the first time and choose the best topic for it.  \n" +
  " \n" +
  "\n" +
  " \n" +
  "\n" +
  " \n" +
  " (B) \n" +
  "  A. The Construction of Hyperloop \n" +
  "  B. The Concept of Hyperloop \n" +
  "  C. The Benefits of Hyperloop \n" +
  "  D. The Origin of Hyperloop \n" +
  " \n" +
  "Task 10\n" +
  "Directions：Listen to the report in Task 9 part by part and choose the best answer to each question. \n" +
  "\n" +
  "\n" +
  "Part One\n" +
  "Question 1: The futuristic super high speed transportation system may make us move faster because________. (C)\n" +
  " A. the concept was put forward by Tesla and SpaceX founder\n" +
  " B. we move in passenger pods with compression fans\n" +
  " C. it may minimize drag caused by friction and resistance\n" +
  " D. air bearings beneath passenger pods make us float in the air\n" +
  "Part Two\n" +
  "Question 2: Which of the following statements is true? (D)\n" +
  " A. The concept of hyperloop is the same as the atmospheric railway more than 170 years ago.\n" +
  " B. The concept of hyperloop was realized in UK more than 170 years ago.\n" +
  " C. Both systems create pressurized air to push passengers forward.\n" +
  " D. The atmospheric railway failed because of air leakage.\n" +
  "Part Three\n" +
  "Question 3: The concept of hyperloop hasn’t come to fruition because _______________. (C)\n" +
  " A. startups and student teams can’t afford the expensive research\n" +
  " B. Elon Musk doesn’t want others to develop HTT independently from his involvement\n" +
  " C. in addition to price tag, there are still technological problems to be solved\n" +
  " D. little progress has been made in HTT except for Virgin Hyperloop One\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "Task 11\n" +
  "Directions：Listen to three sentences in the report and have a dictation. Every sentence will be read three times. \n" +
  "\n" +
  "\n" +
  "1.\n" +
  "Your answer：\n" +
  "Reference answer： Musk set out his vision for a futuristic super high speed transportation system that would see passenger pods move through a partial vacuum in steel tubes, addressing the two key factors that slow down conventional vehicles: friction and air resistance.\n" +
  "2.\n" +
  "Your answer：\n" +
  "Reference answer： Under Musk’s first Hyperloop proposal, he suggested that compression fans would move air around the passenger pods to minimize drag and create air bearings beneath them, floating them off the surface of the tubes.\n" +
  "3.\n" +
  "Your answer：\n" +
  "Reference answer： With an estimated price tag close to $6 billion, Musk’s first Hyperloop concept never came to fruition, but the impressive idea and potential to link cities in such a direct way sparked intense interest.\n" +
  "\n" +
  "\n" +
  "Task 14\n" +
  "Directions：Watch the video in Task 13 for the second time and note down the English terms in it. Their Chinese meanings are given. \n" +
  "\n" +
  "1. 检测  (detect) \n" +
  "2. 交叉路口  (intersection) \n" +
  "3. 传感器  (sensor)\n" +
  "4. 光学雷达  (LiDAR)\n" +
  "5. 超声的  (ultrasonic)\n" +
  "6. 后部  (rear)\n" +
  "7. 车道  (lane)\n" +
  "8. 碰撞  (collision)\n" +
  "9. 峡谷  (canyon)\n" +
  "10. 计程器  (odometry)\n" +
  "\n" +
  "Task 15\n" +
  "Directions：Watch the video in Task 13 with subtitles and retell the content. The outline is given. \n" +
  "\n" +
  "   Self-driving cars, or (1)  (autonomous ) cars, do not need (2)  ( a driver to get from A to B ). They are able to (3)  ( pick up passengers on demand and take them to their desired destinations) with the help of (4)  (sophisticated technology). The sensors, which enable the cars (5)  (to see), are located (6)  (at the front and the rear of the vehicle) or (7)  (on the roof ). All data from the sensors are then (8)  (combined and processed in one or more processors). \n" +
  "     LiDAR is a key component to many vehicles. LiDAR differs from (9)  ( radar ) in that (10)  (it does not use radio waves). It can detect (11)  ( light rays that are reflected by the objects in the surroundings ). Street signs are recognized and interpreted by (12)  (cameras using artificial intelligence). \n" +
  "   Cameras are also used for (13)  (detecting obstacles ) and (14)  (are needed for lane keeping ). On a foggy day, (15)  (radar )is needed for (16)  (forward collision warning and avoidance ) in spite of (17)  (the fact that the object must be large enough to be detected ). \n" +
  "    The exact position of the vehicle is determined by(18)  (GPS in highly accurate digital maps ). In case of (19)  ( tunnels and street canyons), (20)  (odometry) is also needed. \n" +
  "\n" +
  "U9\n" +
  "Task 1\n" +
  "Directions：Listen carefully. Note down the academic words you hear. Every word will be read twice. Refer to your dictionary if necessary. \n" +
  "\n" +
  "1.  (auction ) [v.] to sell to a person offering the highest price \n" +
  "2.  (contour) [n.] the shape of the outside edge of something \n" +
  "3.  ( fatigue) [n.] a feeling of being very tired \n" +
  "4.  (implicit) [a.] not stated directly \n" +
  "5.  (viable) [a.] able to be done; possible \n" +
  "6.  (depict) [v.] to describe someone or something \n" +
  "7.  (calcium) [n.] a substance important for human and animal health, particularly for making bones and teeth \n" +
  "8.  (novice) [n.] a person with little or no experience in a particular activity, skill, or subject \n" +
  "9.  (calculus) [n.] the type of mathematics that deals with rates of change, for example in the slope of a curve or the speed of a falling object \n" +
  "10.  ( loop) [n.] a shape like a curve or circle made by a line curving right round and crossing itself \n" +
  "11.  (adaptive) [a.] able to adjust to new conditions \n" +
  "12.  (altitude) [n.] the height of something above sea level \n" +
  "13.  (mobility) [n.] the ability to move physically \n" +
  "14.  (lump) [n.] a small hard part of something smooth, soft, or continuous \n" +
  "15.  (stripe) [n.] a long, thin part of something which is a different color from the parts beside it \n" +
  "16.  (composite) [a.] made of more than one different part \n" +
  "17.  (allocation) [n.] the distribution of items set apart according to a plan or purpose \n" +
  "18.  (simplify) [v.] to make something easier to do, use or understand \n" +
  "19.  (marble) [n.] a type of hard stone that is usually white and often has coloured lines in it \n" +
  "20.  (coordinate) [v.] to bring order and organization to something \n" +
  "21.  (sustainable) [a.] involving the use of natural products and energy in a way that does not harm the environment \n" +
  "22.  (aggregate) [n.] a sum total amount of something \n" +
  "23.  (neuron) [n.] a cell that carries information within the brain and between the brain and other parts of the body; a nerve cell \n" +
  "24.  (undermine) [v.] to weaken or destroy something secretly and usually slowly \n" +
  "25.  ( hormone) [n.] a chemical substance produced by the body that influences its growth, development, and condition \n" +
  "26.  (deviation) [n.] the difference between a number or measurement in a set and the average of all the numbers or measurements in that set \n" +
  "27.  (mutation) [n.] a change in the genetic structure of an animal or plant that makes it different from others of the same kind \n" +
  "28.  (oscillation ) [n.] a regular movement between one position and another or between one amount and another \n" +
  "29.  (computation) [n.] the act of calculating; method of computing \n" +
  "30.  (questionnaire) [n.] a written list of questions that are answered by a number of people so that information can be collected from the answers \n" +
  "31.  (container) [n.] an object that can be used to hold things \n" +
  "32.  (volition) [n.] the act of making a conscious choice \n" +
  "33.  (statistically) [ad.] with respect to statistics \n" +
  "34.  (parenthesis ) [n.] one of two symbols “(” and “)”, used in writing \n" +
  "35.  (synthesis) [n.] the act of combining separate ideas, beliefs, styles, etc.; a mixture or combination of ideas, beliefs, styles, etc. \n" +
  "36.  (denominator) [n.] a bottom number in a fraction \n" +
  "37.  (chunk) [n.] a large bit of something; thick lump \n" +
  "38.  (syndrome) [n.] a group of signs and symptoms that accompany a disease \n" +
  "39.  (portal ) [n.] a website that functions as an entry point to the Internet, as by providing useful content and linking to various sites and features on the World Wide Web \n" +
  "40.  (indicator) [n.] an instrument that shows conditions in a machine, such as temperature, speed, pressure \n" +
  "41.  (transit) [n.] the act or fact of passing across or through \n" +
  "42.  (bundle) [n.] a group of things that are tied together \n" +
  "43.  (surgeon) [n.] a doctor who performs surgery \n" +
  "44.  (specimen) [n.] an example of something, especially of a plant or an animal \n" +
  "45.  (infectious) [a.] capable of causing infection, by the spreading of a bacteria or virus to others \n" +
  "46.  (aluminum) [n.] very light silvery-white metal used to make cans \n" +
  "47.  (replication) [n.] the act of making copies \n" +
  "48.  (alliance) [n.] a group of people or organizations being joined or associated \n" +
  "49.  (tempt ) [v.] to make someone want something, even if it’s bad \n" +
  "50.  (converge) [v.] to come together \n" +
  "\n" +
  "\n" +
  "\n" +
  "Task 2\n" +
  "Directions：Choose the words from the list in Task 1 that match the Chinese meanings below. \n" +
  "1. 神经元  (neuron)\n" +
  "2. 门户（网站）  (portal )\n" +
  "3. 微积分学  (calculus)\n" +
  "4. 铝  (aluminum)\n" +
  "5. 轮廓  (contour)\n" +
  "6. 指针  (indicator)\n" +
  "7. 激素  (hormone)\n" +
  "8. 振荡  (oscillation)\n" +
  "9. 钙  (calcium)\n" +
  "10. 环  (loop)\n" +
  "\n" +
  "\n" +
  "\n" +
  "Task 3\n" +
  "Directions: Listen to the following sentences and fill in the blanks with appropriate words from the word list in Task 1. \n" +
  "\n" +
  "1. Because they are a  (composite) material, made from wood by-products, they tend to be very stable and hold paint very well. \n" +
  "2. In fact Bowditch loved to carry out complex mathematical  (computations) and the Task of checking and correcting Moore’s work was one he greatly enjoyed. \n" +
  "3. Some have argued that there is nothing wrong with using sandalwood oil if it can be obtained from a legal, traceable and  (sustainable) source. \n" +
  "4. In fact, Thompson said new technology would have to be developed for the solar car to become a  (viable ) consumer alternative. \n" +
  "5. As it is often dangerous to travel by road or railway, transportation and  (mobility) are a problem. \n" +
  "6. Aggregates are concrete and other materials sorted, crushed and mixed so as to form mixed  (aggregate) into pieces of 70 mm, or less, in diameter. \n" +
  "7. For  (novice) users and people with cognitive difficulties, navigation must be intuitive and logical.\n" +
  "8. One of the special features of the bus terminus is the pedestrian subway connecting all platforms, ensuring safe  ( transit) of passengers. \n" +
  "9. The  ( replication) of DNA occurs when the hydrogen bonds between the bases of each strand break, and the molecule divides into two, like a zipper being opened. \n" +
  "10. Thriving investors know that asset  (allocation) has a significant impact on portfolios. \n" +
  "\n" +
  "Task 4\n" +
  "Directions：Listen to the following piece and fill in the missing words and terms. \n" +
  "\n" +
  "      Also known as (1)  (commercial design) ,Industrial Design is an applied art that involves the(2)  (industrialization of consumer products). People who work in this field are known as Industrial Designers. \n" +
  "     Emerging as a professional practice in the early 19th century, industrial design has come a long way since its (3)  (early inception) and is still thriving as a result of (4)  (an expanded awareness) of design in business, collaboration and and help (5)  (critical problem solving ).\n" +
  "      Industrial designers not only focus on the appearance of a product, but also on (6)  (how it functions ) , is manufactured and ultimately the (7)  (value and experience) it provides for users.\n" +
  "      In professional practice, industrial designers are often part of (8)  (multidisciplinary) teams made up of strategists, engineers, user interface (UI) designers, user experience (UX) designers, project managers, branding experts, graphic designers, customers and manufacturers all working together towards (9)  (a common goal). The collaboration of so many different perspectives allows the design team to understand a problem to the fullest extent, then(10)  (craft a solution ) that skillfully responds to the unique needs of a user. \n" +
  "\n" +
  "Task 5\n" +
  "Directions：Watch a video about ID and answer the questions. \n" +
  "\n" +
  "\n" +
  "1.How did ID gain popularity?\n" +
  "Your answer：\n" +
  "Reference answer： Between the 1930s and 1950s, the American designer Raymond Loewy popularized industrial design through his work with the Pennsylvania Railroad, Greyhound, Studebaker and countless domestic product manufacturers bringing elegant design to the masses.\n" +
  "2.What abilities are required for a qualified ID engineer?\n" +
  "Your answer：\n" +
  "Reference answer： The core ability of a qualified industrial design engineer lies in the creation of plans for manufacturer scale, which involves an understanding of user behaviour, ergonomics, shape, colour, materials, finishes, manufacturing and function. Besides, a keen understanding of how an object sits within a brand, how its benefits may be communicated, its role in society or its impact on other things is also needed.\n" +
  "\n" +
  "\n" +
  "Task 6\n" +
  "Directions: Watch a short video and complete the outline below. \n" +
  "\n" +
  "\n" +
  "The main purpose of the acoustic panels:\n" +
  "Your answer：\n" +
  "Reference answer： To scatter the sound and give the best listening experience.\n" +
  "The reason for taking an uneven surface:\n" +
  "Your answer：\n" +
  "Reference answer： The sound waves can be reflected in all directions.\n" +
  "The most difficult part of the construction:\n" +
  "Your answer：\n" +
  "Reference answer： It takes a lot of coding (the huge amount and precision of the data) to get the best results.\n" +
  "Effect of the panels:\n" +
  "Your answer：\n" +
  "Reference answer： The sound is incredibly transparent and clear.\n" +
  "\n" +
  "\n" +
  "Task 7\n" +
  "Directions：Listen to a report about the industrial design industry in Shenzhen and fill in the missing words. \n" +
  "\n" +
  "Task 8\n" +
  "Directions：Write down the words or phrases you hear and match them with the Chinese meanings. These words will appear in the report in Task . \n" +
  "\n" +
  "A. 冲压   \t\tB. 模子  \tC. 乙烯基  \t\tD. 铬    \tE. 铝\n" +
  "F. 夹板                            \tG. 流线型的   \t   H. 实用的    \t\tI. 光滑的    \tJ. 未来主义的\n" +
  "\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "1\n" +
  " (chrome) \n" +
  "　 (D)  \n" +
  "6\n" +
  "   (futuristic) \n" +
  "　   (J) \n" +
  "2\n" +
  "   (sleek) \n" +
  "　   (I) \n" +
  "7\n" +
  "   (streamlined) \n" +
  "　   (G) \n" +
  "3\n" +
  "   (mold) \n" +
  "　   (B) \n" +
  "8\n" +
  "   (vinyl) \n" +
  "　   (C) \n" +
  "4\n" +
  "   ( utilitarian) \n" +
  "　   (H) \n" +
  "9\n" +
  "   (plywood) \n" +
  "　   (F) \n" +
  "5\n" +
  "   (stamping) \n" +
  "　   (A) \n" +
  "10\n" +
  "   (aluminum) \n" +
  "　   (E) \n" +
  "\n" +
  "\n" +
  "\n" +
  "Task 9\n" +
  "　　 \n" +
  "Directions：Listen to a report for the first time and choose the best topic for it.  \n" +
  "　　(C) \n" +
  "　　  A. The birth of American industrial design during the 1920s to 1930s \n" +
  "　　  B. The history of American industrial design during the 1920s to 1930s \n" +
  "　　  C. How American industrial designers improved American society \n" +
  "　　  D. How American industrial designers worked for manufacturers \n" +
  "　　 \n" +
  "Task 10\n" +
  "Directions：Listen to the report in Task 9 part by part and choose the best answer to each question. \n" +
  "\n" +
  "\n" +
  "Part One\n" +
  "Question 1: Utilitarian art became popular in the 1920s mainly because of _________. (A)\n" +
  " A. the dramatic decline of American consumers’ need\n" +
  " B. the significant progress in production processes\n" +
  " C. the invention of news materials\n" +
  " D. the urge of struggling manufacturers\n" +
  "Part Two\n" +
  "Question 2: Successful industrial design _______________________. (D)\n" +
  " A. built the world of tomorrow\n" +
  " B. made mass production arrive\n" +
  " C. told people to spend more money\n" +
  " D. delivered vision of desirable life\n" +
  "Part Three\n" +
  "Question 3: American industrial design improved America _______________. (C)\n" +
  " A. functionally, culturally and economically\n" +
  " B. fundamentally, culturally and intellectually\n" +
  " C. functionally, culturally and intellectually\n" +
  " D. fundamentally, culturally and internationally\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "Task 11\n" +
  "Directions：Listen to three sentences in the report and have a dictation. Every sentence will be read three times. \n" +
  "\n" +
  "\n" +
  "1.\n" +
  "Your answer：\n" +
  "Reference answer： Innovative production processes like stamping and use of molds allowed them to use new materials for their designs\n" +
  "2.\n" +
  "Your answer：\n" +
  "Reference answer： Americans found great positivity in these futuristic forms.\n" +
  "3.\n" +
  "Your answer：\n" +
  "Reference answer： American industrial design improved America functionally, culturally and intellectually, and exported that around the globe.\n" +
  "\n" +
  "\n" +
  "Task 14\n" +
  "Directions：Watch the video in Task 13 for the second time and note down the English terms in it. Their Chinese meanings are given. \n" +
  "\n" +
  "1. 视觉重量  (visual weight) \n" +
  "2. 对称的  (symmetrical) \n" +
  "3. 镜像  (mirror image)\n" +
  "4. 不对称的  (asymmetrical)\n" +
  "5. 比例  (proportion)\n" +
  "6. 曲线  (curved line)\n" +
  "7. 锯齿状线  (jagged line)\n" +
  "8. 有机形状  (organic shape)\n" +
  "9. 几何形状  (geometric shape)\n" +
  "10. 焦点的  (focal)\n" +
  "\n" +
  "Task 15\n" +
  "Directions：Watch the video in Task 13 with subtitles and retell the content. The outline is given. \n" +
  "\n" +
  "      There’s some real thought that needs to go into design. The key is to (1)  (know the mood and message you want to communicate) in your design and then (2)  (choose the proper elements of principles to effectively communicate your design). \n" +
  "      There are six principles of design. The first one is (3)  (the principle of balance), It refers to (4)  (the way the parts of a composition are placed). There are two types of balance, (5)  (symmetrical balance) and (6)  (asymmetrical balance). The second principle of design is (7)  (the principle of contrast). It shows (8)  (the differences between the elements of art or the subjects in your design). The third principle is (9)  (the principle of emphasis ). It uses (10)  (a focal point or a center of interest in the design). It can sometimes be used with other principles. The fourth principle of design is (11)  (the principle of movement). It shows (12)  (action and it directs your eye throughout the work of art). The fifth principle is (13)  (the principle of proportion ). It shows (14)  (the relationship of the size of objects within a work of art). The last principle is (15)  ( the principle of rhythm). It means (16)  (a type of movement that is seen in the repeating of shapes, and colors, or other elements in your work). It differs from movement in that (17)  (rhythm is a repetition or a pattern of shapes, lines, colors or whatever element you are looking at). \n" +
  "\n" +
  "U10\n" +
  "Task 1\n" +
  "Directions：Listen carefully. Note down the academic words you hear. Every word will be read twice. Refer to your dictionary if necessary. \n" +
  "\n" +
  "1.  (trauma ) [n.] a very severe or upsetting experience\n" +
  "2.  (cyclic) [a.] repeated many times and always happening in the same order\n" +
  "3.  (subset) [n.] a small set which is part of a larger set\n" +
  "4.  (electron) [n.] a negatively charged particle\n" +
  "5.  (trait) [n.] a characteristic\n" +
  "6.  (gut) [n.] the tube in the body through which food passes when it leaves the stomach\n" +
  "7.  (fiber) [n.] a thin, threadlike part of an animal hair or plant tissue; an artificial thread\n" +
  "8.  (elimination) [n.] the act or process of removing or being removed\n" +
  "9.  (algorithm) [n.] a step-by-step problem-solving feature\n" +
  "10.  (elastic) [a.] able to return to original shape or size after stretching\n" +
  "11.  (locus) [n.] a place or location\n" +
  "12.  (resistant) [a.] not affected by something\n" +
  "13.  (coefficient) [a.] a number multiplied by a variable in an algebraic expression\n" +
  "14.  (hedge) [n.] a fence made with small trees\n" +
  "15.  ( liable) [a.] legally responsible for something\n" +
  "16.  (temporal) [a.] concerning time\n" +
  "17.  (entity ) [n.] something that is real\n" +
  "18.  (diagram) [n.] a drawing intended to explain how something works\n" +
  "19.  (merge ) [v.] to cause two or more things to become combined into one\n" +
  "20.  (appendix) [n.] additional information at the end of a document\n" +
  "21.  (axiom) [n.] a statement that is accepted as true\n" +
  "22.  (bucket) [n.] an open container with a handle used to carry liquids\n" +
  "23.  (matrix) [n.] an arrangement of numbers in rows and columns\n" +
  "24.  (hologram) [n.] a visual projection of a person or object, generally used for communication or entertainment purposes\n" +
  "25.  (valid) [a.] sound; just; well-founded\n" +
  "26.  (probe) [v.] to ask questions in order to find out secret or hidden information about somebody or something\n" +
  "27.  (trajectory) [n.] the path followed by an object moving through space\n" +
  "28.  (sift) [v.] to separate and retain the coarse parts of (flour, ashes, etc.) with a sieve\n" +
  "29.  (architect) [n.] a person who designs and advises on buildings\n" +
  "30.  (theorem) [n.] a statement that can be proved\n" +
  "31.  (transmission) [n.] an electronic signal that has been sent by radio waves; a force that has been transferred from one machine to another\n" +
  "32.  ( correlate ) [v.] to show the relationship between two items or events\n" +
  "33.  (nonetheless) [ad.] in spite of that, nevertheless\n" +
  "34.  ( axis) [n.] an imaginary line through the centre of an object, around which the object turns\n" +
  "35.  (scenario) [n.] an outline of the plot of a dramatic work\n" +
  "36.  (drift) [n.] to move slowly\n" +
  "37.  (chloride) [n.] a chemical compound that is a mixture of chlorine and something else\n" +
  "38.  (impact) [n.] a striking effect or result to hit with force\n" +
  "39.  (gross) [a.] total amount; extreme or unreasonable\n" +
  "40.  (substrate) [n.] a substance which a catalyst or enzyme has an effect on\n" +
  "41.  (subjective) [a.] based on your own ideas or opinions rather than facts and therefore sometimes unfair\n" +
  "42.  ( rotation) [n.] the movement in a circle around a central point\n" +
  "43.  (rejection) [n.] the act of refusing to consider or believe something\n" +
  "44.  (compensation) [n.] money paid to someone because they have suffered injury or loss, or because something they own has been damaged\n" +
  "45.  (biodiversity) [n.] the variation in an environment, the number of different types of life found there\n" +
  "46.  (plausible) [a.] being reasonable and possibly true\n" +
  "47.  (defect ) [n.] a problem; a fault\n" +
  "48.  (adverse) [a.] negative or harmful\n" +
  "49.  (franchise) [n.] a business, shop, etc. that is run under formal permission given by a company\n" +
  "50.  (facade) [n.] the front of a building, especially an imposing or decorative one\n" +
  "\n" +
  "Task 2\n" +
  "Directions：Choose the words from the list in Task 1 that match the Chinese meanings below. \n" +
  "1. 图表  ( diagram)\n" +
  "2. 正面  (facade)\n" +
  "3. 矩阵  (matrix)\n" +
  "4. 算法  (algorithm)\n" +
  "5. 基质  (substrate)\n" +
  "6. 旋转  (rotation)\n" +
  "7. 全息图  ( hologram)\n" +
  "8. 电子  (electron)\n" +
  "9. 定理  (theorem)\n" +
  "10. 纤维  (fiber)\n" +
  "\n" +
  "Task 3\n" +
  "Directions: Listen to the following sentences and fill in the blanks with appropriate words from the word list in Task 1. \n" +
  "\n" +
  "1. Braces are made from combinations of metal, foam, plastic,  (elastic) material, and straps. \n" +
  "2. In worst case  ( scenarios) , he says that there will always be some way to get access to old data, though it may be costly. \n" +
  "3. Water vapour becomes tangible  (entities) that look like stalactites and stalagmites. \n" +
  "4. A  ( defect) in this system may cause fluid retention and hypertension. \n" +
  "5. Suborbital paths are the  (trajectories) of choice for ballistic missiles. \n" +
  "6. The evolution of the universe could be  (cyclic) ,with regularly repeating periods of expansion and contraction. \n" +
  "7. The three most expensive parts of an automobile are the body, the engine and the  ( transmission).\n" +
  "8. It is impossible to specify the exact  (locus) in the brain of these neural events. \n" +
  "9. These are all  (plausible) objections to globalization as the defining element in contemporary order. \n" +
  "10. This means that the  ( subsets) of data selected as indicative of the future are those that confirm a prejudice of the selector. \n" +
  "\n" +
  "Task 4\n" +
  "Directions：Listen to the following piece and fill in the missing words and terms. \n" +
  "\n" +
  "      A smart city is a (1)  (framework) , predominant ly composed of Information and Communication Technologies (ICT), to develop, deploy and promote sustainable development practices to address (2)  (growing urbanization challenges). A big part of this ICT framework is essentially an (3)  (intelligent network) of connected objects and machines that transmit data using (4)  (wireless technology) and the cloud. Cloud-based IoT applications receive, analyze and manage data in real time to help (5)  (municipalities) , enterprises and citizens (6)  (make better decisions) in the moment that improve quality of life. \n" +
  "     In addition to people, dwellings, commerce and (7)  (traditional urban infrastructure), there are four essential elements that are necessary for successful smart cities: (8)  (pervasive wireless connectivity), (9)  (open data), security you can trust in, flexible (10)  (monetization schemes) . \n" +
  "\n" +
  "Task 5\n" +
  "Directions：Watch a video about machine learning and answer the questions. \n" +
  "\n" +
  "\n" +
  "1.What are the possible amazing technologies we will see by 2050?\n" +
  "Your answer：\n" +
  "Reference answer： The Internet of things and artificial intelligence will offer the hyper-connected smart cities, technologically equipped to improve the lives of their residents.\n" +
  "2.How will the technologies change our life?\n" +
  "Your answer：\n" +
  "Reference answer： In smart cities, the sensors will be installed to analyze the use of electricity in various sectors to optimize energy distribution across the grid; Data Dome will be created as a platform on which public information can be shared to give local players, citizens, and entrepreneurs the means to build the smart city truly for their needs.\n" +
  "\n" +
  "\n" +
  "Task 6\n" +
  "Directions: Watch a short video and complete the outline below. \n" +
  "\n" +
  "\n" +
  "The jobs of robots on a robotic farm:\n" +
  "Your answer：\n" +
  "Reference answer： Automatic harvesting;\n" +
  "Automatic branch trimming;\n" +
  "Locating and exterminating weeds;\n" +
  "Performing scans and detailed mapping.\n" +
  "The advantages of the robotic farm:\n" +
  "Your answer：\n" +
  "Reference answer： Solving labour shortages and ageing farming workforce problems;\n" +
  "Operating 24/7;\n" +
  "Attracting a new generation of workers.\n" +
  "\n" +
  "\n" +
  "Task 7\n" +
  "Directions：Listen to a report about China’s progress in quantum computer and fill in the missing words. \n" +
  "\n" +
  "      China has already made inroads in quantum communications using (1)  (entangled particles) to (2)  (transmit information instantly and completely securely) over 1,000 km between Beijing and Shanghai, and even further via a quantum satellite in space. And the government is also pouring money into the quantum computing race. In fact, it’s building a $10 billion research center slated to open in 2020 to support its efforts. But that center is just the tip of the iceberg; China’s Government has proved itself willing to invest tremendous sums in relevant research at a time when governments like the US have been slashing science budgets.\n" +
  "      And it’s not just the public sector either. In October, for example, Alibaba announced a new $15 billion fund for R&D into foundational and disruptive tech including quantum computing. The stakes of this race are quite high. Pan Jianwei, a high profile scientist in the field, has said that the first true quantum computer will (3)  (have a million times more computing power) than every computer currently on Earth combined. \n" +
  "      Getting the first quantum computer would give China a massive leg up over every other country in everything (4)  (from communications tech, to scientific research, to military advancement) .It’s no wonder then that many Western governments and scientists have expressed concerns about how quickly China is moving, but can anybody catch up? Unless the US Government has made impressive progress on some (5)  (classified quantum computing project), it seems unlikely. Many observers agree that based on what’s publicly known, China seems to be in the lead and there’s no sign that’s it’s planning to slow down anytime soon. \n" +
  "\n" +
  "Task 8\n" +
  "Directions：Write down the words you hear and match them with the Chinese meanings. These words will appear in the report in Task . \n" +
  "\n" +
  "A. 趋势   \t\tB. 流动性  \tC. 千禧一代  \t\tD. 人口统计学    \tE. 办理（业务）\n" +
  "F. 数字的                   \tG. 心态   \t    H. 劳动力    \t\t I. 胡言乱语    \t J. 前所未有的\n" +
  "\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "No.\n" +
  "English word\n" +
  "Chinese meaning\n" +
  "1\n" +
  " (millennial) \n" +
  "　 (C)  \n" +
  "6\n" +
  "   (mobility) \n" +
  "　   (B) \n" +
  "2\n" +
  "   (rant) \n" +
  "　   (I) \n" +
  "7\n" +
  "   ( trend ) \n" +
  "　   (A) \n" +
  "3\n" +
  "   ( transact) \n" +
  "　   (E) \n" +
  "8\n" +
  "   (workforce) \n" +
  "　   (H ) \n" +
  "4\n" +
  "   (digital) \n" +
  "　   (F) \n" +
  "9\n" +
  "   (demographics) \n" +
  "　   (D) \n" +
  "5\n" +
  "   (unprecedented) \n" +
  "　   (J) \n" +
  "10\n" +
  "   (mindset ) \n" +
  "　   (G) \n" +
  "\n" +
  "\n" +
  "Task 9\n" +
  "Directions：Listen to a report for the first time and choose the best topic for it. \n" +
  "\n" +
  "\n" +
  " (C)\n" +
  " A. The 5 Trends in the Future\n" +
  " B. The 5 Trends in Globalization\n" +
  " C. The 5 Trends Shaping the Future of Work\n" +
  " D. The 5 Trends in the Evolution of Work\n" +
  "\n" +
  "\n" +
  "Task 10\n" +
  "Directions：Listen to the report in Task 9 part by part and choose the best answer to each question. \n" +
  "\n" +
  "\n" +
  "Part One\n" +
  "Question 1: What are the 5 trends? (B)\n" +
  " A. Globalization, mobility, millennials and changing demographics, new challenges and technologies.\n" +
  " B. Globalization, mobility, millennials and changing demographics, new behaviors and technologies.\n" +
  " C. Globalization, mobility, millennials and changing demographics, new behaviors and science.\n" +
  " D. Globalization, mobility, changing demographics, new behaviors and technologies.\n" +
  "Part Two\n" +
  "Question 2: Which of the following statements is FALSE according to the report? (D)\n" +
  " A. Globalization makes it possible for more American engineers to work for Chinese organizations.\n" +
  " B. Mobility presents a picture of working at home or on a train.\n" +
  " C. A person who is reluctant to change may be out of work in the future.\n" +
  " D. Being monitored by new technologies, we will have to work harder.\n" +
  "Part Three\n" +
  "Question 3: In order to attract and retain top talents, organizations are being forced to _______. (C)\n" +
  " A. create pleasant working places for employees\n" +
  " B. make employees shift their mentality\n" +
  " C. construct inspiring working environment\n" +
  " D. make plans for the future\n" +
  "\n" +
  "\n" +
  "Task 11\n" +
  "Directions：Listen to three sentences in the report and have a dictation. Every sentence will be read three times. \n" +
  "\n" +
  "\n" +
  "1.\n" +
  "Your answer：\n" +
  "Reference answer： The language that you speak, the culture that you subscribe to, the currency that you transact in and where you are physically located are all starting to matter much less. \n" +
  "2.\n" +
  "Your answer：\n" +
  "Reference answer： Technology, such as big data, wearable devices, collaboration platforms, the Internet of things, and cloud computing are enabling us to work in new ways while keeping us more engaged and productive.\n" +
  "3.\n" +
  "Your answer：\n" +
  "Reference answer： When we think about the future of work, the organizations that can most effectively make this shift from need to want are the ones who will be able to attract and retain top talent. \n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "Task 14\n" +
  "Directions：Watch the video in Task 13 for the second time and note down the English terms in it. Their Chinese meanings are given. \n" +
  "\n" +
  "1. 枢纽的，关键的  (pivot) \n" +
  "2. 纳米机器人  (nanobot) \n" +
  "3. 胆固醇  (cholesterol)\n" +
  "4. 氧气  (oxygen)\n" +
  "5. 聚集  (converge)\n" +
  "6. 超越  (transcend)\n" +
  "7. 令人恐惧的  ( creepy)\n" +
  "8. 增强  (amplify)\n" +
  "9. 智能爆炸  ( intelligence explosion)\n" +
  "10. 规范，标准  (norm)\n" +
  "\n" +
  "Task 15\n" +
  "Directions：Watch the video in Task 13 with subtitles and retell the content. The outline is given. \n" +
  "\n" +
  "     Life will be (1)  (magical, abundant, full of possibilities ) because of the (2)  (exponential) and (3)  (unstoppable ) changes resulting from technological advances. (4)  ( Connectivity ) is like oxygen and (5)  (data ) is the new oil. Technology is moving inside of us, becoming (6)  (a part of us). Man and machine will (7)  (converge). In the future, we will be able to (8)  ( travel virtually to the most amazing places directly from our living room by using our mobile devices) , and to (9)  ( transcend humanity). \n" +
  "      But we are moving forward at considerable cost. For example, (10)  ( intelligence explosion). There are many questions to be answered for the future. What will it mean to be human in a world (11)  (where everyone will need to be amplified or augmented by algorithms)? What may be the unintended consequences of the leap of (12)  (artificial intelligence and cognitive computing )? How can we retain (13)  ( humanity), which makes us human? \n" +
  "       Are you ready for your future shock? \n" +
  "\n";
var content_down="U1\n" +
  "TASK2\n" +
  "Directions：Choose the best answer to each of the following questions.\n" +
  "\t1.Decentralized systems serve as a supplement to large-scale power grids in that __________. (B)\n" +
  "  A. they make renewable resources like wind and solar power accessible to consumers\n" +
  "  B. they enable consumers to generate energy for their own use off the main grid\n" +
  "  C. they are technological innovations that rapidly expand electric power capacity\n" +
  "  D. they meet the demand for the benefits of electrification around the globe\n" +
  "2.__________ marked the beginning of a new age of communication and media. (A)\n" +
  "  A. The transmission of the first transatlantic radio wave by Guglielmo Marconi\n" +
  "  B. The invention of telephone by Alexandra Graham Bell\n" +
  "  C. The emergence of the World Wide Web\n" +
  "  D. The introduction of the first electronic computers in the 1930s\n" +
  "3.What does the last sentence in paragraph 13 imply? (D)\n" +
  "  A. We should not hold high expectations of what technology can bring to fulfill the imaging needs of humankind.\n" +
  "  B. There is no limit to what technology can bring to fulfill the imaging needs of humankind.\n" +
  "  C. Nothing can limit our expectations of what technology can bring to fulfill the imaging needs of humankind.\n" +
  "  D. We should be bold enough to imagine what technology can bring to fulfill the imaging needs of humankind.\n" +
  "4.__________ contributed to the 30-year increase of average life expectancy in the United States from 1900 to 2000. (C)\n" +
  "  A. The dramatic reduction of the domestic workload\n" +
  "  B. The advancements of household appliances like electric stoves, vacuum cleaners, washers, etc.\n" +
  "  C. Medical advances in diagnosis, pharmaceuticals, devices and other forms of treatment\n" +
  "  D. A sense of satisfaction brought by technological innovations and advancements\n" +
  "5.The attitude of the writer towards the outlook of petrochemical industry in the 21st century is __________. (B)\n" +
  "  A. optimistic\n" +
  "  B. negative\n" +
  "  C. neutral\n" +
  "  D. critical\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK3\n" +
  "1.\t  (D)\n" +
  "2.  (A)\n" +
  "3.  (G)\n" +
  "4.  (F)\n" +
  "5.  (B)\n" +
  "6.  (C)\n" +
  "7.  (H)\n" +
  "8.  (E)\n" +
  "\n" +
  "TASK4\n" +
  "Directions：Complete the following outline according to Passage B.\n" +
  "What Is Engineering?: A Journey Through the Field We All Love\n" +
  "1. Definition\n" +
  "1)Engineering:  (the application of science to solve real-world problems)\n" +
  "2)Engineers:  (people who are trained to solve real world problems)\n" +
  "2. Types of engineering\n" +
  "1)  (mechanical engineering)\n" +
  "2)  (civil engineering)\n" +
  "3)  (chemical engineering)\n" +
  "4)  (petroleum engineering)\n" +
  "5)  (electrical/electronic engineering)\n" +
  "6)  (aerospace engineering)\n" +
  "3. Differences between scientists and engineers\n" +
  "1) Scientists:  (investigate that which already is)\n" +
  "2) Engineers:  (create that which has never been)\n" +
  "3) Relationship between scientists and engineers:  (two master races that complement each other)\n" +
  "\n" +
  "\n" +
  "TASK5\t\n" +
  "Directions：Find the English equivalents of the following items from Passage B.\n" +
  "1. 科学潮流  (a stream of science)\n" +
  "2. 现实世界问题  (real-world problem)\n" +
  "3. 粒子加速器  (particle accelerator)\n" +
  "4. 物理结构  (physical structure)\n" +
  "5. 可充电电池  (rechargeable battery)\n" +
  "6. 现代工业  (modern industry)\n" +
  "7. 原油  (crude oil)\n" +
  "8. 可再生能源  (renewable energy)\n" +
  "9. 等级之争  (hierarchical dispute)\n" +
  "10. 多元理论  (multiple theory)\n" +
  "\n" +
  "\n" +
  "TASK6\n" +
  "Directions：Fill in the blanks with the phrases below. Change the form if necessary. Each phrase can be used only once.\n" +
  "leave a mark on              pertain to                 in high demand          take a stance for             in every sense\n" +
  "\n" +
  "\n" +
  "1. The government should  (take a stance for) the public safety and inform the public clearly what products are contaminated and remove them.\n" +
  "2. Contracts and technical manuals normally contain terms with specific meanings that  (pertain to) a particular context.\n" +
  "3. Now that the property market has begun to boom, well-qualified young people with experience in marketing are  (in high demand) at the moment.\n" +
  "4. It is a mixture of the surface layer, easy to clean, of long term use, not easy to  (leave a mark on) the surface.\n" +
  "5. China is now very much a world power  (in every sense), with a solid and rapidly growing presence in the global economy.\n" +
  "\n" +
  "\n" +
  "TASK7\n" +
  "Directions：Translate the following sentences from Passage B into Chinese.\n" +
  "\t1. These machines can range their complexity and sizes, each one designed and built for specific purposes.(Para. 8)\n" +
  "Your answer：\n" +
  "Reference answer： 这些机器复杂程度和大小各异，每台机器都是为特定的目的而设计制造的。\n" +
  "2. The purification of water using chlorination and processing of metals using chemicals are all byproducts of the chemical engineering feats that have graced the world. (Para. 12)\n" +
  "Your answer：\n" +
  "Reference answer： 氯化净水和使用化学物质处理金属都是化学工程成就的副产品，这些成就使世界变得美好。\n" +
  "3. Modern automation calls for more electrical engineering and the onset of renewable energy have projected electrical engineers as the saviors of the modern world. (Para. 17)\n" +
  "Your answer：\n" +
  "Reference answer： 现代自动化更需要电气工程，而可再生能源的出现使电气工程师成为现代世界的救世主。\n" +
  "4. Basically, scientists discover a phenomenon that is present in the world. However, we cannot leverage the phenomenon to our advantage unless we understand it. (Para. 23)\n" +
  "Your answer：\n" +
  "Reference answer： 基本上来说，科学家发现世界存在的现象，然而，我们不能利用它，除非我们了解它。\n" +
  "5. Scientists help us decode things better and engineers are ones who actually use these findings to create something that isn’t there. (Para. 23)\n" +
  "Your answer：\n" +
  "Reference answer： 科学家帮助我们更好地解码事物，而工程师则利用这些发现创造不存在的东西。\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK8\n" +
  "Directions：Write a summary of Passage B in about 200 words.\n" +
  "\tYour answer：\n" +
  "Reference answer： Although the word engineer always arouses a sense of pride and it's worth being an engineer, many people still lack a deeper understanding of what engineering is from a historical point of view. Engineering is a stream of science that has helped humans shape the world and will continue to do so. As the author tells us, engineering is the application of science to solve real-word problems, and engineers, as practitioners of engineering, are problem solvers who use their expertise in science. As we trace back in time, we can easily see the influences of engineers, past and present, on the world we are living in. Engineers are the special spectrum of people who take delight in creating order from disorder and move the world forward.\n" +
  "Engineering is a broad field that is divided into various disciplines and sub-disciplines, but there exist only six main categories: mechanical engineering, civil engineering, chemical engineering, petroleum engineering, electrical/electronic engineering, and aerospace engineering. Engineers differ from scientists in that they create that which has never been, while scientists investigate that which already is. However, both scientists and engineers complement each other and make contributions to our society. Although engineering is a great field to get into, an engineering career might not be a good fit for everyone.\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK9\n" +
  "Directions：Refer to your dictionary for the meanings of the words or terms in Column A, and match them with the Chinese equivalents in Column B.\n" +
  "\n" +
  "1.  (B)\n" +
  "2.  (D)\n" +
  "3.  (E)\n" +
  "4.  (C)\n" +
  "5.  (A)\n" +
  "\n" +
  "\n" +
  "TASK10\n" +
  "Directions：Listen carefully and decide on the best answers to the questions.\n" +
  "\t1. For the first time ever, __________ MIT engineering department heads are women. (B)\n" +
  "  A. five out of six\n" +
  "  B. five out of eight\n" +
  "  C. five out of nine\n" +
  "  D. five out of ten\n" +
  "2. _________ is head of Chemical Engineering, MIT. (D)\n" +
  "  A. Asu Ozdalgar\n" +
  "  B. Anne White\n" +
  "  C. Evelyn Wang\n" +
  "  D. Paula Hammond\n" +
  "3. Which department of MIT is NOT led by a woman? (A)\n" +
  "  A. Architecture and Planning.\n" +
  "  B. Biological Engineering.\n" +
  "  C. Mechanical Engineering.\n" +
  "  D. Nuclear Science and Engineering.\n" +
  "4. Whose expertise lies in large-scale network systems? (B)\n" +
  "  A. Anne White.\n" +
  "  B. Asu Ozdalgar.\n" +
  "  C. Angela Belcher.\n" +
  "  D. Paula Hammond.\n" +
  "5. The appointment is exciting mainly because _________. (C)\n" +
  "  A. five of the heads are female engineers\n" +
  "  B. these women are excellent researchers\n" +
  "  C. more women begin leading the engineering path\n" +
  "  D. engineering has been a predominantly male-oriented industry\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK11\n" +
  "Directions：Listen to three sentences from the report and fill in the missing words.\n" +
  "1. Women in engineering are still the  (exception) instead of the  (norm), which is part of  (what makes this news so exciting).\n" +
  "2. Wang’s primary interests lie in  (water harvesting, purification and conservation), as well as  (thermal management, energy conversion, and storage).\n" +
  "3. MIT and many people around the world are thrilled at the  (diversity) and appointment of these  (phenomenal) people, not merely for the fact that they are women, but for  (what they have achieved as researchers and professors)\n" +
  "\n" +
  "TASK12\n" +
  "TASK13\n" +
  " \n" +
  "No.\tWords or expressions\tMeanings in the context\tThe sentences which include them\n" +
  " \n" +
  "1\ta hearing impediment\t听力障碍\tLook, he’s a Hungarian refugee who came to, I believe it was City College in New York, with a hearing impediment and taught himself technology.\n" +
  "2\ttypify\t Reference Answer:(是……的典型；代表)\t (Reference Answer:He studied and taught at UC Berkeley, he typified the CEO as an educator.)\n" +
  "3\tblow away\t Reference Answer:(使……大为惊讶；使印象深刻)\t (Reference Answer:And somehow as a summer student, I found my way into that course and I was blown away.)\n" +
  "4\tspin-offs\t Reference Answer:(副产品)\t (Reference Answer:Andy was at Fairchild and Silicon Valley—the silicon is not an accident, we call all the semiconductor spin-offs from Fairchild the fair children, and Andy was, I believe, badge number three employee number two of the most important of all of those which was Intel.)\n" +
  "5\tbadge\t Reference Answer:(佩戴在身上以显示工作单位的徽章；证章)\t (Reference Answer:Andy was at Fairchild and Silicon Valley—the silicon is not an accident, we call all the semiconductor spin-offs from Fairchild the fair children, and Andy was, I believe, badge number three employee number two of the most important of all of those which was Intel.)\n" +
  "6\tpivot\t Reference Answer:(支点，转折点)\t (Reference Answer:Andy led some very tough strategic decisions, pivots someone called them, in Intel’s history such as getting out of dynamic RAM memories to make microprocessors and EEPROMs, or another one less well-known is once they were in the microprocessor business they were losing the 16-bit microprocessor battles to Motorola and to Zilog.)\n" +
  "7\tEEPROMs\t Reference Answer:=electrically erasable programmable read-only memory(电可擦可编程只读存储器)(Reference Answer:Andy led some very tough strategic decisions, pivots someone called them, in Intel’s history such as getting out of dynamic RAM memories to make microprocessors and EEPROMs, or another one less well-known is once they were in the microprocessor business they were losing the 16-bit microprocessor battles to Motorola and to Zilog.)\n" +
  "8\twafer\t Reference Answer:(晶圆，晶片)\t (Reference Answer:I mean, think of this, thousands of people had to get millions of lines exactly right on every chip, on every wafer or nothing worked. )\n" +
  "9\tdemocratize\t Reference Answer:(使大众化)\t (Reference Answer:Andy Grove democratized computing, he made it affordable to everyone.)\n" +
  "10\tMoore’s law\t Reference Answer:(摩尔定律)\t (Reference Answer:He put dozens of microprocessors in all of our homes, so whether it’s managing solar panels so you can get power in Africa, or making refrigerators more efficient, or automobiles safer, or blood chemistry more analyzed, the microprocessor I think is the most important technological invention of the last three or so decades, and Andy Grove is the man who took Moore’s law and made it happen.)\n" +
  "Get the Flash Player to see this player.\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK14\n" +
  "Directions：Write down the Chinese meanings of the affixes listed below.\n" +
  "Affixes\tMeanings\tWords\n" +
  "a-/an-\t (非，无)\tanechoic 无回声的，anelectric 不起电的\n" +
  "anti-\t (反对；抗……)\tantibacterial 抗菌的，antibiotics 抗生素\n" +
  "bi-\t (二，双)\tbiannual 一年两次的，bicycle 自行车\n" +
  "counter-\t (反对；相反)\tcounteract 反作用，counterattack 反击\n" +
  "cyber-\t (网络的；计算机的)\tcyberspace 电脑空间，cyberworld 网络世界\n" +
  "de-\t (对立，相反)\tdecode 破译，despun 消旋，dehydration 脱水\n" +
  "di-\t (二，双)\tdioxide 二氧化物，diatomic 二原子的\n" +
  "dia-\t (穿过；二者之间)\tdiagonal 对角线，diameter 直径\n" +
  "dis-\t (不；非；相对；相反)\tdisproof 反证，dissolve 分解，disseminate 散布\n" +
  "em-/en-\t (进入……之中；使……进入状态)\tempower 赋予权力，enclose 封入\n" +
  "exo-\t (外部的；外面)\texocentric 离心的，exothermic 放出热量的\n" +
  "hyper-\t (在上；超出；高于)\thypersonic 超音速的，hyperfrequency 超高频\n" +
  "inter-\t (在……之间；相互)\tintermolecular 分子间的，interface 界面\n" +
  "intra-\t (在里面，在内部)\tintracellular 细胞内部的，intravenous 静脉内的\n" +
  "intro-\t (向内；入内)\tintrospection 内省，introflection 向内弯曲\n" +
  "mal-\t (坏的；不良地)\tmalfunction 运转失灵，malformation 畸形\n" +
  "mis-\t (错，误，坏)\tmisprint 误印，misconduct 行为不端\n" +
  "multi-\t (许多)\tmulticoloured 多色的，multimeter 万用表\n" +
  "neo-\t (新的)\tneolithic 新石器时代的，neonatal 新生的\n" +
  "out-\t (超过；过度；出去)\toutnumber 数量超过，outwit 智胜\n" +
  "over-\t (过度地)\toverexposure 感光过度，overweight 超重\n" +
  "post-\t (之后，在后)\tpostnatal 产后的，post-depositional 沉积作用后的\n" +
  "pre-\t (先于，在前)\tpreamplifier 前置放大器，precontinent 大陆前缘\n" +
  "proto-\t (第一，主要；原始)\tprototype 原型，protopetroleum 原油\n" +
  "pseudo-\t (假，伪)\tpseudoscience 伪科学，pseudosymmetry 假对称\n" +
  "quasi-\t (类似；准)\tquasi-static 准静态的，quasi-cholera 拟似霍乱\n" +
  "semi-\t (半)\tsemiconductor 半导体，semicircle 半圆\n" +
  "sub-\t (低于；亚，接近；从属)\tsubtropic 亚热带的，subarctic 近北极圈的\n" +
  "super-/supra-\t (在上；超出)\tsuperconductor 超导体，supravasal 导管上的\n" +
  "syn-\t (共同；相同)\tsyntonic 谐振的，synchrotron 同步加速器\n" +
  "tele-\t (远距离的)\ttelescope 望远镜，telecommunication 远程通信\n" +
  "tra-/trans-\t (横穿；从……到……)\ttraverse 横过，traject 传导，transplant 移植\n" +
  "ultra-\t (超出，超过；极端)\tultrasonic 超声波，ultrasonics 超音速，ultrared 红外线的\n" +
  "-able/-ible\t (可被……的，能被……的)\treadable 可读的，sensible 可察觉的\n" +
  "-ee\t (动作的承受者)\temployee 雇员，trainee 受训者\n" +
  "-let\t (表示“小”)\tbooklet 小册子，leaflet 宣传单\n" +
  "-ette\t (表示“小”；“女性”)\tcigarette 香烟，statuette 小雕像\n" +
  "-fold\t (倍数)\tthreefold 三倍的，multifold 多倍的\n" +
  "-proof\t (防……的)\twaterproof 防水的，soundproof 隔音的\n" +
  "-ward\t (向……)\tupward 向上，backward 向后\n" +
  "-wise\t (方向，方式，状态)\tclockwise 顺时针的，sidewise 斜向一边\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "U2\n" +
  "TASK2\n" +
  "\n" +
  "Directions：Choose the best answer to each of the following questions.\n" +
  "\t1. Which of the following statements is NOT true according to the passage? (D)\n" +
  "  A. Lean and Six Sigma programs are not a perfect way to improve product quality and yield.\n" +
  "  B. Advanced analytics may help control the extreme swings in variability in certain processing environments.\n" +
  "  C. Process flaws are an unavoidable factor in the process of manufacturing.\n" +
  "  D. Advanced analytics is no more granular an approach than lean and Six Sigma programs in production processes.\n" +
  "2. The purpose of taking previously isolated data sets and aggregating them is to __________. (A)\n" +
  "  A. assess and improve practices by means of advance analytics\n" +
  "  B. prove advanced analytics has the greatest effect on yield\n" +
  "  C. provide real-time shop-floor data for many global manufacturers in a range of industries and geographies\n" +
  "  D. test the capability of global manufacturers to conduct sophisticated statistical assessments\n" +
  "3. The example of the production of biopharmaceuticals illustrates the fact that __________. (A)\n" +
  "  A. advanced analytics does not necessarily increase capital expenditures while improving yield in production\n" +
  "  B. advanced analytics can monitor no less than 200 variables within the production flow\n" +
  "  C. the same production process may confine the variation in yield between 50 and 100 percent\n" +
  "  D. every targeted process change in nine parameters may increase yield by more than 50 percent\n" +
  "4. The case at one established European maker of functional and specialty chemicals shows __________. (C)\n" +
  "  A. there is little room for improvement in the plant that everybody uses as a reference\n" +
  "  B. too much pride in the long history of process improvements hinders a company’s further progress\n" +
  "  C. even for a company with little room for improvements, advanced analytics may still reveal further opportunities to increase yield\n" +
  "  D. the company’s waste of raw materials is in proportion to its energy costs\n" +
  "5. Companies may achieve their competitive advantages by taking the following steps EXCEPT __________. (B)\n" +
  "  A. investing in systems and practices to collect more data as a basis for improving operations\n" +
  "  B. collecting vast troves of process data for tracking purposes\n" +
  "  C. hiring data analysts who are trained in spotting patterns and drawing actionable insights from information\n" +
  "  D. gathering information about one particularly important or particularly complex process step within the larger chain of activities\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK3\n" +
  "Directions：Match the items in Column A with their definitions in Column B.\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "1.  (E)\n" +
  "2.  (C)\n" +
  "3.  (G)\n" +
  "4.  (F)\n" +
  "5.  (D)\n" +
  "6.  (H)\n" +
  "7.  (B)\n" +
  "8.  (A)\n" +
  "\n" +
  "\n" +
  "TASK4\n" +
  "Directions：Complete the following outline according to Passage B.\n" +
  "The Death of Big Data and the Emergence of the Multi-Cloud Era\n" +
  "Era of Big Data  New Era of Big Data\n" +
  "Technological Basis:\n" +
  " (Hadoop-based)-based\n" +
  "Feature:\n" +
  " (an established technology)\tIncluding:\n" +
  "1.   (The Era of Multi-Cloud)\n" +
  "Feature:  ( support applications and platforms across multiple clouds)\n" +
  "2.  (The Era of Machine Learning) \n" +
  "Feature:  (focus on analytic models, algorithms, model training, deep learning, and the ethics of algorithmic and deep learning technologies)\n" +
  "3.  (The Era of Real-Time and Ubiquitous Context) \n" +
  "Feature:  (timely updates both from an analytic and engagement perspective)\n" +
  "Concepts to keep in mind:\n" +
  "1.  (Hadoop still has its place in enterprise data.)\n" +
  "2.  (The need for multi-cloud analytics and data visualization is greater than ever.)\n" +
  "3.  (Machine learning and data science are the next generation of analytics and will require their own new data management efforts.)\n" +
  "4.  (Real-time and ubiquitous context needs to be seen as a data challenge as well as a collaborative and technological challenge.)\n" +
  "Conclusion:  (Use the entirety of big data as a business asset to support job-based context, machine learning, and real-time interaction.)\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK5\n" +
  "Directions：Find the English equivalents of the following items from Passage B.\n" +
  "1. 成熟技术  (established technology)\n" +
  "2. 机器学习  (machine learning)\n" +
  "3. 分析模型  (analytic model)\n" +
  "4. 深度学习  (deep learning)\n" +
  "5. 边缘观察  (edge observation)\n" +
  "6. 扩展现实  (extended reality)\n" +
  "7. 行为反馈  (behavioral feedback)\n" +
  "8. 数据集成  (data integration)\n" +
  "9. 数据建模  (data modeling)\n" +
  "10. 战略优势  (strategic advantage)\n" +
  "\n" +
  "\n" +
  "TASK6\n" +
  "Directions：Fill in the blanks with the phrases below. Change the form if necessary. Each phrase can be used only once.\n" +
  "speak to             come to an end                 interact with          figure out             bring into being\n" +
  "\n" +
  "\n" +
  "\n" +
  "1. Hemoglobin is a protein consisting of multiple molecules, and such a molecule can  (interact with) a nonprotein\n" +
  "compound called heme.\n" +
  "2. If the Chinese economy is slowing even more than acknowledged, all this support for the euro could\n" +
  " (come to an end).\n" +
  "3. This new concept may  (bring into being) a new branch of science—engineering meteorology, and a new\n" +
  "industry—meteorology engineering.\n" +
  "4. How can a conflicted guy in a bat suit and a villain with a cracked, painted-on clown smile  (speak to)\n" +
  "the essentials of the human condition?\n" +
  "5. Dr. Berman and his colleagues are now trying to  (figure out) exactly what elements of natural\n" +
  "environments trigger the cognitive benefits.\n" +
  "\n" +
  "\n" +
  "TASK7\n" +
  "Directions：Translate the following sentences from Passage B into Chinese.\n" +
  "\t1. With the passing of big data, we move forward in tending to the health and care of the era of big data’s progeny, including the era of multi-cloud, era of machine learning, and the era of real-time and ubiquitous context. (Para. 1)\n" +
  "Your answer：\n" +
  "Reference answer： 随着大数据的逝去，我们继续向前推进，照管大数据时代的后裔，包括多云时代、机器学习时代、实时泛在的数据环境时代。\n" +
  "2. Machine learning requires much of the same work needed to create clean data for analytics, but also requires additional mathematical, business, and ethical context to create lasting and long-term value. (Para. 3)\n" +
  "Your answer：\n" +
  "Reference answer： 机器学习需要做大量相同的工作来创建用于分析的纯净数据，但也需要额外的数学、商业和伦理环境来创建持久和长期的价值。\n" +
  "3. The effective use of real-time analytics requires a breadth of business data to provide appropriate holistic context as well as for analytics being performed on-data and on-demand. (Para. 4)\n" +
  "Your answer：\n" +
  "Reference answer： 实时分析的有效使用需要广泛的业务数据来提供适当的整体环境，以及依据数据或依据需求来执行分析。\n" +
  "4. With the era of big data coming to an end, we now can focus less on the mechanics of collecting large volumes of data and more on the myriad challenges of processing, analyzing, and interacting with massive amounts of data in real-time. (Para. 5)\n" +
  "Your answer：\n" +
  "Reference answer： 随着大数据时代的结束，我们现在可以更少地关注收集大量数据的机制，而更多地关注实时处理、分析和与大量数据实时交互的挑战。\n" +
  "5. The most important consideration here is to use data that does not serve the business well due to small sample size, lack of data sources, poorly defined data, poorly contextualized data, or inaccurate algorithmic and classification assumptions. (Para. 8)\n" +
  "Your answer：\n" +
  "Reference answer： 这里最重要的考虑因素是使用不能很好服务于业务的数据，因为这些数据样本量小、缺乏数据源、定义不清、数据环境不佳或算法和分类假设不准确。\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK8\n" +
  "Directions：Write a summary of Passage B in about 200 words.\n" +
  "\tYour answer：\n" +
  "Reference answer： As the maturity of the first generation of Hadoop-based big data, we are heading for a new era of big data, which include the era of multi-cloud, era of machine learning, and the era of real-time and ubiquitous context. The era of multi-cloud supports applications and platforms across multiple clouds to meet the increasing need for supporting continuous delivery and business continuity. The era of machine learning focuses on analytic models, algorithms, model training, deep learning, and the ethics of algorithmic and deep learning technologies to create lasting and long-term value. The era of real-time and ubiquitous context is characterized as providing timely updates and in-site, in-time, in-action context needed for effective behavioral feedback.\n" +
  "As we progress to new eras driven by big data, we should bear in mind that Hadoop still has its place in enterprise data, but the need for multi-cloud analytics and data visualization is greater than ever; machine learning and data science are the next generation of analytics and will require their own new data management efforts; real-time and ubiquitous context needs to be seen as a data challenge as well as a collaborative and technological challenge.\n" +
  "In conclusion, as the era of big data comes to an end, the entirety of big data should be used as a business asset to support job-based context, machine learning, and real-time interaction.\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK9\n" +
  "Directions：Refer to your dictionary for the meanings of the words or terms in Column A, and match them with the Chinese equivalents in Column B.\n" +
  "\n" +
  "1.  (D)\n" +
  "2.  (C)\n" +
  "3.  (A)\n" +
  "4.  (E)\n" +
  "5.  (B)\n" +
  "\n" +
  "\n" +
  "TASK10\n" +
  "Directions：Listen carefully and decide on the best answers to the questions.\n" +
  "\t1. The report is mainly about __________. (B)\n" +
  "  A. manufacturing’s big data application\n" +
  "  B. manufacturing’s big data toolkit\n" +
  "  C. manufacturing’s big data analytics\n" +
  "  D. manufacturing’s big data security\n" +
  "2. Big data can be used in manufacturing to _________. (C)\n" +
  "  A. optimize asset performance\n" +
  "  B. improve production processes\n" +
  "  C. ensure production and sale efficiency\n" +
  "  D. facilitate product customization\n" +
  "3. The first step in putting big data to work is to _________. (D)\n" +
  "  A. ensure data quality and integrity\n" +
  "  B. capture information up to the metadata level\n" +
  "  C. standardize data and put it into formats\n" +
  "  D. gather and store vital information\n" +
  "4. _________ essential big data analytics tools are introduced in the report. (D)\n" +
  "  A. Five\n" +
  "  B. Six\n" +
  "  C. Seven\n" +
  "  D. Eight\n" +
  "5. _________ help manufacturers identify dependencies and pinpoint potential bottlenecks. (A)\n" +
  "  A. Data mapping tools\n" +
  "  B. Data visualization tools\n" +
  "  C. Data monitoring tools\n" +
  "  D. Data cleanup tools\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK11\n" +
  "Directions：Listen to three sentences from the report and fill in the missing words.\n" +
  "1. This allows manufacturers to  (keep an end-to-end inventory of critical data) , enabling them to  (maximize the value of their information).\n" +
  "2. The ability to  (analyze equipment failures, production bottlenecks, supply chain deficiencies), etc., enables better  ( decision-making).\n" +
  "3. Data quality is of  ( paramount) importance, so manufacturers need a way to  (ensure compliance with data quality standards, oversee equipment performance and review production process efficiency).\n" +
  "\n" +
  "TASK12\n" +
  "\n" +
  "TASK13\n" +
  "Directions：Watch a report on big data security problems, fill in the table of words or expressions and share your ideas about big data privacy with your classmates.\n" +
  "No.\tWords or expressions\tMeanings in the context\tThe sentences which include them\n" +
  "1\trage\t非常流行的东西，时\n" +
  "尚的东西\tIt’s the latest rage.\n" +
  "2\tglean\t   (收集)\t   (Online, offline every which way-line you just can’t help producing the stuff, and there’s a huge drive to collect it all because intelligence can be gleaned from it.)\n" +
  "3\tclamor\t   (强烈要求)\t   (This is the data that every company and government is now clamoring to collect because knowledge is power and everybody’s job becomes easier the more they know about everybody else.)\n" +
  "4\textract\t   (提取)\t   (A company can take its customer database, extract and analyze information on the purchasing habits of customers and cross-reference that data set with increasingly available data on income, property ownership, age, and other specific sets.)\n" +
  "5\taggregate\t   (聚集)\t   (Searching, aggregating, and cross-referencing in order to generate intelligence. )\n" +
  "6\tinnocuous\t   (无害的)\t   (Except in cross-referencing data sets like this, big data analytics are putting together pieces of data that in isolation is seemingly innocuous, but in combination, produce a detailed picture of troubling accuracy for everyone across all transactions, all communications, and all movements. )\n" +
  "7\tmold\t   (模式)\t   (If you don’t fit the mold or you act out of the norm or appear to be from an undesirable grouping, you’ll be placed into boxes that would be nearly impossible to escape from.)\n" +
  "8\trevoke\t   (吊销，撤销)\t   (Other serious and ruinous error can happen like having your driving license mistakenly revoked, your benefits canceled, electoral participation denied, even arrests made and being detained. )\n" +
  "9\tslashed\t   (大幅度削减)\t   (As slashed budgets lead to increased staff cuts, automated systems have moved from acting as simple administrative tools to primary decision-makers. )\n" +
  "10\tallocate\t   (分配)\t   (Several cities across the US are using such tools to analyze crime statistics, map where crimes are more likely to occur and allocate resources accordingly.)\n" +
  "Get the Flash Player to see this player.\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK14\n" +
  "Directions：Analyze the syntactic features of the following sentences and translate them into Chinese.\n" +
  "\t1. Now, Stanford researchers have shown that a few layers of atomically thin materials, stacked like sheets of paper atop hot spots, can provide the same insulation as a sheet of glass 100 times thicker.\n" +
  "Your answer：\n" +
  "Reference answer： 现在，斯坦福大学的研究人员已经证明，几层原子厚度的材料，像一张张纸一样叠放在热点上，可以提供和厚100倍的玻璃一样的隔热效果。\n" +
  "2. Despite the development of drone tracking and flight management systems by NASA and other startups, the push for autonomy and convenience is likely to meet with well-coordinated civilian resistance.\n" +
  "Your answer：\n" +
  "Reference answer： 尽管美国国家航空航天局（NASA）和其他初创企业开发了无人机跟踪和飞行管理系统，但推动无人驾驶和便捷性的努力可能会遭遇普通民众一致的抵制。\n" +
  "3.Researchers led by speech neuroscientist Edward Chang at the University of California San Francisco (UCSF) on Tuesday reported their success at decoding speech attempts in real time by reading the activity in the speech centers of test subjects’ brains.\n" +
  "Your answer：\n" +
  "Reference answer： 周二，由加州大学旧金山分校（UCSF）的语言神经学家Edward Chang领导的研究人员汇报说，他们通过读取测试对象大脑语言中枢的活动，尝试实时解码语音获得成功。\n" +
  "4.To demonstrate this wearable technology, the researchers stuck sensors to the wrist and abdomen of one test subject to monitor the person’s pulse and respiration by detecting how their skin stretched and contracted with each heartbeat or breath.\n" +
  "Your answer：\n" +
  "Reference answer： 为了演示这种可穿戴技术，研究人员将传感器固定在一名受试者的手腕和腹部，通过检测他们的皮肤在每次心跳或呼吸时的拉伸和收缩情况，来监测受试者的脉搏和呼吸。\n" +
  "5. 3D printing could be especially useful to repair older cars with hard-to-find or nonexistent parts supply—just take out the thing that broke, scan it and spit out a new one.\n" +
  "Your answer：\n" +
  "Reference answer： 3D打印技术对于维修老旧的汽车尤其有用，因为老旧的汽车很难找到或根本不存在零部件供应——只要把坏掉的东西拿出来，扫描一下，然后吐出一个新的就行了。\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "U3\n" +
  "TASK2\n" +
  "Directions：Choose the best answer to each of the following questions.\n" +
  "\t1. From the first paragraph, we may infer that __________. (D)\n" +
  "  A. we are having brilliant achievements in the aerospace industry\n" +
  "  B. a growing number of production lines are being built in China\n" +
  "  C. chemists may not have bright prospects for success\n" +
  "  D. there will be fewer business trips worldwide\n" +
  "2. Which of the following is NOT a key element of a VR experience? (A)\n" +
  "  A. Real world.\n" +
  "  B. Immersion.\n" +
  "  C. Sensory feedback.\n" +
  "  D. Interactivity.\n" +
  "3. According to the passage, AR is a method by which we can alter our real world by adding some__________ to it. (A)\n" +
  "  A. digital elements\n" +
  "  B. immersive environment\n" +
  "  C. portable devices\n" +
  "  D. symbols and pictures\n" +
  "4. What is the author’s view on XR? (B)\n" +
  "  A. XR refers to computer technologies using headsets to generate sounds, images and other sensations that replicate a real environment.\n" +
  "  B. XR holds tremendous potential outside entertainment.\n" +
  "  C. The high cost of implementation slows the progress of XR.\n" +
  "  D. VR and AR are the technologies we collectively refer to as XR.\n" +
  "5. Which of the following details is CORRECT? (D)\n" +
  "  A. The author has an office in New York.\n" +
  "  B. It could grow to be a $209 billion AR industry as soon as 2022.\n" +
  "  C. AR is expected to have a bigger impact on the market than VR.\n" +
  "  D. XR brings with it concurrent IT security concerns.\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK3\n" +
  "Directions：Match the items in Column A with their definitions in Column B.\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "1.  (H)\n" +
  "2.  (E)\n" +
  "3.  (D)\n" +
  "4.  (C)\n" +
  "5.  (A)\n" +
  "6.  (F)\n" +
  "7.  (G)\n" +
  "8.  (B)\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK4\n" +
  "Directions：Complete the following outline according to Passage B.\n" +
  "Extended Reality “As Ubiquitous As Smartphones” by 2025, According to Recent Survey\n" +
  "1 Introduction   \n" +
  "  1)Definition of XR:  (an umbrella term for immersive technologies)    \n" +
  "  2) Purpose of this article:  ( to highlight why executives should utilize XR in their businesses)\n" +
  "2 Body \n" +
  "  1) There is an increased investment in XR. Supporting details: \n" +
  "     (Executives can spot trends by following the money).\n" +
  "     (The XR industry is maturing, and interest in sectors other than gaming is growing rapidly).\n" +
  "  2.XR has many case applications. \n" +
  "    Supporting details: \n" +
  "     (Workforce development is a key opportunity for XR).    \n" +
  "     (XR’s applications in workforce development are varied, among which training is the most relevant one).   \n" +
  "     (XR has many applications for consumer-facing industries). \n" +
  " 3.XR attracts a younger and more tech-savvy workforce.\n" +
  "   Supporting details:   (The adoption of XR technology could benefit workplaces in the long term as millennials begin to dominate the workforce). \n" +
  " 4. Conclusion:  (Forward-thinking executives should consider incorporating XR into their business plans).\n" +
  "\n" +
  "\n" +
  "TASK5\n" +
  "1. 增强现实  (augmented reality)\n" +
  "2. 沉浸式体验  (immersive experiences)\n" +
  "3. 风险投资  (venture capital)\n" +
  "4. 去年同期  (the same time period in the previous year)\n" +
  "5. 实时信息  (real-time information)\n" +
  "6. 产品设计  (product design)\n" +
  "7. 留存率  (retention rate)\n" +
  "8. 虚拟展厅  (virtual showroom)\n" +
  "9. 人才库  (talent pool)\n" +
  "10. 尖端科技  (cutting-edge technology)\n" +
  "\n" +
  "TASK6\n" +
  "Directions：Fill in the blanks with the phrases below. Change the form if necessary. Each phrase can be used only once.\n" +
  "other than          be around        try out        given that      make up\n" +
  "\n" +
  "1. VR headsets  (have been around) for some time now.\n" +
  "2.  (Given that) he has had six months to do the project, he has not made much progress.\n" +
  "3. They are  (trying out) a new head-mounted display for the XR show.\n" +
  "4. We are going away in July but  (other than) that we’ll be here all summer.\n" +
  "5. Roads, buildings, power grids, waterways and thoroughfare all  (make up) a large part of our infrastructure.\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK7\n" +
  "Directions：Translate the following sentences from Passage B into Chinese.\n" +
  "\t1. Executives can spot trends by following the money, and the increased investment in the XR space— particularly in areas other than gaming, such as workforce innovation and training, e-commerce applications, and others—suggests that forward-thinking executives will soon be affected by immersive technologies. (Para. 2)\n" +
  "Your answer：\n" +
  "Reference answer： 高管们可以通过资金的流向来发现趋势，对XR领域——特别是在游戏之外的领域，比如劳动力创新和培训、电子商务应用等——的投资日益增加，这表明有远见的高管很快就会受到沉浸式技术的影响。\n" +
  "2. In fact, Q4 2018 saw the value of global venture capital deals spike to $1.7 billion—three times the value for that same time period in the previous year. (Para. 2)\n" +
  "Your answer：\n" +
  "Reference answer： 事实上，2018年第四季度全球风险投资交易的价值飙升至17亿美元，是去年同期的三倍。\n" +
  "3. Further, 9 out of 10 survey respondents believe that XR is an inescapable feature of the future, predicting that “by the year 2025, immersive technologies of XR—including augmented reality, virtual reality and mixed reality—will be as ubiquitous as mobile devices”. (Para. 2)\n" +
  "Your answer：\n" +
  "Reference answer： 此外，百分之九十的受访者认为XR是未来的必然特征，并预测“到2025年，XR的沉浸式技术——包括增强现实、虚拟现实和混合现实——将像移动设备一样无处不在。”\n" +
  "4. The point is that investment in XR is rapidly increasing, which will result in more applications for connecting and collaborating with employees, vendors, partners, and customers. (Para. 3)\n" +
  "Your answer：\n" +
  "Reference answer： 重点是对XR的投资正在迅速增加，XR技术将被投入更多实际应用，从而增加员工、供应商、合伙人、客户间的联系与协作。\n" +
  "5. Respondents believe that XR’s applications in workforce development will be varied; they believe that workforce development benefits of XR include real-time access to information, training that mirrors real-life experiences, enhanced creativity in product design and development, and collaboration among geographically scattered employees. (Para. 5)\n" +
  "Your answer：\n" +
  "Reference answer： 受访者认为XR在劳动力发展方面的应用将是多样化的，他们认为XR对劳动力发展的好处包括获取实时信息、进行仿真培训、提高产品设计与开发的创造力以及加强远程员工间的协作。\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK8\n" +
  "Directions：Write a summary of Passage B in about 200 words.\n" +
  "\tYour answer：\n" +
  "Reference answer： Business executives should embrace extended reality (XR) technology for its application in various fields in order to maximize future business outcomes. First of all, the investment in XR is rapidly increasing in different areas and sectors, and has no signs of stopping, indicating that immersive technologies will be prevalent in the future and result in more applications. Companies that don’t want to get left behind should start to use XR in ways that best suit their business needs. Second, XR has many case applications. For example, XR is highly applicable to workforce development, employee training, and consumer-facing industries such as e-commerce. XR can offer a wide range of possibilities in every aspect of life and in an ongoing way. Third, a younger and tech-savvy workforce demands cutting-edge technologies such as XR as millennials begin to dominate the workforce. The adoption of XR technology could benefit workplaces in the long term. To sum up, XR is coming. It is a good time for forward-thinking executives to consider entertaining the XR technology.\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK9\n" +
  "Directions：Refer to your dictionary for the meanings of the words or terms in Column A, and match them with the Chinese equivalents in Column B.\n" +
  "\n" +
  "1.  (D)\n" +
  "2.  (B)\n" +
  "3.  (C)\n" +
  "4.  (A)\n" +
  "5.  (E)\n" +
  "\n" +
  "\n" +
  "TASK10\n" +
  "Directions：Listen carefully and decide on the best answers to the questions.\n" +
  "\t1. Which of the following sentences best sums up the main idea of the report? (C)\n" +
  "  A. Rolls-Royce is working on ways to incorporate virtual reality into its engineering training programmes.\n" +
  "  B. Rolls-Royce is designing, testing, and maintaining engines in the digital realm, bringing virtual reality to the training programmes.\n" +
  "  C. Rolls-Royce and Qatar Airways are using virtual reality to train engineers, in a first for the two companies.\n" +
  "  D. Qatar Airways engineers are the first in the industry to receive virtual reality training, using Rolls- Royce’s pioneering Trent XWB engine.\n" +
  "2. Rolls-Royce’s pioneering Trent XWB engine __________. (B)\n" +
  "  A. powers the Airbus A750\n" +
  "  B. must be separated for transportation\n" +
  "  C. is the largest engine in the world\n" +
  "  D. needs more engineers to maintain\n" +
  "3. The applications for virtual reality __________. (A)\n" +
  "  A. will reduce the risk of damage to engines and flying time loss\n" +
  "  B. will cover all elements of the engineering TASKs\n" +
  "  C. will replace practical training, particularly when it comes to refresher training\n" +
  "  D. will save time and free up engines for flying with more money spent\n" +
  "4. With __________ equipment, engineers are immersed in the training process. (D)\n" +
  "  A. HTC Five\n" +
  "  B. HTC Live\n" +
  "  C. HTC Dive\n" +
  "  D. HTC Vive\n" +
  "5.Steve Buckland, a Customer and Product Training Manager at Rolls-Royce who developed the VR training programme, believes __________. (D)\n" +
  "  A. new technology has created holograms of an engine\n" +
  "  B. new technology will beat learning with an engine\n" +
  "  C. new technology can be overlaid over a virtual engine\n" +
  "  D. new technology is making innovation in training possible\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK11\n" +
  "Directions：Listen to three sentences from the report and fill in the missing words.\n" +
  "1. While practical training will always be  (the main focus), Rolls-Royce is working on ways to  ( incorporate virtual reality into its engineering training programmes).\n" +
  "2.Rolls-Royce is  ( designing, testing, and maintaining engines in the digital realm), so it makes sense that  (it brings cutting-edge technology to the training programmes).\n" +
  "3. We’re looking at creating  (holograms) of an engine that we can use to teach in a classroom, or  ( augmented reality) that can be  (overlaid over a real engine to show technical information).\n" +
  "\n" +
  "TASK12\n" +
  "TASK13\n" +
  "Directions：Watch a talk on virtual reality, fill in the table of words or expressions and share your outlook on it with your classmates.\n" +
  "Get the Flash Player to see this player.\n" +
  "No.\tWords or expressions\tMeanings in the context\tThe sentences which include them\n" +
  "1\tOculus Rift\t一款为电子游戏设计\n" +
  "的头戴式显示器\tTypically, it’ll work through a virtual reality\n" +
  "headset, something like the Oculus Rift which\n" +
  "you can put on.\n" +
  "2\tauditory\t   (听觉的)\t   (In fact, here I am actually just sitting back in an apartment in New York, and it could be feeding me visual experiences and auditory experiences.)\n" +
  "3\tDescartes\t   (笛卡尔（法国哲学家、数学家）)\t   (Descartes, hundreds of years ago, said, “How do you know that you’re not being fooled right now by an evil genius who’s feeding you sensations into your mind to think that all this is going on out there, when in fact, none of it really exists?”)\n" +
  "4\thypothesis\t   (假设)\t   (The philosopher Nick Bostrom has argued, in fact, maybe we should take this hypothesis very seriously. )\n" +
  "5\thierarchy\t   (层次结构)\t   (It’s far more probable that I’m somewhere down in the hierarchy of simulated universes.)\n" +
  "6\tithrow light on\t   (阐明，解释)\t   (I see virtual reality as raising a bunch of new philosophical problems, but at the same time, really illuminating a lot of old philosophical problems and throwing new light on them.)\n" +
  "7\tskepticism\t   (怀疑论)\t   (Skepticism about the external world is the view that we don’t know that the external world even exists.)\n" +
  "8\tmatrix\t   (矩阵)\t   (And all the things we ordinarily take ourselves to know like that I’m sitting down right now on a chair might well be false, and I don’t know them, because, for example, I could be in a matrix virtual reality which is a mere simulation.)\n" +
  "9\tdeception\t   (欺骗)\t   (But once you actually start to think about virtual reality in some detail, that actually, to me, no longer obvious that this has to be seen as an illusion or as a deception. )\n" +
  "10\tnewfangled\t (新奇的)\t (It’s a newfangled technology which I might think raises some limited questions in the philosophy of technology.)\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK14\n" +
  "Directions：Translate the following sentences into Chinese.\n" +
  "\t1. In the near future, we can expect high concept wearables like the currently-in-research Amazon-patented technology to read emotions and the AlterEgo neural interface that lets people talk without speaking.\n" +
  "Your answer：\n" +
  "Reference answer： 在不久的将来，我们可以期待高概念的可穿戴设备，比如目前正在研发的能读取情绪的亚马逊专利技术，以及让人们无需说话就能交谈的互我（AlterEgo）神经界面。（顺译法）\n" +
  "2. The poor are the first to experience technological progress as a curse which destroys the old musclepower jobs that previous generations used as a means to fight their way out of poverty.\n" +
  "Your answer：\n" +
  "Reference answer： 对于以往的几代人来说，旧式的体力劳动是一种摆脱贫穷的手段，而技术的进步则摧毁了穷人赖以为生的体力劳动。因此，首先体验到进步之害的是穷人。（逆译法）\n" +
  "3. Manufacturing processes may be classified as unit production with small quantities being made and mass production with large numbers of identical parts being produced.\n" +
  "Your answer：\n" +
  "Reference answer： 制造过程可以分为单件生产和批量生产。单件生产指的是生产少量的零件，批量生产则是指生产大量相同的零件。（分译法）\n" +
  "4. The idea of a fish being able to generate electricity strong enough to light small bulbs and even to run an electric motor is almost unbelievable.\n" +
  "Your answer：\n" +
  "Reference answer： 鱼能发电，其强度足以点亮小灯泡，甚至能开动马达，这简直令人难以置信。（综合法）\n" +
  "5. For a family of four, for example, it is more convenient as well as cheaper to sit comfortably at home, with almost unlimited entertainment available, than to go out in search of amusement elsewhere.\n" +
  "Your answer：\n" +
  "Reference answer： 例如，对于一个四口之家来说，舒舒服服地坐在家里享受着各种娱乐节目，这比到外面去消遣要更加方便，也更加便宜。（综合法）\n" +
  "\n" +
  "\n" +
  "\n" +
  "U4\n" +
  "TASK2\n" +
  "Directions：Choose the best answer to each of the following questions.\n" +
  "\t1. The example of a fire extinguisher in the first paragraph is to show __________. (A)\n" +
  "  A. how objects and people can be interconnected for digital processing\n" +
  "  B. how objects can produce user-generated contents through communication networks\n" +
  "  C. how the Internet has changed over the years\n" +
  "  D. how artificial intelligence can enable wider applications in smart city initiatives\n" +
  "2. The phrase “cut across” (Line 1, Para.3) can be replaced by “__________”. (B)\n" +
  "  A. reduce the size of\n" +
  "  B. affect\n" +
  "  C. separate\n" +
  "  D. integrate\n" +
  "3. Which of the following collects data from the surrounding environment in the IoT ecosystem? (A)\n" +
  "  A. A sensor.\n" +
  "  B. An IoT platform.\n" +
  "  C. A vertical silo.\n" +
  "  D. An embedded system.\n" +
  "4. Which of the following statements about the IoT is NOT true? (A)\n" +
  "  A. Once the data is collected, it is sent to a cloud infrastructure or an IoT platform with the help of wireless networking technologies.\n" +
  "  B. The IoT epitomizes the fusion of the physical and digital worlds.\n" +
  "  C. Common platforms and innovation across areas help to build IoT ecosystems.\n" +
  "  D. Different steps of evolution can develop at the same time.\n" +
  "5. According to the passage, which of the following is NOT an example of the IoT? (B)\n" +
  "  A. People can control the temperature of houses with a few taps on their smartphones.\n" +
  "  B. Large firms use a computer program or algorithm to screen candidates by hunting for keywords in their résumés.\n" +
  "  C. A fitness tracker monitors users’ blood pressure and eating habits, and shares them with a third-party application or a health care service provider.\n" +
  "  D. A watering system utilizes real-time weather data and forecasts for optimal water use in the yard.\n" +
  "\n" +
  "\n" +
  "TASK3\n" +
  "Directions：Match the items in Column A with their definitions in Column B.\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "1.  (B)\n" +
  "2.  (D)\n" +
  "3.  (F)\n" +
  "4.  (H)\n" +
  "5.  (A)\n" +
  "6.  (C)\n" +
  "7.  (G)\n" +
  "8.  (E)\n" +
  "\n" +
  "\n" +
  "TASK4\n" +
  "5G & The Future of Connectivity\n" +
  "No.\tIndustries\tExamples\n" +
  "1\t (Manufacturing)\t (production operations)\n" +
  " (the use of robots)\n" +
  " (increased adoption of augmented reality for training, maintenance, construction and repair)\n" +
  "2\t (Energy & utilities)\t (energy production, transmission, distribution, and usage)\n" +
  " (smart grid and energy management)\n" +
  " (increased lifespan of battery-dependent devices)\n" +
  " (the use of drones to monitor and maintain transmission of production assets)\n" +
  "3\t (Retail)\t (improved mobile shopping experience)\n" +
  " (VR dressing rooms)\n" +
  " (mobile AR experiences in stores and at home)\n" +
  "4\t (Financial services)\t (internal operations)\n" +
  " (customer engagement)\n" +
  " (payments transactions)\n" +
  " (wearable devices to authenticate user identity instantly and accurately)\n" +
  "5\t (Media & entertainment)\t (mobile media, mobile advertising, home broadband, TV)\n" +
  " (emerging interactive technologies)\n" +
  " (increased download speed)\n" +
  "6\t (Healthcare)\t (faster and more efficient networks for the healthcare system)\n" +
  " (remote monitoring devices)\n" +
  " (remote robotic surgery)\n" +
  "7\t (Transportation)\t (increased visibility and control over transportation systems)\n" +
  " (V2V and V2I communication)\n" +
  "8\t (Education)\t (AR/VR educational platforms)\n" +
  "9\t (Cloud computing)\t (better cloud computing experience)\n" +
  "10\t (Public safety)\t (assisting emergency situations)\n" +
  " (information sharing)\n" +
  " (the use of drones)\n" +
  " (an enhanced network of sensors, cameras, and other automated devices)\n" +
  "\n" +
  "TASK5\n" +
  "Directions：Find the English equivalents of the following items from Passage B.\n" +
  "1. 生产作业  (production operation)\n" +
  "2. 制造业  (manufacturing industry)\n" +
  "3. 移动网络  (mobile network)\n" +
  "4. 低延迟  (low latency)\n" +
  "5. 智能电网  (smart grid)\n" +
  "6. 可穿戴设备  (wearable device)\n" +
  "7. 加载时间  (loading time)\n" +
  "8. 远程监控  (remote monitoring)\n" +
  "9. 云计算  (cloud computing)\n" +
  "10. 中央服务器  (central server)\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK6\n" +
  "Directions：Fill in the blanks with the phrases below. Change the form if necessary. Each phrase can be used only once.\n" +
  "be poised to   open the door to     keep up with   \n" +
  "water down     assist in\n" +
  "1. The agreement could  (open the door to) increased international trade.\n" +
  "2. You will be employed to  (assist in) the development of the new equipment.\n" +
  "3. The criticisms  (had been watered down / were watered down) so as not to offend anybody.\n" +
  "4. The company  (is poised to) launch its new advertising campaign.\n" +
  "5. I read the papers to  (keep up with) what is happening in the outside world.\n" +
  "\n" +
  "\n" +
  "TASK7\n" +
  "Directions：Translate the following sentences from Passage B into Chinese.\n" +
  "\t1. 5G connectivity could also allow wearable devices to share biometric data with financial services to authenticate user identity instantly and accurately. (Para. 14)\n" +
  "Your answer：\n" +
  "Reference answer： 可穿戴设备可以通过5G连接与金融服务部门共享生物识别数据，从而及时准确地验证用户身份。\n" +
  "2. 5G is set to disrupt media and entertainment on many levels, including mobile media, mobile advertising, home broadband, and TV. (Para. 15)\n" +
  "Your answer：\n" +
  "Reference answer： 5G必将从多方面颠覆包括移动媒体、移动广告、家庭宽带和电视在内的媒体和娱乐业。\n" +
  "3. 5G will save people an estimated average of 23 hours of loading time per month while browsing social media, gaming, streaming music, and downloading movies and shows. (Para. 16)\n" +
  "Your answer：\n" +
  "Reference answer： 在浏览社交媒体、游戏、流媒体音乐以及下载电影和节目方面，5G预计每月将为人们节省23个小时的加载时间。\n" +
  "4. Over the next decade, the global media industry stands to gain a staggering $765B in cumulative revenues from new services and applications enabled by 5G technology, according to a study conducted by Ovum. (Para. 18)\n" +
  "Your answer：\n" +
  "Reference answer： 根据Ovum的一项研究，未来十年，5G技术支持的新服务和应用将给全球媒体行业带来累计达到7650亿美元的惊人收入。\n" +
  "5. A study conducted by Next Galaxy Corp and Nicklaus Children’s Hospital found that medical personnel retained as much as 80% of the course material after being trained with VR, compared to retaining only 20% of information from a traditional training session. (Para. 31)\n" +
  "Your answer：\n" +
  "Reference answer： Next Galaxy和Nicklaus儿童医院的一项研究发现，培训中使用VR技术可以令医务人员记住高达80%的授课内容，而通过传统方式培训，医务人员只能记住20%。\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK8\n" +
  "Directions：Write a summary of Passage B in about 200 words.\n" +
  "\tYour answer：\n" +
  "Reference answer：  Ten industries are discussed where 5G technology can bring about disruptions. In the manufacturing industry, 5G improves the flexibility, efficiency and safety of production operations, enabling manufacturers to enhance smart factories. In the energy and utilities industry, 5G provides innovative solutions to various areas in energy management and widens the potential application of smart grids. In the retail industry, the extremely fast data speeds will enhance the mobile shopping experience, and develop innovative ways of customer engagement that incorporate AR/VR technologies. In the financial services, 5G could accelerate a number of mobile operations and assist in real-time data transmission. In the media and entertainment industry, 5G revolutionizes many areas via the exponential increase in the download speed and unprecedented virtual consumption experience. In the healthcare industry, not only will 5G be capable of handling the massive data load, but it will also facilitate the remote monitoring devices and remote surgery procedures. In the transportation industry, 5G offers new insights into smart transportation systems such as V2V and V2I communications. In the education industry, 5G has the potential to transform traditional educational methods and enrich classroom learning experience by leveraging AR/VR technologies particularly in high-risk educational settings. In the cloud computing, 5G’s low latency and high throughput could improve cloud computing experience. In the public safety industry, 5G could enhance public safety capabilities thereby improving emergency response and information sharing.\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK9\n" +
  "Directions：Refer to your dictionary for the meanings of the words or terms in Column A, and match them with the Chinese equivalents in Column B.\n" +
  "\n" +
  "1.  (C)\n" +
  "2.  (B)\n" +
  "3.  (E)\n" +
  "4.  (A)\n" +
  "5.  (D)\n" +
  "\n" +
  "\n" +
  "TASK10\n" +
  "Directions：Listen carefully and decide on the best answers to the questions.\n" +
  "\t1. What is the report mainly about? (D)\n" +
  "  A. Teleportation in the realm of science fiction.\n" +
  "  B. Scenarios where teleportation can be achieved.\n" +
  "  C. Teleportation being accomplished in physics labs.\n" +
  "  D. How quantum teleportation actually works.\n" +
  "2. Which is NOT included in the three kinds of teleportation? (B)\n" +
  "  A. Relocating one’s body to another place through a small hole.\n" +
  "  B. Transporting one’s body to another place in a container.\n" +
  "  C. Moving one’s body to another place with the molecules disassembled and reassembled.\n" +
  "  D. Building a new body somewhere else with the information scanned and transmitted.\n" +
  "3. Quantum entanglement can be realized when __________. (C)\n" +
  "  A. your body is scanned and the information is transmitted\n" +
  "  B. the property of quantum mechanics becomes possible\n" +
  "  C. two or more particles are forced to hold mutually exclusive states\n" +
  "  D. both a burger and a grilled chicken sandwich are ordered\n" +
  "4. Quantum entanglement is independent of __________. (A)\n" +
  "  A. distance\n" +
  "  B. property\n" +
  "  C. relation\n" +
  "  D. state\n" +
  "5. We can teleport an object __________. (D)\n" +
  "  A. with a bit of math\n" +
  "  B. by sending another object to the moon\n" +
  "  C. with some careful setup and observations\n" +
  "  D. by including it in the entanglement\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK11\n" +
  "Directions：Listen to three sentences from the report and fill in the missing words.\n" +
  "1. We may not be able to  (teleport) objects or people from place to place  (in an instant), but there are  (scenarios) where  (teleportation can be achieved).\n" +
  "2. ...and the  (philosophy) problem kind where your body is  (scanned)and the information is  (transmitted) somewhere else and used to  (build an entirely new body out of different materials).\n" +
  "3. Quantum entanglement occurs  (when two or more particles are forced to hold mutually exclusive states), so determining one  (simultaneously) determines the other.\n" +
  "\n" +
  "TASK12\n" +
  "TASK13\n" +
  "No.\tWords or expressions\tMeanings in the context\tThe sentences which include them\n" +
  " \n" +
  "1\t \n" +
  "cellular network\t \n" +
  "蜂窝网络\tThis fifth-generation cellular network is 10\n" +
  "times faster than 4G LTE.\n" +
  "2\tlag\t (延迟)\t (The new standard means devices can communicate with each other with no lag.)\n" +
  "3\tzero latency\t (零延迟)\t (You know how when you write with a pen, you see it as it happens, that zero latency, that’s pretty much what 5G can do. No waiting.)\n" +
  "4\tinfrastructure\t (基础设施)\t (First, we need a whole new infrastructure.)\n" +
  "5\tmillimeter waves\t (毫米波)\t (The 5G standard uses millimeter waves, which are a lot shorter than the wavelengths 4G uses.)\n" +
  "6\tantennas\t (天线)\t (To ensure a reliable 5G signal, there needs to be a lot of 5G cell towers and antennas everywhere.)\n" +
  "7\tnode\t (节点)\t (Each node, or, you know, mini cell tower needs some kind of connection to it.)\n" +
  "8\tfiber optic cables\t (光缆)\t (That means laying down fiber optic cables.)\n" +
  "9\troll out\t (推出)\t (While 5G is being rolled out, it is very slow and in limited areas. )\n" +
  "10\tcongest\t (拥挤)\t (I do estimate that eventually, even 5G will be congested with the number of people connecting to it and also the extra stuff that’s going to be used for 5G.)\n" +
  "Get the Flash Player to see this player.\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK14\n" +
  "Directions：The following are three excerpts from a lecture. Fill in each blank with one of the lecture cues given below and tell its function in leading the audience.\n" +
  "A.   Another example\n" +
  "B.    What I want to talk about is\n" +
  "C.    Finally\n" +
  "D.   So\n" +
  "E.    Then\n" +
  "F.     Let’s move on now to consider\n" +
  "G.   We’ll primarily be looking at four main models\n" +
  "1.  Good morning everyone. I hope you’ve all finished reading the notes from my previous lecture. Today’s lecture is in many ways a continuation of what we were looking at yesterday. ①  (B [topic cue]) learning  styles.\n" +
  "②  (G [structure cue]). First, we’ll be looking at the Kolb model. ③  (E [organisation cue—listing])we’ll consider a variant of  this, the Honey and Mumford model. The third model we’ll look at is the VAK model, perhaps the best  known of all of them. ④  (C [organisation cue—listing]), we’ll consider a popular model in the USA, the Dunn and Dunn  model.\n" +
  "2.  There are many useful tools that visual learners can use to help them improve their study. One  example is using pictures. So when they learn new vocabulary, rather than just writing the meaning,  they can try to draw a picture, to make it more visual. ⑤  (A [organisation cue—giving examples])is using maps or charts, or  for history subjects, use a time line.\n" +
  "3.  ⑥  (D [concluding cue]) that’s the Kolb model. ⑦  (F [transition cue])another model, the Honey and Mumford model.  This model is really a variant of the Kolb model, so in many ways it is very similar…\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "U5\n" +
  "TASK2\n" +
  "1. Which of the following statements about strong AI is NOT true? (C)\n" +
  "  A. Strong AI does not currently exist.\n" +
  "  B. Strong AI would have human cognition.\n" +
  "  C. Strong AI is totally different from general AI.\n" +
  "  D. Strong AI is more of a philosophy rather than an actual approach to creating AI.\n" +
  "2. In the sentence “They are like a crowd of savants babbling their narrow responses to the world” (Para.5), “they” refers to __________. (C)\n" +
  "  A. TASKs\n" +
  "  B. scientists\n" +
  "  C. models\n" +
  "  D. AI data\n" +
  "3. According to the passage, the author felt __________ to raise awareness about superintelligence. (B)\n" +
  "  A. delighted\n" +
  "  B. unnecessary\n" +
  "  C. embarrassed\n" +
  "  D. forced\n" +
  "4. What is the author’s attitude towards AI? (D)\n" +
  "  A. Unclear.\n" +
  "  B. Positive.\n" +
  "  C. Indifferent.\n" +
  "  D. Objective.\n" +
  "5. Which of the following details is NOT true? (C)\n" +
  "  A. AGI refers to a set of algorithms that can perform all TASKs as well as or better than humans.\n" +
  "  B. DeepMind belongs to Google.\n" +
  "  C. G.K. Chesteron observed that modern people knew what they believed.\n" +
  "  D. Anthony Levandowski started his own religion dedicated to the worship of AI.\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK3\n" +
  "Directions：Match the items in Column A with their definitions in Column B.\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "1.  (D)\n" +
  "2.  (E)\n" +
  "3.  (B)\n" +
  "4.  (A)\n" +
  "5.  (G)\n" +
  "6.  (H)\n" +
  "7.  (C)\n" +
  "8.  (F)\n" +
  "\n" +
  "\n" +
  "TASK4\n" +
  "Directions：Complete the following outline according to Passage B.\n" +
  "How AI Is Radically Changing Our Definition of Human Creativity\n" +
  "1.      Introduction\n" +
  "Can AI fully master the creative process? Or is a thought process constrained by what us humans define it as?\n" +
  "2.      Body\n" +
  "How does AI influence creativity in different industries?\n" +
  "1)    AI in AlphaGo\n" +
  " AI has creative intelligence.\n" +
  " The Google system’s 37th move was  (one no human would think to make).\n" +
  "2)    AI in the manufacturing industry\n" +
  " AI can learn human creativity from vast datasets and quickly produce  (solutions to tough problems).\n" +
  " Example:  (Ai Build)\n" +
  "3)    AI in the   (music industry)\n" +
  " AI gives musicians the ability to better understand  (their creative process) and  (even themselves).\n" +
  " Example:  (Reeps One’s battle with an AI opponent)\n" +
  "4)    AI in the art industry\n" +
  " Recommendation algorithms are changing the industry by influencing artists and curators to\n" +
  "create work which  (society is more likely to engage with).\n" +
  "5)    AI in the  ( gaming industry)\n" +
  "  AI is programmed to complete mundane TASKs so that  (practitioners can focus on more creative ones).\n" +
  "  Currently, AI used in creative practice today is  (self-controlled).\n" +
  "   In the future, we might accept AI  (into our work as a contributor).\n" +
  "3. Conclusion\n" +
  "    As AI provides creativities in a number of industries, it is  (challenging the possibilities of creation) and  (giving us more understanding of creativity).\n" +
  "\n" +
  "\n" +
  "TASK5\n" +
  "Directions：Find the English equivalents of the following items from Passage B.\n" +
  "1. 制胜战略  (winning strategy)\n" +
  "2. 增材制造  (additive manufacturing)\n" +
  "3. 生产流程  (production process)\n" +
  "4. 深度学习程序  (deep-learning programme)\n" +
  "5. 创意输出  (creative output)\n" +
  "6. 计算机生成的  (computer-generated)\n" +
  "7. 视觉艺术家  (visual artist)\n" +
  "8. 推荐算法  (recommendation algorithm)\n" +
  "9. 抽象思维  (abstract thinking)\n" +
  "10. 情节记忆  (episodic memory)\n" +
  "\n" +
  "\n" +
  "TASK6\n" +
  "Directions：Fill in the blanks with the phrases below. Change the form if necessary. Each phrase can be used only once.\n" +
  "take into account       take part       engage with\n" +
  "more of       a collection of\n" +
  "1. You’d better take some  (more of) your medicine.\n" +
  "2. There’s quite  (a collection of) books in the study.\n" +
  "3. A good architect  (takes into account) the building’s surroundings.\n" +
  "4. I will keep blogging because it offers me a way to  (engage with) readers.\n" +
  "5. It is a great honour to be invited to  (take part) in this educational tour.\n" +
  "\n" +
  "\n" +
  "TASK7\n" +
  "Directions：Translate the following sentences from Passage B into Chinese.\n" +
  "\t1. Although AlphaGo has been described as years ahead of its time, AI is rapidly sweeping into our everyday lives and its advancement has begun to transform and aid creative processes, as well as challenge what we believe to be “creative thinking”. (Para. 3)\n" +
  "Your answer：\n" +
  "Reference answer： 虽然AlphaGo可以说是领先了这个时代很多年，但是人工智能正在迅速进入我们的日常生活，其发展已经开始改变和辅助创作过程，同时也在挑战我们所认为的“创造性思维”。\n" +
  "2. We lose our ability to take these decisions efficiently and consistently as the number of possible solutions increases. (Para. 5)\n" +
  "Your answer：\n" +
  "Reference answer： 随着备选解决方案的增多，我们无法做出有效一致的决定。\n" +
  "3. AI is a solution to this issue and is enabling designers such as Cam and Desyllas to construct better designs by accelerating their thought processes and increasing their creative options. (Para. 6)\n" +
  "Your answer：\n" +
  "Reference answer： 人工智能解决了这个问题，它帮助像Cam和Desyllas这样的设计师加快思考过程，丰富创意方案，从而制作出更好的设计。\n" +
  "4. By using AI to automate the production process, Ai Build reduces material usage and labour costs whilst creating complex designs that were once impossible to devise and build. (Para. 6)\n" +
  "Your answer：\n" +
  "Reference answer： Ai Build公司使用人工智能实现生产过程自动化，从而减少了材料消耗，降低了劳工成本，创造出了曾经无法想象也无法实现的复杂的设计作品。\n" +
  "5. Yet, AI used in creative practice today is self-controlled, meaning that it works within a controlled environment and is programmed to do what its creators tell it. (Para. 14)\n" +
  "Your answer：\n" +
  "Reference answer： 然而人工智能在今时今日的创作实践中却是自我约束的，这表示人工智能是在一个受控的环境中工作，按照人们设定好的程序运行。\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK8\n" +
  "Directions：Write a summary of Passage B in about 200 words.\n" +
  "\tYour answer：\n" +
  "Reference answer：  Artificial intelligence (AI) is spreading through our lives, and it has made a surprising impact on human creativity. To begin with, a case in point is AlphaGo. The Google system relied on its own creative intelligence to design a winning chess move and beat the world’s reigning champion at Go in 2016. Nowadays AI continues influencing creativity across industries. In the manufacturing industry, AI can learn creativity from mountains of datasets and quickly produce large arrays of solutions to tough problems. In the music industry, AI gives musicians the ability to better understand their own creative process and themselves so as to help them become even more creative. Besides, music pieces generated by AI are socially accepted as well. Similarly, AI in the visual art industry is also adopted as a tool to shape creative strategies. Arts, with the assistance of AI, now can be tailored to popular tastes. In the gaming industry, AI releases human from mundane TASKs so that people can focus on more creative ones. Creative as it seems, what AI does is controlled in nature. In the near future, AI is expected to become more creative and contributing, and even interact with players in the games. To conclude, AI is challenging the possibilities of creation and giving us more understanding of creativity.\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK9\n" +
  "Directions：Refer to your dictionary for the meanings of the words or terms in Column A, and match them with the Chinese equivalents in Column B.\n" +
  "\n" +
  "1.  (C)\n" +
  "2.  (A)\n" +
  "3.  (B)\n" +
  "4.  (E)\n" +
  "5.  (D)\n" +
  "\n" +
  "\n" +
  "TASK10\n" +
  "Directions：Listen carefully and decide on the best answers to the questions.\n" +
  "\t1. The survey respondents might not cover interviews from __________. (D)\n" +
  "  A. business leaders\n" +
  "  B. government officials\n" +
  "  C. AI experts\n" +
  "  D. manufacturing workers\n" +
  "2. The survey is about __________. (B)\n" +
  "  A. AI development in Asia\n" +
  "  B. AI ethics in Asia\n" +
  "  C. AI regulation in Asia\n" +
  "  D. AI potentials in Asia\n" +
  "3. Most companies in Asia do not prioritize __________ by applying AI. (C)\n" +
  "  A. enhancing customer satisfaction\n" +
  "  B. improving process efficiency\n" +
  "  C. reducing labor costs\n" +
  "  D. speeding up decision-making\n" +
  "4. Most interviewees think AI should be __________. (A)\n" +
  "  A. government-regulated\n" +
  "  B. business-regulated\n" +
  "  C. institution-regulated\n" +
  "  D. free of regulation\n" +
  "5. Majority of Asian business leaders believe __________. (C)\n" +
  "  A. the unchecked use of AI will result in massive loss of jobs\n" +
  "  B. the rise of AI in Asia will destroy more jobs than it will create\n" +
  "  C. the application of AI can enhance and augment human work\n" +
  "  D. Asia will lead the world in the development of AI\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK11\n" +
  "Directions：Listen to three sentences from the report and fill in the missing words.\n" +
  "1. The company priorities for AI are to  (enhance customer satisfaction, speed up decision-making, and reduce inefficiencies).\n" +
  "2. Across the region, from Singapore to Japan and China, governments are  (assembling AI institutions to guide governance, often consulting with the private sector and civil society).\n" +
  "3. AI-driven  (unemployment narratives) are  (counterbalanced ) by the potential to  (enhance and augment human work).\n" +
  "\n" +
  "TASK12\n" +
  "TASK13\n" +
  "Directions：Watch a talk on the possible consciousness of robots, fill in the table of words or expressions and share your opinion of it with your classmates.\n" +
  "Get the Flash Player to see this player.\n" +
  "No.\tWords or expressions\tMeanings in the context\tThe sentences which include them\n" +
  " \n" +
  "1\t \n" +
  "toaster\t \n" +
  "烤面包机\tImagine a future where your toaster anticipates\n" +
  "what kind of toast you want.\n" +
  "2\tneuroscientist\t (神经科学家)\t (Some neuroscientists believe that any sufficiently advanced system can generate consciousness.)\n" +
  "3\tentitle\t (使享有权利)\t (Consciousness entitles beings to have rights because it gives a being the ability to suffer.)\n" +
  "4\tinfringement\t (侵犯，侵害)\t (For example, we dislike pain because our brains evolved to keep us alive, to stop us from touching a hot fire or to make us run away from predators, so we came up with rights that protect us from infringements that cause us pain.)\n" +
  "5\tdismantle\t (拆卸)\t (Would it mind being dismantled if it had no fear of death? )\n" +
  "6\thuman exceptionalism\t (人类例外论)\t (Our whole human identity is based on the idea of human exceptionalism that we are special, unique snowflakes entitled to dominate the natural world.)\n" +
  "7\tautomata\t (自动机，自动之物)\t (In the midst of the Scientific Revolution, René Descartes argued that animals were mere automata, robots if you will.)\n" +
  "8\trepugnant\t (令人厌恶的)\t (As such, injuring a rabbit was about as morally repugnant as punching a stuffed animal. )\n" +
  "9\tperpetrator\t (犯罪者)\t (And many of the greatest crimes against humanity were justified by their perpetrators on the grounds that the victims were more animal than civilized human.)\n" +
  "10\tsentient\t (有感觉的)\t (If we can coerce a sentient AI possibly through programmed torture into doing as we please, the economic potential is unlimited. )\n" +
  "\n" +
  "\n" +
  "TASK14\n" +
  "U6\n" +
  "\n" +
  "TASK2\n" +
  "Directions：Choose the best answer to each of the following questions.\n" +
  "\t1. Which of the following is one of the main features of Industry 4.0 according to the passage? (C)\n" +
  "  A. Mechanization.\n" +
  "  B. Automation.\n" +
  "  C. Smart manufacturing.\n" +
  "  D. Assembly lines.\n" +
  "2. With the support of smart machines, our factories will become all of the following EXCEPT __________. (B)\n" +
  "  A. less wasteful\n" +
  "  B. less profitable\n" +
  "  C. more efficient\n" +
  "  D. more productive\n" +
  "3. Once robotics were only available to large enterprises, because they were very __________. (A)\n" +
  "  A. expensive\n" +
  "  B. large\n" +
  "  C. complicated\n" +
  "  D. dangerous\n" +
  "4. Which of the following is the key component of Industry 4.0 according to the passage? (D)\n" +
  "  A. The computer.\n" +
  "  B. The data.\n" +
  "  C. The autonomous equipment.\n" +
  "  D. The Internet of Things.\n" +
  "5. According to the passage, which of the following statements about the Industry 4.0 applications is NOT true? (C)\n" +
  "  A. Manufacturers can optimize their operations quickly and efficiently by knowing what needs attention.\n" +
  "  B. A connected supply chain can adjust and accommodate when new information is presented.\n" +
  "  C. The technology of additive manufacturing is mainly used for prototyping.\n" +
  "  D. Through the use of the cloud environment, smaller enterprises may have access to the technology that they wouldn’t be able to develop on their own.\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK3\n" +
  "Directions：Match the items in Column A with their definitions in Column B.\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "1.  (E)\n" +
  "2.  (C)\n" +
  "3.  (G)\n" +
  "4.  (A)\n" +
  "5.  (F)\n" +
  "6.  (B)\n" +
  "7.  (H)\n" +
  "8.  (D)\n" +
  "\n" +
  "\n" +
  "TASK4\n" +
  "Directions：Complete the following outline according to Passage B.\n" +
  "The Smart Factory\n" +
  "1. Introduction\n" +
  "1) The smart factory can integrate  (data from connected operations and production systems to learn) and adapt to  (new demands).\n" +
  "2) The result can be a more  (efficient and agile system), less  (production downtime), and a greater ability to   (predict and adjust to changes in the facility or broader network).\n" +
  "2.     Definition of the smart factory\n" +
  "1)    The term “automation” suggests the performance of   (a single, discrete TASK or process).\n" +
  "2)    The smart factory is a flexible system that can  (self-optimize performance across a broader network, self-adapt to and learn from new conditions in real or near-real time), and autonomously run entire production processes.\n" +
  "3.     Features of the smart factory\n" +
  "1)    The most important feature of the smart factory is   (its connected nature).\n" +
  "2)    The automated workflows, synchronization of assets, improved tracking and scheduling, and optimized energy consumption can increase   ( yield, uptime and quality), as well as reduce  (costs and waste).\n" +
  "3)    In the smart factory, the data captured are   (transparen).\n" +
  "4)    In a proactive system, employees and systems can   (anticipate and act before issues or challenges arise) , rather than simply   (reacting to them after they occur).\n" +
  "5) Agile flexibility allows the smart factory to   (adapt to schedule and product changes with minimal intervention).\n" +
  "4. Benefits of the smart factory\n" +
  "1)    The  (self-correction) is what distinguishes the smart factory from traditional automation, which can yield   (greater overall asset efficiency).\n" +
  "2)    The self-optimization can  ( predict and detect quality defect sooner and can help to identify causes of poor quality), which could lead to  (a better-quality product with fewer defects and recalls).\n" +
  "3)    Optimized processes traditionally lead to   (more cost-efficient processes).\n" +
  "4)    The smart factory can impart real benefits around\n" +
  "(labor wellness and environmental sustainability).\n" +
  "5. Conclusion\n" +
  "Investing in a smart factory capability can enable manufacturers to  (differentiate themselves) and  (function more effectively and efficiently).\n" +
  "\n" +
  "\n" +
  "TASK5\n" +
  "Directions：Find the English equivalents of the following items from Passage B.\n" +
  "1.    库存跟踪  (inventory tracking) \n" +
  "2.     生产停工时间  (production downtime)\n" +
  "3.     优化决策  (optimization decision)\n" +
  "4.     供应链  (supply chain)\n" +
  "5.     操作技术  (operational technology)\n" +
  "6.     实时决策  (real-time decision)\n" +
  "7.     智能传感器  (smart sensor)\n" +
  "8.     数据可视化  (data visualization)\n" +
  "9.     资产效率  (asset efficiency)\n" +
  "10.  报废率  (scrap rate)\n" +
  "\n" +
  "\n" +
  "TASK6\n" +
  "Directions：Fill in the blanks with the phrases below. Change the form if necessary. Each phrase can be used only once.\n" +
  "adapt to                react to           take on\n" +
  "tap into                 translate into\n" +
  "\n" +
  "1. For this reason, some still argue that the central bank should not  (take on) the financial stability role.\n" +
  "2. Disruptive innovations, however, usually  (translate into) cheaper products with lower profit margins.\n" +
  "3. A miscalculation would produce big inflation only if the Fed failed to see and  (react to) it.\n" +
  "4. The rain forest theme products  (tap into) consumer interest in the environment.\n" +
  "5. The results of experiment show that this correction method can  (adapt to) a variety of rules of changes in the speed of sound of liquid media.\n" +
  "\n" +
  "\n" +
  "TASK7\n" +
  "Directions：Translate the following sentences from Passage B into Chinese.\n" +
  "\t1. The smart factory represents a leap forward from more traditional automation to a fully connected and flexible system—one that can use a constant stream of data from connected operations and production systems to learn and adapt to new demands. (Para. 1)\n" +
  "Your answer：\n" +
  "Reference answer： 智能工厂代表着从更传统的自动化向完全互联且灵活的系统的飞跃，该系统可以使用来自互联运营和生产系统的源源不断的数据来学习和适应新的需求。\n" +
  "2. Historically, situations in which machines have made “decisions” have been automation based and linear, such as opening a valve or turning a pump on and off based on a defined set of rules. (Para. 2)\n" +
  "Your answer：\n" +
  "Reference answer： 历史上，由机器做出“决定”的情况是基于自动化和线性的，例如打开阀门或根据一套明确的规则打开和关闭泵。\n" +
  "3. Integration of data from operations and business systems, as well as from suppliers and customers, enables a holistic view of upstream and downstream supply chain processes, driving greater overall supply network efficiency. (Para. 4)\n" +
  "Your answer：\n" +
  "Reference answer： 整合来自运营和业务系统以及供应商和客户的数据，就能够全面了解上下游供应链流程，从而提高整体供应网络效率。\n" +
  "4. The ability of the smart factory to predict future outcomes based on historical and real-time data can improve uptime, yield, and quality, and prevent safety issues. (Para. 7)\n" +
  "Your answer：\n" +
  "Reference answer： 智能工厂基于历史数据和实时数据预测未来结果的能力可以提高正常运行时间、产量和质量，并能预防安全问题。\n" +
  "5. However, the role of the human worker in a smart factory environment may take on greater levels of judgment and on-the-spot discretion, which can lead to greater job satisfaction and a reduction in turnover. (Para. 12)\n" +
  "Your answer：\n" +
  "Reference answer： 然而，在智能工厂环境中，人类工作者的角色可能会具有更高的判断力和现场裁量权，从而提高工作满意度并减少人员流动。\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK8\n" +
  "Directions：Write a summary of Passage B in about 200 words.\n" +
  "\tYour answer：\n" +
  "Reference answer：  The smart factory is a fully connected and flexible system that can integrate data from connected operations and production systems to self-optimize performance, self-adapt to new demands, and autonomously run entire production processes.\n" +
  "The smart factory has some features, the most important of which is connectedness. In the smart factory, the manufacturing process has been optimized, and the data captured are transparent. The proactive system can anticipate and act before issues or challenges arise, and the agility enables the smart factory to adapt to schedule and product changes with minimal intervention.\n" +
  "The self-correction of the smart factory can yield greater overall asset efficiency. The self-optimization of the smart factory can lead to a better-quality product with fewer defects and recalls. In the smart factory, the optimized processes traditionally lead to more cost-efficient processes: the process and operations variability can be reduced, and the costs can be lowered. The smart factory can also bring real benefits to labor health and environmental sustainability. Human workers will take on more complex roles while automation will conquer the TASKs that are repetitive and fatiguing.\n" +
  "The smart factory is a direct way for manufacturers to excel in a competitive and dynamic marketplace.\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK9\n" +
  "Directions：Refer to your dictionary for the meanings of the words or terms in Column A, and match them with the Chinese equivalents in Column B.\n" +
  "\n" +
  "1.  (C)\n" +
  "2.  (B)\n" +
  "3.  (E)\n" +
  "4.  (D)\n" +
  "5.  (A)\n" +
  "\n" +
  "\n" +
  "TASK10\n" +
  "Directions：Listen carefully and decide on the best answers to the questions.\n" +
  "\t1. Why is the way developed by Relativity Space to make rockets revolutionary? (B)\n" +
  "  A. Because it signed a contract with the Air Force.\n" +
  "  B. Because it is to use a 3D printer to make rockets.\n" +
  "  C. Because it has a launch site at Cape Canaveral, Florida.\n" +
  "  D. Because it has the largest 3D printer by volume in the world.\n" +
  "2. Stargate, the 3D printer of Relativity, can manufacture parts that are up to __________. (C)\n" +
  "  A. 30 feet tall and 10 feet wide\n" +
  "  B. 20 feet tall and 20 feet wide\n" +
  "  C. 20 feet tall and 10 feet wide\n" +
  "  D. 10 feet tall and 20 feet wide\n" +
  "3. Which of the following statements is true? (C)\n" +
  "  A. Relativity can make the rocket through automated 3D printing without manual assembly.\n" +
  "  B. The making of the rocket still need much human involvement for testing, shipping and assembly.\n" +
  "  C. More than 90 percent of the rocket can be 3D printed automatically without human touch.\n" +
  "  D. The company’s engineers designed the 3D printer from scratch, which means they can test it if necessary.\n" +
  "4. Using 3D printer to making rockets keeps costs relatively low because __________. (D)\n" +
  "  A. it reduces human work and the number of rocket parts\n" +
  "  B. it reduces human work and simplifies manufacturing process\n" +
  "  C. it reduces the prices of rocket parts and the production time\n" +
  "  D. it reduces the number of rocket parts and simplifies manufacturing process\n" +
  "5. The long-term objective of 3D printing rockets is __________. (B)\n" +
  "  A. perfecting its printing process on Earth\n" +
  "  B. setting up a rocket factory on Mars\n" +
  "  C. reducing the size of the printers\n" +
  "  D. sending materials, and astronauts to Mars\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK11\n" +
  "Directions：Listen to three sentences from the report and fill in the missing words.\n" +
  "1. Ellis  (claims) that by relying on technology like Stargate to  (manufacture rockets),the company will be able to  (produce about 95 percent of the rocket through automated 3D printing).\n" +
  "\n" +
  "2. For example, the Terran 1’s  (engine injector and chamber) are made of just three 3D-printed parts rather than the nearly 3,000 parts  (needed by conventional rocket assembly processes.).\n" +
  "\n" +
  "3. Relativity’s rocket will be called the Terran 1: a  (10-story-tall launcher) capable of  (delivering payloads up to 2,755 pounds)—roughly the weight of  (a compact car—into low Earth orbit)—into  (low Earth orbit).\n" +
  "\n" +
  "TASK12\n" +
  "TASK13\n" +
  "Directions：Watch a report on the rise of machine, fill in the table of words or expressions and share your ideas about the inevitable job loss brought by new-age automation with your classmates.\n" +
  "Get the Flash Player to see this player.\n" +
  "No.\tWords or expressions\tMeanings in the context\tThe sentences which include them\n" +
  " \n" +
  "1\t \n" +
  "diagnose\t \n" +
  "诊断\tToday, they can land aircraft, diagnose cancer,\n" +
  "and trade stocks.\n" +
  "2\tin a nutshell\t (简而言之)\t (So in a nutshell, innovation, higher productivity, fewer old jobs, and many new and often better jobs. )\n" +
  "3\tboom\t (迅速发展)\t (While new information age industries are booming, they are creating fewer and fewer new jobs.)\n" +
  "4\trun out of steam\t (失去势头，失去动力)\t (Old innovative industries are running out of steam. )\n" +
  "5\tmomentum\t (势头，推进力)\t (Decades of investment kept this momentum going. )\n" +
  "6\ton a par with\t (与……同等)\t (Some technologists argue that the Internet is an innovation on a par with the introduction of electricity.)\n" +
  "7\tequate\t (等同于)\t (Innovation in the information age doesn’t equate to the creation of enough new jobs, which would be bad enough on its own, but now a new wave of automation and a new generation of machines is slowly taking over.)\n" +
  "8\tbrink\t (边缘)\t (Machines are on the brink of becoming so good at breaking down complex jobs into many predictable ones, that for a lot of people, there will be no further room to specialize.)\n" +
  "9\ton the verge of\t (即将)\t (We are on the verge of being out-competed.)\n" +
  "10\tout-competed\t (被打败，被淘汰)\t (We are on the verge of being out-competed.)\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK14\n" +
  "Directions：The following is one part of the user manual of HP photo scanner 1200. Translate it into English with the useful words and expressions given below.\n" +
  "\n" +
  "\tYour answer：\n" +
  "Reference answer： set the scan options\n" +
  "\n" +
  "You can use buttons on the scanner to select among several scanning options.\n" +
  "\n" +
  "position the photo on the scanner\n" +
  "\n" +
  "1 Place the photo face down on the scanner glass. The top of the photo should be toward the back and left side of the scanner.\n" +
  "\n" +
  "2 Slide the photo within the border markings on the scanner glass.\n" +
  "\n" +
  "3 Close the scanner lid.\n" +
  "\n" +
  "Note: To find out about positioning large photos or documents, see scan photos larger than 10 x 15 cm (4 x 6 inches) on page 25.\n" +
  "\n" +
  "change the image quality\n" +
  "\n" +
  "The scanner has three image quality settings for photos: Good, Better, and Best. It also has a Text setting for scanning text documents. On the front panel display you can view the current quality setting.\n" +
  "\n" +
  "to change the image quality:\n" +
  "\n" +
  "Press the Quality button until the setting you want appears on the front panel display.\n" +
  "\n" +
  "The settings change incrementally from Good, to Better, to Best, then to Text. The quality setting determines the quality of the images and how many images you can store on the memory card.\n" +
  "\n" +
  "When you change the quality setting, the scanner will recalculate the number of photos remaining. If the quality is changed to a level beyond the amount of memory remaining, the number of photos remaining will be zero and the scanner will not scan.\n" +
  "\n" +
  "For information on how the quality setting affects the number of images that fit on the memory card, see memory card capacity on page 38.\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "U7\n" +
  "\n" +
  "TASK2\n" +
  "Directions：Choose the best answer to each of the following questions.\n" +
  "\t1. The smart grid can usher in a new era of the energy industry by __________. (B)\n" +
  "  A. meeting the needs of increasing power supply\n" +
  "  B. promoting reliability, availability, and efficiency\n" +
  "  C. adjusting to communication between power plants and customers\n" +
  "  D. reducing blackouts\n" +
  "2. To ensure the benefits from the smart grid, it will be critical to carry out __________ during the transition period. (D)\n" +
  "  A. consumer education and development of standards and regulations\n" +
  "  B. technology improvements\n" +
  "  C. information sharing between projects\n" +
  "  D. all of the above\n" +
  "3. The advantage of the smart grid in an electricity disruption lies in __________. (A)\n" +
  "  A. its greater capacity to handle emergencies and minimize the effects\n" +
  "  B. its higher level of security for customers\n" +
  "  C. its interaction with customers\n" +
  "  D. its quick response to the situation\n" +
  "4. The smart grid can save consumers’ money by __________. (C)\n" +
  "  A. the reduction in electricity rates\n" +
  "  B. less loss in power transmission\n" +
  "  C. the high level of consumer participation in electricity use and even power generation\n" +
  "  D. giving the information of their overall electricity use every month\n" +
  "5. Which of the following statements is NOT true according to the passage? (C)\n" +
  "  A. The smart grid involves a lot of digital and computerized equipment and technology dependent on it.\n" +
  "  B. When it comes fully on line, the smart grid will play a significant role in our life.\n" +
  "  C. The electric grid is a recent concept.\n" +
  "  D. The smart grid allows for better integration of home-grown electricity.\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK3\n" +
  "Directions：Match the items in Column A with their definitions in Column B.\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "1.  (H)\n" +
  "2.  (D)\n" +
  "3.  (E)\n" +
  "4.  (C)\n" +
  "5.  (F)\n" +
  "6.  (A)\n" +
  "7.  (G)\n" +
  "8.  (B)\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK4\n" +
  "Directions：Complete the following outline according to Passage B.\n" +
  "5 questions\tAnswers and explanations\n" +
  " \n" +
  "Comparison with\n" +
  "the impact of the last transition\t1.     Impact of the last transition from biomass energy to fossil fuel energy:\n" +
  "1)  (exercise of geopolitical power around the distribution of those resources)\n" +
  "2)  (economic advantages for those countries that extracted those resources)\n" +
  "2.     Impact of this transition from fossil fuel energy to renewable energy:\n" +
  "1)  (some degree of energy independence in the new energy system for almost every country)\n" +
  "2)  (a profound impact on the global economy and potential to reshape the geopolitical landscape)\n" +
  " \n" +
  "Countries’ anticipated response to the energy transition and geopolitical changes\t1.  Some fossil-fuel producing countries like  (the United Arab Emirates ) and  (Saudi Arabia):  (to adopt a new, diversified, economic model)\n" +
  "2.  Other countries highly dependent on fossil fuel resources like  (Nigeria),  ( Angola)and  ( Gabon):  (unprepared)\n" +
  "3.  In terms of the geopolitics, there is a chance for fossil-fuel producing countries to remain as    (energy players) .\n" +
  " \n" +
  "Response of emerging economies to this transition\t1.     General: already responding well\n" +
  "2.     Evidence:\n" +
  " (The majority of renewables capacity addition) has been in emerging economies and developing countries.\n" +
  "3.     Examples:  (Morocco )and    (Chile)\n" +
  " \n" +
  "Explanation on the remark “renewable energy is the ‘defence policy of the future’”\t1.  The risk of confrontation over    ( hydrocarbon reserves) may diminish.\n" +
  "2.  Renewable energy plays an essential role in    (all strategies to combating climate change) .\n" +
  "3.  Renewable energy has the potential to    (mitigate against wider socio-economic stresses and shocks) that can lead to conflict too.\n" +
  "Challenges presented by\n" +
  "the transition\t1.     Impact on those working in the fossil fuel industries:  (Potentially severe social disruption), like in the coal industry and mobility sectors\n" +
  "2.     Suggestion: a lot of work to be done in developing    (a cross-understanding of industrial policy and social policy)\n" +
  "\n" +
  "\n" +
  " \n" +
  "\n" +
  "\n" +
  "TASK5\n" +
  "Directions：Find the English equivalents of the following items from Passage B.\n" +
  "1. 能源转型  (energy transition/transformation)\n" +
  "2. 化石燃料  (fossil fuel)\n" +
  "3. 生物质能  (biomass energy)\n" +
  "4. 清洁能源发电  (clean energy power generation)\n" +
  "5. 新兴经济体  (emerging economies)\n" +
  "6. 产能的增加  (capacity addition)\n" +
  "7. 电力组合，电力结构  (electricity mix)\n" +
  "8. 油气储量  (hydrocarbon reserves)\n" +
  "9. 能源引发的冲突  (energy-fuelled conflicts)\n" +
  "10. 煤炭行业  (coal industry/sector)\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK6\n" +
  "Directions：Fill in the blanks with the phrases below. Change the form if necessary. Each phrase can be used only once.\n" +
  "\n" +
  "1. GSM operators  (call for) reallocation of 800MHz band to more efficiently use the spectrum and increase revenue from the upcoming auction.\n" +
  "2. As broad as the definition of IoT are the cybersecurity challenges that  (pose a threat to) anything and everyone connected.\n" +
  "3. In this incident technology has proved already  (in place) to track bomb hoaxers.\n" +
  "4. The government is the main contributor and,  (as such), controls the project.\n" +
  "5. We can see technology disruption  (play out) in a number of industries like computing where the mainframe gave way to the PC that gave way to the smartphone.\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK7\n" +
  "Directions：Translate the following sentences from Passage B into Chinese.\n" +
  "\t1. One of the greatest challenges that the energy transition presents is for fossil fuel-producing countries, many of which are countries that have run their economies on these resources in the past, to adopt a new, diversified, economic model. (Para. 4)\n" +
  "Your answer：\n" +
  "Reference answer： 能源转型所带来的最大挑战之一是，化石燃料生产国——其中许多是过去依靠这些资源发展经济的国家——要采取一种新的多样化的经济模式。\n" +
  "2. If you think of the possibilities that a fast-moving energy transition has for the prices of fossil fuel resources, and the impact it could have on countries like Nigeria, Angola, Gabon and others that are highly dependent on these resources, then unless they have ambitious strategies of economic diversification, they could face some severe challenges in the near future. (Para. 7)\n" +
  "Your answer：\n" +
  "Reference answer： 如果你想到快速的能源转型对化石燃料资源价格的影响，以及它可能对尼日利亚、安哥拉、加蓬和其他高度依赖这些资源的国家的影响，那么除非这些国家有雄心勃勃的经济多样化战略，否则它们在不久的将来可能会面临一些严峻的挑战。\n" +
  "3. You have leaders in this field, like Morocco, which is coming from a 90 per cent energy import dependency to a target of having 52 per cent renewables in their electricity mix by 2030—which is an extraordinary achievement. (Para. 12)\n" +
  "Your answer：\n" +
  "Reference answer： 在这一领域，有一些国家处于领先地位，比如摩洛哥，该国正从90%的能源进口依赖转向到2030年可再生能源在其电力结构中占52%的目标——这是一个非凡的成就。\n" +
  "4. Renewables have the added potential to mitigate against wider socio-economic stresses and shocks that can lead to conflict too: by improving access to energy to the 1 billion people who are energy-poor, by creating jobs, reducing local pollution, promoting sustainable development and alleviating competition over scarce natural resources. (Para. 18)\n" +
  "Your answer：\n" +
  "Reference answer： 可再生能源还有额外的潜力，即通过改善10亿能源贫困人口的能源供应，通过创造就业机会、减少当地污染、促进可持续发展和减轻对稀缺自然资源的竞争，可以缓解更广泛的社会经济压力和冲击，这些压力和冲击也可能导致冲突。\n" +
  "5. But then if you think about how technology is beginning to reshape the global economy, if we move rapidly into the renewable energy-based electrification of the economy—where major sectors like mobility become increasingly electric—then you could see the whole supply chain of conventional vehicles that employs millions of people around the world, with hundreds of billions of dollars of investment, very quickly begin to experience significant challenges. (Para. 22)\n" +
  "Your answer：\n" +
  "Reference answer： 但是，如果你想一想技术如何开始重塑全球经济，如果我们迅速进入基于可再生能源的经济电气化——在这个经济体中，像交通这样的主要部门变得越来越电气化——那么你可以看到在全球雇佣数百万人、拥有数千亿美元投资的整个传统汽车供应链很快就开始面临重大挑战。\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK8\n" +
  "Directions：Write a summary of Passage B in about 200 words.\n" +
  "\tYour answer：\n" +
  "Reference answer：  The world is shifting from an energy system based on fossil fuels to one based on renewable energy. Director-General of the International Renewable Energy Agency, Adnan Z. Amin, talks about how this transition is set to disrupt the geopolitical landscape.\n" +
  "Because almost every country will have some degree of energy independence in the new system, this transition is going to have a profound impact on the global economy, thus having the potential to reshape the geopolitical landscape. In order to remain as energy players, some fossil fuel-producing countries are ready to embrace an economic diversification strategy. Emerging economies are already responding well to this transition, which can be seen from renewables capacity addition. Renewable energy is the “defence policy of the future” as it will reduce the risk of confrontation over limited hydrocarbon reserves, combat climate change and mitigate against wider socio-economic stresses and shocks. However, policymakers and decision-makers need to understand the impact of this transition on the fossil fuel industries and those working in them, and come up with coping strategies to create a workforce fit for the future.\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK9\n" +
  "Directions：Refer to your dictionary for the meanings of the words or terms in Column A, and match them with the Chinese equivalents in Column B.\n" +
  "\n" +
  "1.  (B)\n" +
  "2.  (A)\n" +
  "3.  (C)\n" +
  "4.  (E)\n" +
  "5.  (D)\n" +
  "\n" +
  "\n" +
  "TASK10\n" +
  "Directions：Listen carefully and decide on the best answers to the questions.\n" +
  "\t1. The theoretical “blackbody limit” decides __________. (B)\n" +
  "  A. how much heat can be produced from thermal radiation\n" +
  "  B. how much electricity can be produced from heat\n" +
  "  C. how much thermal radiation can be produced from heat\n" +
  "  D. how much energy can be produced from electricity\n" +
  "2. Francoeur and his team have developed a device that __________. (C)\n" +
  "  A. uses two silicon surfaces with a 200-nanometer-thick gap\n" +
  "  B. consists of two 100-nanometer-thick silicon wafers\n" +
  "  C. converts wasted heat to usable energy\n" +
  "  D. transforms all heat into electricity\n" +
  "3. The findings of Francoeur and his team were published in the journal __________. (B)\n" +
  "  A. Medical Engineering\n" +
  "  B. Nature Nanotechnology\n" +
  "  C. Electrical Engineering\n" +
  "  D. Science Nanotechnology\n" +
  "4. The amount of electricity generated from heat flux is determined by __________. (A)\n" +
  "  A. the gap between two silicon wafers\n" +
  "  B. the thickness of the chip\n" +
  "  C. the size of two silicon wafers\n" +
  "  D. the time of heating and cooling\n" +
  "5. The chips could be used in the following areas EXCEPT __________. (D)\n" +
  "  A. Computer\n" +
  "  B. Automobile\n" +
  "  C. Medicine\n" +
  "  D. Education\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK11\n" +
  "Directions：Listen to three sentences from the report and fill in the missing words.\n" +
  "1. But Francoeur and his team have demonstrated that  (that they can go well beyond the blackbody limit and produce more energy) if they create a device  (that uses two silicon surfaces very close together).\n" +
  "2. While the chip was in a  (vacuum), they heated  (one surface and cooled another surface), which created a  ( heat flux) that can  ( generate ) electricity.\n" +
  "3. The chips could be used to  (improve the efficiency of solar panels) by increasing the amount of electricity from the sun’s heat or in  ( automobiles ) to  ( take the heat from the engine to help power the electrical systems).\n" +
  "\n" +
  "TASK12\n" +
  "TASK13\n" +
  "Directions：Watch an introduction to renewable energy, fill in the table of words or expressions and share your ideas about the challenges with your classmates.\n" +
  "Get the Flash Player to see this player.\n" +
  "No.\tWords or expressions\tMeanings in the context\tThe sentences which include them\n" +
  " \n" +
  "1\t \n" +
  "barrel\t桶（石油计量单位，1桶\n" +
  "等于42加仑或159升）\tEvery year, the world uses 35 billion barrels\n" +
  "of oil.\n" +
  "2\ton the flip side\t (另一方面)\t (On the flip side, we have abundant sun, water, and wind)\n" +
  "3\tblast furnaces\t (（炼铁的）高炉，鼓风炉)\t (Electricity powers blast furnaces, elevators, computers, and all manner of things in homes, businesses, and manufacturing)\n" +
  "4\tquadrillion\t (千万亿)\t (The sun continuously radiates about 173 quadrillion watts of solar energy at the earth, which is almost 10,000 times our present needs)\n" +
  "5\tgeothermal\t (地热的)\t (There are other forms of renewable energy we could draw from such as hydroelectric, geothermal, and biomasses, but they also have limits based on availability and location)\n" +
  "6\tastronomical\t (极高的，天文数字的)\t (But building a system on this scale faces an astronomical price tag)\n" +
  "7\tdissipate\t (消耗)\t (Present-day power lines lose about 6 to 8% of the energy they carry because wire material dissipates energy through resistance)\n" +
  "8\tlithium-ion batteries\t (锂离子电池)\t (Recently, we’ve gotten better at producing lithium-ion batteries, which are lightweight and have high energy density)\n" +
  "9\tmegajoule\t (兆焦（耳）)\t (But even the best of these store about 2.5 megajoules per kilogram)\n" +
  "10\tmultifaceted\t (多方面的)\t (Priorities on how to tackle this challenge depend on the specific assumptions we have to make when trying to solve such a multifaceted problem, but there’s ample reason to be optimistic that we’ll get there.)\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK14\n" +
  "Directions：Choose the best answer to each of the following questions.\n" +
  "\t1. Which of the following examples do you think best illustrates the concise language you should use in a lab report? (C)\n" +
  "  A. The plants exposed to full sunlight showed amazing amounts of growth after a couple weeks.\n" +
  "  B. The entire lab group laughed when the water spilled out of the test tube.\n" +
  "  C. The plants exposed to full sunlight grew an average of 3 cm in 14 days, while the plants left indoors grew only 0.5 cm on average.\n" +
  "  D. The plants grew.\n" +
  "2. You did an experiment in which you added 20 ml of water to a test tube. How would you describe this in your lab report? (A)\n" +
  "  A. 20 ml of water was added to a test tube.\n" +
  "  B. 20 ml of water is added to a test tube.\n" +
  "  C. I added 20 ml of water to a test tube.\n" +
  "  D. I add 20 ml of water to a test tube.\n" +
  "3. Imagine you did an experiment in which you grew five different groups of rose bushes, and each group received a different amount of fertilizer. Which of the following would be the best title for this lab report? (C)\n" +
  "  A. Plants and fertilizer.\n" +
  "  B. Five groups of rose bushes received different amount of fertilizer.\n" +
  "  C. The effect of fertilizer on the growth of rose bushes.\n" +
  "  D. Rose bushes with large amount of fertilizer grow better than rose bushes with small amount of fertilizer.\n" +
  "4. Which of the following information should not be included in the Introduction of a lab report? (D)\n" +
  "  A. The purpose of the study.\n" +
  "  B. General information about the topic being investigated.\n" +
  "  C. A literature review that summarizes what is already known about the topic.\n" +
  "  D. The conclusions you have made based on the results of your study.\n" +
  "5. Imagine that you’re writing a paper for a lab in which you isolated the caffeine from a cup of coffee. Select the sentence that you would write in the Materials and Methods section of a lab report. (D)\n" +
  "  A. Coffee is a beverage enjoyed by millions of people around the world every day.\n" +
  "  B. The second attempt resulted in the extraction of 73 mg of caffeine.\n" +
  "  C. 200 ml coffee heated to 90°C.\n" +
  "  D. 200 ml of coffee was placed in a flask and heated to 90°C.\n" +
  "6. Which of the following is a good example of a sentence you would find in the Discussion section of a lab report? (B)\n" +
  "  A. Ten dogs with no previous training were selected for the study.\n" +
  "  B. Unlike in previous studies on dog training, most of the dogs in this study retained the ability to perform tricks for up to six weeks after the initial training sessions.\n" +
  "  C. Seven of the ten dogs learned how to “sit” after three training sessions.\n" +
  "  D. It was hypothesized that the dogs would be able to retain all of the training commands for six weeks after the initial training sessio\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "U8\n" +
  "UNIT 8\n" +
  "TASK 2\n" +
  "Directions：Choose the best answer to each of the following questions.\n" +
  "\t1. Self-driving cars run on the basis of machine learning and the complex system composed of __________. (D)\n" +
  "  A. cameras\n" +
  "  B. sensors\n" +
  "  C. software\n" +
  "  D. all of the above\n" +
  "2. What is the unique feature of Einride’s self-driving trucks compared with those of Daimler and Uber? (B)\n" +
  "  A. They have higher efficiency and cause less air pollution.\n" +
  "  B. There is no cab for human intervention.\n" +
  "  C. They can take over in certain circumstances.\n" +
  "  D. None of the above.\n" +
  "3. According to the passage, Amazon has been committed to drones for __________. (C)\n" +
  "  A. air taxis\n" +
  "  B. environmental monitoring\n" +
  "  C. delivery service and recharge of electric cars\n" +
  "  D. prevention of costly downtime\n" +
  "4. __________ is the fuel that powers the tremendous strides in the transportation system. (D)\n" +
  "  A. Machine learning\n" +
  "  B. Predictive maintenance analytics\n" +
  "  C. Optimization\n" +
  "  D. Data\n" +
  "5. Which of the following can be inferred from the passage? (C)\n" +
  "  A. In the future there will be very few conventional vehicles on the road.\n" +
  "  B. Remote-controlled cargo ships in commercial use are still decades away.\n" +
  "  C. Big data, AI and IoT are very likely to bring a safer, more cost-effective and efficient transportation system.\n" +
  "  D. Even in the future taking a drone air taxi will be so expensive that it will remain the privilege of a few.\n" +
  "\n" +
  "\n" +
  "TASK 3\n" +
  "Directions：Match the items in Column A with their definitions in Column B.\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "1.  (F)\n" +
  "2.  (E)\n" +
  "3.  (H)\n" +
  "4.  (B)\n" +
  "5.  (G)\n" +
  "6.  (D)\n" +
  "7.  (C)\n" +
  "8.  (A)\n" +
  "\n" +
  "\n" +
  "TASK 4\n" +
  "\n" +
  "\n" +
  "Directions：Complete the following outline according to Passage B.\n" +
  "Smart Mobility: Challenges and Solutions in Cities and Communities\n" +
  "1. Introduction\n" +
  "    1) Importance of urban mobility:  (the lifeblood of modern cities, a critical economic factor, and a facilitator of smart, sustainable development) \n" +
  "    2) Theme of this article: a perspective on  (urban mobility challenges and examples of smart city solutions)\n" +
  "2. Urban Mobility Problems\n" +
  "    1) General: In few places the reality of urban mobility matches the public’s aspirations for  ( safe, clean, reliable, and affordable transport) transport.\n" +
  "    2) Supporting details:\n" +
  "         It is a major priority to  ( reduce and control pollution levels).\n" +
  "         Urbanization and continuing car dependence lead to  (inevitable traffic congestion, emissions and safety problems).\n" +
  "         The popularity of ride-hailing is a threat to cities by increasing pollution and congestion while reducing  (public transport ridership).\n" +
  "         Road fatalities are increasing in many cities as a result of  (urban population density) and vehicles sharing streets with  ( vulnerable road users).\n" +
  "          (Greater reliance on digital technologies) causes increased cybersecurity risks to the transport sector.\n" +
  "         There is the challenge of how to ensure usability and continuity of services for citizens with  ( limited mobility options) and in  (transport poverty) .\n" +
  "3. Examples of Urban Mobility Solutions\n" +
  "    1) Mobility as a Service (MaaS) Example:  (Moovel)\n" +
  "    2) Sustainable travel behavior Example:  (TimesUpp)\n" +
  "    3) Traffic management solution Example:  (PSIroads)\n" +
  "    4) Traffic congestion service Example:  (Parquery)\n" +
  "    5) Micromobility management Example:  ( eCooltra)\n" +
  "    6) Public transport innovation Example:  ( the city of Lublin)\n" +
  "    7) Transport poverty reduction Example:  (the HiReach project)\n" +
  "4. Visions of the Future\n" +
  "    Residents and visitors will enjoy a wider range of  (affordable, multimodal, on-demand mobility options); and conventional cars and ownership practices are replaced by  (shared electric and autonomous vehicles), generating benefits like  ( the elimination of road fatalities),  (improvement in travel times) and  ( reduction of air pollution).\n" +
  "\n" +
  "TASK 5\n" +
  "Directions：Find the English equivalents of the following items from Passage B.\n" +
  "1. 城市交通解决方案  (urban mobility solutions)\n" +
  "2. 交通基础设施承载力  (capacity of road infrastructure)\n" +
  "3. 颠覆性的商业模式  (disruptive business models)\n" +
  "4. 公共交通客运量  (public transport ridership)\n" +
  "5. 公共交通停车站  (transit stops)\n" +
  "6. 弱势道路使用者  (vulnerable road users)\n" +
  "7. 按需服务  (on-demand service)\n" +
  "8. 电子显示屏  (electronic displays)\n" +
  "9. 拼车  (ridesharing)\n" +
  "10. 自动驾驶车辆  (autonomous vehicles)\n" +
  "\n" +
  "TASK 6\n" +
  "Directions：Fill in the blanks with the phrases below. Change the form if necessary. Each phrase can be used only once.\n" +
  "equivalent to            committed to          perspective on\n" +
  "collide with             deny access to\n" +
  " \n" +
  "1.     The aims of the negotiators in New York again seem likely to  (collide with) the aims of the warriors in the field.\n" +
  "2.     Because of its geographical position, Germany’s  (perspective on) the situation in Russia is very different from Washington’s.\n" +
  "3.     The density of the atmosphere at the Venus surface is  (equivalent to) just under a kilometer beneath the ocean here on Earth.\n" +
  "4.     Perfect Parking, Inc. is  (committed to) providing high quality solutions for all parking, logistics,and management services in Downtown Los Angeles and beyond.\n" +
  "5.     If you have a shared or public computer that several people use, you might want to  (deny access to) its drives to prevent users from deleting important data.\n" +
  "\n" +
  "TASK 7\n" +
  "1. Although cities recognize the benefits of public transport in reducing pollution and congestion, local government’s efforts to deliver the benefits may collide with disruptive business models such as Uber and other ride-hailing services. (Para. 5)\n" +
  "Your answer：\n" +
  "Reference answer： 尽管城市认识到公共交通有助于减少污染和拥堵，但地方政府提供这些好处的努力可能会与优步和其他叫车服务等颠覆性的商业模式发生冲突。\n" +
  "2. Based on research from Leeds University, someone suffers from transport poverty “when issues concerning travel time, availability, accessibility, affordability or adequacy of transport options present barriers to satisfying basic activity needs”. (Para. 8)\n" +
  "Your answer：\n" +
  "Reference answer： 根据利兹大学的研究，出现以下情形而使人们不能满足其基本活动需求时，其会遭受交通匮乏之苦。这些情形涉及交通工具的出行时间、可得性、可达性，以及交通选择的可负担性和充分性。\n" +
  "3. Used by more than 150,000 people, TimesUpp “transforms a user’s calendar into the perfect travel assistant, advising on the best time and method of transport to get to their destination, with real-time updates on traffic jams and other unexpected delays”. (Para. 10)\n" +
  "Your answer：\n" +
  "Reference answer： 用户超过15万人的TimesUpp“将用户的日历变成完美的旅行助手，提供到达目的地的最佳时间和交通方式的建议，实时更新交通堵塞和其他意外延误信息。”\n" +
  "4. Judging from innovation trends and disruptive forces in urban mobility, it is realistic to envision a future scenario when smart city residents and visitors enjoy a wider range of affordable, multimodal, on-demand mobility options; and conventional cars and ownership practices are replaced by shared electric and autonomous vehicles. (Para. 17)\n" +
  "Your answer：\n" +
  "Reference answer： 从城市交通的创新趋势和颠覆性力量来看，下述对未来情景的设想是现实的：智能城市居民和游客享受更广泛的可负担得起的、多模式的、按需的交通选择；传统的汽车和所有权被共享电动车辆和自动驾驶车辆所取代。\n" +
  "5. The Boston Consulting Group believes widespread adoption of autonomous technologies could yield substantial benefits by eliminating road fatalities, improving travel times by up to 40%, recovering billions of hours lost to commuting and congestion, and generating total benefits to society worth $1.3 trillion. (Para. 18)\n" +
  "Your answer：\n" +
  "Reference answer： 波士顿咨询集团认为，自动驾驶技术的广泛应用将带来巨大的好处——可以消除道路死亡人数，将出行时间缩短40%，弥补通勤和交通拥堵造成的数十亿小时的损失，并为社会带来价值1.3万亿美元的总效益。\n" +
  "TASK 8\n" +
  "Reference answer：  Mobility is an important element in smart city planning. According to McKinsey, there are quite a few urban mobility problems in all major cities in Europe—pollution, traffic congestion, increasing road fatalities, cybersecurity risks, citizens with limited mobility options and in “transport poverty”, just to name a few.\n" +
  "Fortunately, various solutions have sprung up. In such fields as mobility as a service, sustainable travel behavior, traffic management, traffic congestion and micromobility management, European companies design and launch state-of-the-art products to help improve mobility with the latest advance in technologies. Through innovative efforts the city of Lublin in Poland was recognized as “Smart City of the Year 2015 with population between 100, 000 and 350,000” for investments in the traffic management system and solutions in collective transport. The HiReach project funded under Europe’s Horizon 2020 program is committed to the reduction of transport poverty.\n" +
  "All these promise a future when residents and visitors enjoy a wider range of affordable, multimodal, on-demand mobility options and the benefits brought by the elimination of road fatalities, improvement in travel times and reduction of air pollution.\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK 9\n" +
  "\n" +
  "Directions：Refer to your dictionary for the meanings of the words or terms in Column A, and match them with the Chinese equivalents in Column B.\n" +
  "\n" +
  "1.  (B)\n" +
  "2.  (E)\n" +
  "3.  (D)\n" +
  "4.  (A)\n" +
  "5.  (C)\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK 10\n" +
  "Directions：Listen carefully and decide on the best answers to the questions.\n" +
  "\t1. Which can be the best title of the report? (C)\n" +
  "  A. The Introduction to Sports Cars\n" +
  "  B. The Design of Sports Cars\n" +
  "  C. The Evolution of Sports Cars\n" +
  "  D. The Future of Sports Cars\n" +
  "2. Modern sports cars were first introduced after __________ in __________. (B)\n" +
  "  A. World War II; UK\n" +
  "  B. World War II; USA\n" +
  "  C. World War I; UK\n" +
  "  D. World War I; USA\n" +
  "3. Early sports cars were heavy and unreliable because __________. (D)\n" +
  "  A. they were first introduced onto the market\n" +
  "  B. they were enhanced versions of touring model\n" +
  "  C. they were particularly among the rich and famous\n" +
  "  D. they were not made of lighter materials\n" +
  "4. Compared with early models, modern sports cars available on the market today are __________. (A)\n" +
  "  A. lighter, cheaper, more powerful and faster\n" +
  "  B. lighter, more expensive and powerful, faster\n" +
  "  C. heavier, cheaper, more powerful and faster\n" +
  "  D. lighter, cheaper, less powerful and faster\n" +
  "5. Which of the following factors DOESN’T contribute to the progress of sports cars? (C)\n" +
  "  A. Lighter materials.\n" +
  "  B. Powerful engines.\n" +
  "  C. Increasing buyers.\n" +
  "  D. Improved design.\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK 11\n" +
  "Directions：Listen to three sentences from the report and fill in the missing words.\n" +
  "1. These days, sports cars  (feature a plethora of technology), including  (sleek infotainment systems, side opening doors, stylish interiors and unique safety features.).\n" +
  "2. However, these are generally more difficult to design due to  (the speeds they travel and how long electric batteries currently last.).\n" +
  "3. As technology advances, we’re likely to see sports cars become even more  ( evolved),  (offering up features we so far can only dream of).\n" +
  " \n" +
  "TASK12\n" +
  "\n" +
  "TASK 13\n" +
  "No.\tWords or expressions\tMeanings in the context\tThe sentences which include them\n" +
  " \t sheer\t \n" +
  "用于强调事物的大小、程度、数量等\tWhile relatively simple to build as compared  to other structures like skyscrapers or dams, the sheer scale of the global network makes road construction one of the largest sources of\n" +
  "material consumption on our planet.\n" +
  "2\tasphalt\t (沥青)\t (While road types can vary greatly depending on their use, location, and the construction method, the majority are formed from crushed rock, sand, and asphalt, in a process that releases volatile organic compounds into the atmosphere.)\n" +
  " \n" +
  "3\tvolatile organic\n" +
  "compounds\t (挥发性有机化合物)\t (While road types can vary greatly depending on their use, location, and the construction method, the majority are formed from crushed rock, sand, and asphalt, in a process that releases volatile organic compounds into the atmosphere. )\n" +
  "4\tcurb\t (控制，抑制)\t (In order to curb the environmental impacts of road construction, a number of new innovations are now being trialed.)\n" +
  "5\tpothole\t (路面坑洞)\t (In India, the process of melting plastics to filling potholes has been happening on a small scale for a number of years.)\n" +
  "6\tpellet\t (颗粒，球丸)\t (British engineer, Toby McCartney, recognized the benefits of using plastic in roads while traveling the country, and developed a method of turning plastic bottles into small pellets that could be added to an asphalt mix to increase its bulk.)\n" +
  "7\tprefabricated\t (预制的)\t (Taking things a step further, Dutch company KWS, together with Wavin, and Total have developed PlasticRoad, a prefabricated modular roadway made from recycled plastic.)\n" +
  "8\tsilica\t (硅石，二氧化硅)\t (While the concept may sound advantageous, critics have raised a number of concerns around this new type of roadway, including the safety of vehicles driving over the toughened glass or silica that is required to protect the photovoltaic elements and how effective horizontal solar panels can be as compared to those positioned diagonally on roofs. )\n" +
  "9\tphotovoltaic\t (光伏，光电的)\t (While the concept may sound advantageous, critics have raised a number of concerns around this new type of roadway, including the safety of vehicles driving over the toughened glass or silica that is required to protect the photovoltaic elements and how effective horizontal solar panels can be as compared to those positioned diagonally on roofs. )\n" +
  "10\tpilot scheme\t (试验性的)\t (Several pilot schemes are now underway, seeking to overcome these challenges. )\n" +
  "\n" +
  "Get the Flash Player to see this player.\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK 14\n" +
  "\n" +
  "Directions：Analyze the language and organization of the following abstract of an academic paper and translate it into Chinese with the useful expressions given below.\n" +
  "ABSTRACT\n" +
  "\tYour answer：\n" +
  "Reference answer： 摘要\n" +
  "在基于稳态视觉诱发电位（SSVEP）的脑机接口（BCI）中，有效的频率识别算法至关重要。在本研究中，我们提出了一个分层特征融合框架，可用于设计高性能的频率识别方法。该框架包括空间维数（SD）融合和频率维数（FD）融合两种融合技术。采用带非线性函数的加权策略，得到了SD和FD融合。为了评估我们的新方法， 我们使用了相关成分分析（CORRCA）方法来研究提出的框架的效率和有效性。实验结果来自于35个受试者的基准数据集，表明框架内使用的扩展CORRCA方法显著优于原CORCCA方法。因此，该框架有望提高基于SSVEP的BCI中频率识别方法的性能。\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "U9\n" +
  "UNIT 9\n" +
  "\n" +
  "TASK 2\n" +
  "Directions：Choose the best answer to each of the following questions.\n" +
  "\t1. From the first paragraph, we know it’s better to __________ if designers meet design problems. (D)\n" +
  "  A. search information via Internet\n" +
  "  B. go into a shop\n" +
  "  C. discuss with the coworkers\n" +
  "  D. return to the roots of designing\n" +
  "2. What will expand the definition of ID? (C)\n" +
  "  A. The changing TASK of ID.\n" +
  "  B. The efforts of industrial designers.\n" +
  "  C. The application of design to social problems.\n" +
  "  D. The development of technology.\n" +
  "3. All of the following are the possible ways to make more responsible products EXCEPT __________. (C)\n" +
  "  A. using less material\n" +
  "  B. reducing energy consumption\n" +
  "  C. focusing on market demand\n" +
  "  D. making products recyclable\n" +
  "4. According to the writer, who is likely to help develop a positive attitude about conservation? (C)\n" +
  "  A. Marketers.\n" +
  "  B. Consumers.\n" +
  "  C. Designers.\n" +
  "  D. Capitalists.\n" +
  "5. What does the writer think of cultural diversity? (A)\n" +
  "  A. It will ultimately disappear.\n" +
  "  B. It will affect industrial designing forever.\n" +
  "  C. It evokes national pride.\n" +
  "  D. It is always source of designing.\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK 3\n" +
  "Directions：Match the items in Column A with their definitions in Column B.\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "1.  (H)\n" +
  "2.  (D)\n" +
  "3.  (G)\n" +
  "4.  (F)\n" +
  "5.  (B)\n" +
  "6.  (C)\n" +
  "7.  (E)\n" +
  "8.  (A)\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK 4\n" +
  "Directions：Complete the following outline according to Passage B.\n" +
  "Excessive Resolution: Artificial Intelligence and Machine Learning in Architectural Design\n" +
  "\n" +
  "1. Computers can solve a growing number of human problems because they have their own  (logic).\n" +
  "2. Different problem-solving methods between humans and computers\n" +
  "1) Human brain was never  (hard-wired) for big data, so we often  (drop ) or  (compress )them into shorter  (notations ) or using the method of  (sorting) to deal with too many facts and figures.\n" +
  "2) Computers can do a lot of  (computation) at a very low cost without having to process data in a classified way.\n" +
  "3. Conclusion\n" +
  "We can give full play to the  ( features)of machines and people. Although machine have  (advantages) over humans in  (big data), no  (machine-learning system) can  (optimize all parameters) of a design process, only  (designers) can.\n" +
  "\n" +
  "TASK 5\n" +
  "Directions：Find the English equivalents of the following items from Passage B.\n" +
  "1. 设计与制造  (design and fabrication)\n" +
  "2. 计算工具  (computational tools)\n" +
  "3. 后人类逻辑  (post-human logic)\n" +
  "4. 数据压缩技术  (data-compression technology)\n" +
  "5. 物理形状  (physical shape)\n" +
  "6. 材料特性  (material property)\n" +
  "7. 机械手，机器手臂  (robotic arms)\n" +
  "8. 微观设计  (micro-designing)\n" +
  "9. 形而上学的意蕴  (metaphysical implication)\n" +
  "10. 工业革命  (industrial revolution)\n" +
  "\n" +
  "TASK 6\n" +
  "Directions：Fill in the blanks with the phrases below. Change the form if necessary. Each phrase can be used only once.\n" +
  "1. Google is no longer  (in the business of) sending users to the best sources of information on the web.\n" +
  "2. Many factors are  (at play), including just how much China lets its own currency appreciate against the dollar.\n" +
  "3. That does not automatically mean, however, that the money supply has been curbed, and there is considerable evidence  (to the contrary).\n" +
  "4. In this way, you can create objects that imitate having an infinite amount of methods  (on the fly).\n" +
  "5. Bad weather continues to complicate efforts to  (deal with) oil spoiling from the tanker.\n" +
  "\n" +
  "\n" +
  "TASK 7\n" +
  "1. Twenty years ago we thought computers were machines for making things; today we find out they are even more indispensable as machines for thinking. (Para. 1)\n" +
  "Your answer：\n" +
  "Reference answer： 二十年前，我们认为计算机是制造产品的机器。而今天，我们发现计算机作为思维工具，更加不可或缺。\n" +
  "2. Take alphabetic sorting as a metaphor for the way we think in general: we put things in certain places so we know where they are when we need them; we also sort things and ideas to make some sense of the world. (Para. 2)\n" +
  "Your answer：\n" +
  "Reference answer： 将字母排序作为我们一般思维方式的隐喻：我们将物品放在特定的地方，这样在我们需要时就知道它们在哪里；我们也对事物和思想进行分类以了解世界。\n" +
  "3. But no modern engineer or contractor would dream of notating each brick one by one, since that would take forever, and the construction documents would be as big as the Encyclopedia Britannica in print. (Para. 3)\n" +
  "Your answer：\n" +
  "Reference answer： 没有任何一个现代工程师或承包商会想象逐一记录每块砖，因为那可能需要花一辈子的时间，而且由此产生的施工文件会像印刷出版的《大英百科全书》一样厚。\n" +
  "4. Micro-designing each minute particle of a building to the smallest scale available can save plenty of building material, energy, labor, and money, and can deliver buildings that are better fit to specs. (Para. 4)\n" +
  "Your answer：\n" +
  "Reference answer： 将建筑物的每一个微小颗粒以可用的最小比例进行微观设计，可以节省大量的建筑材料、能源、劳动力和金钱，并使交付的建筑物更加符合规范要求。\n" +
  "5. But, just as coping with the mechanical way of making was the challenge of industrial design in the 20th century, coping with the computer’s way of thinking is going to be the challenge of postindustrial design in the 21st century, because today’s thinking machines defy and contradict the organic logic of the human mind, just as the mechanical machines of the industrial revolution defied and contradicted the organic logic of the human body. (Para. 5)\n" +
  "Your answer：\n" +
  "Reference answer： 但是，正如20世纪的工业设计面临机械制造方式的挑战一样，21世纪的后工业设计需要应对计算机思维方式的挑战。因为正如由工业革命产生的机械机器违背了人体的有机逻辑，当今的思维机器（计算机）与人类思维的有机逻辑相悖。\n" +
  "\n" +
  "\n" +
  "TASK 8\n" +
  "Directions：Write a summary of Passage B in about 200 words.\n" +
  "\tYour answer：\n" +
  "Reference answer：  Designers have been using computer-based tools for design and fabrication for many years. With the power of computing tools, computers have become more than just manufacturing tools, but have evolved into indispensable thinking tools. With their unique logic, computers can solve more and more human problems. The main difference between the way we think and the way computers solve problems is that our brain was never hard-wired for big data. When dealing with too many facts and data, we have to compress them into shorter notations or adopt the method of classification. It may lead to the loss of information in the process. Compared with humans, computers are superior in computation and data processing and they can search without sorting. Because of these properties, in the field of architecture, computers can notate every brick of a building and micro-design each minute particle of a building, which may save plenty of building material, energy, labor and money and can deliver buildings that are better fit to spec. Although computers have advantages over humans in big data, no machine-learning system can optimize all parameters of a design process in the meantime, only designers can. Coping with computer’s way of thinking will be the challenge of postindustrial design, but fears of competition coming from Artificial Intelligence may be unnecessary.\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK 9\n" +
  "Directions：Refer to your dictionary for the meanings of the words or terms in Column A, and match them with the Chinese equivalents in Column B.\n" +
  "\n" +
  "1.  (C)\n" +
  "2.  (D)\n" +
  "3.  (E)\n" +
  "4.  (B)\n" +
  "5.  (A)\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK 10\n" +
  "\n" +
  "\n" +
  "\t1. Which of the following statements is true? (D)\n" +
  "  A. The Renaissance is renown as an era of incredible progress in art and science.\n" +
  "  B. It was quite well-known that urbanism became a true discipline in the 15th century.\n" +
  "  C. In the late 14th century, Leonardo turned his thoughts to urban planning problems.\n" +
  "  D. Leonardo’s ideas about an “ideal city” were not realistic because of excessive cost.\n" +
  "2. It is not easy to identify a coordinated vision of Leonardo’s ideal city because __________. (A)\n" +
  "  A. he worked in a disordered way\n" +
  "  B. he was a true Renaissance man\n" +
  "  C. he lived 500 years ago\n" +
  "  D. he never kept notes and sketches\n" +
  "3. Which is included in Leonardo’s unconventional ideas in his urban design? (D)\n" +
  "  A. Well-ordered streets and architecture.\n" +
  "  B. A comfortable and spacious city.\n" +
  "  C. High, strong walls.\n" +
  "  D. High-rise buildings.\n" +
  "4. Leonardo’s idea of locating flights of stairs on the outside of the buildings wasn’t implemented until __________. (B)\n" +
  "  A. the 1820s and 30s\n" +
  "  B. the 1920s and 30s\n" +
  "  C. the 1930s and 40s\n" +
  "  D. the 1830s and 40s\n" +
  "5. The true originality of Leonardo’s vision was its __________. (B)\n" +
  "  A. fusion of art and architecture\n" +
  "  B. fusion of architecture and engineering\n" +
  "  C. fusion of urbanism and art\n" +
  "  D. fusion of architecture and Renaissance\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK 11\n" +
  "Directions：Listen to three sentences from the report and fill in the missing words.\n" +
  "1. He recommended “  (high, strong walls)”, with “  (towers and battlements of all necessary and pleasant beauty)”, and felt the place needed “  (the sublimity and magnificence of a holy temple)”, and “  (the convenient composition of private homes)”.\n" +
  "2. While in  (upper layers of the city), people could walk  (undisturbed)between elegant palaces and streets, the lower layer was the place for  (services, trade, transport and industry) .\n" +
  "3. Leonardo also thought that the  (width)of the streets ought to match  ( the average height of the adjacent houses): a rule still followed in  (many contemporary cities across Italy),to  (allow access to sun and reduce the risk of damage from earthquakes).\n" +
  "\n" +
  "TASK12\n" +
  "\n" +
  "TASK 13\n" +
  "No.\tWords or expressions\tMeanings in the context\tThe sentences which include them\n" +
  " \n" +
  "1\t \n" +
  "sonic boom\t（超音速飞行器的）音\n" +
  "爆\tThe air exited tunnels with a sonic boom that\n" +
  "could be heard 400 meters away.\n" +
  "2\tpantograph\t (受电弓)\t (Owls inspired the pantograph, that’s the rig that connects the train to the electric wires above. )\n" +
  "3\tserrations and curvature\t (锯齿状和弯曲的形态)\t (Nakatsu modeled the redesign after their feathers, reducing noise by using the same serrations and curvature that allow them to silently swoop down to catch prey. )\n" +
  "4\tswoop down\t (向下猛冲)\t (Nakatsu modeled the redesign after their feathers, reducing noise by using the same serrations and curvature that allow them to silently swoop down to catch prey.)\n" +
  "5\tshaft\t (轴)\t (The Adélie penguin whose smooth body allows it to swim and slide effortlessly inspired the pantograph supporting shaft redesigned for lower wind resistance.)\n" +
  "6\tdecibel\t (分贝)\t (When the redesign debuted in 1997, it was 10% faster, used 15% less electricity, and stayed under the 70-decibel noise limit in residential areas. )\n" +
  "7\tbiomimicry\t (仿生学)\t (There’s a name for design like this, it’s called biomimicry.)\n" +
  "8\tgecko\t (壁虎)\t (Stick like a gecko, compute like a cell, even run a business like a redwood forest. )\n" +
  "9\tburrow\t (洞穴)\t (That might mean studying prairie dog burrows to build better air ventilation systems, mimicking shark skin to create bacteria-resistant plastic surfaces for hospitals, or arranging wind turbines in the same drag-reducing pattern that schools of fish swim in. )\n" +
  "10\tbuzzword\t (流行词)\t (There’s a buzzword right now that’s really hot, called the circular economy, which is essentially, you know, industry saying, you know, there should be no such thing as a byproduct in our manufacturing facility that goes to landfill, it should be used by something else, right, and at the end of a product’s life, that product should be up-cycled into something else, it’s being called the circular economy.)\n" +
  "\n" +
  "Get the Flash Player to see this player.\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK 14\n" +
  "Directions：The following is the INTRODUCTION PART of an academic paper. Choose the most appropriate words from the box to fill in the blanks, and analyze how the introduction is developed.\n" +
  "A. adapted\tB. addressing\tC. array\tD. components\tE. designed\n" +
  "F. desirable\tG. implications\tH. inherent\tI. multiple\tJ. reliability\n" +
  "K. significant\tL. specialized\tM. subjected\tN. typically\tO. values\n" +
  "译文\n" +
  "    In the context of Wireless Sensor Networks, the Internet of Things involves a large 1.  (C)of competing technologies 2.  (B) the transport of information at different levels of the communication process, including physical, network, transport and application layer protocols. From a full analysis, it is regarded that a WSN can be made up of four main 3.  (D): (1) a subnet of sensor and actuator nodes that communicates with (2) a subnet of gateways that interacts with (3) a server or broker to which (4) multiple clients have access to provide or retrieve information. Sensors and actuators in WSNs are 4.  (N)deployed in marginal environments in which wireless channels are affected by heavy bursty packet loss due to multipath fading. Due to the limited power, memory and computational resources of these devices, bandwidth and energy efficiency are highly 5.  (F) properties for protocols, such as Message Queue Telemetry Transport (MQTT), Extensive Messaging and Presence Protocol (EMPP), Advanced Message Queuing Protocol (AMQP) and Constrained Application Protocol (CoAP).\n" +
  "    MQTT is a lightweight transport protocol based on the subscription/notification paradigm with the characteristics of small size, low power usage and efficient distribution of information to 6.  (I) receivers. It relies on Transport Control Protocol (TCP); therefore, in certain environments of high packet loss, its overall application latency becomes impractical because of retransmissions. EMPP is a communication protocol for message exchange that has been 7.  (A) for use in IoT applications by means of protocol extensions. As MQTT innately relies on TCP for transport and on the Extensible Markup Language (EML) for message encoding, it has some 8.  (H) limitations that make it inefficient in certain environments. AMQP is a message exchange protocol adapted for use in IoT applications that provides 9.  (J) as well as security. As it also relies on TCP for transport, it is highly affected by packet loss, causing excessive latency in marginal environment. CoAP is a 10.  (L) web transfer protocol with constrained nodes and constrained networks. It provides a request and response model between endpoints and supports built-in discovery of services and resources. CoAP is 11.  (E) to easily interface with Hypertext Transfer Protocol (HTP) to integrate with the Web while meeting specialized requirements, such as multicast support, low overhead and complexity in constrained environments.\n" +
  "    Compared to the aforementioned protocols, one 12.  (K) difference of CoAP is that it relies on UDP for transport and therefore is not 13.  (M) to the same limitations of packet loss that are found in certain wireless environments. This paper focuses on a mathematical model to analyze the 14.  (G) of the transport mechanisms used by CoAP to support delivery of sensor data. In this model, close forms of application packet loss and latency are obtained and then compared against experimental 15.  (O) that result from a predefined validation framework.\n" +
  "    The remainder of the paper is organized as follows: a literature review of related works in Section 2; details of the analytical model and the proposed mechanism in Section 3; the evaluation framework and comparative results obtained by applying network impairments and computing quality scores in Section 4. Section 5 is the conclusion and suggestions for future work.\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "U10\n" +
  "UNIT 10\n" +
  "\tTASK 2\n" +
  "Directions：Choose the best answer to each of the following questions.\n" +
  "\t1. Which of the following is NOT mentioned as the application of computer vision? (C)\n" +
  "  A. Medical image processing.\n" +
  "  B. Satellite imagery understanding.\n" +
  "  C. Missile guidance.\n" +
  "  D. Automatic driving systems.\n" +
  "2. What is the way to ensure the high accuracy of computer vision system? (A)\n" +
  "  A. Collecting a data set that has thousands of images.\n" +
  "  B. Focusing solely on better algorithms.\n" +
  "  C. Capturing images.\n" +
  "  D. Increasing funds for AI research.\n" +
  "3. What can we infer from Paragraph 5? (B)\n" +
  "  A. Vision begins with the eyes.\n" +
  "  B. It is easy for children to make sense of what they see, while this is a difficult TASK for computers.\n" +
  "  C. Humans are smarter than computers.\n" +
  "  D. Computers can be trained to accurately identify dogs.\n" +
  "4. The word “exhaustive” (Line 1, Para. 7) can be replaced by “__________”. (D)\n" +
  "  A. boring\n" +
  "  B. exhausting\n" +
  "  C. interesting\n" +
  "  D. thorough\n" +
  "5. What is the attitude of the writer towards the development of computer vision? (C)\n" +
  "  A. Doubtful.\n" +
  "  B. Cautious.\n" +
  "  C. Optimistic.\n" +
  "  D. Opposed.\n" +
  "\n" +
  "\n" +
  "TASK 3\n" +
  "Directions：Match the items in Column A with their definitions in Column B.\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n" +
  "1.  (F)\n" +
  "2.  (A)\n" +
  "3.  (G)\n" +
  "4.  (C)\n" +
  "5.  (B)\n" +
  "6.  (D)\n" +
  "7.  (E)\n" +
  "8.  (H)\n" +
  "\n" +
  "\n" +
  "\n" +
  "TASK 4\n" +
  "Directions：Complete the following outline according to Passage B.\n" +
  "Scenario 2060: From Parking to Parkland\n" +
  "1. The reason Micha and his family moved back to town:  \n" +
  "(Smart cities offer its habitants the comforts of metropolitan living combined with the benefits of rural life)\n" +
  "2. Visions of future cities:\n" +
  "1)  (Smart buildings help cities build data ecosystem, which improves the efficiency of city infrastructures.)\n" +
  "2)  (Every building can be high-performance energy supplies.)\n" +
  "3)  (Holographic studio allows people to meet and eat in virtual space.)\n" +
  "4)  (Self-service system can be used everywhere.)\n" +
  "\n" +
  "  TASK 5\n" +
  "Directions：Find the English equivalents of the following items from Passage B.\n" +
  "1. 数字技术  (digital technology)\n" +
  "2. 智能建筑  (smart building)\n" +
  "3. 数据生态系统  (data ecosystem)\n" +
  "4. 自动化可视系统  (automation and visualization system)\n" +
  "5. 神经元网络  (neuronal networks)\n" +
  "6. 城市基础设施  (urban infrastructure)\n" +
  "7. 风力发电机  (wind generator)\n" +
  "8. 太阳能板  (solar panel)\n" +
  "9. 全息工作室  (holographic studio)\n" +
  "10. 虚拟空间  (virtual space)\n" +
  "\n" +
  "TASK 6\n" +
  "1. Under the high-light exposure experiment, accelerating experiment and room temperature storage observation, all the criteria were found to  (be in line with) the quality standard specification.\n" +
  "2. Service composition enables the creation of solutions to run  (in tandem with) existing services.\n" +
  "3. German officials now  (toy with) the idea of following Britain’s lead in discouraging the import of produce from sources that are deemed illegal.\n" +
  "4. A British newspaper says British Airways plan to  (take over) Trans World Airways.\n" +
  "5. Hackers look for computers with security vulnerability and infect them  (in advance of) an attack.\n" +
  "TASK 7\n" +
  "Directions：Translate the following sentences from Passage B into Chinese.\n" +
  "\t1. Thanks to digital technologies that allow cities to streamline their infrastructures while allowing ever more people to do most everything from home, the smart cities of the future will offer their inhabitants the comforts of metropolitan living combined with the benefits of rural life. (Para. 1)\n" +
  "Your answer：\n" +
  "Reference answer： 数字技术的发展提高了城市基础设施的效率，同时使越来越多的人可以在家完成大部分工作，未来的智能城市将为居民提供兼具乡村好处与大都市便捷的生活方式。\n" +
  "2. It is committed to the principles of sustainability and regionalism, and to creating a functioning social fabric and public spaces that are freely accessible to all. (Para. 3)\n" +
  "Your answer：\n" +
  "Reference answer： 它坚持可持续性发展和区域主义的原则，致力于创造可供所有人自由进入的功能性社会组织与公共空间\n" +
  "3. Today, all of this information amounts to a virtual digital ecosystem that administers itself—a system that sifts through a flood of data to generate intelligent information; a learning system based on neuronal networks; a system that autonomously enhances the efficiency of urban infrastructures. (Para. 4)\n" +
  "Your answer：\n" +
  "Reference answer： 现在，所有这些信息构成了一个能够自我管理的虚拟数字生态系统。该系统是基于神经元网络的学习系统，能够筛选海量数据生成智能信息，自主提高城市基础设施效率。\n" +
  "4. The resulting ability to precisely match energy supply and demand has significantly reduced cities’ costs. (Para. 5)\n" +
  "Your answer：\n" +
  "Reference answer： 由此产生的精确匹配能源需求与供给的能力，大大降低了城市的成本。\n" +
  "5. While this radically reduced emissions in urban areas, the downside was that people became increasingly lonely and unhappy—which is where demand for holographic studios came in. (Para. 7)\n" +
  "Your answer：\n" +
  "Reference answer： 尽管这从根本上减少了城市的排放量，但人们也因此变得越来越孤独和不快乐——全息工作室的需求由此产生。\n" +
  "\n" +
  "\n" +
  "TASK 8\n" +
  "Directions：Write a summary of Passage B in about 200 words.\n" +
  "\tYour answer：\n" +
  "Reference answer： Thanks to digital technologies, the smart cities of the future offer their inhabitants the comforts of metropolitan living combined with the benefits of rural life and returning to cities has been an option of people who once moved to the countryside. What changes have taken place in urban life? First of all, in big cities, smart buildings become a norm. Each building is networked to the eaves and embedded within City Intelligent Platforms, which are used to process vast volumes of data from sensor networks. All the information constitutes a virtual digital ecosystem that administers itself. Meanwhile, the building has become a high-performance energy supplier. People can store energy from the solar panels on the façade and wind generators on the roof. As global networking expanded, people could do almost everything at home. While this reduces emissions, it makes people lonely and unhappy. The advent of holographic studio solves the problem. It helps people to meet and eat in the virtual space. In addition, self-service system is everywhere. For example, when the ingredients for a cake in the bakery are out of stock, the autonomous supply vehicle can fill up itself without receiving instructions. All in all, the development of science and technology, along with the popularity of the Internet have made life convenient in many ways and improve people’s quality of life.\n" +
  "\n" +
  "\n" +
  "TASK 9\n" +
  "\n" +
  "1.  (C)\n" +
  "2.  (A)\n" +
  "3.  (E)\n" +
  "4.  (B)\n" +
  "5.  (D)\n" +
  "\n" +
  "TASK 10\n" +
  "1. Which of the following can be the best title for the report? (A)\n" +
  "  A. Technological Trends in Agriculture\n" +
  "  B. The Solution to Meeting Food Demands\n" +
  "  C. The Application of AgriTech\n" +
  "  D. Smart Farming in the Future\n" +
  "2. According to the report, the more efficient way to meet food demands in the future is to __________. (C)\n" +
  "  A. shift the agriculture legacy to urban space\n" +
  "  B. keep smart cities playing their essential roles\n" +
  "  C. equip farms and farmers with technology\n" +
  "  D. upgrade farming by developing smart cities\n" +
  "3. Sensors are intelligently used in agriculture for __________. (C)\n" +
  "  A. data storage\n" +
  "  B. data transmission\n" +
  "  C. data collection\n" +
  "  D. data analysis\n" +
  "4. Agricultural robots or Agbots are performing the following TASKs EXCEPT __________. (D)\n" +
  "  A. crop harvest\n" +
  "  B. crop watering\n" +
  "  C. crop planting\n" +
  "  D. crop transportation\n" +
  "5. Which of the following statements about driverless tractors is true? (B)\n" +
  "  A. Driverless tractors can now work autonomously without human intervention.\n" +
  "  B. The concept of autonomous tractors is still in the nascent stage, requiring human intervention.\n" +
  "  C. Driverless tractors are now widely used, saving resources, reducing time, money and labour.\n" +
  "  D. Driverless tractors are able to use big data like real-time weather satellite information.\n" +
  "TASK 11\n" +
  "\n" +
  "\n" +
  "Directions：Listen to three sentences from the report and fill in the missing words.\n" +
  "1. Subsurface Drip Irrigation (SDI) system is  fuck(integrated) with  fuck(advanced IoT sensors) to constantly  (keep a check on moisture levels and plant health) , farmers will need to  (intervene) only when required.\n" +
  "2. Furthermore, robots can be equipped with  (sensors, cameras and sprayers ) so as to  (identify the pests and application of pesticides).\n" +
  "3. As the concept of autonomous tractors is still in the  (nascent) stage, human effort will be necessary to  (establish the field and boundary maps, define operating conditions and program the best field paths using the path planning software).\n" +
  "\n" +
  "TASK12\n" +
  "TASK 13\n" +
  "No.\tWords or expressions\tMeanings in the context\tThe sentences which include them\n" +
  " \n" +
  "1\t \n" +
  "champion\t \n" +
  "捍卫，支持\tThe engineers certainly need to champion\n" +
  "the reasons behind why they’ve expanded the project and have implemented those sustainable aspects into the project.\n" +
  "2\tcode of ethics\t (道德规范)\t (Certainly, as it relates to our technical engineering profession, we can understand our code of ethics, what the obligation is of our society that society has for engineers and also being sure to hold paramount the safety health and welfare of the public. )\n" +
  "3\tparamount\t (最重要的)\t (Certainly, as it relates to our technical engineering profession, we can understand our code of ethics, what the obligation is of our society that society has for engineers and also being sure to hold paramount the safety health and welfare of the public.)\n" +
  "4\tdilemma\t (困境)\t (There’s a number of different ethical dilemmas that come up for newer professionals.)\n" +
  "5\tbillable\t (可计费的)\t (It’s common to hear a situation where a new professional is pressured to put billable hours on a project that they didn’t necessarily directly work on.)\n" +
  "6\tin-house fund\t (内部资金)\t (Some cultures in business really have no in-house fund to charge hours to and that all of the hours from an engineer needs to be billable to a project. )\n" +
  "7\tadamant\t (坚定的)\t (Certainly, some engineers feel quite adamant that billing hours to a project that they didn’t work on is not a truthful statement. )\n" +
  "8\thome mortgage\t (住房抵押贷款)\t (One mid-career engineer said that he really needed to pay his home mortgage, he had a family to support, he would do anything that the client or a supervisor asked him to do without question.)\n" +
  "9\tresonate\t (产生共鸣)\t (I hope it resonated with other people in the room.)\n" +
  "10\tblow the whistle\t (揭发)\t (So, if necessary, the engineer has to blow the whistle?)\n" +
  "\n" +
  "Get the Flash Player to see this player.\n" +
  "\n" +
  "TASK 14\n" +
  "Directions：Translate the following acknowledgements into Chinese or English.\n" +
  "\t1. I would like to pay special appreciation to the persons below who made my research successful and assisted me at every point to stick to my goal:\n" +
  "My Supervisor, Dr. Milne for his vital support and assistance. His encouragement made it possible to achieve the goal.\n" +
  "My Assistant Supervisor, Dr. Wilson, whose help and sympathetic attitude at every point during my research helped me to work in time.\n" +
  "Professor Benson, Head of the Department of Chemistry, whose reminders and constant motivation encouraged me to meet the deadlines.\n" +
  "All the faculty, staff members and lab technicians of Chemistry Department, whose services turned my research into a success.\n" +
  "My Mom and Dad, family members and friends, without whom I was nothing; they not only assisted me financially but also extended their support morally and emotionally.\n" +
  "Your answer：\n" +
  "Reference answer： 我要特别感谢下面这些人，他们使我的研究取得了成功，并在各个方面帮助我坚持我的目标：\n" +
  "\n" +
  "我的导师米尔恩博士，感谢他的大力支持和帮助，他的鼓励使实现目标成为可能。\n" +
  "\n" +
  "我的导师助理威尔逊博士，在我研究的每一个阶段，他的帮助和富有同情心的态度帮助我及时进行工作。\n" +
  "\n" +
  "化学系主任本森教授，他的提醒和不断的动力鼓励我按时完成任务。\n" +
  "\n" +
  "化学系的全体教职员工和实验室技术人员，他们的服务使我的研究获得了成功。\n" +
  "\n" +
  "我的父母、家人和朋友，没有他们，我什么都不是；他们不仅在经济上帮助我，而且在道义上和情感上也给予了我支持。\n" +
  "2.该研究由国家科学基金资助，资助号为1678326。我们感谢加州大学欧文分校的同事们，他们提 供的见解和专业知识对这项研究帮助很大。我们感谢俄亥俄州立大学教授Jose Cruz的意见，他 的意见极大地改进了手稿。我们还要感谢Tony Spencer在收集数据方面提供的帮助。\n" +
  "Your answer：\n" +
  "Reference answer： The research was supported by the National Science Foundation under Grant No. 1678326. We would like to show gratitude to colleagues at the University of California Irving who provided insights and expertise that greatly assisted the research. We thank Professor Jose Cruz of the Ohio State University for comments that greatly improved the manuscript. We would also like to thank Tony Spencer for his assistance in collecting the data.\n" +
  "\n" +
  "\n" +
  "\n" +
  "U11\n" +
  "\n" +
  "\n" +
  "\n" +
  "\n";

/**********************************************************************************开始代码块*********************************************************************************/

$(function () {
  $("head").append(" <link rel='stylesheet' href='https://www.layuicdn.com/layui-v2.5.6/css/layui.css'/>");
  $("html").append("<script src='https://www.layuicdn.com/layui-v2.5.6/layui.js'></script>");
  var page_div = document.getElementById("DIV2");
  var dispaly=document.createElement("div");
  var r_time=0;
  try{
    $("#student-menu");
    if(getCookie("term")==""){
      let term=prompt("请输入当前学期 大二上输入'1' 大二下输入'2'");
      if (term==='1') setCookie("term","1");
      else setCookie("term","2");
    }
  }catch (e){
    console.log("未获取到学习页面");
  }
  try{
    page_div.appendChild(dispaly);
    dispaly.setAttribute("id","ZCB");
    dispaly.setAttribute("style","display: block; position: absolute;top:150px;right:30px;");
  }
  catch (e) {
    console.log(e);
  }
  $("#ZCB").html("<div style=\"background-color:  #2196F3;width: 300px;color: white;border-radius:15px;text-align: center;box-shadow: 1px 1px 5px 1px #00000085;padding: 15px\">\n" +
    "  <span style=\"font-size: 1.5em;padding-bottom: 20px\">工程英语助手V5.0</span>\n" +
    "  <br><input type=\"button\" value='' id='auto-submit' style=\"margin: 15px;display: inline-block;\n" +
    "    border-radius: 25px;font-size: 1.3em;\n" +
    "    background-color: #75C70C;\n" +
    "    border: none;width:150px;padding: 10px;\n" +
    "    color: #FFFFFF;cursor: pointer\">\n" +
    "  <br>" +
    "<div id='time_box' style='margin: auto'>" +
    "</div>" +
    "<div><p>如遇到无法自动填充，可尝试从以下两个网址进入</p>" +
    "<a href=\"https://gcxkyysts.casb3.njit.edu.cn:5443/StudentSTS/unitnav.aspx?BookId=29&UnitTreeid=4612\">备用网址1</a>" +
    "<a href=\"http://202.119.161.130/Common/index.aspx\">备用网址2</a>"+
    "</div><div style=\"font-style:italic;font-size: 0.6em;color: gainsboro;margin-bottom: -10px;float:right\">反馈邮箱<a href=\"mailto:binconan@outlook.com\">binconan@outlook.com</a></div>" +
  "</div>");
  /*网页加载完毕后执行*/


  /*刷时长函数*/
  if(parseInt(getCookie("refresh"))){

    $("#auto-submit").val("刷时长中");
    $("#time_box").html(" <br><input type=\"button\" value=\"停止刷时长\" id=\"clear\" style=\"display: inline-block;margin: -10px;\n" +
      "    border-radius: 25px;font-size: 1.3em;\n" +
      "    background-color: #75C70C;\n" +
      "    border: none;width:150px;padding:10px;\n" +
      "    color: #FFFFFF;cursor: pointer\">\n"+
      "<br><br><span>已刷新"+getCookie('r_time')+"次 时长"+getCookie("r_time")+"分钟</span>");
    reload();
    $("#clear").click(function () {
      setCookie("refresh","",-1);
      setCookie("r_time","",-1);
      window.location.reload();
    });
    return;
  }

  $("#time_box").html("<input type=\"button\" value=\"刷在线时长\" id=\"set-time\" style=\"margin: 5px;display: inline-block;\n" +
    "    border-radius: 25px;font-size: 1.3em;\n" +
    "    background-color: #75C70C;\n" +
    "    border: none;width:150px;padding: 10px;\n" +
    "    color: #FFFFFF;cursor: pointer\">\n" +
    " <br><span style=\"color:orange\"></span>\n" +
    " <br>" +
    "    选择时长 <select id=\"select\">\n" +
    "  <option>1</option>\n" +
    "  <option>5</option>\n" +
    "  <option>10</option>\n" +
    "  <option>20</option>\n" +
    "</select> 小时<br>刷新频率 1分钟/次<br>");
  try{
    if(parseInt(getCookie("term"))===1){selector_up()}
    else selector_down();
  }catch (e) {
    console.log(e);
  }
  finally {
    check_fstatus();
  }
  $("#set-time").on('click',function () {
    layui.use('layer', function(){
      var layer = layui.layer;
      var options = $("#select option:selected");
      layer.alert(
        '刷时长时无法答题,可通过助手面板手动取消',
        function(index){
          var time=parseInt(options.val());
          setCookie("refresh",1,time);
          setCookie("r_time",r_time,0.1);
          window.location.reload();
          layer.close(index);
        });
    });

  });
  $("#auto-submit").click(function () {
    var flag=parseInt(getCookie("fstatus"));
    if(flag){
      setCookie("fstatus",0,60);
      window.location.reload();
    }
    else {
      setCookie("fstatus",1,60);
      window.location.reload();
    }
  });
});
function check_fstatus() {  //检查Cookie值
  var flag=parseInt(getCookie("fstatus"));
  if(flag){
    $("#auto-submit").val("取消自动提交");
    submit();
  }
  else {
    $("#auto-submit").val("自动提交");
  }
}

function submit() {
  $("#ctl00_ContentPlaceHolder1_submit").attr("onclick","");
  $("#ctl00_ContentPlaceHolder1_submit").trigger("click");
}
/*匹配函数*/
function selector_down() {
  let str=$("[selected]").text();//获取单元
  try{
    var src=$(".tex1>img")[0].src;//获取task
  }catch (e) {
    $("#ZCB").hide();
    return;
  }
  let getUnit=/[\d]/g;
  let getTask=/(?<=Task)[\d]*(?=.png)/g;

  let task=parseInt(src.match(getTask));
  let unit=parseInt(str.match(getUnit));
  let words ,inputs,i;
  let n_unit=unit+1;
  let n_task=task+1;

  localStorage.unit_content=content_down.match(eval("/(?<=U"+unit+")((.|\\n)+?)(?=U"+n_unit+")/gm"));//匹配UNIT答案
  if(task==14){
    localStorage.task_content=localStorage.unit_content.match(eval("/(?<=TASK( )*"+task+")((.|\\n)+?)*/g"));//匹配TASK答案
  }
  else {
    localStorage.task_content=localStorage.unit_content.match(eval("/(?<=TASK( )*"+task+")((.|\\n)+?)(?=TASK( )*"+n_task+")/gm"));//匹配TASK答案
  }
  var task_content=localStorage.task_content;

  if(task==2) {
    words = task_content.match(/(?<=([\. | \?][\s]\())(.?)(?=\))/g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    inputs = document.querySelectorAll("input[type='radio']");//得到input数组
    for ( i = 0; i < 5; i++) {
      var word=String(words[i]);
      switch(word) {
        case 'A':inputs[i*4].checked=true;break;
        case 'B':inputs[1+i*4].checked=true;break;
        case 'C':inputs[2+i*4].checked=true;break;
        case 'D':inputs[3+i*4].checked=true;break;
      }
    }
  }
  if(task==3){
    words = task_content.match(/(?<=([\. | \?][\s]\())(.?)(?=\))/g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    inputs = $("input[type=text]");//得到input数组
    for ( i = 0; i < 8; i++) {
      $("input[type=text]")[i].value=words[i];
    }
  }
  if(task==4){
    words = task_content.match(/(?<=\()((.|\n)+?)(?=\))/g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    for ( i = 0; i < $("input[type=text]").length; i++) {
      $("input[type=text]")[i].value=words[i];
    }
  }
  if(task==5){
    words = task_content.match(/(?<=\()((.|\n)+?)(?=\))/g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    inputs = $("input[type=text]");//得到input数组
    for ( i = 0; i < 10; i++) {
      $("input[type=text]")[i].value=words[i];
    }
  }
  if(task==6){
    words = task_content.match(/(?<=\()((.|\n)+?)(?=\))/g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    for ( i = 0; i < 5; i++) {
      $("input[type=text]")[i].value=words[i];
    }
  }
  if(task==7){
    words = task_content.match(/(?<=Reference answer： )(((.|\n)+?)。)/g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    for ( i = 0; i < 5; i++) {
      $("textarea")[i].value=words[i];
    }
  }
  if(task==8){
    words = task_content.match(/(?<=Reference answer： )(((.|\n)+?)\n+)/g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    $("textarea").val(words);
  }
  if(task==9){
    words = task_content.match(/(?<=([\. | \?][\s]\())(.?)(?=\))/g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    for ( i = 0; i < 5; i++) {
      $("input[type=text]")[i].value=words[i];
    }
  }
  if(task==10) {
    words = task_content.match(/(?<=([\.|\?][\s]\())(.?)(?=\))/g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    inputs = document.querySelectorAll("input[type='radio']");//得到input数组
    for ( i = 0; i < 5; i++) {
      var wod=String(words[i]);
      switch(wod) {
        case 'A':inputs[i*4].checked=true;break;
        case 'B':inputs[1+i*4].checked=true;break;
        case 'C':inputs[2+i*4].checked=true;break;
        case 'D':inputs[3+i*4].checked=true;break;
      }
    }
  }
  if(task==11){
    words = task_content.match(/(?<=\()((.|\n)+?)(?=\))/g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    for ( i = 0; i < $("input[type=text]").length; i++) {
      $("input[type=text]")[i].value=words[i];
    }
  }
  if(task==13){
    words = task_content.match(/(?<=\()((.|\n)+?)(?=\))/g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    for ( i = 0; i < $("input[type=text]").length; i++) {
      $("input[type=text]")[i].value=words[i];
    }
  }
  if(task==14){
    var pt=/(?<=Directions).*(?=\.)/g;
    var type=task_content.match(pt);
    if (/write/i.test(type)){
      words = task_content.match(/(?<=\()((.|\n)+?)(?=\))/g);//匹配答案
      if(words==null){
        alert("未找到答案");
      }
      for ( i = 0; i < $("input[type=text]").length; i++) {
        $("input[type=text]")[i].value=words[i];
      }
      return;
    }
    if(/translate/i.test(type)){
      words = task_content.match(/(?<=Reference answer： )(((.|\n)+?)([\d]|\n))/g);//匹配答案
      if(words==null){
        alert("未找到答案");
      }
      for ( i = 0; i < $("textarea").length; i++) {
        $("textarea")[i].value=words[i];
      }
      return;
    }
    if(/fill/i.test(type)){
      words = task_content.match(/(?<=\()((.|\n)+?)(?=\))/g);//匹配答案
      if(words==null){
        alert("未找到答案");
      }
      for ( i = 0; i < $("input[type=text]").length; i++) {
        $("input[type=text]")[i].value=words[i];
      }
      return;
    }
    if(/choose/i.test(type)){
      words = task_content.match(/(?<=([\. | \?][\s]\())(.?)(?=\))/g);//匹配答案
      if(words==null){
        alert("未找到答案");
      }
      inputs = document.querySelectorAll("input[type='radio']");//得到input数组
      for ( i = 0; i <words.length; i++) {
        var p=String(words[i]);
        switch(p) {
          case 'A':inputs[i*4].checked=true;break;
          case 'B':inputs[1+i*4].checked=true;break;
          case 'C':inputs[2+i*4].checked=true;break;
          case 'D':inputs[3+i*4].checked=true;break;
        }
      }
      return;
    }
  }
}
function selector_up(){
  let unit;
  let tablet=["One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];
  let str=$("[selected]").text();//获取单元
  let units=str.split(" ");
  for(let i=0; i<tablet.length; i++){
    if (tablet[i]===units[1]){
      unit=i+1;
    }
  }
  try{
    var src=$(".tex1").text();//获取task
  }catch (e) {
    $("#ZCB").hide();
    return;
  }

  let getTask=/(?<=Task).[0-9][0-9]?/g;
  let task=parseInt(src.match(getTask));
  let words ,inputs,i;
  let n_unit=unit+1;
  let n_task=task+1;

  if(unit==10)localStorage.unit_content=content_up.match(eval("/(?<=U"+unit+")((.|\\n)+)/gm"));//匹配UNIT答案
  else localStorage.unit_content=content_up.match(eval("/(?<=U"+unit+")((.|\\n)+?)(?=U"+n_unit+")/gm"));//匹配UNIT答案
  if(task==15)localStorage.task_content=localStorage.unit_content.match(eval("/(?<=Task "+task+")((.|\\n)+)/gm"));//匹配TASK答案
  else localStorage.task_content=localStorage.unit_content.match(eval("/(?<=Task "+task+")((.|\\n)+)(?=Task "+n_task+")/gm"));//匹配TASK答案
  var task_content=localStorage.task_content;
  if(task==1) {
    words = task_content.match(/(?<=\()\s*(\w+?)\s*(?=(\) \[))/g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    inputs = document.querySelectorAll("td>input");//得到input数组
    for ( i = 0; i < words.length; i++) {
      inputs[i].value = words[i];
    }
  }
  if(task==2) {
    words = task_content.match(/(?<=\()((.|\n)+?)(?=\))/g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    inputs = document.querySelectorAll("td>input");//得到input数组
    for (i = 0; i < words.length; i++) {
      inputs[i].value = words[i];
    }
  }
  if(task==3) {
    words = task_content.match(/(?<=\()((.|\n)+?)(?=\))/g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    inputs = document.querySelectorAll("td>input");//得到input数组
    for ( i = 0; i < words.length; i++) {
      inputs[i].value = words[i];console.log(words[i]);
    }

  }
  if(task==4) {
    words = task_content.match(/(?<=(\)\s*\())((.|\n)+?)(?=\))/g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    inputs = document.querySelectorAll("td>input");//得到input数组
    for ( i = 0; i < words.length; i++) {
      inputs[i].value = words[i];
    }
  }
  if(task==5) {
    words = task_content.match(/Reference answer： ((.|\n)+?)\./g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    inputs = document.querySelectorAll("textarea");//得到input数组
    for ( i = 0; i < words.length; i++) {
      inputs[i].value = words[i];
    }
  }
  if(task==6) {
    words = task_content.match(/Reference answer[^\r\n]+/g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    inputs = document.querySelectorAll("textarea");//得到input数组
    for ( i = 0; i < words.length; i++) {
      inputs[i].value = words[i];
    }
  }
  if(task==7) {
    words = task_content.match(/(?<=(\)  \())(.+?)(?=\))/gm);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    inputs = document.querySelectorAll("td>input");//得到input数组
    for ( i = 0; i < words.length; i++) {
      inputs[i].value = words[i];
    }
  }
  if(task==8) {
    words = task_content.match(/(?<=\()((.|\n)+?)(?=\))/gm);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    inputs = document.querySelectorAll("input");//得到input数组
    for ( i = 0; i < words.length; i++) {
      inputs[i+7].value = words[i];
    }
  }
  if(task==9) {
    words = task_content.match(/(?<=\()((.|\n)+?)(?=\))/gm);//匹配答案
    var word=String(words[0]);console.log(words[0]);
    if(words==null){
      alert("未找到答案");
    }
    inputs = document.querySelectorAll("input[type='radio']");//得到input数组
    switch(word) {
      case 'A':inputs[0].checked=true;break;
      case 'B':inputs[1].checked=true;break;
      case 'C':inputs[2].checked=true;break;
      case 'D':inputs[3].checked=true;break;
      default:alert("未匹配到答案");
    }
  }
  if(task==10) {
    words = task_content.match(/(?<=([\\. | ?][\s]*\())(.+?)(?=\))/g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    inputs = document.querySelectorAll("input[type='radio']");//得到input数组
    for ( i = 0; i < 3; i++) {
      var word=String(words[i]);
      switch(word) {
        case 'A':inputs[i*4].checked=true;break;
        case 'B':inputs[1+i*4].checked=true;break;
        case 'C':inputs[2+i*4].checked=true;break;
        case 'D':inputs[3+i*4].checked=true;break;
      }
    }
  }
  if(task==11) {
    words = task_content.match(/Reference answer： ((.|\n)+?)\./g);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    inputs = document.querySelectorAll("textarea");//得到input数组
    for ( i = 0; i < words.length; i++) {
      inputs[i].value = words[i];
    }
  }
  if(task==12) {
    alert("此题无标准答案");
  }
  if(task==13) {
    alert("此题无标准答案");
  }
  if(task==14) {
    words = task_content.match(/(?<=\()((.|\\n)+?)(?=\))/gm);//匹配答案
    if(words==null){
      alert("未找到答案");
    }
    inputs = document.querySelectorAll("input");//得到input数组
    for ( i = 0; i < words.length; i++) {
      inputs[i+7].value = words[i];
    }
  }
  if(task==15) {
    words = task_content.match(/(?<=(\)  \())(.+?)(?=\))/gm);//匹配答案
    inputs = document.querySelectorAll("input");//得到input数组
    for ( i = 0; i < words.length; i++) {
      inputs[i+7].value = words[i];
    }
  }
}
/*刷新函数*/
function reload() {
  r_time=parseInt(getCookie('r_time'));
  r_time++;
  setCookie("r_time",r_time,2);
  setTimeout(function () {
    window.location.reload();
  },60000);
}
/*设置Cookie函数*/
function setCookie(cname, cvalue, hours) {
  var d = new Date();
  d.setTime(d.getTime()+(hours*60*1000*60));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}
/*获取Cookie函数*/
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
