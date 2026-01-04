// ==UserScript==
// @name         Nada Consta no Koha
// @namespace    https://greasyfork.org/pt-BR/users/1076289-marx-medeiros
// @version      2025.12.02
// @description  Facilita o cadastro da mensagem e da restrição por emissão de Nada Consta.
// @author       Marx Medeiros - IFPB Campus João Pessoa
// @match        https://biblioteca-adm.ifpb.edu.br/cgi-bin/koha/circ/circulation.pl*
// @match        https://biblioteca-adm.ifpb.edu.br/cgi-bin/koha/members/moremember.pl*
// @icon         https://biblioteca-adm.ifpb.edu.br/intranet-tmpl/prog/img/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541274/Nada%20Consta%20no%20Koha.user.js
// @updateURL https://update.greasyfork.org/scripts/541274/Nada%20Consta%20no%20Koha.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getMatriculaFromHeader() {
        const h5 = document.querySelector('div.col-md-2.order-sm-2.order-md-1');
        if (!h5) return '___';
        const match = h5.textContent.trim().match(/^\d+/);
        return match ? match[0] : '___';
    }

    function insertBeforeTarget(newNode) {
        const label = document.querySelector('label[for="select_patron_messages"]');
        if (label && label.parentNode) {
            label.parentNode.insertBefore(newNode, label);
        }
    }

    function createMatriculaInput() {
        const existingInput = document.getElementById('manual_matricula_input');
        if (existingInput) return existingInput;
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'manual_matricula_input';
        input.placeholder = 'Substituir matrícula';
        input.style.marginBottom = '5px';
        input.style.display = 'block';
        insertBeforeTarget(input);
        return input;
    }

    function getManualMatriculaValue() {
        const manualInput = document.getElementById('manual_matricula_input');
        return manualInput ? manualInput.value.trim() : '';
    }

    function getTargetMatricula() {
        const manualValue = getManualMatriculaValue();
        return manualValue || getMatriculaFromHeader();
    }

    function isManualOverride() {
        const manualValue = getManualMatriculaValue();
        const headerValue = getMatriculaFromHeader();
        return !!manualValue && manualValue !== headerValue;
    }

    function getMetodoEnvio() {
        const button = document.getElementById('toggle_email_button');
        return button?.dataset.emailAtivo === 'true' ? 'e-mail' : 'Sistema';
    }

    function createMetodoEnvioToggle() {
        const input = document.getElementById('manual_matricula_input');
        if (!input || document.getElementById('toggle_email_button')) return;

        const button = document.createElement('button');
        button.type = 'button';
        button.id = 'toggle_email_button';
        button.className = 'btn btn-outline-secondary btn-sm';
        button.textContent = 'Via e-mail';
        button.dataset.emailAtivo = 'false';
        updateEmailButtonStyle(button);

        button.addEventListener('click', () => {
            const ativo = button.dataset.emailAtivo === 'true';
            button.dataset.emailAtivo = (!ativo).toString();
            updateEmailButtonStyle(button);
            deleteNotes();
        });

        input.insertAdjacentElement('afterend', button);
    }

    function updateEmailButtonStyle(button) {
        if (button.dataset.emailAtivo === 'true') {
            button.style.backgroundColor = '#6c757d';
            button.style.color = 'white';
        } else {
            button.style.backgroundColor = '';
            button.style.color = '';
        }
    }

    function hasOverdueBlock() {
        return !!document.querySelector('li.odues.blocker');
    }

    function hasUserBlock() {
        const blockers = document.querySelectorAll('li.userdebarred.blocker');
        for (let blocker of blockers) {
            const text = blocker.textContent.toLowerCase();
            if (!text.includes('nada consta')) {
                return true;
            }
        }
        return false;
    }

    function hasActiveCheckouts() {
        const checkoutTab = document.getElementById('checkouts-tab');
        return checkoutTab && !/Empréstimos\s*\(0\)/.test(checkoutTab.textContent);
    }

    function disableAllNotes(select) {
        for (const option of select.options) {
            option.disabled = true;
        }
    }

    function disableSomeNotes(select) {
        for (const option of select.options) {
            if (!option.dataset.alwaysEnabled) {
                option.disabled = true;
            }
        }
    }

    function insertManualRestrictionForm() {
        const modalContent = document.querySelector('#add_message_form .modal-content');
        if (!modalContent || modalContent.querySelector('#restriction_manual_form')) return;

        const csrf = document.querySelector('input[name="csrf_token"]')?.value || '';
        const borrowernumber = document.querySelector('input[name="borrowernumber"]')?.value || '';

        const formHTML = `
            <form id="add_restriction_form" method="post" action="/cgi-bin/koha/members/mod_debarment.pl" class="clearfix" style="margin-top: 12px;">
                <input type="hidden" name="csrf_token" value="${csrf}">
                <input type="hidden" name="borrowernumber" value="${borrowernumber}">
                <input type="hidden" name="op" value="cud-add">
                <fieldset id="restriction_manual_form" style="display: none; align-items: flex-end; gap: 8px; width: 100%;">
                    <div style="flex: 1; display: flex; flex-direction: column;">
                        <label for="rmcomment" style="font-weight: bold;">Restrição manual:</label>
                        <input type="text" id="rmcomment" name="comment">
                    </div>
                    <input type="submit" class="btn btn-danger" id="submit_restriction" value="Restringir" style="padding: 2px 6px; font-size: 12px;">
                </fieldset>
            </form>
        `;
        modalContent.insertAdjacentHTML('beforeend', formHTML);

        // Adiciona envio simultâneo por fetch do #add_message_form ao clicar em "Restringir"
        const restrictionForm = document.getElementById('add_restriction_form');
        const messageForm = document.getElementById('message_form');

        restrictionForm.addEventListener('submit', function (e) {
            const rmcomment = document.getElementById('rmcomment');
            if (!rmcomment.value.trim()) return;

            e.preventDefault(); // Impede o envio padrão

            const formData = new FormData(messageForm);
            fetch(messageForm.action, {
                method: 'POST',
                body: formData,
            }).then(() => {
                restrictionForm.submit(); // Agora envia normalmente o formulário de restrição
            });
        });
    }

    function deleteNotes() {
        const select = document.getElementById('select_patron_messages');
        if (!select) return;

        createMatriculaInput();
        createMetodoEnvioToggle();
        insertManualRestrictionForm();

        const matricula = getTargetMatricula();
        const metodo = getMetodoEnvio();
        const overdueBlock = hasOverdueBlock();
        const userBlock = hasUserBlock();
        const activeCheckouts = hasActiveCheckouts();

        select.innerHTML = '';

        const newNotes = [
            { alwaysEnabled: true, value: '', text: 'Selecionar a Nota Correspondente' },
            { value: `Emissão de Nada Consta. Afastamento. Mat. ${matricula}. Via ${metodo}.`, text: `Emissão de Nada Consta. Afastamento. Mat. ${matricula}. Via ${metodo}.` },
            { value: `Emissão de Nada Consta. Aposentadoria. Mat. ${matricula}. Via ${metodo}.`, text: `Emissão de Nada Consta. Aposentadoria. Mat. ${matricula}. Via ${metodo}.` },
            { value: `Emissão de Nada Consta. Cancelamento de Matrícula. Mat. ${matricula}. Via ${metodo}.`, text: `Emissão de Nada Consta. Cancelamento de Matrícula. Mat. ${matricula}. Via ${metodo}.` },
            { value: `Emissão de Nada Consta. Colação de Grau. Mat. ${matricula}. Via ${metodo}.`, text: `Emissão de Nada Consta. Colação de Grau. Mat. ${matricula}. Via ${metodo}.` },
            { value: `Emissão de Nada Consta. Emissão de Diploma de Curso Técnico. Mat. ${matricula}. Via ${metodo}.`, text: `Emissão de Nada Consta. Emissão de Diploma de Curso Técnico. Mat. ${matricula}. Via ${metodo}.` },
            { value: `Emissão de Nada Consta. Emissão de Diploma de Graduação. Mat. ${matricula}. Via ${metodo}.`, text: `Emissão de Nada Consta. Emissão de Diploma de Graduação. Mat. ${matricula}. Via ${metodo}.` },
            { value: `Emissão de Nada Consta. Emissão de Diploma de Pós-graduação. Mat. ${matricula}. Via ${metodo}.`, text: `Emissão de Nada Consta. Emissão de Diploma de Pós-graduação. Mat. ${matricula}. Via ${metodo}.` },
            { value: `Emissão de Nada Consta. Exoneração. Mat. ${matricula}. Via ${metodo}.`, text: `Emissão de Nada Consta. Exoneração. Mat. ${matricula}. Via ${metodo}.` },
            { alwaysEnabled: true, value: `Emissão de Nada Consta. Participação em Evento (Educacional, Científico, Tecnológico). Mat. ${matricula}. Via ${metodo}.`, text: `Emissão de Nada Consta. Participação em Evento (Educacional, Científico, Tecnológico). Mat. ${matricula}. Via ${metodo}.` },
            { alwaysEnabled: true, value: `Emissão de Nada Consta. Participação em Projeto (Ensino, Pesquisa, Extensão). Mat. ${matricula}. Via ${metodo}.`, text: `Emissão de Nada Consta. Participação em Projeto (Ensino, Pesquisa, Extensão). Mat. ${matricula}. Via ${metodo}.` },
            { value: `Emissão de Nada Consta. Redistribuição Interna/Remoção. Mat. ${matricula}. Via ${metodo}.`, text: `Emissão de Nada Consta. Redistribuição Interna/Remoção. Mat. ${matricula}. Via ${metodo}.` },
            { value: `Emissão de Nada Consta. Redistribuição Externa. Mat. ${matricula}. Via ${metodo}.`, text: `Emissão de Nada Consta. Redistribuição Externa. Mat. ${matricula}. Via ${metodo}.` },
            { alwaysEnabled: true, value: `Emissão de Nada Consta. Trancamento de Disciplina. Mat. ${matricula}. Via ${metodo}.`, text: `Emissão de Nada Consta. Trancamento de Disciplina. Mat. ${matricula}. Via ${metodo}.` },
            { value: `Emissão de Nada Consta. Trancamento de Matrícula. Mat. ${matricula}. Via ${metodo}.`, text: `Emissão de Nada Consta. Trancamento de Matrícula. Mat. ${matricula}. Via ${metodo}.` },
            { value: `Emissão de Nada Consta. Transferência Externa. Mat. ${matricula}. Via ${metodo}.`, text: `Emissão de Nada Consta. Transferência Externa. Mat. ${matricula}. Via ${metodo}.` },
            { value: `Emissão de Nada Consta. Transferência Interna. Mat. ${matricula}. Via ${metodo}.`, text: `Emissão de Nada Consta. Transferência Interna. Mat. ${matricula}. Via ${metodo}.` },
            { value: `Emissão de Nada Consta. Vacância. Mat. ${matricula}. Via ${metodo}.`, text: `Emissão de Nada Consta. Vacância. Mat. ${matricula}. Via ${metodo}.` },
        ];

        newNotes.forEach(op => {
            const option = document.createElement('option');
            option.value = op.value;
            option.textContent = op.text;
            if (op.alwaysEnabled) {
                option.dataset.alwaysEnabled = "true";
            }
            select.appendChild(option);
        });

        // Se a matrícula foi substituída manualmente e existir bloqueio real (não "nada consta"), desabilita todas as notas.
        const manualInput = document.getElementById('manual_matricula_input');
        const manualValue = manualInput ? manualInput.value.trim() : '';
        const headerValue = getMatriculaFromHeader();
        const isManualDifferent = !!manualValue && manualValue !== headerValue;

        if (overdueBlock) {
            // Sempre desativa se houver empréstimo atrasado
            disableAllNotes(select);
        } else if (isManualDifferent) {
            if (userBlock) {
                disableAllNotes(select);
            } else {
                for (const opt of select.options) opt.disabled = false;
            }
        } else {
            // Comportamento original
            if (overdueBlock || userBlock) {
                disableAllNotes(select);
            } else if (activeCheckouts) {
                disableSomeNotes(select);
            }
        }

        select.onchange = function () {
            const selectedOption = select.selectedOptions[0];
            if (!selectedOption || selectedOption.disabled) return;

            const selectedValue = selectedOption.value;
            const borrowerMessage = document.getElementById('borrower_message');
            const rmcomment = document.getElementById('rmcomment');
            const restrictionForm = document.getElementById('restriction_manual_form');

            if (borrowerMessage) borrowerMessage.value = selectedValue;

            const nowManualOverride = isManualOverride();
            const isAlwaysEnabled = selectedOption.dataset.alwaysEnabled === 'true';
            const isRedistribuicaoInterna = selectedValue.includes('Redistribuição Interna/Remoção');
            const isForce = selectedOption.dataset.forceRestriction === 'true';

            if (rmcomment && restrictionForm) {
                const mustOpenRestriction = isForce || (!nowManualOverride && !isAlwaysEnabled && !isRedistribuicaoInterna);
                rmcomment.value = mustOpenRestriction ? selectedValue : '';
                restrictionForm.style.display = rmcomment.value.trim() ? 'flex' : 'none';
            }
        };

        // Reagir à digitação da matrícula manual
        const manualInput2 = document.getElementById('manual_matricula_input');
        if (manualInput2) {
            manualInput2.addEventListener('input', deleteNotes);
        }
    }

    const observer = new MutationObserver(() => {
        const select = document.getElementById('select_patron_messages');
        if (select) {
            deleteNotes();
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();