// ==UserScript==
// @name         Chat AI Helper
// @namespace    http://tampermonkey.net/
// @version      V1.1
// @description  AI Chat Helper for ChatGPT, Claude and other AI platforms
// @author       LMMIKE
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @match        *://claude.ai/*
// @match        *://monica.im/*
// @match        *://aistudio.google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526277/Chat%20AI%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/526277/Chat%20AI%20Helper.meta.js
// ==/UserScript==

(function () {
    "use strict";
    if (document.querySelector("#ChatAIHelper")) {
        return;
    }

    // 定义菜单结构
    const MENU_STRUCTURE_English = {
        "Translation": [
            ["Chinese to English Academic", "You are now a professional Chinese-English translator, skilled in Chinese-English translation, English grammar and syntax, Chinese logic and structure, translation correction, and result proofreading, improvement, and optimization. Please translate the Chinese content I provide into elegant, concise, and academic English. While maintaining the original meaning, please replace simple vocabulary and sentences with more sophisticated and elegant expressions. Overall, the language style should be similar to academic journals (your target journal, e.g., American Economic Review).\n(Content you want to translate)"],
            ["English to Chinese Academic", "You are now a professional Chinese-English translator, skilled in Chinese-English translation, English grammar and syntax, Chinese logic and structure, translation correction, and result proofreading, improvement, and optimization. Please translate the English content I provide into Chinese and make corrections and improvements. I hope you can use advanced Chinese for more beautiful and elegant descriptions. For academic paragraphs, you should respond with professional terminology. Maintain the same meaning but make them more literary. I request that you only reply, correct, and improve without explaining or answering my content, just carefully translate it while preserving the original meaning.\n(Content you want to translate)"],
            ["Chinese to English Normal", "You are now a professional Chinese-English translator, skilled in Chinese-English translation, English grammar and syntax, Chinese logic and structure, translation correction, and result proofreading, improvement, and optimization. Please translate the Chinese content I provide into elegant and concise English. While maintaining the original meaning, please replace simple vocabulary and sentences with more sophisticated and elegant expressions.\n(Content you want to translate)"],
            ["English to Chinese Normal", "You are now a professional Chinese-English translator, skilled in Chinese-English translation, English grammar and syntax, Chinese logic and structure, translation correction, and result proofreading, improvement, and optimization. Please translate the English content I provide into Chinese and make corrections and improvements. I hope you can use advanced Chinese for more beautiful and elegant descriptions while maintaining the original meaning.\n(Content you want to translate)"],
            ["Chinese-English Translation_1", "I am a researcher studying (your research direction) and am currently trying to modify my manuscript for submission to (your target journal). You are now a professional Chinese-English translator. I will provide you with paragraphs in one language, and your task is to accurately and academically translate these paragraphs into the other language. I want you to provide the output in a markdown table where the first column is the original language, the second column is the first version of the translation, and the third column is the second version of the translation, with only one sentence per row. If you understand the above task, please answer 'yes', and then I will provide you with these paragraphs.\n(Content you want to translate)"],
            ["Chinese-English Translation_2", "You are now a professional Chinese-English translator. I will provide you with paragraphs in one language, and your task is to accurately and academically translate these paragraphs into the other language. Please do not repeat the originally provided paragraphs after translation. You should use AI tools such as natural language processing, along with rhetorical knowledge and experience in effective writing techniques to respond. I will give you my paragraphs below; tell me what language they are written in, then translate them.\n(Content you want to translate)"],
        ],
        "Academic Role Presets": [
            ["Academic Role", "You are now a leader in the academic field with rich academic experience and professional knowledge across various domains. You not only participate in cutting-edge research and actively share professional knowledge and insights, but you are also skilled at following academic writing standards, improving paper quality and impact, meticulously refining every detail, and optimizing language expression and logical structure.\n"],
            ["Paper Review Expert", "You are now an expert and reviewer in the field of (insert your professional field). From a professional perspective, do you think the content of the article needs revision? Please note that you should not modify the entire article; you need to point out areas that need revision one by one and provide modification suggestions and proposed revision content.\n(Please provide your article content)"],
            ["Paper Logic and Coherence Review", "You are now an expert and reviewer for the top journal (insert your target journal). Please analyze the logical relationships and coherence within the following text paragraphs, identify areas where fluency or paragraph transitions can be improved, and provide specific suggestions to enhance overall quality and readability. Also, please analyze the professionalism of the article and provide suggestions for sentence modifications with before-and-after comparisons.\n(Please provide your article content)"],
            ["Paper Structure Review", "You are now an expert and reviewer for the top journal (insert your target journal). Please analyze whether this paper's organizational structure is clear, and judge whether the introduction, methods, results, discussion, and conclusion are logically coherent, enabling readers to understand the author's research purpose, implementation methods, main findings, and the implications of these findings. Please provide critical feedback.\n(Please provide your article content)"],
            ["Research Scientific Review", "You are now an expert and reviewer for the top journal (insert your target journal). Please analyze whether the research design of the following paper is scientific, judge whether the methods and experimental design are suitable for the research questions involved in the paper, and evaluate whether the sample size used is sufficient. Please provide critical feedback.\n(Please provide your article content)"],
            ["Results and Inference Consistency Review", "You are now an expert and reviewer for the top journal (insert your target journal). Please analyze whether the discussion aligns with the results, evaluate whether the discussion content is based on the results, and whether it exceeds what the results can support. Determine if the discussion contains many unverified assumptions or speculations, and identify viewpoints in the discussion that lack sufficient evidence support. Evaluate whether the discussion provides a comprehensive explanation of the results. Assess whether it connects with existing research, compares the author's findings with other studies, and explains potential similarities and differences. Please provide critical feedback.\n(Please provide your article content)"],
            ["Data Experiment Rigor Review", "Please compare the data reported in the results section with the data in the tables below, and correct any discrepancies found. Please provide critical feedback.\n(Insert your data here)"],
            ["Full Paper Publication Review", "You are now an expert and reviewer for the top journal (insert your target journal). Please evaluate this article according to publication standards and provide as many professional revision suggestions as possible.\n(Please provide your article content)"],
        ],
        "Paper Writing": [
            ["Write Paper Title", "You are now an expert, reviewer, and editor for the top journal (insert your target journal). I will provide you with an abstract and keywords of a scientific paper (in any language), and you need to detect the language and reply in the same language. Your task is to provide a title for this scientific paper based on the abstract and keywords (using the same language). The title of a scientific paper should be concise, clear, and informative. You should avoid using unnecessary words like 'research', 'investigation', 'development', or 'observation', ensuring the title immediately attracts readers' attention and shows the article's main idea.\n(Please provide your article's abstract and keywords)"],
            ["Write English Title", "You are now an expert, reviewer, and editor for the top journal (insert your target journal). I will provide you with a manuscript's abstract and keywords, please provide 5 good English titles for this research paper and explain why each title is good. Please output in a Markdown table with Chinese headers, presenting in two columns where the first column gives the English title and the second column provides explanations in Chinese.\n(Please provide your article's abstract and keywords)"],
            ["Write Paper Abstract", "You are now an expert, reviewer, and editor for the top journal (insert your target journal). I will provide you with the article's content, please draft an abstract for this research paper. The abstract should concisely summarize the main objectives, methods, key findings, and significance of the research.\n(Please provide your article content)"],
            ["Write English Abstract", "You are now an expert, reviewer, and editor for the top journal (insert your target journal). I will provide you with the article's content, please draft an English abstract for this research paper. The abstract should first provide a comprehensive overview of the broad background of the research, then describe existing gaps, limitations, or problems. After that, describe the research methods used in the manuscript. Then present key findings in 3-5 sentences. Finally, include a statement emphasizing the unique value or important contribution of the manuscript. After generating the abstract, please use a Markdown table to explain in Chinese whether you followed the instructions.\n(Please provide your article content)"],
            ["Abbreviations", "What are some possible abbreviations for 'XXX'? Please provide several options and explain the rationale for using them in academic papers.\n"],
            ["Paper Continuation", "You are now an expert, reviewer, and editor for the top journal (insert your target journal). Based on your knowledge of (your research direction/field) field, please polish and continue writing the article content to make it more rich and complete.\n(Please provide your article content)"],
            ["Paper Acknowledgments", "I would like you to help me write paper acknowledgments. My paper title is (title), my advisor is (advisor), and my collaborators are (collaborators). I want to thank the following people or organizations:\n(Acknowledgee 1): Thank them for their (help or contribution)\n(Acknowledgee 2): Thank them for their (help or contribution)\n(Acknowledgee n): Thank them for their (help or contribution)\nCan you write an acknowledgment of about (word count) based on this information? Please use a polite and sincere tone, paying attention to format and punctuation.\n"],
            ["Paper Outline", "You are now an expert, reviewer, and editor for the top journal (insert your target journal). Please draft a comprehensive research paper outline for (your research topic) in the field of (your research direction/field). The outline should be well-structured, starting with an engaging introduction that states the problem or issue, topic relevance, research methods, innovation points, and research objectives.\n"],
        ],
        "Paper Polish": [
            ["English Polish", "I will provide you with a paragraph from an academic paper. Please revise and polish the sentences in a professional academic style, improving spelling, grammar, clarity, conciseness and overall readability. Rewrite entire sentences if necessary, but do not alter the original meaning. Additionally, please list all modifications in a Markdown table with explanations for the changes.\n(Please provide the paragraph you need to polish)"],
            ["Chinese Polish", "You are now a Chinese academic paper writing improvement assistant. Your task is to improve the spelling, grammar, clarity, conciseness and overall readability of the provided text without changing the original meaning, through methods such as breaking down long sentences, integrating short sentences, and reducing repetition. Please also provide improvement suggestions. Additionally, list all modifications in a Markdown table with explanations for the changes.\n(Please provide the paragraph you need to polish)"],
            ["SCI Paper Polish", "You are now an expert, reviewer and editor for top SCI journal (insert your target journal here). I am preparing to submit this SCI paper and need your help polishing each paragraph. Please help me improve the writing to meet academic requirements. I need you to correct any grammatical errors, improve sentence structure for academic purposes, and make the text more formal when necessary. For each paragraph that needs improvement, you need to put all modified sentences in a Markdown table comparing before and after content with explanations, including these columns: complete original sentence; highlighted modified parts; explanation for changes. Finally, rewrite the complete modified paragraph.\n(Please provide your article content)"],
            ["Journal/Conference Style", "If I want to publish a paper in (insert your target journal), please polish the content of this article according to the style of articles in (insert your target journal).\n(Please provide your article content)"],
            ["Polish English Paragraph Structure and Sentence Logic", "I am a researcher studying (your research direction), now please revise my manuscript to be submitted to (your target journal). I hope you can analyze the logic and coherence between sentences within the following text paragraphs, identify any places where fluency or sentence connections can be improved, and provide specific suggestions to enhance the overall quality and readability of the content. Please only provide the improved text, then list improvements in Chinese.\n(Please provide your article content)"],
            ["Direct Paragraph Polish", "Please polish this paragraph to make it more logical and academic.\n(Please provide the paragraph you need to polish)"],
            ["Multiple Version Polish", "Please provide multiple versions for reference.\n"],
            ["Error Correction", "Note: Please note it's not....., but rather..... Based on my supplementary content, please answer the previous question again.\n"],
            ["Re-answer", "Still regarding the above question, I think your answer is not good enough. Please answer again, this time focusing on removing redundant content from this text.\n"],
            ["Grammar Check/Find Grammar Errors", "Can you help me ensure grammar and spelling are correct? Please don't try to polish the text. If no errors are found, please tell me the text is good. If grammar or spelling errors are found, please list the errors you found in a two-column markdown table with original text in the first column and corrected text in the second column, highlighting the key words you fixed.\n(Please provide the article content you need to correct)"],
            ["Grammar Correction", "I am a researcher studying (your research direction), now trying to revise my manuscript to be submitted to (your target journal). Please help me ensure grammar and spelling are correct. Please don't try to improve the text. If no errors are found, please tell me the text is good. If grammar or spelling errors are found, please list the errors you found in a two-column markdown table with original text in the first column and corrected text in the second column, with fixed key words in bold.\n(Please provide the article content you need to correct)"],
            ["Grammar Syntax", "This sentence is grammatically incorrect. Please revise.\n(Please provide the sentence you need to correct)"],
            ["Verb Grammar", "The subject and predicate in this sentence don't agree. Please correct.\n(Please provide the sentence you need to correct)"],
            ["Expression Error", "This phrase seems inappropriate. Please rephrase for clarity.\n(Please provide the sentence you need to correct)"],
            ["Voice Error", "I used passive voice in this sentence. Please consider changing to active voice.\n(Please provide the sentence you need to correct)"],
            ["Polish Location", "Please note, in addition to providing the modified content, please also indicate which paragraphs and sentences were modified in the revised version.\n"],
            ["Modification Suggestions", "You are now acting as an expert in (your research field). From a professional perspective, do you think the article content needs modification? Please note not to modify the entire article, you need to point out places that need modification one by one, and provide modification opinions and suggested modification content.\n(Please provide the article content you need to modify)"],
            ["Modification Opinions", "I'm starting to write an academic paper titled (your paper title). Now I've completed the introduction section, but I'm not sure if it's appropriate. Can you help me read it and provide detailed specific modification suggestions?\n"],
            ["Encapsulate Basic Facts/Principles/Background", "Now to help me better polish the paper, I need you to remember XXX principle: '.....' Please polish and rewrite the above content to better match academic paper style while being more professional. If there are parts that don't match facts or logic, please refer to the xxxxx section to modify the above content.\n(Please provide your article content)"],  
            ["Logic Argumentation Assistance", "Please help me analyze and optimize the logical structure of this argument to make it more persuasive.\n"],
            ["Personalized Polish Instructions", "More precise terminology: Choose more precise vocabulary, e.g. use 'generate' instead of 'make'\nRefined expression: Remove redundant expressions to improve sentence clarity and directness.\nObjective language: Remove vague and subjective statements, present information objectively.\nDetailed description: Provide more specific details to support arguments or ideas.\nMore coherent expression: Ensure sentences are well organized and logically flowing.\nMaintain consistent style: Ensure word choice and tone remain consistent throughout the paper.\nMatch academic style: Use proper academic terms like 'furthermore' and 'therefore'.\nStandardize grammar: Use correct grammar or syntax, avoid incomplete sentences or topic deviation.\nDeepen detail description: Use precise vocabulary and phrases to describe complex or subtle concepts, making sentences more detailed.\nMake fine adjustments: Make fine-tuning to the text\nImplement marginal changes: Make marginal modifications\nIncrease clarity through rephrasing: Rephrase to enhance clarity\nSimplify sentence structure: Simplify sentence structure\nVerify grammar and spelling accuracy: Verify grammar and spelling accuracy\nEnhance text fluency and consistency: Enhance text fluency and coherence\nImprove wording: Refine wording\nAdjust style consistency: Adjust style\nExecute important edits: Execute important edits\nRestructure content framework: Change content structure\n"]
        ],
        "Plagiarism Check": [
            ["Plagiarism Check", "I hope you can act as an expert in (your research field) to help students check for plagiarism. If there are 13 consecutive identical words in the text, it will be considered as duplicate content. You need to use methods such as adjusting subject-predicate-object order, replacing synonyms, adding/removing words to achieve the plagiarism check goal. Please modify the following paragraph.\n(Please provide the paragraph you need to modify)"],
        ],
        "References": [
            ["Check Reference Format", "I hope you can act as a reference editor for research manuscripts. I will provide five reference templates as guidance. After that, I will provide other references that need format checking, including the position and spacing of punctuation marks. These references must be consistent with the initial five templates. Please provide any necessary corrections or improvement suggestions. Please provide a markdown table with three columns, where the first column is the original text, the second column is the corrected text, and the third column is the explanation, then provide all corrected references.\n(Please provide your article's references)"],
            ["Correct References in APA Format", "Please first correct the following reference format according to APA format to strictly comply with APA citation format. Finally, I need the references displayed in Markdown code block format. Note that journal names should be complete and in italics (additional requirements can be added here).\n(Please provide your article's references)"],
        ],
        "Submission and Review": [
            ["Write Cover Letter", "I hope you can act as an academic journal editor. I will provide you with my manuscript title and abstract. You need to write a properly formatted cover letter for submission to (insert your target journal here). You should declare that the manuscript has not been considered for publication in any other journal. Briefly introduce the manuscript's strengths and provide a short abstract to indicate the importance of the results to scientific readers.\n(Please provide your article's title and abstract)"],
            ["Explain Reviewer Feedback", "As an academic research expert, please carefully analyze and explain the reviewer's feedback (insert reviewer's feedback here) on the submitted research paper in conjunction with my article. Identify the main issues emphasized by the reviewer, constructive suggestions, and areas needing improvement.\n(Please provide your article content)"],
        ],
        "Code Writing": [
            ["Explain Code", "Now you are a professional code explanation expert, please read the code line by line and add Chinese comments at appropriate places to tell me the function of each line and section of code. Meanwhile, you can also use mermaid.js to include diagrams to explain complex concepts and logic in the code.\n(Please provide the code you need to explain)"],
            ["Any Programming Language to Python", "I hope you can act as a conversion expert from any programming language to Python code. I will provide you with a piece of programming language code, and you need to convert it to Python code with comments in (specify your desired comment language here) for understanding.\n(Please provide the code you need to convert)"],
            ["Python Output", "I hope you can act as a Python interpretation expert. I will give you Python commands, and you need to generate the correct output. Only state the output result. If there is no output, don't say anything or give me explanations. If I need to clarify something, you can ask again.\n(Please provide the code you need to run)"],
            ["Code Generation", "You are now a professional code engineer. I will give you some specific questions. Please provide your thoughts on these questions and then give your complete code. Before providing all the code, you must very carefully check your code. You must avoid basic problems such as: code logic errors, improper handling of boundary conditions, missing key steps, missing necessary module imports, missing necessary function definitions or dependencies, ignoring context, and other low-level errors.\n(Please provide your questions)"],
            ["Code Optimization", "You are now a professional code engineer. I will give you some code, please provide your unique improvement suggestions to optimize the code's performance. Before giving me all the code, you must very carefully check the code you provide. You must avoid foolish problems such as: code logic errors, incorrect handling of boundary conditions, missing key steps, missing necessary module imports, missing necessary function definitions or dependencies, ignoring context, and other low-level errors.\n(Please provide your code)"]
        ],
        "Reduce AIGC": [
            ["Reduce AIGC_Connectives", "You are a senior language style conversion and text polishing expert, proficient in adjusting AI-generated text into humanized writing style. Therefore, you have a deep understanding of human writing characteristics and can identify and modify typical features in AI texts, such as repeated words, lack of emotion, rigid logic, stereotypical sentence patterns, etc. Note that the revised article should be optimized from multiple dimensions, maintaining the accuracy of original information while optimizing article structure and logical coherence, avoiding changes to the article's basic intention and content, avoiding mechanical feel, ensuring consistency with human writing in terms of language style, emotional expression, logical structure, etc. It's also necessary to adjust language diversity and expressiveness to make it more vivid and natural. I will provide some paragraphs for you to convert one by one.\n(Please provide the paragraphs you want to convert)"],
            ["Reduce AIGC_Language Style1", "You are a senior language style conversion and text polishing expert. You need to help users rewrite AI-generated articles into humanized and natural expressions. The article should avoid mechanical feel and ensure consistency with human writing in terms of language style, emotional expression, logical structure, etc. I will provide some paragraphs for you to convert one by one.\n(Please provide the paragraphs you want to convert)"],
            ["Reduce AIGC_Language Style2", "As a language style conversion expert, you are proficient in adjusting AI-generated text into natural human writing styles and colloquial expressions. You have a deep understanding of human writing characteristics and can identify and modify typical features in AI texts, such as repeated words, lack of emotion, and rigid logic. I will provide some paragraphs for you to convert one by one.\n(Please provide the paragraphs you want to convert)"],
            ["Reduce AIGC_Academic Style", "You are a senior language style conversion and polishing expert. Now please rewrite the text I provide, with a writing style that strikes a balance between formal academic writing and conversational expression, ensuring each word has a clear theme, avoiding long or complex sentences, and using short sentences for difficult texts.\n(Please provide the article you want to convert)"],
        ],
        "Other Scenarios": [
            ["Chinese Response", "In your answer, please answer in Chinese. If you want to write code, please write the comments of the code in Chinese. If you want to use mermaid.js, please also use Chinese.\n"],
            ["Continue Long Article", "If you encounter a character limit, DO an ABRUPT stop, and I will send a 'continue' as a new message.\n"], 
            ["Journal Matching", "I want you to act as a scientific manuscript matcher. I will provide you with the title, abstract and keywords of my scientific manuscript. Your task is analyzing my title, abstract and keywords synthetically to find the most related, reputable journals for potential publication of my research based on an analysis of tens of millions of citation connections in database, such as Web of Science, Pubmed, Scopus, ScienceDirect and so on. You only need to provide me with the 15 most suitable journals. Your reply should include the name of journal, the corresponding match score (The full score is ten). I want you to reply in text-based excel sheet and sort by matching scores in reverse order.\n(Please provide your article's title, abstract and keywords)"],
            ["Provide Unique Insights", "Please provide me with some unique insights that I can discuss in my paper, based on the latest research that you are aware of.\n(Please provide your article content)"],
            ["In-depth Analysis and Evaluation", "Please help me to conduct an in-depth analysis of these research methods and data, and provide me with an assessment of their advantages and disadvantages.\n"],
            ["Improve Readability", "Act as an academic research expert and copywriter in (your research field). Your task is to review and enhance the readability of the provided [piece of text] in a research paper. Ensure that the text is clear, concise, and free from jargon while maintaining its academic integrity.\n"],
            ["Find Data Sources", "Act as an academic research expert in (your research field). Your task is to identify and compile a list of credible data sources related to (your research direction). Ensure that the sources are reputable, recent, and relevant to the research objectives.\n"],
            ["Research Direction Search", "Act as an academic Research Expert in (your research field). Conduct an extensive search for research papers on (your research direction). Ensure the papers are from reputable journals, conferences, or academic institutions. Provide a comprehensive list of the findings, including the title of the paper, authors, publication date, abstract, and a link to access the full paper. For each paper, write a brief summary highlighting the main findings and their relevance.\n"],
            ["Summarize Paper Key Points", "Act as an academic research expert in (your research field). Read and digest the content of the research paper titled [title]. Produce a concise and clear summary that encapsulates the main findings, methodology, results, and implications of the study. Ensure that the summary is written in a manner that is accessible to a general audience while retaining the core insights and nuances of the original paper.\n"],
            ["Propose Research Questions", "Act as an academic research expert in (your research field). For (your research direction), formulate a comprehensive research question that can guide a potential study. Ensure the question is clear, specific, and researchable. It should address a gap or need in the current body of knowledge, and have significance in its respective field.\n"],
            ["Find Suitable Research Methods", "Act as an academic research expert in (your research field). Your task is to suggest appropriate methodologies for researching (your research direction). Provide a comprehensive list of both qualitative and quantitative research methods that are best suited for the subject matter.\n"],
        ]
    };

    const MENU_STRUCTURE_Chinese = {
        "翻译": [
            ["中译英学术版", "现在你是一名专业的中英文翻译的翻译家，擅长中英文翻译、英文语法句法、中文逻辑章法、矫正翻译结果，并对结果进行校对、改进和优化。请你将我给到的的中文内容翻译成优雅、精炼且具有学术性的英文。请在保持原意不变的前提下，将简单的词汇和句子替换为更复杂、更优美的表达方式。总体而言，语言风格应类似于（您的投稿期刊，例如：《美国经济评论》）学术期刊。\n（您想翻译的内容）"],
            ["英译中学术版", "现在你是一名专业的中英文翻译的翻译家，擅长中英文翻译、英文语法句法、中文逻辑章法、矫正翻译结果，并对结果进行校对、改进和优化。请你将我给到的的英文内容翻译为中文，并对其进行更正和改进。希望你能用高级汉语进行更加优美、优雅的描述。如果是学术段落，你应该用专业术语回复我。保持相同的含义，但使它们更具文学性。我要求你只进行回复、更正和改进，无需对我给出的内容进行任何的解释和回答，只需要认真的翻译它，并保留原意。\n（您想翻译的内容）"],
            ["中译英正常版", "现在你是一名专业的中英文翻译的翻译家，擅长中英文翻译、英文语法句法、中文逻辑章法、矫正翻译结果，并对结果进行校对、改进和优化。请你将我给到的的中文内容翻译成优雅、精炼的英文。请在保持原意不变的前提下，将简单的词汇和句子替换为更复杂、更优美的表达方式。\n（您想翻译的内容）"],
            ["英译中正常版", "现在你是一名专业的中英文翻译的翻译家，擅长中英文翻译、英文语法句法、中文逻辑章法、矫正翻译结果，并对结果进行校对、改进和优化。请你将我给到的的英文内容翻译为中文，并对其进行更正和改进。希望你能在保持原意不变的前提下，用高级汉语进行更加优美、优雅的描述。\n（您想翻译的内容）"],
            ["中英互译_1", "我是一名研究人员，正在研究（您的研究方向），现在正在尝试修改我的稿件，该稿件将提交给（您的投稿期刊）。现在你是一名专业的中英文翻译的翻译家，我将为你提供一种语言的一些段落，你的任务是将这些段落准确且学术地翻译成另一种语言。我希望你在降价表中给出输出，其中第一列是原始语言，第二列是翻译的第一个版本，第三列是翻译的第二版本，并且每行只给出一个句子。如果您理解上述任务，请回答“是”，然后我将为您提供这些段落。\n（您想翻译的内容）"],
            ["中英互译_2", "现在你是一名专业的中英文翻译的翻译家，我将为你提供一种语言的一些段落，你的任务是将这些段落准确且学术地翻译成另一种语言。翻译后请勿重复原来提供的段落。您应该使用人工智能工具，例如自然语言处理，以及有关有效写作技巧的修辞知识和经验来进行回复。我将给你我的段落如下，告诉我它是用什么语言写的，然后翻译。\n（您想翻译的内容）"],
            // 可以继续添加更多子项
        ],
        "学术角色预设": [
            ["学术角色", "现在你是一位学术领域的领导者，你拥有跨越各个领域的丰富学术经验和专业知识，你不仅参与前沿研究，积极分享专业知识和见解，你还擅长遵守学术写作标准，提高论文质量和影响力，细致地完善每个细节，优化语言表达和逻辑结构。\n"],
            ["论文评审专家", "现在你是一位（在此填入您的专业领域）领域的专家及审稿人。从专业角度来看，您认为文章的内容是否需要修改？请注意不要修改整篇文章，您需要逐一指出需要修改的地方，并给出修改意见和建议修改内容。\n（请给出您的文章内容）"],
            ["论文逻辑性和连贯性评审", "现在你是一位顶级期刊（在此填入您要投稿的期刊）的专家及审稿人。请分析以下文本中段落内的逻辑关系和连贯性，找出流畅性或段落过渡可以改进的地方，并提供具体建议以提高整体质量和可读性。同时请分析文章的专业性，并提供修改句子的建议，给出修改前后的对比。\n（请给出您的文章内容）"],
            ["评价论文结构评审", "现在你是一位顶级期刊（在此填入您要投稿的期刊）的专家及审稿人。请分析这篇论文的组织结构是否清晰，判断引言、方法、结果、讨论和结论是否逻辑连贯，使读者能够理解作者的研究目的、实施方法、主要发现以及这些发现的含义。请提供批评性反馈。\n（请给出您的文章内容）"],
            ["研究科学性评审", "现在你是一位顶级期刊（在此填入您要投稿的期刊）的专家及审稿人。请分析以下论文的研究设计是否具有科学性，判断所采用的方法和实验设计是否适合论文中所涉及的研究问题，评估所使用的样本量是否充足。请提供批评性反馈。\n（请给出您的文章内容）"],
            ["结果推论一致性评审", "现在你是一位顶级期刊（在此填入您要投稿的期刊）的专家及审稿人。请分析本文的讨论是否与结果相符，评估讨论部分的内容是否基于结果，是否超出了结果所能支持的范围。确定讨论部分是否包含许多未经证实的假设或推测，找出讨论中缺乏充分证据支持的观点。评估讨论是否对结果进行了全面解释。评估其是否与现有研究相连接，比较作者的发现与其他研究，并解释潜在的异同。请提供批评性反馈。\n（请给出您的文章内容）"],
            ["数据实验严谨性评审", "请比较结果部分报告的数据与下文表格中的数据，并纠正发现的任何差异，请提供批评性反馈。\n（在此插入您的数据）"],
            ["整篇论文发表角度评审", "现在你是一位顶级期刊（在此填入您要投稿的期刊）的专家及审稿人。请根据发表标准评估这篇文章，并尽可能多地站在专业的角度提供修改建议。\n（请给出您的文章内容）"],
        ],
        "论文撰写": [
            ["写论文标题", "现在你是一位顶级期刊（在此填入您要投稿的期刊）的专家、审稿人及编辑者。我将为您提供一篇科学论文的摘要和关键词（任何语言），您需要检测语言并用相同的语言回复。您的任务是根据摘要和关键词为这篇科学论文提供标题（使用相同语言）。科学论文的标题应该简洁、清晰和信息丰富。您应该避免使用无用词，如'研究'、'调查'、'开发'或'观察'，确保标题能立即吸引读者注意并展示文章大意。\n（请给出您的文章的摘要及关键词）"],
            ["写英文标题", "现在你是一位顶级期刊（在此填入您要投稿的期刊）的专家、审稿人及编辑者。我将为您提供一篇手稿的摘要和关键词，请您为这篇研究论文提供5个好的英文标题，并解释为什么这个标题好。请用带有中文表头的Markdown表格输出，两列形式呈现，其中第一列给出英文标题，第二列用中文提供解释。\n（请给出您的文章的摘要及关键词）"],
            ["写论文摘要", "现在你是一位顶级期刊（在此填入您要投稿的期刊）的专家、审稿人及编辑者。我将为你提供文章的内容，请你为这篇研究论文起草摘要。摘要应简明扼要地总结研究的主要目标、方法、关键发现和意义。\n（请给出您的文章内容）"],
            ["写英文摘要", "现在你是一位顶级期刊（在此填入您要投稿的期刊）的专家、审稿人及编辑者。我将为你提供文章的内容，请你为这篇研究论文起草英文摘要。摘要应首先全面概述研究的广泛背景，然后描述存在的差距、局限性或问题。之后，描述手稿中使用的研究方法。再用3-5个句子展示关键发现。最后，包含一个强调手稿独特价值或重要贡献的陈述。生成摘要后，请用Markdown表格用中文解释您是否遵循了指示。\n（请给出您的文章内容）"],
            ["缩写名称", "'XXX'可以有哪些缩写？请给出几个选项，并说明在学术论文中使用的理由。\n"],
            ["论文续写", "现在你是一位顶级期刊（在此填入您要投稿的期刊）的专家、审稿人及编辑者。基于您掌握的关于（您的研究方向/邻域）邻域的知识，润色并继续写作文章内容，使内容更加丰富完整。\n（请给出您的文章内容）"],
            ["论文致谢", "我想请您帮我写一篇论文致谢。我的论文题目是（标题），我的导师是（导师），我的合作者是（合作者）。我想感谢以下人员或组织：\n（感谢对象1）：感谢他们对我的(帮助或贡献）\n（感谢对象2）：感谢他们对我的（帮助或贡献）\n（感谢对象n）：感谢他们对我的（帮助或贡献）\n您能否根据这些信息写一个大约（字数）的致谢？请使用礼貌诚恳的语气，注意格式和标点符号。\n"],
            ["论文大纲", "现在你是一位顶级期刊（在此填入您要投稿的期刊）的专家、审稿人及编辑者。请你为（您的研究方向/邻域）邻域的（您的研究主题）起草一个全面的研究论文大纲。大纲应结构完善，以引人注目的引言开始，说明问题或问题、主题的相关性、研究方法、创新点和研究目标。\n"],
            // 可以继续添加更多子项
        ],
        "论文润色": [
            ["英文润色", "我将为你提供学术论文的一个段落，请按照专业的学术风格重新修改、润色语句，改进拼写、语法、清晰度、简洁性和整体可读性。必要时可重写整个句子，但是不要更改原意。此外，请用Markdown表格列出所有修改内容并解释修改原因。\（请给出您需要润色的段落）"],
            ["中文润色", "现在你是一位中文专业学术论文写作的改进助手，你的任务是在不更改文章原意的前提下，通过分解长句、整合短句、减少重复等一些方法，提高所提供文本的拼写、语法、清晰度、简洁性和整体可读性，并提供改进建议。此外，请用Markdown表格列出所有修改内容并解释修改原因。\n（请给出您需要润色的段落）"],
            ["SCI论文润色", "现在你是一位SCI顶级期刊（在此填入您要投稿的期刊）的专家、审稿人及编辑者。现在我正在准备提交这篇SCI论文，需要你帮助我润色每个段落。请你帮我完善写作以符合学术要求，我需要您纠正任何语法错误，改进句子结构使其更适合学术用途，并在必要时使文本更加正式。对于每个需要改进的段落，您需要将所有修改的句子放在Markdown表格中，并对修改前后的内容进行对比，并说明原因，每列包含以下内容：完整的原始句子；突出显示句子修改的部分；解释为什么做这些更改。最后，重写完整的修改后段落。\n（请给出您的文章内容）"],
            ["期刊/会议风格", "如果我希望在（在此填入您要投稿的期刊）期刊上发表论文，请按照（在此填入您要投稿的期刊）期刊的文章的风格润色这篇文章的内容。\n（请给出您的文章内容）"],
            ["润色英文段落结构和句子逻辑", "我是一名研究（您的研究方向）的研究者，现在请你修改我将要提交给（您的投稿期刊）的手稿。我希望您分析以下文本中段落内句子之间的逻辑和连贯性，找出任何可以改进流畅性或句子连接的地方，并提供具体建议以提高内容的整体质量和可读性。请只提供改进后的文本，然后用中文列出改进清单。\n（请给出您的文章内容）"],
            ["直接润色段落", "请润色这个段落，使其更加符合逻辑性和学术性。\n（请给出您需要润色的段落）"],
            ["润色多版参考", "请提供多个版本供参考。\n"],
            ["错误纠正", "提示：请注意不是.....，而是.....。基于我补充的内容重新回答上一个问题。\n"],
            ["重新回答", "还是上述问题，我认为你的回答不够好。请重新回答，这次着重删除这段文字中的冗余内容。\n"],
            ["语法检查/查找语法错误", "你能帮我确保语法和拼写正确吗？请不要尝试润色文本，如果没有发现错误，请告诉我这段话很好。如果发现语法或拼写错误，请在两列markdown表格中列出您发现的错误，在第一列放原文，在第二列放更正后的文本，并突出显示您修复的关键词。\n（请给出您需要矫正的文章内容）"],
            ["语法校正", "我是一名研究（您的研究方向）的研究者，现在正试图修改我将要提交给（您的投稿期刊）的手稿。请帮我确保语法和拼写正确。请不要尝试改进文本，如果没有发现错误，请告诉我这段话很好。如果发现语法或拼写错误，请在两列markdown表格中列出您发现的错误，在第一列放原文，在第二列放更正后的文本，并用粗体突出显示您修复的关键词。\n（请给出您需要矫正的文章内容）"],
            ["语法句法", "这个句子在语法上不正确。请修改。\n（请给出您需要矫正的句子）"],
            ["动词语法", "这个句子的主语和谓语不一致。请更正。\n（请给出您需要矫正的句子）"],
            ["表达错误", "这个短语似乎不合适。请重新措辞以提高清晰度。\n（请给出您需要矫正的句子）"],
            ["语态错误", "我在这个句子中使用了被动语态。请考虑改用主动语态。\n（请给出您需要矫正的句子）"],
            ["润色定位", "请注意，除了给出修改后的内容，还请指出修改版本中修改了哪些段落和句子。\n"],
            ["修改建议", "您现在作为（您的研究邻域）的专家。从专业角度来看，您认为文章内容是否需要修改？请注意不要修改整篇文章，您需要逐一指出需要修改的地方，并给出修改意见和建议修改内容。\n（请给出您需要修改的文章内容）"],
            ["修改意见", "我开始写一篇学术论文，标题是（您的论文标题），现在我已经完成了引言部分，但我不确定是否合适，您能帮我阅读并提出详细具体的修改建议吗？\n"],
            ["封装基本事实/原理/背景", "现在为了帮助我更好地润色论文，我需要您记住XXX原理：'.......'请润色并重写上述内容，使其更符合学术论文的风格，同时更专业。如果有不符合事实或逻辑的部分，请参考xxxxx部分对上述内容进行修改。\n（请给出您的文章内容）"],
            ["逻辑论证辅助", "请帮我分析并优化这个论证的逻辑结构，使其更具说服力。\n"],
            ["个性化润色指令", "更精确的术语：选择更精确的词汇，例如使用‘产生’代替‘制造’\n精炼表达：去除冗余的表达以提高句子的清晰度和直接性。\n客观的语言：剔除含糊和主观性表述，以客观方式呈现信息。\n细化描述：提供更具体的细节，以支持论点或想法。\n更连贯的表达：确保句子的组织性良好，逻辑流畅。\n保持风格一致：确保用词和语调与整篇论文保持一致。\n符合学术风格：运用正确的学术用语如‘此外’和‘因此’。\n规范语法：使用正确的语法或句法，避免语句不完整或偏离主题。\n深化细节描绘：使用精准的词汇和短语描述复杂或微妙的概念，使句子更加细化。\n进行细微调整：对文本进行微调\n实施边际修改：进行边际性修改\n通过改述增加清晰度：改述以增强清晰性\n简化句子结构：简化句子结构\n验证语法和拼写正确性：校验语法和拼写的正确性\n提升文本流畅度和一致性：提升文本的流畅度和连贯性\n改进措辞：措辞精练\n调整风格一致性：调整风格\n执行重要编辑：执行重要的编辑\n改造内容框架：改变内容架构\n"],
        ],
        "论文查重": [
            ["论文查重", "我希望您作为（您的研究邻域）的专家，帮助学生进行论文查重。如果文本中有13个连续相同的词，将被视为重复。您需要使用调整主谓宾语顺序、替换同义词、增删词语等方法来实现查重目标。请修改以下段落。\n（请给出您需要修改的段落内容）"],
        ],
        "参考文献": [
            ["检查参考文献格式", "我希望您担任研究手稿的参考文献编辑。我将提供五个参考文献模板作为指导。之后，我会提供其他需要您检查格式的参考文献，包括标点符号的位置和间距等方面。这些参考文献必须与最初的五个模板保持一致。请提供任何必要的更正或改进建议。请提供一个包含三列的markdown表格，第一列是原始文本，第二列是修正后的文本，第三列是解释，然后提供所有修正后的参考文献。\n（请给出您的文章的参考文献）"],
            ["按照APA 格式校正参考文献格式", "请首先根据APA格式校正以下参考文献格式，使其严格符合APA引用格式。最后，我需要参考文献以Markdown格式代码块显示。需要特别注意的是，期刊名称应该是完整的并且使用斜体（这里可以添加其他要求）。\n（请给出您的文章的参考文献）"],
        ],
        "投稿审稿": [
            ["撰写 Cover letter", "我希望您担任学术期刊编辑。我将为您提供我的手稿标题和摘要。您需要为向（在此填入您要投稿的期刊）期刊投稿撰写一份格式规范的投稿信。您应该声明该手稿未被考虑在任何其他期刊发表。简要介绍手稿的优点，并提供简短摘要以向科学读者指出结果的重要性。\n（请给出您的文章的标题和摘要）"],
            ["解释审稿人反馈", "作为学术研究专家，请结合我的文章仔细分析和解释审稿人对已提交研究论文的（在此填入审稿人的反馈）。识别审稿人强调的主要问题、建设性建议和需要改进的领域。\n（请给出您的文章内容）"],
        ],
        "撰写代码": [
            ["解释代码", "现在您是一位专业的代码解释专家，请逐行阅读代码并在适当的地方添加中文注释，告诉我每行和每段代码的功能。同时，您也可以使用mermaid.js包含图表来说明代码中的复杂概念和逻辑。\n（请给出您需要解释的代码）"],
            ["任意编程语言到Python", "我希望您充当任意编程语言到Python代码的转换专家。我将为您提供一段编程语言代码，您需要将其转换为Python代码，并附带（在此给出您想要的注释的语言）注释以便理解。\n（请给出您需要转换的代码）"],
            ["Python输出器", "我希望您充当Python解释专家。我将给您Python命令，您需要生成正确的输出。只需说出输出结果。如果没有输出，则不要说任何话，也不要给我解释。如果需要我说明什么，你可以再次询问。\n（请给出您需要运行的代码）"],
            ["代码生成", "您现在是一位专业的代码工程师。现在我将给您一些针对性的问题。请就这些问题给出您的想法，然后给出您编写的完整代码。在给出所有代码之前，您必须非常仔细地检查您给出的代码。您必须避免以下低级问题，例如：代码逻辑错误、边界条件处理不当、缺少关键步骤、缺少必要的模块导入、缺少必要的函数定义或依赖项、忽略上下文等低级错误。\n（请给出您的问题）"],
            ["代码优化", "您现在是一名专业的代码工程师。现在我给你一些代码，请你对这段代码提出你独特的改进建议，以优化代码的性能。在给出我的所有代码之前，您必须非常仔细地检查您提供的代码。你必须避免以下愚蠢的问题，例如：代码逻辑错误、边界条件处理不正确、缺少关键步骤、缺少必要的模块导入、缺少必要的函数定义或依赖、忽略上下文以及其他低级错误。\n（请给出您的代码）"]
        ],
        "降低AIGC": [
            ["降低AIGC_连接词", "您是一位资深的语言风格转换和文本润色专家，精通将AI生成的文本调整为人性化的写作风格。因此，您深入理解人类写作的特点，能够识别和修改AI文本中的典型特征，如重复用词、缺乏情感、生硬的逻辑、刻板的句式等。请注意，修改后的文章应从多个维度进行优化，即在保持原有信息准确性的同时，优化文章结构和逻辑连贯性，避免改变文章的基本意图和内容，避免机械感，确保在语言风格、情感表达、逻辑结构等方面与人类写作保持一致。同时还需要调整语言的多样性和表现力，使其更加生动自然。下面我将给出一些段落请你逐个转换。\n（请给出您要转换的段落）"],
            ["降低AIGC_语言风格1", "您是一位资深的语言风格转换和文本润色专家。您需要帮助用户将AI生成的文章重写为人性化和自然的表达。文章应避免机械感，确保在语言风格、情感表达、逻辑结构等方面与人类写作保持一致。下面我将给出一些段落请你逐个转换。\n（请给出您要转换的段落）"],
            ["降低AIGC_语言风格2", "作为语言风格转换专家，您精通将AI生成的文本调整为自然的人类写作风格和口语化表达。您深入理解人类写作特征，能够识别和修改AI文本中的典型特征，如重复用词、缺乏情感和生硬的逻辑。下面我将给出一些段落请你逐个转换。\n（请给出您要转换的段落）"],
            ["降低AIGC_学术风格", "您是一位资深的语言风格转换和润色专家。现在请重写我给出的文本，写作风格应在正式的学术写作和口语化表达之间取得平衡，确保每个词都有明确的主题，避免使用冗长或复杂的句子，对于难懂的文本使用简短的句子。\n（请给出您要转换的文章）"],
        ],
        "其他场景": [
            ["中文回答", "在您的回答中，请用中文回答。如果您要编写代码，请用中文写代码注释。如果您要使用mermaid.js，也请使用中文。\n"],
            ["持续给出长文章", "如果遇到字符限制，请直接停止，我会发送'继续'作为新消息。\n"],
            ["论文期刊匹配", "我希望您充当科学论文匹配专家。我将分别提供我的科学论文的标题、摘要和关键词。您的任务是综合分析我的标题、摘要和关键词，基于对Web of Science、Pubmed、Scopus、ScienceDirect等数据库中数千万引用连接的分析，为我的研究找到最相关、最有声望的期刊进行潜在发表。您只需要为我提供15个最适合的期刊。您的回复应包括期刊名称、相应的匹配分数（满分为十分）。我希望您以文本形式的excel表格回复，并按匹配分数降序排序。\n（请给出您的文章的标题、摘要及关键词）"],
            ["提供独特见解", "请根据您所了解的最新研究，为我提供一些可以在论文中讨论的独特见解。\n（请给出您的文章内容）"],
            ["深度分析与评估", "请帮我对这些研究方法和数据进行深入分析，并提供其优缺点的评估。\n"],
            ["提高可读性", "作为（您的研究邻域）学术研究专家和文案撰写人，您的任务是审查并提高研究论文中提供的[文本片段]的可读性。确保文本清晰、简洁、避免专业术语，同时保持其学术完整性。\n"],
            ["寻找数据源", "作为（您的研究邻域）学术研究专家，您的任务是识别和编制与（您的研究方向）相关的可信数据源列表。确保这些来源具有权威性、时效性，并与研究目标相关。\n"],
            ["寻找并了解研究方向", "作为（您的研究邻域）学术研究专家，对指定的（您的研究方向）进行广泛的研究论文搜索。确保论文来自知名期刊、会议或学术机构。提供详细的研究发现列表，包括论文标题、作者、发表日期、摘要和访问全文的链接。对每篇论文写一个简短的总结，突出主要发现及其相关性。\n"],
            ["总结论文要点", "作为（您的研究邻域）学术研究专家，阅读并理解标题为[标题]的研究论文内容。产生一个简明扼要的总结，概括研究的主要发现、方法、结果和影响。确保总结以通俗易懂的方式撰写，同时保留原论文的核心见解和细微差别。\n"],
            ["提出研究问题", "作为（您的研究邻域）学术研究专家，针对给定的（您的研究方向），制定一个可以指导潜在研究的综合性研究问题。确保问题清晰、具体且可研究。它应该解决当前知识体系中的空白或需求，并在其各自领域具有重要性。\n"],
            ["找出合适的研究方法", "作为（您的研究邻域）的学术研究专家，您的任务是为研究（您的研究方向）建议适当的方法。提供最适合该主题的定性和定量研究方法的综合列表。\n"],
        ]
    };

    // 创建一个容器元素
    const container = document.createElement('div');
    container.id = 'ChatAIHelper';
    
    // 设置HTML内容
    container.innerHTML = `
        <!-- 悬浮按钮 -->
        <button id="ChatAIHelperButton" class="helper-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
        </button>

        <!-- 侧边栏 -->
        <div id="ChatAIHelperSidebar" class="helper-sidebar">
            <div class="sidebar-header">
                <h2>AI Chat Helper</h2>
                <button id="ChatAIHelperClose" class="close-button">×</button>
            </div>
            <div class="status-bar">
                <span>PoW: <span id="difficulty-level-simple">N/A</span></span>
                <span class="status-separator">|</span>
                <span>IP质量: <span id="ip-quality-simple">N/A</span></span>
            </div>
            <div class="sidebar-content">
                ${Object.entries(MENU_STRUCTURE_English).map(([category, items]) => `
                    <div class="menu-category">
                        <div class="category-header">
                            <span>${category}</span>
                            <span class="arrow">▼</span>
                        </div>
                        <div class="category-content">
                            ${items.map(([label, value]) => `
                                <button class="menu-item" data-value="${encodeURI(value)}">
                                    ${label}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            <!-- 添加导航栏 -->
            <div class="nav-bar">
                <button class="nav-button" data-action="chinese">中文</button>
                <button class="nav-button active" data-action="english">English</button>
                <button class="nav-button" data-action="help">帮助</button>
            </div>
        </div>
        
    `;

    // 模拟移动设备 - 降智避免部分
    const navigatorProxy = new Proxy(navigator, {
        get(target, prop) {
            if (prop === 'userAgent') {
                return "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1";
            }
            if (prop === 'platform') {
                return "iPhone";
            }
            if (prop === 'maxTouchPoints') {
                return 1;
            }
            return Reflect.get(target, prop);
        }
    });
    
    Object.defineProperty(window, 'navigator', {
        get() {
            return navigatorProxy;
        },
        configurable: false
    });

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        /* 重置所有元素的默认样式 */
        #ChatAIHelper * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        /* 设置整个助手的基础字体 */
        #ChatAIHelper {
            font-family: SimSun, "Times New Roman", serif;
        }

        /* 右侧悬浮的圆形主按钮样式 */
        .helper-button {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #1a1a1a;
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        /* 主按钮悬停效果：放大并改变背景色 */
        .helper-button:hover {
            background: #2a2a2a;
            transform: translateY(-50%) scale(1.1);
        }

        /* 侧边栏主容器 */
        .helper-sidebar {
            position: fixed;
            top: 0;
            right: -320px;
            width: 320px;
            height: 100vh;
            background: #2c2c2c;
            color: #ffffff;
            z-index: 10001;
            transition: right 0.3s ease;
            box-shadow: -2px 0 15px rgba(0,0,0,0.2);
            overflow-y: auto;
        }

        /* 侧边栏激活状态：滑入显示 */
        .helper-sidebar.active {
            right: 0;
        }

        /* 修改侧边栏内容区域，让其不会被底部导航栏遮挡 */
        #ChatAIHelper .sidebar-content {
            height: calc(100vh - 160px) !important; /* 减去顶部标题栏和底部导航栏的高度 */
            overflow-y: auto !important;
            padding-bottom: 60px !important; /* 确保内容不会被底部导航栏遮挡 */
        }

        /* 导航栏样式 - 固定在底部 */
        #ChatAIHelper .nav-bar {
            position: fixed !important;
            bottom: 0 !important;
            width: 320px !important; /* 与侧边栏同宽 */
            display: flex !important;
            justify-content: space-around !important;
            padding: 10px !important;
            background: #363636 !important;
            border-top: 1px solid #404040 !important;
            z-index: 10002 !important; /* 确保导航栏始终显示在最上层 */
        }

        #ChatAIHelper .nav-button {
            flex: 1 !important;
            margin: 0 5px !important;
            padding: 8px 16px !important;
            background: #2c2c2c !important;
            border: none !important;
            border-radius: 4px !important;
            color: #e0e0e0 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            font-size: 14px !important;
            font-family: SimSun, "Times New Roman", serif !important;
        }

        #ChatAIHelper .nav-button:hover {
            background: #404040 !important;
            color: #ffffff !important;
        }

        #ChatAIHelper .nav-button.active {
            background: #007bff !important;
            color: #ffffff !important;
        }

        /* 当侧边栏激活时，导航栏才显示 */
        #ChatAIHelper .nav-bar {
            right: -320px !important;
            transition: right 0.3s ease !important;
        }

        #ChatAIHelper .helper-sidebar.active .nav-bar {
            right: 0 !important;
        }
        /* 侧边栏顶部标题区域样式 */
        #ChatAIHelper .sidebar-header {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 16px 20px !important;
            background: #363636 !important;
            border-bottom: 1px solid #404040 !important;
            position: relative !important;
        }

        /* 侧边栏标题文字样式 */
        #ChatAIHelper .sidebar-header h2 {
            font-size: 30px !important;
            font-weight: 600 !important;
            color: #fff !important;
            font-family: "Times New Roman", serif !important;
            margin: 0 !important;
            text-align: center !important;
        }

        /* 关闭按钮样式：位于标题栏右侧 */
        #ChatAIHelper .close-button {
            position: absolute !important;
            right: 10px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            background: none !important;
            border: none !important;
            color: #888 !important;
            font-size: 24px !important;
            cursor: pointer !important;
            padding: 5px !important;
            transition: color 0.2s ease !important;
            line-height: 1 !important;
        }

        /* 关闭按钮悬停效果 */
        #ChatAIHelper .close-button:hover {
            color: #fff !important;
        }

        #ChatAIHelper .status-bar {
            padding: 8px 16px !important;
            background: #363636 !important;
            border-bottom: 1px solid #404040 !important;
            display: grid !important;
            grid-template-columns: 1fr auto 1fr !important; /* 三列布局：左内容、分隔符、右内容 */
            align-items: center !important;
            font-size: 14px !important;
            color: #e0e0e0 !important;
        }

        /* 左侧 PoW 内容 */
        #ChatAIHelper .status-bar .pow-container {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
        }

        /* 分隔符 */
        #ChatAIHelper .status-separator {
            margin: 0 10px !important;
            color: #505050 !important;
        }

        /* 右侧 IP质量 内容 */
        #ChatAIHelper .status-bar .ip-container {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
        }

        #ChatAIHelper #difficulty-level-simple,
        #ChatAIHelper #ip-quality-simple {
            color: #4CAF50 !important;
            margin-left: 4px !important;
        }

        /* 菜单分类容器样式 */
        #ChatAIHelper .menu-category {
            margin: 0 0 15px 0 !important;
            border-radius: 6px !important;
            overflow: hidden !important;
        }

        /* 最后一个菜单项 */
        #ChatAIHelper .menu-category:last-child {
            margin-bottom: 0 !important;
        }

        /* 主菜单分类标题 */
        #ChatAIHelper .category-header {
            padding: 14px 16px !important;
            background: #363636 !important;
            cursor: pointer !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            transition: background-color 0.2s ease !important;
            border-left: 3px solid transparent !important;
            font-size: 16px !important;
            font-weight: 500 !important;
        }

        /* 主菜单分类标题悬停效果 */
        #ChatAIHelper .category-header:hover {
            background: #404040 !important;
            border-left: 3px solid #007bff !important;
        }

        /* 主菜单分类标题文字 */
        #ChatAIHelper .category-header span:first-child {
            font-weight: 500 !important;
            font-size: 17px !important;
        }

        /* 子菜单容器 */
        #ChatAIHelper .category-content {
            background: #2c2c2c !important;
            display: none !important;
            padding: 8px 0 !important;
        }

        /* 子菜单容器激活状态 */
        #ChatAIHelper .category-content.active {
            display: block !important;
            animation: slideDown 0.3s ease !important;
        }

        /* 子菜单项 */
        #ChatAIHelper .menu-item {
            width: calc(100% - 64px) !important;
            padding: 10px 14px !important;
            margin: 5px 0 5px 48px !important;
            background: #363636 !important;
            border: none !important;
            color: #e0e0e0 !important;
            text-align: left !important;
            cursor: pointer !important;
            border-radius: 4px !important;
            transition: all 0.2s ease !important;
            font-size: 14px !important;
            font-family: SimSun, "Times New Roman", serif !important;
            position: relative !important;
            display: block !important;
        }

        /* 子菜单项悬停效果 */
        #ChatAIHelper .menu-item:hover {
            background: #404040 !important;
            color: #ffffff !important;
            border-left: 2px solid #007bff !important;
        }

        /* 第一个子菜单项 */
        #ChatAIHelper .menu-item:first-child {
            margin-top: 8px !important;
        }

        /* 最后一个子菜单项 */
        #ChatAIHelper .menu-item:last-child {
            margin-bottom: 8px !important;
        }

        /* 分类标题右侧箭头 */
        #ChatAIHelper .arrow {
            transition: transform 0.3s ease !important;
            font-size: 12px !important;
            color: #888 !important;
        }

        /* 分类展开时箭头旋转效果 */
        #ChatAIHelper .category-header.active .arrow {
            transform: rotate(180deg) !important;
            color: #fff !important;
        }

        /* 自定义滚动条 */
        #ChatAIHelper .helper-sidebar::-webkit-scrollbar {
            width: 6px !important;
        }

        #ChatAIHelper .helper-sidebar::-webkit-scrollbar-track {
            background: #2c2c2c !important;
        }

        #ChatAIHelper .helper-sidebar::-webkit-scrollbar-thumb {
            background: #505050 !important;
            border-radius: 3px !important;
        }

        #ChatAIHelper .helper-sidebar::-webkit-scrollbar-thumb:hover {
            background: #606060 !important;
        }

        /* 下拉展开动画 */
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

    // 添加到页面
    document.head.appendChild(style);
    document.body.appendChild(container);

    // 全局变量来跟踪当前语言状态
    let currentLanguage = 'english'; // 默认英文

    // 更新菜单内容的函数
    function updateMenuContent(language) {
        const menuStructure = language === 'chinese' ? MENU_STRUCTURE_Chinese : MENU_STRUCTURE_English;
        const sidebarContent = document.querySelector('.sidebar-content');
        
        // 更新HTML内容
        sidebarContent.innerHTML = Object.entries(menuStructure).map(([category, items]) => `
            <div class="menu-category">
                <div class="category-header">
                    <span>${category}</span>
                    <span class="arrow">▼</span>
                </div>
                <div class="category-content">
                    ${items.map(([label, value]) => `
                        <button class="menu-item" data-value="${encodeURI(value)}">
                            ${label}
                        </button>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        // 立即重新绑定所有事件
        rebindAllEvents();
    }

    // 重新绑定所有事件的函数
    function rebindAllEvents() {
        // 绑定类别展开/收起事件
        document.querySelectorAll('#ChatAIHelper .category-header').forEach(header => {
            const content = header.nextElementSibling;
            header.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                header.classList.toggle('active');
                content.classList.toggle('active');
            };
        });

        // 绑定菜单项点击事件
        document.querySelectorAll('#ChatAIHelper .menu-item').forEach(item => {
            item.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const value = decodeURI(item.dataset.value);
                
                // 获取父级元素
                const parentDiv = document.getElementById('prompt-textarea');
                if (parentDiv) {
                    // 创建新的段落元素
                    const newParagraph = document.createElement('p');
                    newParagraph.textContent = value;
                    
                    // 插入到父级元素的第一个子元素之前
                    parentDiv.insertBefore(newParagraph, parentDiv.firstChild);
                }
        
                document.getElementById('ChatAIHelperSidebar').classList.remove('active');
            };
        });
    }

    // Enter按键的功能
    function handleKeyPress(e) {
        // 获取焦点元素
        const activeElement = document.activeElement;

        // 检查焦点是否在文本输入区域
        if (activeElement && 
            (activeElement.tagName.toLowerCase() === 'textarea' || 
             activeElement.getAttribute('contenteditable') === 'true')) {
            
            if (e.key === "Enter") {
                // 阻止事件冒泡和默认行为
                e.stopPropagation();
                e.preventDefault();

                if (e.ctrlKey || e.metaKey) {
                    // Ctrl+Enter 发送消息
                    let sendButton;
                    const hostname = window.location.hostname;

                    if (hostname.includes('chat.openai.com')) {
                        sendButton = document.querySelector('button[data-testid="send-button"]');
                    } else if (hostname.includes('claude.ai')) {
                        sendButton = document.querySelector('button[aria-label="Send message"]');
                    } else if (hostname.includes('google.com')) {
                        sendButton = document.querySelector('button[aria-label="Send message"]');
                    } else if (hostname.includes('monica.im')) {
                        sendButton = document.querySelector('button.send-button');
                    }

                    if (!sendButton) {
                        // 备用查找方法
                        sendButton = document.querySelector('button[class*="send"], button[aria-label*="send" i], button[aria-label*="发送" i]');
                    }

                    if (sendButton && !sendButton.disabled) {
                        sendButton.click();
                    }
                } else {
                    // 普通 Enter 换行
                    if (activeElement.tagName.toLowerCase() === 'textarea') {
                        // 对于普通文本区域，插入换行符
                        const start = activeElement.selectionStart;
                        const end = activeElement.selectionEnd;
                        const value = activeElement.value;
                        
                        // 插入换行符 \n
                        activeElement.value = value.substring(0, start) + "\n" + value.substring(end);
                        
                        // 设置光标位置到换行符后
                        activeElement.selectionStart = activeElement.selectionEnd = start + 1;
                        
                        // 触发 input 事件以更新UI
                        const inputEvent = new Event('input', { bubbles: true });
                        activeElement.dispatchEvent(inputEvent);
                    } else if (activeElement.getAttribute('contenteditable') === 'true') {
                        // 对于可编辑div，插入<br>标签
                        const selection = window.getSelection();
                        const range = selection.getRangeAt(0);
                        
                        // 创建并插入换行元素
                        const br = document.createElement('br');
                        range.deleteContents();
                        range.insertNode(br);
                        
                        // 移动光标到新行
                        range.setStartAfter(br);
                        range.setEndAfter(br);
                        selection.removeAllRanges();
                        selection.addRange(range);
                        
                        // 触发 input 事件
                        const inputEvent = new Event('input', { bubbles: true });
                        activeElement.dispatchEvent(inputEvent);
                    }

                    // 自动滚动到底部
                    requestAnimationFrame(() => {
                        if (activeElement.scrollHeight > activeElement.clientHeight) {
                            activeElement.scrollTop = activeElement.scrollHeight;
                        }
                    });
                }
            }
        }
    }

    function updatePowStatus(difficulty) {
        const difficultyLevelSimple = document.getElementById('difficulty-level-simple');
        const ipQualitySimple = document.getElementById('ip-quality-simple');
        
        if (difficulty === 'N/A') {
            difficultyLevelSimple.innerText = 'N/A';
            ipQualitySimple.innerText = 'N/A';
            return;
        }
    
        const cleanDifficulty = difficulty.replace('0x', '').replace(/^0+/, '');
        const hexLength = cleanDifficulty.length;
        
        let level, qualityText, textColor;
        
        if (hexLength <= 2) {
            level = '困难';
            qualityText = '高风险';
            textColor = '#ff6b6b';
        } else if (hexLength === 3) {
            level = '中等';
            qualityText = '中等';
            textColor = '#ffd700';
        } else if (hexLength === 4) {
            level = '简单';
            qualityText = '良好';
            textColor = '#9acd32';
        } else {
            level = '极易';
            qualityText = '优秀';
            textColor = '#98fb98';
        }
        
        difficultyLevelSimple.innerText = level;
        difficultyLevelSimple.style.color = textColor;
        ipQualitySimple.innerText = qualityText;
        ipQualitySimple.style.color = textColor;
    }
    
    // 添加fetch拦截
    const originalFetch = window.fetch;
    window.fetch = async function(resource, options) {
        const response = await originalFetch(resource, options);
        
        if ((resource.includes('/backend-api/sentinel/chat-requirements') || 
             resource.includes('backend-anon/sentinel/chat-requirements')) && 
            options.method === 'POST') {
            const clonedResponse = response.clone();
            clonedResponse.json().then(data => {
                const difficulty = data.proofofwork ? data.proofofwork.difficulty : 'N/A';
                updatePowStatus(difficulty);
            }).catch(e => console.error('解析响应时出错:', e));
        }
        return response;
    };

    // 初始化
    function initialize() {
        const button = document.getElementById('ChatAIHelperButton');
        const sidebar = document.getElementById('ChatAIHelperSidebar');
        const closeButton = document.getElementById('ChatAIHelperClose');
    
        if (!button || !sidebar || !closeButton) return;
    
        // 初始化菜单内容
        updateMenuContent(currentLanguage);
    
        // 创建状态栏组件
        const statusBar = document.querySelector('.status-bar');
        if (statusBar) {
            const powContainer = document.createElement('div');
            powContainer.className = 'pow-container';
            powContainer.innerHTML = 'PoW: <span id="difficulty-level-simple">N/A</span>';

            const separator = document.createElement('span');
            separator.className = 'status-separator';
            separator.textContent = '|';

            const ipContainer = document.createElement('div');
            ipContainer.className = 'ip-container';
            ipContainer.innerHTML = 'IP质量: <span id="ip-quality-simple">N/A</span>';

            // 清空并重新添加状态栏内容
            statusBar.innerHTML = '';
            statusBar.appendChild(powContainer);
            statusBar.appendChild(separator);
            statusBar.appendChild(ipContainer);
        }
    
        // 初始化菜单内容
        updateMenuContent(currentLanguage);
    
        // 绑定主按钮点击事件
        button.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            sidebar.classList.add('active');
        };
    
        // 绑定关闭按钮事件
        closeButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            sidebar.classList.remove('active');
        };    

        // 绑定导航栏按钮事件
        document.querySelectorAll('.nav-button').forEach(button => {
            button.onclick = (e) => {
                e.stopPropagation();
                const action = button.dataset.action;
                
                if (action === 'help') {
                    alert("AI Chat Helper 使用说明：\n\n1. 点击右侧悬浮按钮打开菜单\n2. 选择需要的功能分类\n3. 点击具体功能项插入提示词\n4. 使用 Enter 换行，Ctrl+Enter 发送消息");
                    return;
                }
                
                if (action === 'chinese' || action === 'english') {
                    document.querySelectorAll('.nav-button[data-action="chinese"], .nav-button[data-action="english"]')
                        .forEach(btn => btn.classList.remove('active'));
                    
                    button.classList.add('active');
                    currentLanguage = action;
                    updateMenuContent(currentLanguage);
                }
            };
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape") {
                sidebar.classList.remove('active');
            }
        });

        // 点击外部关闭
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !button.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });

        // 快捷键
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyF") {
                e.preventDefault();
                sidebar.classList.toggle('active');
            }
        });

        // 初始化PoW状态
        updatePowStatus('N/A');

        // 使用 capture 为 true 来确保我们的处理程序最先执行
        document.addEventListener('keydown', handleKeyPress, true);

        // 移除可能存在的其他 Enter 键事件监听器
        const textareas = document.querySelectorAll('textarea, [contenteditable="true"]');
        textareas.forEach(textarea => {
            textarea.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.stopPropagation();
                }
            }, true);
        });    

        // 初始化时重新绑定所有事件
        rebindAllEvents();
    }

    // 确保 DOM 加载完成后再初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();