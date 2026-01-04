// ==UserScript==
// @name         Radiopaedia PT-BR to EN Medical Search
// @version      0.4
// @description  Translates Portuguese medical search terms to English on Radiopaedia.org
// @author       Seu Nome/AI
// @match        https://radiopaedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=radiopaedia.org
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1464973
// @downloadURL https://update.greasyfork.org/scripts/538811/Radiopaedia%20PT-BR%20to%20EN%20Medical%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/538811/Radiopaedia%20PT-BR%20to%20EN%20Medical%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Dicionário de Tradução ---
    // Adicione mais termos e frases aqui
    // Para frases, a chave deve ser a frase completa em português em minúsculas
    // Para palavras, a chave deve ser a palavra em português em minúsculas

    const phraseTranslations = {
        "hematoma subgaleal": "subgaleal hematoma",
        "acidente vascular cerebral": "cerebrovascular accident",
        "avc": "stroke", // Acrônimo comum
        "avc hemorrágico": "hemorrhagic stroke",
        "avc isquêmico": "ischemic stroke",
        "tumor cerebral": "brain tumor",
        "edema pulmonar": "pulmonary edema",
        "fratura de colles": "colles fracture",
        "doença de crohn": "crohn disease",
        "apendicite aguda": "acute appendicitis",
        "aneurisma da aorta abdominal": "abdominal aortic aneurysm",
        "embolia pulmonar": "pulmonary embolism",
        "derrame pleural": "pleural effusion",
        "cisto ovariano": "ovarian cyst",
        "cisto renal": "renal cyst",
        "estenose aórtica": "aortic stenosis",
        "infarto agudo do miocárdio": "acute myocardial infarction",
        "iam": "acute myocardial infarction", // Acrônimo
        "nefrolitíase": "nephrolithiasis", // sinônimo: cálculo renal
        "cálculo renal": "renal calculus", // ou kidney stone
        "colecistite aguda": "acute cholecystitis",
        "pancreatite aguda": "acute pancreatitis",
        "pneumonia lobar": "lobar pneumonia",
        "tuberculose pulmonar": "pulmonary tuberculosis",
        "meningioma": "meningioma", // Mesmo termo, mas para garantir
        "glioblastoma multiforme": "glioblastoma multiforme",
        "hidrocefalia": "hydrocephalus"
    };

    const wordTranslations = {
        "hematoma": "hematoma",
        "subgaleal": "subgaleal",
        "hemorrágico": "hemorrhagic",
        "isquêmico": "ischemic",
        "cerebral": "brain", // ou cerebral dependendo do contexto
        "vascular": "vascular",
        "acidente": "accident",
        "tumor": "tumor", // ou tumour (UK)
        "fratura": "fracture",
        "edema": "edema",
        "pulmonar": "pulmonary",
        "agudo": "acute",
        "aguda": "acute",
        "crônico": "chronic",
        "crônica": "chronic",
        "cisto": "cyst",
        "nódulo": "nodule",
        "massa": "mass",
        "lesão": "lesion",
        "inflamação": "inflammation",
        "infecção": "infection",
        "osso": "bone",
        "articulação": "joint",
        "músculo": "muscle",
        "tendão": "tendon",
        "ligamento": "ligament",
        "nervo": "nerve",
        "vaso": "vessel",
        "artéria": "artery",
        "veia": "vein",
        "coração": "cardiac", // ou heart
        "pulmão": "lung", // ou pulmonary
        "fígado": "hepatic", // ou liver
        "rim": "renal", // ou kidney
        "baço": "splenic", // ou spleen
        "pâncreas": "pancreatic", // ou pancreas
        "estômago": "gastric", // ou stomach
        "intestino": "intestinal", // ou bowel
        "delgado": "small",
        "grosso": "large",
        "cólon": "colon",
        "cérebro": "brain", // ou cerebral
        "medula": "spinal cord", // ou marrow
        "espinhal": "spinal",
        "óssea": "bone",
        "pele": "skin", // ou cutaneous
        "olho": "ocular", // ou eye
        "ouvido": "otic", // ou ear
        "garganta": "throat", // ou pharyngeal/laryngeal
        "cabeça": "head",
        "pescoço": "neck",
        "tórax": "chest", // ou thoracic
        "abdômen": "abdomen",
        "abdominal": "abdominal",
        "pelve": "pelvis",
        "pélvico": "pelvic",
        "membro": "limb",
        "superior": "upper",
        "inferior": "lower",
        "de": "of", // Preposições podem ser problemáticas, mas úteis para frases
        "do": "of the", // (masculino)
        "da": "of the", // (feminino)
        "dos": "of the", // (masculino plural)
        "das": "of the", // (feminino plural)
        "em": "in",
        "no": "in the", // (masculino)
        "na": "in the", // (feminino)
        "nos": "in the", // (masculino plural)
        "nas": "in the", // (feminino plural)
        "para": "to", // ou for
        "com": "with",
        "sem": "without",
        "aneurisma": "aneurysm",
        "aorta": "aorta",
        "aórtica": "aortic",
        "estenose": "stenosis",
        "infarto": "infarction", // ou infarct
        "miocárdio": "myocardium", // ou myocardial
        "derrame":"effusion",
        "pleural": "pleural",
        "ovariano": "ovarian",
        "renal": "renal",
        "colecistite": "cholecystitis",
        "pancreatite": "pancreatitis",
        "pneumonia": "pneumonia",
        "lobar": "lobar",
        "tuberculose": "tuberculosis",
        "meningioma": "meningioma",
        "glioblastoma": "glioblastoma",
        "multiforme": "multiforme",
        "hidrocefalia": "hydrocephalus",
        "apendicite": "appendicitis"
    };

    function translateTerm(term) {
        const lowerTerm = term.toLowerCase().trim();

        // 1. Tentar tradução de frase completa
        if (phraseTranslations[lowerTerm]) {
            return phraseTranslations[lowerTerm];
        }

        // 2. Tentar tradução palavra por palavra
        const words = lowerTerm.split(/\s+/);
        let translatedWords = words.map(word => wordTranslations[word] || word);

        // 3. Lógica de reordenação simples para o seu exemplo e similares
        // Se for uma frase de duas palavras e a tradução direta não foi encontrada,
        // e se a primeira palavra traduzida for "hematoma", inverter.
        // Você pode adicionar mais regras aqui, mas fica complexo.
        if (words.length === 2) {
            if (words[0] === "hematoma" && wordTranslations[words[1]]) { // Ex: hematoma subgaleal
                 return (wordTranslations[words[1]] || words[1]) + " " + (wordTranslations[words[0]] || words[0]);
            }
            // Outra regra: se a segunda palavra for "cerebral" e a primeira tiver tradução
            if (words[1] === "cerebral" && wordTranslations[words[0]]) { // Ex: tumor cerebral
                return (wordTranslations[words[1]] || words[1]) + " " + (wordTranslations[words[0]] || words[0]);
            }
        }

        // Remover preposições traduzidas como "of the" ou "of" se não fizerem sentido sozinhas ou no final
        translatedWords = translatedWords.filter(word => word !== "of" && word !== "of the" && word !== "in" && word !== "in the");


        return translatedWords.join(" ");
    }

    function handleSearch(event) {
        const form = event.target.closest('form');
        if (!form) return;

        const searchInput = form.querySelector('input[name="q"], input#q');
        if (searchInput && searchInput.value.trim() !== "") {
            const originalTerm = searchInput.value.trim();
            const translated = translateTerm(originalTerm);

            if (translated.toLowerCase() !== originalTerm.toLowerCase()) {
                console.log(`Radiopaedia PT-BR Search: Original: "${originalTerm}", Traduzido: "${translated}"`);
                event.preventDefault(); // Impede o envio do formulário original
                const searchUrl = `https://radiopaedia.org/search?q=${encodeURIComponent(translated)}&scope=all`;
                window.location.href = searchUrl;
            }
        }
    }

    // Espera o DOM carregar para garantir que os formulários existam
    document.addEventListener('DOMContentLoaded', function() {
        // Formulário de busca principal no cabeçalho
        const mainSearchForm = document.querySelector('form.site-search');
        if (mainSearchForm) {
            mainSearchForm.addEventListener('submit', handleSearch);
        }

        // Formulário de busca na página de resultados
        const filterSearchForm = document.querySelector('form.filter-search-form');
        if (filterSearchForm) {
            filterSearchForm.addEventListener('submit', handleSearch);
        }
    });

})();